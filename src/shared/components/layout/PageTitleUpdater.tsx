'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

const TITLE_MAP: Record<string, string> = {
    '/login': 'Login',
    '/': 'Dashboard',
    '/profiles': 'Profiles',
    '/admin/users': 'User management',
};

export const PageTitleUpdater = () => {
    const pathname = usePathname();

    useEffect(() => {
        if (!pathname) return;
        const matchingEntry = Object.keys(TITLE_MAP).find((path) =>
            path === '/' ? pathname === path : pathname.startsWith(path)
        );

        const pageTitle = matchingEntry ? TITLE_MAP[matchingEntry] : 'Arena Fox';
        document.title = `${pageTitle} • Arena Fox`;
    }, [pathname]);

    return null;
};
