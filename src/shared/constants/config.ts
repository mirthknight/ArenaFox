/**
 * Application configuration constants
 */

export const config = {
  app: {
    name: 'Arena Fox',
    description: 'Kingshot event management dashboard',
  },
  splash: {
    minDuration: 1200, // Minimum splash screen duration in ms
    progressInterval: 260, // Progress update interval in ms
    progressIncrement: { min: 6, max: 14 }, // Progress increment range
  },
  notifications: {
    position: 'top-right' as const,
    limit: 3,
  },
} as const;

