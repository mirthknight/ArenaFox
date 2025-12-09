import { Stack, Text, Tooltip, UnstyledButton, Badge } from '@mantine/core';
import {
    LayoutDashboard,
    Users,
    BadgeCheck,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import { useState, type ElementType } from 'react';
import { useAuth } from '@/features/auth/context/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { WorkspaceCreateButton } from '@/features/workspaces';


const NAV_ITEMS = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { label: 'Profiles', icon: BadgeCheck, path: '/profiles' },
];

const ADMIN_ITEMS = [
    { label: 'User Management', icon: Users, path: '/admin/users' },
];

interface SidebarProps {
    isMobileOpen: boolean;
    onClose: () => void;
}

export const Sidebar = ({ isMobileOpen, onClose }: SidebarProps) => {
    const { user } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [collapsed, setCollapsed] = useState(false);

    const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';

    const NavItem = ({ item }: { item: { label: string; icon: ElementType; path: string; badge?: string } }) => {
        const isActive = location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);
        return (
            <Tooltip label={item.label} position="right" disabled={!collapsed} withArrow>
                <UnstyledButton
                    onClick={() => {
                        navigate(item.path);
                        onClose();
                    }}
                    className="group w-full"
                >
                    <div
                        className={`
                            relative w-full flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200
                            ${isActive
                                ? 'bg-[rgba(0,173,181,0.16)] text-[var(--af-ink)] shadow-[0_10px_30px_rgba(0,0,0,0.26)] border border-[rgba(0,173,181,0.22)]'
                                : 'text-[var(--af-ink-soft)] hover:bg-[rgba(0,173,181,0.08)] hover:text-[var(--af-ink)] border border-transparent'}
                        `}
                    >
                        <span
                            className={`grid h-10 w-10 place-items-center rounded-lg border transition-all duration-200
                                ${isActive
                                    ? 'bg-[rgba(0,173,181,0.22)] border-[rgba(0,173,181,0.45)] text-[var(--af-accent)]'
                                    : 'bg-[rgba(255,255,255,0.02)] border-[var(--af-border)] text-[var(--af-ink-muted)] group-hover:text-[var(--af-accent)]'}
                            `}
                        >
                            <item.icon size={18} />
                        </span>
                        {!collapsed && (
                            <div className="flex-1 min-w-0 flex items-center gap-2">
                                <Text size="sm" fw={600} className="tracking-tight truncate">
                                    {item.label}
                                </Text>
                                {item.badge && (
                                    <Badge size="xs" color="fox" variant="light" className="uppercase tracking-wide">
                                        {item.badge}
                                    </Badge>
                                )}
                            </div>
                        )}
                        {isActive && (
                            <span className="absolute right-2 h-6 w-1.5 rounded-full bg-[var(--af-accent)] shadow-[0_0_10px_rgba(0,173,181,0.7)]" />
                        )}
                    </div>
                </UnstyledButton>
            </Tooltip>
        );
    };

    return (
        <nav
            className={`
                fixed top-16 bottom-0 left-0 z-40 w-[17rem] flex-shrink-0
                bg-[linear-gradient(160deg,rgba(34,40,49,0.98),rgba(57,62,70,0.92))]
                border-r border-[var(--af-border)] shadow-[10px_0_35px_rgba(0,0,0,0.35)]
                transition-all duration-300 flex flex-col text-[var(--af-ink)]
                ${collapsed ? 'md:w-20' : 'md:w-[17rem]'}
                ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
                md:sticky md:top-16 md:bottom-auto md:min-h-[calc(100vh-4rem)] md:max-h-[calc(100vh-4rem)]
                overflow-y-auto scroll-py-4
            `}
            aria-label="Sidebar navigation"
        >
            <div className="flex-1 px-3 pt-4 pb-2 md:pb-3 flex flex-col gap-3">
                <Stack gap="xs" className="pb-1">
                    <Text size="xs" fw={700} c="gray.5" className="px-3 uppercase tracking-[0.2em]">
                        {!collapsed ? 'Workspace' : '...'}
                    </Text>
                    <WorkspaceCreateButton triggerVariant="sidebar" compact={collapsed} />
                </Stack>

                <Stack gap="xs">
                    <Text size="xs" fw={700} c="gray.5" className="px-3 uppercase tracking-[0.2em]">
                        {!collapsed ? 'Menu' : '...'}
                    </Text>
                    {NAV_ITEMS.map((item) => (
                        <NavItem key={item.path} item={item} />
                    ))}
                </Stack>

                {isAdmin && (
                    <Stack gap="xs" className="pt-1">
                        <Text size="xs" fw={700} c="gray.5" className="px-3 uppercase tracking-[0.2em]">
                            {!collapsed ? 'Admin' : '...'}
                        </Text>
                        {ADMIN_ITEMS.map((item) => (
                            <NavItem key={item.path} item={item} />
                        ))}
                    </Stack>
                )}
            </div>

            <div className="p-3 border-t border-[var(--af-border)] bg-[rgba(57,62,70,0.5)]">
                <UnstyledButton
                    onClick={() => {
                        if (isMobileOpen) {
                            onClose();
                            return;
                        }
                        setCollapsed(!collapsed);
                    }}
                    className="w-full flex justify-center p-2 rounded-lg hover:bg-[rgba(0,173,181,0.12)] text-[var(--af-ink-soft)] hover:text-[var(--af-ink)] transition-colors"
                >
                    {isMobileOpen ? 'Close' : collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                </UnstyledButton>
            </div>
        </nav>
    );
};
