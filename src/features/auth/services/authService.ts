import { supabaseClient } from '@/shared/lib/supabaseClient';
import type { LoginCredentials, UserProfile } from '../types/auth.types';

interface ProfileResponseRow {
  id: string;
  email?: string | null;
  display_name?: string | null;
  avatar_url?: string | null;
  bio?: string | null;
  verified_at?: string | null;
  status_label?: string | null;
  role?: string | null;
  is_enabled?: boolean | null;
  is_verified?: boolean | null;
}

const SUPER_ADMIN_ROLE = 'super_admin';

const getSuperAdminEmail = () => import.meta.env.VITE_SUPER_ADMIN_EMAIL?.toLowerCase().trim();

const mapProfile = (
  userId: string,
  credentialsEmail: string,
  row?: ProfileResponseRow | null
): UserProfile => {
  const superAdminEmail = getSuperAdminEmail();
  const email = (row?.email ?? credentialsEmail).toLowerCase();

  const isSuperAdmin = row?.role === SUPER_ADMIN_ROLE || (!!superAdminEmail && email === superAdminEmail);

  return {
    id: userId,
    email,
    displayName: row?.display_name ?? email.split('@')[0],
    avatarUrl: row?.avatar_url ?? '',
    bio: row?.bio ?? '',
    isVerified: row?.is_verified ?? Boolean(row?.verified_at),
    statusLabel: row?.status_label ?? null,
    role: (row?.role as UserProfile['role']) ?? (isSuperAdmin ? SUPER_ADMIN_ROLE : 'member'),
    isEnabled: row?.is_enabled ?? true,
    verifiedAt: row?.verified_at ?? null,
  };
};

export const fetchProfile = async (userId: string, email: string): Promise<UserProfile> => {
  try {
    // Create a timeout for the database query to prevent hanging on RLS issues
    const dbPromise = supabaseClient
      .from('user_accounts')
      .select(
        'id, email, display_name, avatar_url, bio, verified_at, status_label, role, is_enabled, is_verified'
      )
      .eq('id', userId)
      .maybeSingle();

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('DB Query Timeout')), 3000)
    );

    const { data, error } = await Promise.race([dbPromise, timeoutPromise]) as any;

    if (error) {
      console.error('[authService] fetchProfile error:', error);
      // Fallthrough to fallback
    } else {
      return mapProfile(userId, email, data ?? undefined);
    }
  } catch (err) {
    console.error('[authService] fetchProfile caught error (or timeout):', err);
    // Fallthrough to fallback
  }

  // Fallback: Return a valid profile based on the authenticated credentials
  // This ensures the user can at least log in even if the database table is locked/empty
  return mapProfile(userId, email, null);
};

export const signInWithSupabase = async (
  credentials: LoginCredentials
): Promise<{ profile: UserProfile; metadata: Record<string, unknown> } | null> => {
  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email: credentials.email,
    password: credentials.password,
  });

  if (error) {
    throw error;
  }

  const userId = data.user?.id;
  const sessionEmail = data.user?.email ?? credentials.email;

  if (!userId || !sessionEmail) {
    throw new Error('Unable to load user profile from Supabase.');
  }

  const profile = await fetchProfile(userId, sessionEmail);

  if (!profile.isEnabled) {
    await supabaseClient.auth.signOut();
    throw new Error('Your account has been disabled. Please contact an administrator.');
  }

  return {
    profile,
    metadata: data.user?.user_metadata ?? {},
  };
};
