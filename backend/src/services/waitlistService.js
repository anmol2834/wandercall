const User = require('../models/User');
const Waitlist = require('../models/Waitlist');

class WaitlistService {
  // Generate default rewards
  static generateExclusiveRewards() {
    const now = new Date();
    const discountExpiry = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    
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
  }

  // Get user's waitlist data (single source of truth)
  static async getUserWaitlistData(userId, email) {
    try {
      const waitlistEntry = await Waitlist.findOne({
        $or: [{ userId }, { email }]
      });
      
      return waitlistEntry;
    } catch (error) {
      console.error('Error fetching waitlist data:', error);
      return null;
    }
  }

  // Get user with waitlist data
  static async getUserWithWaitlistData(userId) {
    try {
      const user = await User.findById(userId).select('-password');
      if (!user) return null;

      const waitlistEntry = await this.getUserWaitlistData(userId, user.email);
      
      if (waitlistEntry) {
        // Link waitlist to user if not already linked
        if (!waitlistEntry.userId) {
          waitlistEntry.userId = userId;
          waitlistEntry.isRewardsClaimed = true;
          await waitlistEntry.save();
        }

        // Update user's waitlist status
        if (!user.isWaitlistMember) {
          await User.findByIdAndUpdate(userId, { isWaitlistMember: true });
          user.isWaitlistMember = true;
        }

        // Add waitlist rewards to user object (not saved to DB)
        user.waitlistRewards = waitlistEntry.exclusiveRewards;
      }

      return user;
    } catch (error) {
      console.error('Error getting user with waitlist data:', error);
      return null;
    }
  }

  // Join waitlist (handles both authenticated and non-authenticated users)
  static async joinWaitlist(name, email, userId = null) {
    try {
      // Check if already on waitlist
      const existingEntry = await Waitlist.findOne({ email });
      
      if (existingEntry) {
        // If user is authenticated and entry exists but not linked
        if (userId && !existingEntry.userId) {
          existingEntry.userId = userId;
          existingEntry.isRewardsClaimed = true;
          await existingEntry.save();
          
          // Update user profile
          await User.findByIdAndUpdate(userId, {
            isWaitlistMember: true
          });
          
          return { success: true, rewards: existingEntry.exclusiveRewards, message: 'Waitlist rewards linked to your account!' };
        }
        
        return { success: false, message: 'This email is already on the waitlist' };
      }

      // Create new waitlist entry
      const exclusiveRewards = this.generateExclusiveRewards();
      const waitlistEntry = new Waitlist({
        name,
        email,
        userId,
        exclusiveRewards,
        isRewardsClaimed: !!userId
      });
      
      await waitlistEntry.save();

      // If user is authenticated, update their profile
      if (userId) {
        await User.findByIdAndUpdate(userId, {
          isWaitlistMember: true
        });
      }

      return { success: true, rewards: exclusiveRewards, message: 'Successfully joined the waitlist!' };
    } catch (error) {
      console.error('Error joining waitlist:', error);
      return { success: false, message: 'Failed to join waitlist' };
    }
  }

  // Clean up orphaned waitlist entries (maintenance function)
  static async cleanupOrphanedEntries(email, keepUserId) {
    try {
      // Remove any waitlist entries with same email but different userId
      await Waitlist.deleteMany({
        email,
        userId: { $ne: keepUserId, $exists: true }
      });
    } catch (error) {
      console.error('Error cleaning up orphaned entries:', error);
    }
  }
}

module.exports = WaitlistService;