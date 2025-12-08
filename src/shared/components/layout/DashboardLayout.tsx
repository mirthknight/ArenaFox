import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';

export const DashboardLayout = () => {
    return (
        <div className="min-h-screen bg-[#0b1220] text-white selection:bg-primary-500/30">
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(45,212,191,0.14),transparent_30%),radial-gradient(circle_at_85%_25%,rgba(124,58,237,0.12),transparent_32%),radial-gradient(circle_at_50%_70%,rgba(59,130,246,0.08),transparent_36%)]" />
                <div className="absolute inset-0 bg-[linear-gradient(145deg,rgba(255,255,255,0.04)_0%,rgba(255,255,255,0)_40%,rgba(255,255,255,0.03)_80%)]" />
            </div>

            <div className="relative z-10 flex flex-col min-h-screen">
                <Header />

                <div className="flex flex-1 overflow-hidden">
                    <Sidebar />

                    <main className="flex-1 overflow-y-auto w-full p-4 md:p-8 bg-gradient-to-br from-white/5 via-black/20 to-black/50">
                        <div className="max-w-7xl mx-auto h-full">
                            <Outlet />
                        </div>
                    </main>
                </div>

                <Footer />
            </div>
        </div>
    );
};
