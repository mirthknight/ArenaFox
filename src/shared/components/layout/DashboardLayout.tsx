import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';
import { MockDataNotice } from './MockDataNotice';

export const DashboardLayout = () => {
    return (
        <div className="min-h-screen bg-[#f5f7fb] text-slate-900 selection:bg-indigo-100">
            <div className="relative flex flex-col min-h-screen">
                <Header />

                <div className="flex flex-1 overflow-hidden">
                    <Sidebar />

                    <main className="flex-1 overflow-y-auto w-full p-4 md:p-8 bg-gradient-to-b from-white to-indigo-50/60">
                        <div className="max-w-7xl mx-auto h-full space-y-4">
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
