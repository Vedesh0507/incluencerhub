const CollaborationRequest = require('../models/CollaborationRequest');
const CreatorProfile = require('../models/CreatorProfile');

// ─────────────────────────────────────────────
// POST /api/collaborations
// Send a collaboration request (business only)
// ─────────────────────────────────────────────
const sendCollaborationRequest = async (req, res) => {
  try {
    // RBAC: only business users can send requests
    if (req.user.role !== 'business') {
      return res.status(403).json({
        success: false,
        message: 'Only business users can send collaboration requests',
      });
    }

    const {
      creatorProfile,
      campaignTitle,
      description,
      budget,
      barter,
      deliverables,
      deadline,
      platform,
    } = req.body;

    // Validate creator profile exists
    const creator = await CreatorProfile.findById(creatorProfile);
    if (!creator) {
      return res.status(404).json({
        success: false,
        message: 'Creator profile not found',
      });
    }

    // Prevent sending request to yourself (edge case)
    if (creator.user.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot send a collaboration request to yourself',
      });
    }

    const collaboration = await CollaborationRequest.create({
      businessUser: req.user._id,
      creatorProfile,
      campaignTitle,
      description,
      budget,
      barter: barter || false,
      deliverables: deliverables || [],
      deadline,
      platform,
      status: 'pending',
    });

    res.status(201).json({
      success: true,
      message: 'Collaboration request sent successfully',
      data: collaboration,
    });
  } catch (error) {
    console.error('[collaborationController] sendCollaborationRequest error:', error);

    // Mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages[0] });
    }

    res.status(500).json({ success: false, message: 'Server error, please try again' });
  }
};

// ─────────────────────────────────────────────
// GET /api/collaborations/creator
// Get all incoming requests for logged-in creator
// ─────────────────────────────────────────────
const getCreatorInbox = async (req, res) => {
  try {
    // RBAC: only creators can view their inbox
    if (req.user.role !== 'creator') {
      return res.status(403).json({
        success: false,
        message: 'Only creator users can access the collaboration inbox',
      });
    }

    // Find the creator profile linked to this user
    const creatorProfile = await CreatorProfile.findOne({ user: req.user._id });
    if (!creatorProfile) {
      return res.status(404).json({
        success: false,
        message: 'Creator profile not found. Please set up your profile first.',
      });
    }

    const collaborations = await CollaborationRequest.find({
      creatorProfile: creatorProfile._id,
    })
      .populate('businessUser', 'name email avatar')
      .populate('creatorProfile', 'username category')
      .sort({ createdAt: -1 }); // newest first

    res.status(200).json({
      success: true,
      count: collaborations.length,
      data: collaborations,
    });
  } catch (error) {
    console.error('[collaborationController] getCreatorInbox error:', error);
    res.status(500).json({ success: false, message: 'Server error, please try again' });
  }
};

// ─────────────────────────────────────────────
// GET /api/collaborations/business
// Get all requests sent by the logged-in business
// ─────────────────────────────────────────────
const getBusinessRequests = async (req, res) => {
  try {
    // RBAC: only business users can view their sent requests
    if (req.user.role !== 'business') {
      return res.status(403).json({
        success: false,
        message: 'Only business users can access sent collaboration requests',
      });
    }

    const collaborations = await CollaborationRequest.find({
      businessUser: req.user._id,
    })
      .populate('creatorProfile', 'username category profileImage followers')
      .sort({ createdAt: -1 }); // newest first

    res.status(200).json({
      success: true,
      count: collaborations.length,
      data: collaborations,
    });
  } catch (error) {
    console.error('[collaborationController] getBusinessRequests error:', error);
    res.status(500).json({ success: false, message: 'Server error, please try again' });
  }
};

// ─────────────────────────────────────────────
// PUT /api/collaborations/:id/status
// Update collaboration status (creator only)
// Allowed: accepted | rejected | completed
// ─────────────────────────────────────────────
const updateCollaborationStatus = async (req, res) => {
  try {
    // RBAC: only creators can update status
    if (req.user.role !== 'creator') {
      return res.status(403).json({
        success: false,
        message: 'Only creator users can update collaboration status',
      });
    }

    const { status } = req.body;
    const allowedStatuses = ['accepted', 'rejected', 'completed'];

    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Status must be one of: ${allowedStatuses.join(', ')}`,
      });
    }

    // Find the collaboration request
    const collaboration = await CollaborationRequest.findById(req.params.id);
    if (!collaboration) {
      return res.status(404).json({
        success: false,
        message: 'Collaboration request not found',
      });
    }

    // Verify ownership — ensure this request belongs to the logged-in creator
    const creatorProfile = await CreatorProfile.findOne({ user: req.user._id });
    if (!creatorProfile) {
      return res.status(404).json({
        success: false,
        message: 'Creator profile not found',
      });
    }

    if (collaboration.creatorProfile.toString() !== creatorProfile._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this collaboration request',
      });
    }

    // Prevent re-updating already finalized statuses
    if (collaboration.status === 'rejected' || collaboration.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: `Cannot update a collaboration that is already ${collaboration.status}`,
      });
    }

    collaboration.status = status;
    await collaboration.save();

    res.status(200).json({
      success: true,
      message: `Collaboration request ${status} successfully`,
      data: collaboration,
    });
  } catch (error) {
    console.error('[collaborationController] updateCollaborationStatus error:', error);
    res.status(500).json({ success: false, message: 'Server error, please try again' });
  }
};

module.exports = {
  sendCollaborationRequest,
  getCreatorInbox,
  getBusinessRequests,
  updateCollaborationStatus,
};
