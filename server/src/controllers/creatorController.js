const CreatorProfile = require('../models/CreatorProfile');

// @desc    Create a creator profile
// @route   POST /api/creators
// @access  Private (creator role only)
const createProfile = async (req, res, next) => {
  try {
    // Only creators can create a profile
    if (req.user.role !== 'creator') {
      return res.status(403).json({
        success: false,
        message: 'Only users with the creator role can create a profile',
      });
    }

    // Check if profile already exists for this user
    const existingProfile = await CreatorProfile.findOne({ user: req.user._id });
    if (existingProfile) {
      return res.status(400).json({
        success: false,
        message: 'Creator profile already exists for this user',
      });
    }

    // Build profile data from request body
    const profileData = {
      user: req.user._id,
      username: req.body.username,
      category: req.body.category,
      bio: req.body.bio || '',
      location: req.body.location || '',
      followers: req.body.followers || 0,
      engagementRate: req.body.engagementRate || 0,
      pricing: req.body.pricing || {},
      platforms: req.body.platforms || [],
      profileImage: req.body.profileImage || '',
      portfolioImages: req.body.portfolioImages || [],
      socialLinks: req.body.socialLinks || {},
    };

    const profile = await CreatorProfile.create(profileData);

    res.status(201).json({
      success: true,
      message: 'Creator profile created successfully',
      profile,
    });
  } catch (error) {
    // Handle duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        success: false,
        message: `A profile with this ${field} already exists`,
      });
    }
    next(error);
  }
};

// @desc    Update a creator profile
// @route   PUT /api/creators/:id
// @access  Private (owner only)
const updateProfile = async (req, res, next) => {
  try {
    const profile = await CreatorProfile.findById(req.params.id);

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Creator profile not found',
      });
    }

    // Verify ownership
    if (profile.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only update your own profile',
      });
    }

    // Fields that can be updated
    const allowedFields = [
      'username', 'category', 'bio', 'location', 'followers',
      'engagementRate', 'pricing', 'platforms', 'profileImage',
      'portfolioImages', 'socialLinks',
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        profile[field] = req.body[field];
      }
    });

    const updatedProfile = await profile.save();

    res.json({
      success: true,
      message: 'Creator profile updated successfully',
      profile: updatedProfile,
    });
  } catch (error) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        success: false,
        message: `A profile with this ${field} already exists`,
      });
    }
    next(error);
  }
};

// @desc    Get all creators (with search, filter, pagination, sort)
// @route   GET /api/creators
// @access  Public
const getAllCreators = async (req, res, next) => {
  try {
    const {
      category,
      location,
      platform,
      minFollowers,
      maxPrice,
      search,
      sort,
      page = 1,
      limit = 12,
    } = req.query;

    // Build filter object
    const filter = {};

    if (category) {
      filter.category = category;
    }

    if (location) {
      filter.location = { $regex: location, $options: 'i' };
    }

    if (platform) {
      filter.platforms = { $in: [platform.toLowerCase()] };
    }

    if (minFollowers) {
      filter.followers = { $gte: Number(minFollowers) };
    }

    if (maxPrice) {
      filter['pricing.post'] = { $lte: Number(maxPrice) };
    }

    if (search) {
      filter.$or = [
        { username: { $regex: search, $options: 'i' } },
        { bio: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
      ];
    }

    // Build sort object
    let sortOption = { createdAt: -1 }; // default: newest
    if (sort === 'followers') {
      sortOption = { followers: -1 };
    } else if (sort === 'rating') {
      sortOption = { rating: -1 };
    }

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(50, Math.max(1, Number(limit)));
    const skip = (pageNum - 1) * limitNum;

    const [creators, total] = await Promise.all([
      CreatorProfile.find(filter)
        .populate('user', 'name email')
        .sort(sortOption)
        .skip(skip)
        .limit(limitNum),
      CreatorProfile.countDocuments(filter),
    ]);

    res.json({
      success: true,
      message: 'Creators fetched successfully',
      creators,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single creator by ID
// @route   GET /api/creators/:id
// @access  Public
const getCreatorById = async (req, res, next) => {
  try {
    const profile = await CreatorProfile.findById(req.params.id)
      .populate('user', 'name email');

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Creator profile not found',
      });
    }

    res.json({
      success: true,
      message: 'Creator fetched successfully',
      profile,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createProfile,
  updateProfile,
  getAllCreators,
  getCreatorById,
};
