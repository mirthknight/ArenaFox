import { useNavigate, Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from '@/features/auth/context/AuthContext';
import { LoadingOverlay } from '@mantine/core';

export const RequireAuth = () => {
    const { user, loading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && !user) {
            navigate('/login', { replace: true });
        }
    }, [loading, user, navigate]);

    if (loading) {
        return <LoadingOverlay visible={true} zIndex={1000} overlayProps={{ radius: 'sm', blur: 2 }} />;
    }

    if (!user) {
        return null; // Will redirect via useEffect
    }

    return <Outlet />;
};
