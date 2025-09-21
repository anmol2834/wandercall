import { useDataCache } from './useDataCache';
import { useAuth } from '../contexts/AuthContext';

export const useOptimizedProfile = () => {
  const { user } = useAuth();
  
  const fetchProfile = async (signal) => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token available');
    
    const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/users/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      signal
    });
    
    if (!response.ok) {
      throw new Error(`Profile fetch failed: ${response.status}`);
    }
    
    const data = await response.json();
    return data.user;
  };

  const {
    data: profile,
    loading,
    error,
    refetch,
    mutate
  } = useDataCache(
    `profile-${user?.id || 'anonymous'}`,
    fetchProfile,
    {
      enabled: !!user,
      ttl: 10 * 60 * 1000, // 10 minutes
      dependencies: [user?.id]
    }
  );

  const updateProfile = async (updates) => {
    // Optimistic update
    const currentProfile = profile || user;
    const optimisticProfile = { ...currentProfile, ...updates };
    mutate(optimisticProfile);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/users/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updates)
      });

      if (!response.ok) {
        throw new Error('Profile update failed');
      }

      const data = await response.json();
      mutate(data.user);
      return data.user;
    } catch (error) {
      // Revert on error
      mutate(currentProfile);
      throw error;
    }
  };

  return {
    profile: profile || user,
    loading,
    error,
    refetch,
    updateProfile
  };
};