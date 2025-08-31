const WaitlistService = require('../services/waitlistService');

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

    const result = await WaitlistService.joinWaitlist(name, email, userId);
    
    if (result.success) {
      res.status(result.message.includes('linked') ? 200 : 201).json(result);
    } else {
      res.status(400).json(result);
    }
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
      const User = require('../models/User');
      const user = await User.findById(userId);
      if (user) {
        waitlistEntry = await WaitlistService.getUserWaitlistData(userId, user.email);
      }
    } else if (email) {
      waitlistEntry = await WaitlistService.getUserWaitlistData(null, email);
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
    const updatedUser = await WaitlistService.getUserWithWaitlistData(userId);
    
    if (updatedUser && updatedUser.waitlistRewards && updatedUser.waitlistRewards.length > 0) {
      console.log('Linked waitlist to user:', userId, email, 'Rewards count:', updatedUser.waitlistRewards.length);
      return { success: true, rewards: updatedUser.waitlistRewards };
    }
    
    console.log('No waitlist entry found for email:', email);
    return { success: false, rewards: [] };
  } catch (error) {
    console.error('Link waitlist to user error:', error);
    return { success: false, rewards: [] };
  }
};

module.exports = exports;