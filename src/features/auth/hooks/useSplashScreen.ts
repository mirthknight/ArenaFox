'use client';

import { useEffect, useState } from 'react';

interface SplashState {
  loading: boolean;
  progress: number;
}

export const useSplashScreen = (): SplashState => {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let rafId: number;
    let mounted = true;

    const animateProgress = () => {
      setProgress((current) => {
        if (current >= 100) return current;
        return Math.min(100, current + Math.random() * 10);
      });
      rafId = requestAnimationFrame(animateProgress);
    };

    const handleReadyState = () => {
      if (document.readyState === 'complete') {
        setTimeout(() => {
          if (mounted) {
            setLoading(false);
            cancelAnimationFrame(rafId);
          }
        }, 600);
      }
    };

    animateProgress();
    handleReadyState();
    window.addEventListener('load', handleReadyState);

    return () => {
      mounted = false;
      cancelAnimationFrame(rafId);
      window.removeEventListener('load', handleReadyState);
    };
  }, []);

  return { loading, progress };
};
