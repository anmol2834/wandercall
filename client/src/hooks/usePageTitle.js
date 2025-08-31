import { useEffect } from 'react';

const usePageTitle = (title) => {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = title ? `${title} | WanderCall` : 'WanderCall - Unique Experiences';
    
    return () => {
      document.title = prevTitle;
    };
  }, [title]);
};

export default usePageTitle;