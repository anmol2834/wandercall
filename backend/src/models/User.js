const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Array limit validator
function arrayLimit(val) {
  return val.length <= 2;
}

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false },
  role: { type: String, enum: ['user', 'provider', 'admin'], default: 'user' },
  agreedToTerms: { type: Boolean, default: true },
  isEmailVerified: { type: Boolean, default: false },
  emailOTP: { type: String, required: false },
  otpExpires: { type: Date, required: false },
  waitlistRewards: [{
    rewardType: { type: String, required: true },
    rewardValue: { type: String, required: true },
    description: { type: String, required: true },
    claimedAt: { type: Date, default: Date.now },
    expiresAt: { type: Date },
    isExpired: { type: Boolean, default: false }
  }],
  addresses: {
    type: [{
      type: { type: String, enum: ['Home', 'Work', 'Other'], default: 'Home' },
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zipCode: { type: String, required: true },
      country: { type: String, required: true },
      isDefault: { type: Boolean, default: false }
    }],
    validate: [arrayLimit, 'Maximum 2 addresses allowed']
  },
  isWaitlistMember: { type: Boolean, default: false }
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password') || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

module.exports = mongoose.model('User', userSchema);