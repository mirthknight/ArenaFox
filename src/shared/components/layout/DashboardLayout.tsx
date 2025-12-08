import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

export const DashboardLayout = () => {
    return (
        <div className="min-h-screen bg-[#0A0A0A] text-white selection:bg-primary-500/30">
            <div className="fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900/50 via-black to-black pointer-events-none" />

            <div className="relative z-10 flex flex-col min-h-screen">
                <Header />

                <div className="flex flex-1 overflow-hidden">
                    <Sidebar />

                    <main className="flex-1 overflow-y-auto w-full p-4 md:p-8 bg-gradient-to-br from-transparent to-black/40">
                        <div className="max-w-7xl mx-auto h-full">
                            <Outlet />
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};
