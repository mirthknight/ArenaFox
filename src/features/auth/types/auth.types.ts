/**
 * Authentication feature types
 */

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
}

export interface User {
  id: string;
  email: string;
  name?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  bio?: string;
  isVerified: boolean;
  verifiedAt: string | null;
  isEnabled: boolean;
  statusLabel: string | null;
  role: 'member' | 'admin' | 'super_admin';
}

export interface SplashScreenProps {
  progress: number;
}
