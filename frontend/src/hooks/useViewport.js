import { useState, useEffect } from 'react';

export const useViewport = () => {
  const [viewport, setViewport] = useState(() => {
    if (typeof window === 'undefined') return { width: 1024, height: 768 };
    return {
      width: window.innerWidth,
      height: window.innerHeight
    };
  });

  useEffect(() => {
    const handleResize = () => {
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = viewport.width <= 767;
  const isTablet = viewport.width >= 768 && viewport.width <= 1023;
  const isDesktop = viewport.width >= 1024;

  return {
    ...viewport,
    isMobile,
    isTablet,
    isDesktop
  };
};