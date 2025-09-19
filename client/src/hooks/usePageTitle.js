import { useEffect } from 'react';

const usePageTitle = (title) => {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = title ? `${title} | wandercall` : 'wandercall - Unique Experiences';
    
    return () => {
      document.title = prevTitle;
    };
  }, [title]);
};

export default usePageTitle;