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
        console.log('[AuthContext] fetchUser called for:', email);
        try {
            const profile = await fetchProfile(userId, email);
            console.log('[AuthContext] fetchProfile result:', profile);
            setUser(profile);
        } catch (error) {
            console.error('[AuthContext] Error fetching profile:', error);
            // Don't nuke user state immediately on simple fetch error, wait for auth check
        }
    };

    const refreshProfile = async () => {
        console.log('[AuthContext] refreshProfile called');
        const { data: { session } } = await supabaseClient.auth.getSession();
        if (session?.user?.email) {
            await fetchUser(session.user.id, session.user.email);
        }
    };

    useEffect(() => {
        let mounted = true;
        console.log('[AuthContext] Provider mounted, starting initAuth');

        const initAuth = async () => {
            // Avoid double-setting loading in React StrictMode if already done
            setLoading(true);

            try {
                // Create a timeout promise (10 seconds)
                const timeoutDetails = new Promise((_, reject) =>
                    setTimeout(() => reject(new Error('Auth timeout')), 10000)
                );

                const authPromise = (async () => {
                    console.log('[AuthContext] Calling getSession...');
                    const { data: { session }, error } = await supabaseClient.auth.getSession();
                    console.log('[AuthContext] getSession result:', { hasSession: !!session, error });

                    if (error) throw error;

                    if (session?.user?.email) {
                        console.log('[AuthContext] Session found, fetching profile...');
                        return await fetchProfile(session.user.id, session.user.email);
                    }
                    console.log('[AuthContext] No session found.');
                    return null;
                })();

                // Race between auth check and timeout
                const profile = (await Promise.race([authPromise, timeoutDetails])) as UserProfile | null;
                console.log('[AuthContext] Race finished. Profile:', profile);

                if (mounted) {
                    if (profile) {
                        setUser(profile);
                    } else {
                        setUser(null);
                    }
                }
            } catch (error) {
                // Only log real errors, not timeouts which are expected on slow connections
                if (mounted) {
                    if (error instanceof Error && error.message !== 'Auth timeout') {
                        console.error('[AuthContext] Auth initialization error:', error);
                    }
                    setUser(null);
                }
            } finally {
                if (mounted) {
                    console.log('[AuthContext] initAuth finished, setting loading=false');
                    setLoading(false);
                }
            }
        };

        const { data: { subscription } } = supabaseClient.auth.onAuthStateChange(async (event, session) => {
            console.log(`[AuthContext] AuthStateChange: ${event}`, session?.user?.email);
            if (event === 'SIGNED_IN' && session?.user?.email) {
                await fetchUser(session.user.id, session.user.email);
            } else if (event === 'SIGNED_OUT') {
                setUser(null);
            }
        });

        initAuth();

        return () => {
            console.log('[AuthContext] Provider unmounting');
            mounted = false;
            subscription.unsubscribe();
        };
    }, []);

    const signOut = async () => {
        await supabaseClient.auth.signOut();
        setUser(null);
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
