import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { userAPI } from '../services/api';

const RewardsContext = createContext();

export const useRewards = () => {
  const context = useContext(RewardsContext);
  if (!context) {
    throw new Error('useRewards must be used within a RewardsProvider');
  }
  return context;
};

export const RewardsProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [waitlistRewards, setWaitlistRewards] = useState([]);
  const [xpBalance, setXpBalance] = useState(0);
  const [hasActiveDiscount, setHasActiveDiscount] = useState(false);
  const [loading, setLoading] = useState(false);

  const refreshRewards = async () => {
    if (!user || !isAuthenticated) {
      setWaitlistRewards([]);
      setXpBalance(0);
      return;
    }

    setLoading(true);
    try {
      const response = await userAPI.getWaitlistRewards();
      
      if (response.data.success && response.data.waitlistRewards.length > 0) {
        setWaitlistRewards(response.data.waitlistRewards);
        
        const welcomeXP = response.data.waitlistRewards.find(r => r.rewardType === 'WELCOME_XP');
        const xp = parseInt(welcomeXP?.rewardValue || 0);
        setXpBalance(xp);
        
        // Check for active discount reward
        const discountReward = response.data.waitlistRewards.find(r => 
          r.rewardType === 'DISCOUNT' && !r.isExpired
        );
        
        if (discountReward) {
          const now = new Date();
          // Check both expiresAt field and 30-day calculation
          const isExpiredByDate = discountReward.expiresAt && new Date(discountReward.expiresAt) < now;
          const claimedDate = new Date(discountReward.claimedAt);
          const daysDiff = (now - claimedDate) / (1000 * 60 * 60 * 24);
          const isExpiredByDays = daysDiff > 30;
          
          setHasActiveDiscount(!isExpiredByDate && !isExpiredByDays);
        } else {
          setHasActiveDiscount(false);
        }
      } else {
        setWaitlistRewards([]);
        setXpBalance(0);
        setHasActiveDiscount(false);
      }
    } catch (error) {
      console.error('Failed to refresh rewards:', error);
      setWaitlistRewards([]);
      setXpBalance(0);
      setHasActiveDiscount(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshRewards();
  }, [user, isAuthenticated]);

  const value = {
    waitlistRewards,
    xpBalance,
    hasActiveDiscount,
    loading,
    refreshRewards
  };

  return (
    <RewardsContext.Provider value={value}>
      {children}
    </RewardsContext.Provider>
  );
};