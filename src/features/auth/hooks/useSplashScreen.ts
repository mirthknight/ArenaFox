import { useEffect, useRef, useState } from 'react';
import { config } from '@/shared/constants/config';

/**
 * Custom hook to manage splash screen state and progress
 * Handles loading progress animation and minimum display duration
 */
export const useSplashScreen = () => {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(10);
  const [isReady, setIsReady] = useState(document.readyState === 'complete');
  const startTimeRef = useRef<number>(performance.now());

  useEffect(() => {
    const handleReadyState = () => {
      if (document.readyState === 'complete') {
        setIsReady(true);
      }
    };

    const timer = setInterval(() => {
      setProgress((value) => {
        const target = isReady ? 100 : 93;
        if (value >= target) {
          return value;
        }

        const increment =
          config.splash.progressIncrement.min +
          Math.random() * (config.splash.progressIncrement.max - config.splash.progressIncrement.min);
        return Math.min(value + increment, target);
      });
    }, config.splash.progressInterval);

    handleReadyState();
    document.addEventListener('readystatechange', handleReadyState);

    return () => {
      clearInterval(timer);
      document.removeEventListener('readystatechange', handleReadyState);
    };
  }, [isReady, startTimeRef]);

  useEffect(() => {
    if (!isReady) {
      return undefined;
    }

    setProgress(100);

    const elapsed = performance.now() - startTimeRef.current;
    const minimumDuration = config.splash.minDuration;
    const delay = Math.max(450, minimumDuration - elapsed);

    const timeout = setTimeout(() => {
      setLoading(false);
    }, delay);

    return () => clearTimeout(timeout);
  }, [isReady]);

  return { loading, progress };
};

