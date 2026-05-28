const CollaborationRequest = require('../models/CollaborationRequest');
const CreatorProfile = require('../models/CreatorProfile');

// ─────────────────────────────────────────────
// GET /api/dashboard/creator/stats
// Dashboard stats for the logged-in creator
// ─────────────────────────────────────────────
const getCreatorStats = async (req, res) => {
  try {
    if (req.user.role !== 'creator') {
      return res.status(403).json({ success: false, message: 'Only creator users can access creator stats' });
    }

    const creatorProfile = await CreatorProfile.findOne({ user: req.user._id });
    if (!creatorProfile) {
      return res.status(404).json({ success: false, message: 'Creator profile not found' });
    }

    // Single aggregation for all status counts
    const statusCounts = await CollaborationRequest.aggregate([
      { $match: { creatorProfile: creatorProfile._id } },
      { $group: { _id: '$status', count: { $sum: 1 }, totalBudget: { $sum: '$budget' } } },
    ]);

    // Build a lookup map
    const counts = { pending: 0, accepted: 0, rejected: 0, completed: 0, cancelled: 0 };
    let totalEarnings = 0;

    statusCounts.forEach(({ _id, count, totalBudget }) => {
      if (counts[_id] !== undefined) counts[_id] = count;
      // Only count earnings from accepted + completed collaborations
      if (_id === 'accepted' || _id === 'completed') {
        totalEarnings += totalBudget;
      }
    });

    const total = Object.values(counts).reduce((a, b) => a + b, 0);

    res.status(200).json({
      success: true,
      data: {
        total,
        pending: counts.pending,
        accepted: counts.accepted,
        rejected: counts.rejected,
        completed: counts.completed,
        cancelled: counts.cancelled,
        totalEarnings,
        // Derived
        activeCollaborations: counts.accepted,
      },
    });
  } catch (error) {
    console.error('[dashboardController] getCreatorStats error:', error);
    res.status(500).json({ success: false, message: 'Server error, please try again' });
  }
};

// ─────────────────────────────────────────────
// GET /api/dashboard/business/stats
// Dashboard stats for the logged-in business
// ─────────────────────────────────────────────
const getBusinessStats = async (req, res) => {
  try {
    if (req.user.role !== 'business') {
      return res.status(403).json({ success: false, message: 'Only business users can access business stats' });
    }

    const statusCounts = await CollaborationRequest.aggregate([
      { $match: { businessUser: req.user._id } },
      { $group: { _id: '$status', count: { $sum: 1 }, totalBudget: { $sum: '$budget' } } },
    ]);

    const counts = { pending: 0, accepted: 0, rejected: 0, completed: 0, cancelled: 0 };
    let totalBudgetSpent = 0;

    statusCounts.forEach(({ _id, count, totalBudget }) => {
      if (counts[_id] !== undefined) counts[_id] = count;
      if (_id === 'accepted' || _id === 'completed') {
        totalBudgetSpent += totalBudget;
      }
    });

    const total = Object.values(counts).reduce((a, b) => a + b, 0);

    res.status(200).json({
      success: true,
      data: {
        total,
        sentRequests: total,
        pending: counts.pending,
        acceptedCreators: counts.accepted,
        rejected: counts.rejected,
        completed: counts.completed,
        cancelled: counts.cancelled,
        activeCampaigns: counts.accepted,
        totalBudgetSpent,
      },
    });
  } catch (error) {
    console.error('[dashboardController] getBusinessStats error:', error);
    res.status(500).json({ success: false, message: 'Server error, please try again' });
  }
};

module.exports = { getCreatorStats, getBusinessStats };
