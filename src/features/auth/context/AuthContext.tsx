'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
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

    const refreshProfile = async () => {
        const { data: { session } } = await supabaseClient.auth.getSession();
        if (session?.user?.email) {
            await fetchUser(session.user.id, session.user.email);
        }
    };

    useEffect(() => {
        let mounted = true;

        const initAuth = async () => {
            setLoading(true);

            try {
                const timeoutDetails = new Promise((_, reject) =>
                    setTimeout(() => reject(new Error('Auth timeout')), 10000)
                );

                const authPromise = (async () => {
                    const { data: { session }, error } = await supabaseClient.auth.getSession();

                    if (error) throw error;

                    if (session?.user?.email) {
                        return await fetchProfile(session.user.id, session.user.email);
                    }
                    return null;
                })();

                const profile = (await Promise.race([authPromise, timeoutDetails])) as UserProfile | null;

                if (mounted) {
                    setUser(profile);
                }
            } catch (error) {
                if (mounted) {
                    if (error instanceof Error && error.message !== 'Auth timeout') {
                        console.error('[AuthContext] Auth initialization error:', error);
                    }
                    setUser(null);
                }
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        };

        const { data: { subscription } } = supabaseClient.auth.onAuthStateChange(async (event, session) => {
            if (event === 'SIGNED_IN' && session?.user?.email) {
                await fetchUser(session.user.id, session.user.email);
            } else if (event === 'SIGNED_OUT') {
                setUser(null);
            }
        });

        initAuth();

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
