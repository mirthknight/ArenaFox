import { useState } from 'react';
import { notifications } from '@mantine/notifications';
import { ShieldCheck, ShieldOff } from 'lucide-react';
import { signInWithSupabase } from '../services/authService';
import type { LoginCredentials, UserProfile } from '../types/auth.types';

interface UseSupabaseAuthReturn {
  currentProfile: UserProfile | null;
  isSubmitting: boolean;
  signIn: (credentials: LoginCredentials) => Promise<UserProfile | null>;
}

export const useSupabaseAuth = (): UseSupabaseAuthReturn => {
  const [currentProfile, setCurrentProfile] = useState<UserProfile | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const signIn = async (credentials: LoginCredentials): Promise<UserProfile | null> => {
    setIsSubmitting(true);
    try {
      const result = await signInWithSupabase(credentials);
      if (!result?.profile) {
        return null;
      }

      setCurrentProfile(result.profile);

      const greetingSuffix = result.profile.displayName ? `, ${result.profile.displayName}` : '';

      notifications.show({
        title: 'Secured with Supabase',
        message: `Welcome back${greetingSuffix}! Your session is protected by row-level policies.`,
        color: 'teal',
        icon: <ShieldCheck size={16} />,
      });

      return result.profile;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to log in right now.';
      notifications.show({
        title: 'Login blocked',
        message,
        color: 'red',
        icon: <ShieldOff size={16} />,
      });
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    currentProfile,
    isSubmitting,
    signIn,
  };
};
