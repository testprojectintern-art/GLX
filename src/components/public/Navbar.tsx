'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Phone, 
  MessageSquare, 
  Menu, 
  X, 
  ShieldCheck, 
  MapPin, 
  Sun, 
  Moon,
  ChevronRight,
  ChevronDown,
  Star,
  ArrowRight
} from 'lucide-react';
import { useSiteContent } from '@/context/SiteContentContext';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const pathname = usePathname();
  const { content, themeMode, toggleThemeMode } = useSiteContent();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 12);
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  const company = content?.company || {
    name: 'GLX Industries (Pvt) Ltd',
    brandName: 'GLX INDUSTRIES',
    tagline: 'Truck Body Engineers',
    phone: '+94 77 226 8608',
    whatsapp: '+94772268608',
    brcNumber: 'PV 00234891',
    logoUrl: '/logo.jpg',
  };

  const theme = content?.theme || {
    topBarLeftBadge: 'BRC Registered: PV 00234891',
    topBarLocationText: 'Ja-Ela & Kotugoda',
    topBarWhatsAppText: 'WhatsApp Support',
  };

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/catalog', label: 'Vehicle Bodies' },
    { href: '/services', label: 'Services' },
    { href: '/about', label: 'About Us' },
    { href: '/contact', label: 'Contact' },
  ];

  const isActive = (href: string) => {
    if (!pathname) return false;
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full min-w-full transition-all duration-500 ${
          scrolled
            ? 'bg-white/[0.97] dark:bg-slate-950/[0.97] shadow-xl shadow-slate-200/50 dark:shadow-black/40 backdrop-blur-2xl'
            : 'bg-white/90 dark:bg-slate-950/90 backdrop-blur-lg shadow-sm'
        } border-b border-slate-100 dark:border-slate-800/80 text-slate-900 dark:text-white`}
      >
        {/* ── Top announcement bar ── */}
        <div className="hidden sm:block relative overflow-hidden w-full bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 dark:from-black dark:via-slate-950 dark:to-black border-b border-slate-800/60">
          {/* Subtle animated shimmer */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-400/5 to-transparent animate-[shimmer_4s_ease-in-out_infinite]" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1.5 flex justify-between items-center gap-4 text-xs">
            {/* Left badges */}
            <div className="flex items-center gap-4">
              <span className="inline-flex items-center gap-1.5 text-amber-400 font-semibold">
                <ShieldCheck className="w-3 h-3 flex-shrink-0" />
                {theme.topBarLeftBadge || `BRC Reg: ${company.brcNumber || 'PV 00234891'}`}
              </span>
              <span className="hidden md:flex items-center gap-1.5 text-slate-400">
                <MapPin className="w-3 h-3 text-sky-400 flex-shrink-0" />
                {theme.topBarLocationText || 'Ja-Ela & Kotugoda'}
              </span>
              <span className="hidden xl:flex items-center gap-1.5 text-slate-400">
                <Star className="w-3 h-3 text-amber-500 flex-shrink-0" />
                <span>3,500+ Bodies Built</span>
              </span>
            </div>

            {/* Right contact strip */}
            <div className="flex items-center gap-1">
              <a
                href={`tel:${company.phone?.replace(/[^0-9+]/g, '')}`}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-slate-200 hover:text-amber-400 hover:bg-white/5 font-semibold transition-all duration-200"
              >
                <Phone className="w-3 h-3 text-amber-400 flex-shrink-0" />
                {company.phone}
              </a>

              <span className="text-slate-700 select-none">·</span>

              <a
                href={`https://wa.me/${company.whatsapp?.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-md text-emerald-400 hover:text-emerald-300 hover:bg-white/5 font-semibold transition-all duration-200"
              >
                <MessageSquare className="w-3 h-3 flex-shrink-0" />
                {theme.topBarWhatsAppText || 'WhatsApp Support'}
              </a>
            </div>
          </div>
        </div>

        {/* ── Main navigation row ── */}
        <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-[68px] gap-2 sm:gap-4">

            {/* Brand / Logo */}
            <Link href="/" className="flex items-center gap-2 sm:gap-3 group flex-shrink-0 min-w-0">
              <div className={`relative w-9 h-9 sm:w-12 sm:h-12 rounded-xl overflow-hidden shadow-md flex-shrink-0 ring-1 transition-all duration-300 ${
                scrolled
                  ? 'ring-slate-200/80 dark:ring-slate-700/60'
                  : 'ring-amber-400/20 dark:ring-amber-400/20'
              } group-hover:ring-amber-400/60 group-hover:shadow-amber-400/20 group-hover:shadow-lg`}>
                <img src={company.logoUrl || '/logo.jpg'} alt="GLX Logo" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-amber-400/0 group-hover:bg-amber-400/10 transition-colors duration-300" />
              </div>
              <div className="leading-none min-w-0">
                <span className="block font-black text-xs sm:text-base tracking-tight text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors duration-200 truncate">
                  {company.brandName || 'GLX INDUSTRIES'}
                </span>
                <span className="block text-[8px] sm:text-[10px] tracking-wider uppercase font-semibold text-slate-400 dark:text-slate-500 mt-0.5 truncate">
                  {company.tagline || 'Truck Body Engineers'}
                </span>
              </div>
            </Link>

            {/* Desktop nav links */}
            <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1" aria-label="Primary Navigation">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-3.5 py-2 rounded-xl text-[13px] font-semibold tracking-wide transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                    isActive(link.href)
                      ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/60'
                  }`}
                >
                  {link.label}
                  {isActive(link.href) && (
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-5 h-0.5 rounded-full bg-blue-600 dark:bg-blue-500" />
                  )}
                </Link>
              ))}
            </nav>

            {/* Desktop right actions */}
            <div className="hidden sm:flex items-center gap-2 lg:gap-3 flex-shrink-0">
              {/* Theme toggle */}
              <button
                onClick={toggleThemeMode}
                className="p-2 sm:p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-400/10 hover:border-amber-300 dark:hover:border-amber-500/50 transition-all duration-200 cursor-pointer"
                title={`Switch to ${themeMode === 'dark' ? 'Light' : 'Dark'} Mode`}
              >
                {themeMode === 'dark' ? (
                  <Sun className="w-4 h-4 text-amber-400" />
                ) : (
                  <Moon className="w-4 h-4" />
                )}
              </button>

              {/* Quotation CTA button — primary */}
              <Link
                href="/quotation"
                className="group relative overflow-hidden px-4 xl:px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs sm:text-[13px] shadow-md shadow-amber-500/25 hover:shadow-amber-500/40 hover:shadow-lg active:scale-95 transition-all duration-200 flex items-center justify-center whitespace-nowrap"
              >
                {/* Shimmer on hover */}
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
                <span className="relative hidden md:inline">Get Instant Quote</span>
                <span className="relative md:hidden">Quote</span>
              </Link>
            </div>

            {/* Mobile right actions */}
            <div className="flex sm:hidden items-center gap-1.5">
              <button
                onClick={toggleThemeMode}
                className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                title="Toggle theme"
              >
                {themeMode === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`p-2 rounded-lg border transition-all duration-200 cursor-pointer ${
                  mobileMenuOpen
                    ? 'border-blue-400/50 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400'
                    : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
                aria-label="Toggle menu"
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* ── Scroll progress bar ── */}
        {scrolled && (
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-slate-100 dark:bg-slate-800">
            <div
              className="h-full bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 transition-all duration-100"
              style={{ width: `${scrollProgress}%` }}
            />
          </div>
        )}
      </header>

      {/* ── Mobile full-screen menu overlay ── */}
      {/* Backdrop */}
      <div
        className={`sm:hidden fixed inset-0 z-50 transition-all duration-300 ${
          mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Backdrop blur */}
        <div
          className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        />

        {/* Slide-in panel from right */}
        <div
          className={`absolute top-0 right-0 bottom-0 w-[85vw] max-w-xs bg-white dark:bg-slate-950 shadow-2xl shadow-black/40 flex flex-col transition-transform duration-300 ease-out ${
            mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* Panel header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
            <Link href="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl overflow-hidden ring-1 ring-slate-200 dark:ring-slate-700">
                <img src={company.logoUrl || '/logo.jpg'} alt="GLX Logo" className="w-full h-full object-cover" />
              </div>
              <div>
                <span className="block font-black text-sm text-slate-900 dark:text-white tracking-tight">
                  {company.brandName || 'GLX INDUSTRIES'}
                </span>
                <span className="block text-[9px] tracking-widest text-slate-400 uppercase font-semibold">
                  {company.tagline || 'Truck Body Engineers'}
                </span>
              </div>
            </Link>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Nav links */}
          <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all ${
                  isActive(link.href)
                    ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/70 border border-transparent'
                }`}
              >
                <span>{link.label}</span>
                <ChevronRight className={`w-4 h-4 transition-transform ${isActive(link.href) ? 'text-blue-500 translate-x-0.5' : 'text-slate-300 dark:text-slate-600'}`} />
              </Link>
            ))}
          </nav>

          {/* Bottom CTA area */}
          <div className="p-4 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
            {/* Info pill */}
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
              <ShieldCheck className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                {theme.topBarLeftBadge || `BRC Reg: ${company.brcNumber}`}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <a
                href={`tel:${company.phone?.replace(/[^0-9+]/g, '')}`}
                className="flex flex-col items-center justify-center gap-1 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white font-bold text-xs transition active:scale-95"
              >
                <Phone className="w-4 h-4 text-amber-500" />
                <span>Call Now</span>
              </a>
              <Link
                href="/quotation"
                onClick={() => setMobileMenuOpen(false)}
                className="flex flex-col items-center justify-center gap-1 py-3 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 text-slate-950 font-extrabold text-xs shadow-lg shadow-amber-500/30 transition active:scale-95"
              >
                <ArrowRight className="w-4 h-4" />
                <span>Get Quote</span>
              </Link>
            </div>

            <a
              href={`https://wa.me/${company.whatsapp?.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs shadow-lg shadow-emerald-500/25 transition active:scale-95"
            >
              <MessageSquare className="w-4 h-4" />
              WhatsApp Us
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
