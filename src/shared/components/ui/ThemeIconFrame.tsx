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
    <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-teal-200 ring-1 ring-white/10 ${className}`}>
      <motion.div
        animate={{ rotate: [0, -5, 5, 0] }}
        transition={{ repeat: Infinity, duration: 7, ease: 'easeInOut' }}
      >
        {icon}
      </motion.div>
    </div>
  );
};

