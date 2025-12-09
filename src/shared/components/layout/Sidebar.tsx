import { Stack, Text, Tooltip, UnstyledButton } from '@mantine/core';
import {
    LayoutDashboard,
    Users,
    BadgeCheck,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/features/auth/context/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';


const NAV_ITEMS = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { label: 'Profiles', icon: BadgeCheck, path: '/profiles' },
];

const ADMIN_ITEMS = [
    { label: 'User Management', icon: Users, path: '/admin/users' },
];

export const Sidebar = () => {
    const { user } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [collapsed, setCollapsed] = useState(false);

    const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';

    const NavItem = ({ item }: { item: any }) => {
        const isActive = location.pathname === item.path;
        return (
            <Tooltip label={item.label} position="right" disabled={!collapsed} withArrow>
                <UnstyledButton
                    onClick={() => navigate(item.path)}
                    className={`
                        w-full flex items-center p-3 mb-1 rounded-lg transition-all duration-200
                        ${isActive
                            ? 'bg-[rgba(0,173,181,0.18)] text-[var(--af-ink)] border-r-2 border-[var(--af-accent)] shadow-[0_10px_30px_rgba(0,0,0,0.28)]'
                            : 'text-[var(--af-ink-soft)] hover:bg-[rgba(0,173,181,0.08)] hover:text-[var(--af-ink)]'
                        }
                    `}
                >
                    <item.icon size={20} className={isActive ? 'text-[var(--af-accent)]' : 'text-[var(--af-ink-muted)]'} />
                    {!collapsed && (
                        <Text size="sm" ml="md" fw={500}>
                            {item.label}
                        </Text>
                    )}
                </UnstyledButton>
            </Tooltip>
        );
    };

    return (
        <nav
            className={`
                h-[calc(100vh-64px)] overflow-y-auto bg-[var(--af-surface-alt)] border-r border-[var(--af-border)] shadow-[10px_0_35px_rgba(0,0,0,0.35)]
                transition-all duration-300 flex flex-col sticky top-16 text-[var(--af-ink)]
                ${collapsed ? 'w-20' : 'w-64'}
            `}
        >
            <div className="flex-1 py-6 px-3">
                <Stack gap="xs">
                    <Text size="xs" fw={700} c="gray.5" className="px-3 mb-2 uppercase tracking-wider">
                        {!collapsed ? 'Menu' : '...'}
                    </Text>
                    {NAV_ITEMS.map((item) => (
                        <NavItem key={item.path} item={item} />
                    ))}

                    {isAdmin && (
                        <>
                            <div className="my-4 border-t border-[var(--af-border)]" />
                            <Text size="xs" fw={700} c="gray.5" className="px-3 mb-2 uppercase tracking-wider">
                                {!collapsed ? 'Admin' : '...'}
                            </Text>
                            {ADMIN_ITEMS.map((item) => (
                                <NavItem key={item.path} item={item} />
                            ))}
                        </>
                    )}
                </Stack>
            </div>

            <div className="p-3 border-t border-[var(--af-border)] bg-[rgba(57,62,70,0.5)]">
                <UnstyledButton
                    onClick={() => setCollapsed(!collapsed)}
                    className="w-full flex justify-center p-2 rounded-lg hover:bg-[rgba(0,173,181,0.12)] text-[var(--af-ink-soft)] hover:text-[var(--af-ink)] transition-colors"
                >
                    {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                </UnstyledButton>
            </div>
        </nav>
    );
};
