const mongoose = require('mongoose');

const rewardSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  xpBalance: { type: Number, default: 0 },
  totalEarned: { type: Number, default: 0 },
  totalRedeemed: { type: Number, default: 0 },
  currentTier: { type: String, default: 'Bronze' },
  history: [{
    type: { type: String, enum: ['earned', 'redeemed'], required: true },
    amount: { type: Number, required: true },
    description: { type: String, required: true },
    source: { type: String },
    date: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Reward', rewardSchema);