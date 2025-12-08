import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const TITLE_MAP: Record<string, string> = {
    '/login': 'Login',
    '/': 'Dashboard',
    '/profiles': 'Profiles',
    '/admin/users': 'User management',
};

export const PageTitleUpdater = () => {
    const location = useLocation();

    useEffect(() => {
        const matchingEntry = Object.keys(TITLE_MAP).find((path) =>
            path === '/' ? location.pathname === path : location.pathname.startsWith(path)
        );

        const pageTitle = matchingEntry ? TITLE_MAP[matchingEntry] : 'Arena Fox';
        document.title = `${pageTitle} • Arena Fox`;
    }, [location.pathname]);

    return null;
};
