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
                            ? 'bg-indigo-50 text-indigo-700 border-r-2 border-indigo-500'
                            : 'text-slate-600 hover:bg-indigo-50 hover:text-indigo-700'
                        }
                    `}
                >
                    <item.icon size={20} className={isActive ? 'text-indigo-600' : ''} />
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
                h-[calc(100vh-64px)] overflow-y-auto bg-white border-r border-slate-200 shadow-[10px_0_25px_rgba(15,23,42,0.06)]
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
                            <div className="my-4 border-t border-slate-200" />
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

            <div className="p-3 border-t border-slate-200 bg-slate-50">
                <UnstyledButton
                    onClick={() => setCollapsed(!collapsed)}
                    className="w-full flex justify-center p-2 rounded-lg hover:bg-indigo-50 text-slate-500 hover:text-slate-900 transition-colors"
                >
                    {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                </UnstyledButton>
            </div>
        </nav>
    );
};
