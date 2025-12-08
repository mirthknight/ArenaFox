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

export interface SplashScreenProps {
  progress: number;
}

