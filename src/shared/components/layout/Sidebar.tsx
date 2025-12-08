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
                            ? 'bg-primary-500/10 text-primary-400 border-r-2 border-primary-500'
                            : 'text-zinc-400 hover:bg-white/5 hover:text-white'
                        }
                    `}
                >
                    <item.icon size={20} className={isActive ? 'text-primary-400' : ''} />
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
                h-[calc(100vh-64px)] overflow-y-auto bg-gradient-to-b from-[#0b1220]/90 via-[#0f172a]/85 to-[#0b1220]/90 backdrop-blur-xl border-r border-white/5 shadow-[10px_0_40px_rgba(0,0,0,0.35)]
                transition-all duration-300 flex flex-col sticky top-16
                ${collapsed ? 'w-20' : 'w-64'}
            `}
        >
            <div className="flex-1 py-6 px-3">
                <Stack gap="xs">
                    <Text size="xs" fw={700} c="dimmed" className="px-3 mb-2 uppercase tracking-wider">
                        {!collapsed ? 'Menu' : '...'}
                    </Text>
                    {NAV_ITEMS.map((item) => (
                        <NavItem key={item.path} item={item} />
                    ))}

                    {isAdmin && (
                        <>
                            <div className="my-4 border-t border-white/5" />
                            <Text size="xs" fw={700} c="dimmed" className="px-3 mb-2 uppercase tracking-wider">
                                {!collapsed ? 'Admin' : '...'}
                            </Text>
                            {ADMIN_ITEMS.map((item) => (
                                <NavItem key={item.path} item={item} />
                            ))}
                        </>
                    )}
                </Stack>
            </div>

            <div className="p-3 border-t border-white/5 bg-white/5/10">
                <UnstyledButton
                    onClick={() => setCollapsed(!collapsed)}
                    className="w-full flex justify-center p-2 rounded-lg hover:bg-white/5 text-zinc-400 hover:text-white transition-colors"
                >
                    {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                </UnstyledButton>
            </div>
        </nav>
    );
};
