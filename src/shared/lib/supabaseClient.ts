'use client';

import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

type AuthSubscription = { unsubscribe: () => void };

const createMockSupabaseClient = (): SupabaseClient => {
  const subscription: AuthSubscription = {
    unsubscribe: () => undefined,
  };

  const auth = {
    async getSession() {
      return { data: { session: null }, error: null } as const;
    },
    onAuthStateChange(
      callback: (event: string, session: unknown) => void
    ): { data: { subscription: AuthSubscription } } {
      setTimeout(() => callback('SIGNED_OUT', null), 0);
      return { data: { subscription } };
    },
    async signOut() {
      return { error: null } as const;
    },
    async signInWithPassword() {
      return {
        data: { session: null },
        error: new Error('Supabase is not configured; running in mock auth mode.'),
      } as const;
    },
  };

  const createErrorResponse = (message: string) => ({
    data: null,
    error: new Error(message),
  });

  const from = () => ({
    select: () => Promise.resolve(createErrorResponse('Supabase unavailable')),
    insert: () => Promise.resolve(createErrorResponse('Supabase unavailable')),
    update: () => Promise.resolve(createErrorResponse('Supabase unavailable')),
    delete: () => Promise.resolve(createErrorResponse('Supabase unavailable')),
    eq: () => ({ select: () => Promise.resolve(createErrorResponse('Supabase unavailable')) }),
    in: () => ({ select: () => Promise.resolve(createErrorResponse('Supabase unavailable')) }),
  });

  return { auth, from } as unknown as SupabaseClient;
};

export const supabaseClient: SupabaseClient = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    })
  : createMockSupabaseClient();
