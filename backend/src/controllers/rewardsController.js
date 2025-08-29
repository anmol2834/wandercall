const Reward = require('../models/Reward');
const User = require('../models/User');

// Get user rewards data
exports.getUserRewards = async (req, res) => {
  try {
    const { userId } = req.params;
    
    let userReward = await Reward.findOne({ userId });
    
    // Create reward record if doesn't exist
    if (!userReward) {
      userReward = new Reward({ userId });
      await userReward.save();
    }
    
    // Calculate current tier
    const getCurrentTier = (xp) => {
      if (xp >= 10000) return 'Diamond';
      if (xp >= 5000) return 'Platinum';
      if (xp >= 2500) return 'Gold';
      if (xp >= 1000) return 'Silver';
      return 'Bronze';
    };
    
    userReward.currentTier = getCurrentTier(userReward.xpBalance);
    await userReward.save();
    
    res.json({
      success: true,
      xpBalance: userReward.xpBalance,
      totalEarned: userReward.totalEarned,
      totalRedeemed: userReward.totalRedeemed,
      currentTier: userReward.currentTier,
      history: userReward.history,
      rewards: [],
      availableRewards: []
    });
  } catch (error) {
    console.error('Get user rewards error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch rewards' });
  }
};

// Redeem reward
exports.redeemReward = async (req, res) => {
  try {
    const { rewardId, userId } = req.body;
    
    const userReward = await Reward.findOne({ userId });
    if (!userReward) {
      return res.status(404).json({ success: false, message: 'User rewards not found' });
    }
    
    // Mock reward costs
    const rewardCosts = {
      1: 500, // 10% Discount Voucher
      2: 1000, // Free Experience Upgrade
      3: 750, // Priority Booking Access
      4: 1500 // Exclusive Experience Access
    };
    
    const cost = rewardCosts[rewardId];
    if (!cost) {
      return res.status(400).json({ success: false, message: 'Invalid reward' });
    }
    
    if (userReward.xpBalance < cost) {
      return res.status(400).json({ success: false, message: 'Insufficient XP' });
    }
    
    // Deduct XP and add to history
    userReward.xpBalance -= cost;
    userReward.totalRedeemed += cost;
    userReward.history.unshift({
      type: 'redeemed',
      amount: cost,
      description: `Redeemed reward #${rewardId}`,
      date: new Date()
    });
    
    await userReward.save();
    
    res.json({
      success: true,
      newBalance: userReward.xpBalance,
      cost,
      rewardName: `Reward #${rewardId}`
    });
  } catch (error) {
    console.error('Redeem reward error:', error);
    res.status(500).json({ success: false, message: 'Failed to redeem reward' });
  }
};

// Earn XP
exports.earnXP = async (req, res) => {
  try {
    const { userId, amount, source, description } = req.body;
    
    let userReward = await Reward.findOne({ userId });
    if (!userReward) {
      userReward = new Reward({ userId });
    }
    
    userReward.xpBalance += amount;
    userReward.totalEarned += amount;
    userReward.history.unshift({
      type: 'earned',
      amount,
      description,
      source,
      date: new Date()
    });
    
    await userReward.save();
    
    res.json({
      success: true,
      amount,
      description,
      newBalance: userReward.xpBalance
    });
  } catch (error) {
    console.error('Earn XP error:', error);
    res.status(500).json({ success: false, message: 'Failed to earn XP' });
  }
};

// Get XP history
exports.getXPHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const userReward = await Reward.findOne({ userId });
    if (!userReward) {
      return res.json({ success: true, history: [] });
    }
    
    res.json({
      success: true,
      history: userReward.history
    });
  } catch (error) {
    console.error('Get XP history error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch XP history' });
  }
};

module.exports = exports;