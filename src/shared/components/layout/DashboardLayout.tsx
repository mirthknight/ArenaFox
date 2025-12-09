import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';
import { MockDataNotice } from './MockDataNotice';

export const DashboardLayout = () => {
    return (
        <div className="min-h-screen bg-[var(--af-surface)] text-[var(--af-ink)] selection:bg-[rgba(0,173,181,0.25)]">
            <div className="relative flex flex-col min-h-screen">
                <Header />

                <div className="flex flex-1 overflow-hidden">
                    <Sidebar />

                    <main className="flex-1 overflow-y-auto w-full p-4 md:p-8 bg-[var(--af-surface)]">
                        <div className="max-w-7xl mx-auto h-full space-y-4 bg-[var(--af-surface-alt)]/40 rounded-2xl p-4 md:p-6 shadow-[0_12px_40px_rgba(0,0,0,0.35)] border border-[var(--af-border)]">
                            <MockDataNotice />
                            <Outlet />
                        </div>
                    </main>
                </div>

                <Footer />
            </div>
        </div>
    );
};
