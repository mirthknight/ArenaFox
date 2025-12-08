/**
 * Theme constants for ArenaFox
 * Centralized color palette, spacing, and design tokens
 */

export const theme = {
  colors: {
    midnight: '#0f172a',
    neon: '#65f3c5',
    accent: '#7c3aed',
  },
  shadows: {
    glow: '0 10px 60px rgba(101, 243, 197, 0.45)',
    soft: '0 8px 30px rgba(15, 23, 42, 0.25)',
  },
  gradients: {
    background: [
      'radial-gradient(circle at 20% 20%, rgba(101, 243, 197, 0.15), transparent 30%)',
      'radial-gradient(circle at 80% 30%, rgba(124, 58, 237, 0.12), transparent 35%)',
      'radial-gradient(circle at 50% 70%, rgba(59, 130, 246, 0.08), transparent 40%)',
      '#0f172a',
    ].join(', '),
    splash: [
      'radial-gradient(circle at 20% 20%, rgba(16, 185, 129, 0.12), transparent 30%)',
      'radial-gradient(circle at 80% 30%, rgba(14, 165, 233, 0.1), transparent 32%)',
      'radial-gradient(circle at 40% 80%, rgba(16, 149, 131, 0.14), transparent 36%)',
      '#0b1220',
    ].join(', '),
  },
} as const;

