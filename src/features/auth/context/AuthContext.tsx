'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabaseClient } from '@/shared/lib/supabaseClient';
import { fetchProfile } from '../services/authService';
import type { UserProfile } from '../types/auth.types';

interface AuthContextType {
    user: UserProfile | null;
    loading: boolean;
    signOut: () => Promise<void>;
    refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchUser = async (userId: string, email: string) => {
        try {
            const profile = await fetchProfile(userId, email);
            setUser(profile);
        } catch (error) {
            console.error('[AuthContext] Error fetching profile:', error);
        }
    };

    const resolveSession = async (session: Session | null, endLoading: boolean) => {
        if (session?.user?.email) {
            await fetchUser(session.user.id, session.user.email);
        } else {
            setUser(null);
        }

        if (endLoading) {
            setLoading(false);
        }
    };

    const refreshProfile = async () => {
        const { data: { session } } = await supabaseClient.auth.getSession();
        if (session?.user?.email) {
            await fetchUser(session.user.id, session.user.email);
        }
    };

    useEffect(() => {
        let mounted = true;
        let initialSessionResolved = false;

        setLoading(true);

        const { data: { subscription } } = supabaseClient.auth.onAuthStateChange(async (event, session) => {
            if (!mounted) return;

            if (event === 'INITIAL_SESSION') {
                initialSessionResolved = true;
                await resolveSession(session ?? null, true);
                return;
            }

            if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
                await resolveSession(session ?? null, false);
                return;
            }

            if (event === 'SIGNED_OUT') {
                setUser(null);
                setLoading(false);
            }
        });

        supabaseClient.auth
            .getSession()
            .then(async ({ data: { session }, error }) => {
                if (!mounted || initialSessionResolved) return;

                if (error) {
                    console.error('[AuthContext] Auth initialization error:', error);
                }

                await resolveSession(session ?? null, true);
            })
            .catch((error) => {
                if (!mounted) return;
                console.error('[AuthContext] Auth initialization caught error:', error);
                setUser(null);
                setLoading(false);
            });

        return () => {
            mounted = false;
            subscription.unsubscribe();
        };
    }, []);

    const signOut = async () => {
        try {
            setLoading(true);
            await supabaseClient.auth.signOut();
        } catch (error) {
            console.error('[AuthContext] Sign out error:', error);
        } finally {
            setUser(null);
            setLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, signOut, refreshProfile }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
