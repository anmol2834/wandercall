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
      } else {
        setWaitlistRewards([]);
        setXpBalance(0);
      }
    } catch (error) {
      console.error('Failed to refresh rewards:', error);
      setWaitlistRewards([]);
      setXpBalance(0);
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
    loading,
    refreshRewards
  };

  return (
    <RewardsContext.Provider value={value}>
      {children}
    </RewardsContext.Provider>
  );
};