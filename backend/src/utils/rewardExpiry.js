const Waitlist = require('../models/Waitlist');
const User = require('../models/User');

// Function to check and expire rewards
const checkExpiredRewards = async () => {
  try {
    const now = new Date();
    
    // Update expired rewards in Waitlist collection
    await Waitlist.updateMany(
      { 
        'exclusiveRewards.expiresAt': { $lt: now },
        'exclusiveRewards.isExpired': false
      },
      { 
        $set: { 'exclusiveRewards.$.isExpired': true }
      }
    );
    
    // Update expired rewards in User collection
    await User.updateMany(
      { 
        'waitlistRewards.expiresAt': { $lt: now },
        'waitlistRewards.isExpired': false
      },
      { 
        $set: { 'waitlistRewards.$.isExpired': true }
      }
    );
    

  } catch (error) {
    console.error('Error updating expired rewards:', error);
  }
};

// Run every hour to check for expired rewards
const startRewardExpiryChecker = () => {
  // Run immediately
  checkExpiredRewards();
  
  // Then run every hour
  setInterval(checkExpiredRewards, 60 * 60 * 1000);
};

module.exports = { checkExpiredRewards, startRewardExpiryChecker };