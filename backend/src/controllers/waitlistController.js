const Waitlist = require('../models/Waitlist');
const User = require('../models/User');
const { sendWelcomeEmail } = require('../services/emailService');

// Default exclusive rewards for waitlist members
const generateExclusiveRewards = () => {
  const now = new Date();
  const discountExpiry = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days from now
  
  return [
    {
      rewardType: 'EARLY_ACCESS',
      rewardValue: '30_DAYS',
      description: '30 days early access to new features',
      claimedAt: now
    },
    {
      rewardType: 'DISCOUNT',
      rewardValue: '10_PERCENT_30_DAYS',
      description: '10% discount valid for 30 days',
      claimedAt: now,
      expiresAt: discountExpiry
    },
    {
      rewardType: 'PREMIUM_SUPPORT',
      rewardValue: 'PRIORITY',
      description: 'Priority customer support',
      claimedAt: now
    },
    {
      rewardType: 'WELCOME_XP',
      rewardValue: '5000',
      description: '5000 Welcome XP points for future bookings',
      claimedAt: now
    }
  ];
};

exports.joinWaitlist = async (req, res) => {
  try {
    let { name, email } = req.body;
    const userId = req.user?.id || null;

    // For authenticated users, use user data if not provided
    if (userId && req.user) {
      name = name || req.user.name;
      email = email || req.user.email;
    }

    // Validation
    if (!name || !email) {
      return res.status(400).json({ success: false, message: 'Name and email are required' });
    }

    // Check if email already exists in waitlist
    const existingWaitlist = await Waitlist.findOne({ email });
    if (existingWaitlist) {
      return res.status(400).json({ 
        success: false, 
        message: 'This email is already on the waitlist' 
      });
    }

    // Create waitlist entry
    const exclusiveRewards = generateExclusiveRewards();
    const waitlistEntry = new Waitlist({
      name,
      email,
      userId,
      exclusiveRewards,
      isRewardsClaimed: !!userId // Only true if user is authenticated
    });
    await waitlistEntry.save();

    // If user is logged in, update their profile
    if (userId) {
      await User.findByIdAndUpdate(userId, {
        isWaitlistMember: true,
        waitlistRewards: exclusiveRewards
      });
    }

    console.log('User joined waitlist:', email);

    res.status(201).json({
      success: true,
      message: 'Successfully joined the waitlist!',
      rewards: exclusiveRewards
    });
  } catch (error) {
    console.error('Join waitlist error:', error);
    res.status(500).json({ success: false, message: 'Failed to join waitlist' });
  }
};

exports.checkWaitlistStatus = async (req, res) => {
  try {
    const { email } = req.query;
    const userId = req.user?.id || null;

    let waitlistEntry = null;

    if (userId) {
      // Check by user ID first
      waitlistEntry = await Waitlist.findOne({ userId });
      if (!waitlistEntry) {
        // Check by email if logged in user
        const user = await User.findById(userId);
        if (user) {
          waitlistEntry = await Waitlist.findOne({ email: user.email });
        }
      }
    } else if (email) {
      // Check by email for non-logged in users
      waitlistEntry = await Waitlist.findOne({ email });
    }

    res.json({
      success: true,
      isOnWaitlist: !!waitlistEntry,
      rewards: waitlistEntry?.exclusiveRewards || []
    });
  } catch (error) {
    console.error('Check waitlist status error:', error);
    res.status(500).json({ success: false, message: 'Failed to check waitlist status' });
  }
};

exports.linkWaitlistToUser = async (userId, email) => {
  try {
    // Find waitlist entry by email
    const waitlistEntry = await Waitlist.findOne({ email });
    if (waitlistEntry && !waitlistEntry.userId) {
      // Link waitlist entry to user
      waitlistEntry.userId = userId;
      waitlistEntry.isRewardsClaimed = true;
      await waitlistEntry.save();

      // Update user with waitlist rewards
      await User.findByIdAndUpdate(userId, {
        isWaitlistMember: true,
        waitlistRewards: waitlistEntry.exclusiveRewards
      });

      console.log('Linked waitlist to user:', userId, email);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Link waitlist to user error:', error);
    return false;
  }
};

module.exports = exports;