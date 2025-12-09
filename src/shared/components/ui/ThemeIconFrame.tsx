import React from 'react';
import { motion } from 'framer-motion';

interface ThemeIconFrameProps {
  icon: React.ReactNode;
  className?: string;
}

/**
 * Animated icon frame component with subtle rotation animation
 * Used for theme icons and decorative elements
 */
export const ThemeIconFrame: React.FC<ThemeIconFrameProps> = ({ icon, className = '' }) => {
  return (
    <div
      className={`flex h-11 w-11 items-center justify-center rounded-xl bg-[rgba(0,173,181,0.12)] text-[var(--af-ink)] ring-1 ring-[rgba(238,238,238,0.15)] shadow-[0_10px_30px_rgba(0,0,0,0.35)] ${className}`}
    >
      <motion.div
        animate={{ rotate: [0, -5, 5, 0] }}
        transition={{ repeat: Infinity, duration: 7, ease: 'easeInOut' }}
      >
        {icon}
      </motion.div>
    </div>
  );
};

