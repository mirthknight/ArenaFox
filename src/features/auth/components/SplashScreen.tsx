import React from 'react';
import { motion } from 'framer-motion';
import { Box, Progress, Stack, Text } from '@mantine/core';
import type { SplashScreenProps } from '../types/auth.types';

/**
 * Splash screen component with animated progress indicator
 * Displays during app initialization
 */
export const SplashScreen: React.FC<SplashScreenProps> = ({ progress }) => {
  return (
    <Box className="splash-screen">
      <motion.div
        className="splash-orb"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ repeat: Infinity, duration: 2.4, ease: 'easeInOut' }}
      >
        <motion.span
          role="img"
          aria-label="Animated fox"
          className="text-5xl"
          animate={{ y: [0, -8, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
        >
          🦊
        </motion.span>
      </motion.div>
      <Stack gap={4} align="center">
        <Text size="lg" fw={700} c="white">
          Preparing Arena Fox
        </Text>
        <Text size="sm" c="gray.2">
          Loading secure login and user workspace context.
        </Text>
      </Stack>
      <Progress value={progress} radius="xl" size="lg" maw={320} className="w-full max-w-xs" />
      <Text size="sm" c="gray.3">
        {Math.round(progress)}% ready
      </Text>
    </Box>
  );
};

