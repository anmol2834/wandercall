const Waitlist = require('../models/Waitlist');

const cleanupExpiredRewards = async () => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Find and remove expired discount rewards
    const result = await Waitlist.updateMany(
      {
        isRewardsClaimed: true,
        'exclusiveRewards.rewardType': 'discount',
        'exclusiveRewards.claimedAt': { $lt: thirtyDaysAgo }
      },
      {
        $pull: {
          exclusiveRewards: {
            rewardType: 'discount',
            claimedAt: { $lt: thirtyDaysAgo }
          }
        },
        $set: { isRewardsClaimed: false }
      }
    );

    console.log(`Cleaned up ${result.modifiedCount} expired waitlist rewards`);
    return result;
  } catch (error) {
    console.error('Error cleaning up expired rewards:', error);
    throw error;
  }
};

// Run cleanup daily
const startRewardCleanup = () => {
  // Run immediately
  cleanupExpiredRewards();
  
  // Run every 24 hours
  setInterval(cleanupExpiredRewards, 24 * 60 * 60 * 1000);
};

module.exports = { cleanupExpiredRewards, startRewardCleanup };