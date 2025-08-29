const mongoose = require('mongoose');

const waitlistSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  joinedAt: { type: Date, default: Date.now },
  isRewardsClaimed: { type: Boolean, default: false },
  exclusiveRewards: [{
    rewardType: { type: String, required: true },
    rewardValue: { type: String, required: true },
    description: { type: String, required: true },
    claimedAt: { type: Date, default: Date.now },
    expiresAt: { type: Date },
    isExpired: { type: Boolean, default: false }
  }]
});

module.exports = mongoose.model('Waitlist', waitlistSchema);