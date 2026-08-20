'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Menu, Sun, Moon, Globe, LayoutDashboard, Loader2 } from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { useSiteContent } from '@/context/SiteContentContext';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const { themeMode, toggleThemeMode } = useSiteContent();

  useEffect(() => {
    if (pathname === '/admin/login') {
      setIsAuthenticated(true);
      return;
    }

    const auth = sessionStorage.getItem('glx_admin_auth');
    if (auth === 'true') {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
      router.replace('/admin/login');
    }
  }, [pathname, router]);

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (isAuthenticated === null || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4 text-slate-900 dark:text-white">
        <div className="flex flex-col items-center gap-3 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl">
          <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
          <span className="text-xs text-slate-600 dark:text-slate-400 font-semibold">
            Verifying Admin Session Security...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Mobile Top App Bar (Visible on mobile screens < lg) */}
      <header className="lg:hidden sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer border border-slate-200 dark:border-slate-700"
            aria-label="Open Navigation Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <Link href="/admin" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl overflow-hidden shadow-sm flex-shrink-0">
              <img src="/logo.jpg" alt="GLX Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <span className="font-extrabold text-xs text-slate-900 dark:text-white block leading-tight">
                GLX ADMIN
              </span>
              <span className="text-[9px] text-amber-600 dark:text-amber-400 font-bold uppercase">
                System Hub
              </span>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleThemeMode}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition border border-slate-200 dark:border-slate-700 cursor-pointer"
            title={`Switch to ${themeMode === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {themeMode === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-blue-600" />
            )}
          </button>

          <Link
            href="/"
            target="_blank"
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition border border-slate-200 dark:border-slate-700"
            title="Public Website"
          >
            <Globe className="w-4 h-4 text-amber-500" />
          </Link>
        </div>
      </header>

      {/* Responsive Sidebar (Desktop sticky & Mobile drawer) */}
      <AdminSidebar
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 flex flex-col min-h-[calc(100vh-56px)] lg:h-screen lg:overflow-y-auto bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
        {children}
      </main>
    </div>
  );
}
