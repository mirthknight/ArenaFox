/**
 * Auth feature exports
 * Central export point for authentication-related components and hooks
 */

export { LoginForm } from './components/LoginForm';
export { DashboardPreview } from './components/DashboardPreview';
export { SplashScreen } from './components/SplashScreen';
export { useSplashScreen } from './hooks/useSplashScreen';
export { useSupabaseAuth } from './hooks/useSupabaseAuth';
export type {
  LoginCredentials,
  AuthState,
  User,
  UserProfile,
  SplashScreenProps,
} from './types/auth.types';

