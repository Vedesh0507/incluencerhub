const CollaborationRequest = require('../models/CollaborationRequest');
const CreatorProfile = require('../models/CreatorProfile');

// ── Shared helper: build filter query from query params ──────────────────────
function buildFilter(base, query) {
  const filter = { ...base };
  if (query.status) filter.status = query.status;
  if (query.platform) filter.platform = query.platform;
  return filter;
}

// ── Shared helper: build sort from query params ──────────────────────────────
function buildSort(query) {
  const allowed = ['createdAt', 'budget', 'deadline', 'statusUpdatedAt'];
  const field = allowed.includes(query.sortBy) ? query.sortBy : 'createdAt';
  const order = query.order === 'asc' ? 1 : -1;
  return { [field]: order };
}

// ── Shared helper: pagination ────────────────────────────────────────────────
function buildPagination(query) {
  const page = Math.max(1, parseInt(query.page) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(query.limit) || 20));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}

// ─────────────────────────────────────────────
// POST /api/collaborations
// Send a collaboration request (business only)
// ─────────────────────────────────────────────
const sendCollaborationRequest = async (req, res) => {
  try {
    if (req.user.role !== 'business') {
      return res.status(403).json({
        success: false,
        message: 'Only business users can send collaboration requests',
      });
    }

    const { creatorProfile, campaignTitle, description, budget, barter, deliverables, deadline, platform, notes } = req.body;

    const creator = await CreatorProfile.findById(creatorProfile);
    if (!creator) {
      return res.status(404).json({ success: false, message: 'Creator profile not found' });
    }

    if (creator.user.toString() === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'You cannot send a collaboration request to yourself' });
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
      notes: notes || '',
      status: 'pending',
    });

    res.status(201).json({
      success: true,
      message: 'Collaboration request sent successfully',
      data: collaboration,
    });
  } catch (error) {
    console.error('[collaborationController] sendCollaborationRequest error:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages[0] });
    }
    res.status(500).json({ success: false, message: 'Server error, please try again' });
  }
};

// ─────────────────────────────────────────────
// GET /api/collaborations/creator
// Creator inbox with filtering + sorting + pagination
// ─────────────────────────────────────────────
const getCreatorInbox = async (req, res) => {
  try {
    if (req.user.role !== 'creator') {
      return res.status(403).json({ success: false, message: 'Only creator users can access the collaboration inbox' });
    }

    const creatorProfile = await CreatorProfile.findOne({ user: req.user._id });
    if (!creatorProfile) {
      return res.status(404).json({ success: false, message: 'Creator profile not found. Please set up your profile first.' });
    }

    const filter = buildFilter({ creatorProfile: creatorProfile._id }, req.query);
    const sort = buildSort(req.query);
    const { page, limit, skip } = buildPagination(req.query);

    const [collaborations, total] = await Promise.all([
      CollaborationRequest.find(filter)
        .populate('businessUser', 'name email avatar')
        .populate('creatorProfile', 'username category')
        .sort(sort)
        .skip(skip)
        .limit(limit),
      CollaborationRequest.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      count: collaborations.length,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      data: collaborations,
    });
  } catch (error) {
    console.error('[collaborationController] getCreatorInbox error:', error);
    res.status(500).json({ success: false, message: 'Server error, please try again' });
  }
};

// ─────────────────────────────────────────────
// GET /api/collaborations/business
// Business sent requests with filtering + sorting + pagination
// ─────────────────────────────────────────────
const getBusinessRequests = async (req, res) => {
  try {
    if (req.user.role !== 'business') {
      return res.status(403).json({ success: false, message: 'Only business users can access sent collaboration requests' });
    }

    const filter = buildFilter({ businessUser: req.user._id }, req.query);
    const sort = buildSort(req.query);
    const { page, limit, skip } = buildPagination(req.query);

    const [collaborations, total] = await Promise.all([
      CollaborationRequest.find(filter)
        .populate('creatorProfile', 'username category profileImage followers')
        .sort(sort)
        .skip(skip)
        .limit(limit),
      CollaborationRequest.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      count: collaborations.length,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      data: collaborations,
    });
  } catch (error) {
    console.error('[collaborationController] getBusinessRequests error:', error);
    res.status(500).json({ success: false, message: 'Server error, please try again' });
  }
};

// ─────────────────────────────────────────────
// GET /api/collaborations/:id
// Get a single collaboration by ID
// ─────────────────────────────────────────────
const getCollaborationById = async (req, res) => {
  try {
    const collaboration = await CollaborationRequest.findById(req.params.id)
      .populate('businessUser', 'name email avatar')
      .populate('creatorProfile', 'username category profileImage followers pricing');

    if (!collaboration) {
      return res.status(404).json({ success: false, message: 'Collaboration request not found' });
    }

    // Only the business owner or the creator can view this
    const creatorProfile = req.user.role === 'creator'
      ? await CreatorProfile.findOne({ user: req.user._id })
      : null;

    const isOwner =
      collaboration.businessUser._id.toString() === req.user._id.toString() ||
      (creatorProfile && collaboration.creatorProfile._id.toString() === creatorProfile._id.toString());

    if (!isOwner) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this collaboration' });
    }

    res.status(200).json({ success: true, data: collaboration });
  } catch (error) {
    console.error('[collaborationController] getCollaborationById error:', error);
    res.status(500).json({ success: false, message: 'Server error, please try again' });
  }
};

// ─────────────────────────────────────────────
// PUT /api/collaborations/:id/status
// Update collaboration status
// Creator: accepted | rejected | completed
// Business: cancelled
// ─────────────────────────────────────────────
const updateCollaborationStatus = async (req, res) => {
  try {
    const { status, notes } = req.body;

    // Define per-role allowed statuses
    const creatorStatuses = ['accepted', 'rejected', 'completed'];
    const businessStatuses = ['cancelled'];

    const isCreator = req.user.role === 'creator';
    const isBusiness = req.user.role === 'business';

    if (!isCreator && !isBusiness) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const allowedStatuses = isCreator ? creatorStatuses : businessStatuses;

    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Status must be one of: ${allowedStatuses.join(', ')}`,
      });
    }

    const collaboration = await CollaborationRequest.findById(req.params.id);
    if (!collaboration) {
      return res.status(404).json({ success: false, message: 'Collaboration request not found' });
    }

    // Ownership check
    if (isCreator) {
      const creatorProfile = await CreatorProfile.findOne({ user: req.user._id });
      if (!creatorProfile || collaboration.creatorProfile.toString() !== creatorProfile._id.toString()) {
        return res.status(403).json({ success: false, message: 'You are not authorized to update this collaboration request' });
      }
    }

    if (isBusiness) {
      if (collaboration.businessUser.toString() !== req.user._id.toString()) {
        return res.status(403).json({ success: false, message: 'You are not authorized to update this collaboration request' });
      }
    }

    // Prevent re-updating finalized statuses
    const finalStatuses = ['rejected', 'completed', 'cancelled'];
    if (finalStatuses.includes(collaboration.status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot update a collaboration that is already ${collaboration.status}`,
      });
    }

    // Apply updates
    collaboration.status = status;
    collaboration.statusUpdatedAt = new Date();
    if (notes !== undefined) collaboration.notes = notes;
    if (status === 'completed') collaboration.completedAt = new Date();
    if (status === 'cancelled') collaboration.cancelledAt = new Date();

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
  getCollaborationById,
  updateCollaborationStatus,
};
