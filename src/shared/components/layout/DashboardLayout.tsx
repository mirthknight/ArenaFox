'use client';

import { useState, type ReactNode } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';
import { MockDataNotice } from './MockDataNotice';

interface DashboardLayoutProps {
  children: ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setMobileMenuOpen((open) => !open);
  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <div className="min-h-screen bg-[var(--af-surface)] text-[var(--af-ink)] selection:bg-[rgba(0,173,181,0.25)]">
      <div className="relative flex flex-col min-h-screen">
        <Header onToggleSidebar={toggleMobileMenu} />

        <div className="flex flex-1 overflow-hidden">
          <div
            className={`fixed inset-0 bg-black/50 transition-opacity duration-200 z-30 md:hidden ${
              mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
            }`}
            onClick={closeMobileMenu}
          />

          <Sidebar isMobileOpen={mobileMenuOpen} onClose={closeMobileMenu} />

          <main className="flex-1 overflow-y-auto w-full p-4 md:p-8 bg-[var(--af-surface)]">
            <div className="max-w-7xl mx-auto h-full space-y-4 bg-[var(--af-surface-alt)]/40 rounded-2xl p-4 md:p-6 shadow-[0_12px_40px_rgba(0,0,0,0.35)] border border-[var(--af-border)]">
              <MockDataNotice />
              {children}
            </div>
          </main>
        </div>

        <Footer />
      </div>
    </div>
  );
};
