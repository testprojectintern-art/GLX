'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Palette, 
  MessageSquare, 
  Send, 
  ExternalLink, 
  LogOut, 
  Truck, 
  Layers,
  Globe,
  Briefcase,
  Sun,
  Moon,
  X
} from 'lucide-react';
import { useSiteContent } from '@/context/SiteContentContext';

interface AdminSidebarProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export default function AdminSidebar({ mobileOpen, onCloseMobile }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { themeMode, toggleThemeMode } = useSiteContent();

  const webNavItems = [
    {
      label: 'UI Manage (Customizer)',
      subtitle: 'Visual Click-to-Edit CMS',
      href: '/admin/ui-manage',
      icon: Palette,
      badge: 'Live',
    },
    {
      label: 'Vehicle Catalog',
      subtitle: 'Add / Edit / Delete Models',
      href: '/admin/catalog',
      icon: Truck,
    },
    {
      label: 'Inquiries & Leads',
      subtitle: 'Customer Quotes & Messages',
      href: '/admin/leads',
      icon: MessageSquare,
    },
    {
      label: 'SMS Gateway',
      subtitle: 'Dispatch Logs & API Status',
      href: '/admin/sms',
      icon: Send,
    },
  ];

  const handleLogout = () => {
    sessionStorage.removeItem('glx_admin_auth');
    router.push('/admin/login');
  };

  const handleLinkClick = () => {
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 lg:w-64 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between h-screen transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="overflow-y-auto flex-1">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl overflow-hidden shadow-md flex-shrink-0">
                <img src="/logo.jpg" alt="GLX Logo" className="w-full h-full object-cover" />
              </div>
              <div>
                <span className="font-extrabold text-xs text-slate-900 dark:text-white block leading-tight">
                  GLX ADMIN PORTAL
                </span>
                <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold uppercase tracking-wider">
                  Unified System Hub
                </span>
              </div>
            </div>

            {/* Mobile Close Button */}
            <button
              onClick={onCloseMobile}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-white lg:hidden cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Central Hub Button */}
          <div className="p-3 pb-1">
            <Link
              href="/admin"
              onClick={handleLinkClick}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                pathname === '/admin'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <LayoutDashboard className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>Admin Portal Hub</span>
              </div>
              <span className="text-[9px] px-1.5 py-0.5 rounded font-mono bg-black/10 dark:bg-black/20">
                Select
              </span>
            </Link>
          </div>

          {/* Section 1: Web Management Portal */}
          <div className="px-3 pt-3">
            <div className="px-2 pb-1.5 flex items-center justify-between text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
                <Globe className="w-3 h-3" /> Web Management
              </span>
            </div>
            <nav className="space-y-1">
              {webNavItems.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={handleLinkClick}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                      active
                        ? 'bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-white border border-blue-200 dark:border-blue-700/60 shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <Icon
                        className={`w-4 h-4 flex-shrink-0 ${
                          active ? 'text-blue-600 dark:text-amber-400' : 'text-slate-400 dark:text-slate-500'
                        }`}
                      />
                      <div className="truncate">
                        <span className="block truncate">{item.label}</span>
                        <span className="text-[9px] text-slate-400 dark:text-slate-500 font-normal block truncate">
                          {item.subtitle}
                        </span>
                      </div>
                    </div>
                    {item.badge && (
                      <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-amber-500 text-slate-950 ml-1">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Section 2: Factory ERP System */}
          <div className="px-3 pt-4">
            <div className="px-2 pb-1.5 flex items-center justify-between text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              <span className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
                <Briefcase className="w-3 h-3" /> Factory Operations
              </span>
            </div>
            <Link
              href="/admin/system"
              onClick={handleLinkClick}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                pathname === '/admin/system'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-900/30'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500/40'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <Layers className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                <div>
                  <span className="block font-bold">Main ERP System</span>
                  <span className="text-[9px] text-slate-400 dark:text-slate-400 font-normal block">
                    Invoices, Jobs & Factory
                  </span>
                </div>
              </div>
              <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-blue-100 dark:bg-blue-500/30 text-blue-700 dark:text-blue-300">
                ERP
              </span>
            </Link>
          </div>
        </div>

        {/* Footer / Quick Actions & Theme Mode Toggle */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 space-y-2 bg-slate-50/50 dark:bg-slate-950">
          {/* Theme Mode Toggle Button */}
          <button
            onClick={toggleThemeMode}
            className="w-full py-2 px-3 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center justify-between transition border border-slate-200 dark:border-slate-800 cursor-pointer shadow-sm"
          >
            <span className="flex items-center gap-2">
              {themeMode === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-blue-600" />
              )}
              <span>Theme: {themeMode === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded font-mono bg-slate-100 dark:bg-slate-800 text-slate-500">
              Toggle
            </span>
          </button>

          <Link
            href="/"
            target="_blank"
            className="w-full py-2 px-3 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-300 text-xs font-medium flex items-center justify-between transition border border-slate-200 dark:border-slate-800"
          >
            <span className="flex items-center gap-2">
              <Globe className="w-3.5 h-3.5 text-amber-500" />
              <span>Public Website</span>
            </span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </Link>

          <button
            onClick={handleLogout}
            className="w-full py-2 px-3 rounded-xl bg-red-50 dark:bg-red-950/30 hover:bg-red-100 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 text-xs font-bold flex items-center gap-2 transition cursor-pointer border border-red-200 dark:border-red-900/30"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Exit Admin Portal</span>
          </button>
        </div>
      </aside>
    </>
  );
}
