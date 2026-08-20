'use client';

import React from 'react';
import Link from 'next/link';
import { Phone, Mail, MapPin, ShieldCheck, Clock, MessageSquare, ChevronRight, Lock, ExternalLink } from 'lucide-react';
import { useSiteContent } from '@/context/SiteContentContext';

export default function Footer() {
  const { content } = useSiteContent();
  const company = content?.company || {
    name: 'GLX Industries (Pvt) Ltd',
    brandName: 'GLX INDUSTRIES',
    tagline: 'Truck Body Engineers',
    phone: '+94 77 226 8608',
    secondaryPhone: '+94 11 223 4567',
    whatsapp: '+94772268608',
    email: 'info@glxindustries.lk',
    brcNumber: 'PV 00234891',
    headOffice: 'No.14, Negombo Road, Thudella, Ja-Ela, Sri Lanka (11350)',
    factoryWorkshop: 'No.2020/3L, 2, Seeduwa Road, Kotugoda, Ja-Ela, Sri Lanka',
    operatingHours: 'Mon - Sat: 8:00 AM - 6:00 PM',
    copyrightText: '© 2026 GLX Industries (Pvt) Ltd. All Rights Reserved.',
  };

  const categories = [
    { label: 'Three-Wheelers & Canopies', href: '/catalog/three-wheelers' },
    { label: 'Tata Dimo Batta Bodies', href: '/catalog/tata-dimo-batta' },
    { label: 'Mahindra Maxximo & Bolero', href: '/catalog/mahindra-maximo' },
    { label: '10.5 ft Commercial Bodies', href: '/catalog/10-5ft-bodies' },
    { label: '14.5 ft Heavy Lorry Bodies', href: '/catalog/14-5ft-bodies' },
    { label: 'Custom & Freezer Boxes', href: '/catalog/custom-special-bodies' },
  ];

  return (
    <footer className="w-full bg-slate-900 dark:bg-slate-950 text-slate-300 border-t border-slate-800/80 pt-10 sm:pt-16 pb-24 sm:pb-12 overflow-hidden">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">
          
          {/* Col 1: Brand Info */}
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl overflow-hidden shadow-md flex-shrink-0">
                <img src={company.logoUrl || '/logo.jpg'} alt="GLX Logo" className="w-full h-full object-cover" />
              </div>
              <div>
                <span className="font-extrabold text-sm sm:text-base text-white block leading-tight">
                  {company.brandName || 'GLX INDUSTRIES'}
                </span>
                <span className="block text-[9px] sm:text-[10px] text-amber-400 font-semibold tracking-wider uppercase">
                  {company.tagline || 'Truck Body Engineers'}
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Sri Lanka&apos;s premier engineering company for commercial vehicle bodies, heavy canopies, and freezer boxes.
            </p>

            <div className="pt-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/90 dark:bg-slate-900 border border-slate-700/80 text-[11px] text-amber-400 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>BRC Reg: {company.brcNumber}</span>
              </span>
            </div>
          </div>

          {/* Col 2: Vehicle Categories */}
          <div>
            <h3 className="text-white font-bold text-xs sm:text-sm uppercase tracking-wider mb-3 sm:mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
              <span>Vehicle Categories</span>
            </h3>
            <ul className="grid grid-cols-2 sm:grid-cols-1 gap-2 text-xs sm:text-sm">
              {categories.map((cat) => (
                <li key={cat.href}>
                  <Link
                    href={cat.href}
                    className="text-slate-400 hover:text-amber-400 transition flex items-center gap-1 group py-0.5"
                  >
                    <ChevronRight className="w-3 h-3 text-slate-600 group-hover:text-amber-400 transition flex-shrink-0" />
                    <span className="truncate">{cat.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Workshop Locations */}
          <div>
            <h3 className="text-white font-bold text-xs sm:text-sm uppercase tracking-wider mb-3 sm:mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
              <span>Workshops & Hours</span>
            </h3>
            <div className="space-y-3 text-xs text-slate-400">
              <div className="space-y-0.5">
                <p className="font-semibold text-slate-200 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                  <span>Kotugoda Workshop:</span>
                </p>
                <p className="pl-5 text-slate-400 leading-snug">{company.factoryWorkshop}</p>
              </div>

              <div className="space-y-0.5">
                <p className="font-semibold text-slate-200 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                  <span>Head Office:</span>
                </p>
                <p className="pl-5 text-slate-400 leading-snug">{company.headOffice}</p>
              </div>

              <div className="space-y-0.5 pt-1">
                <p className="font-semibold text-slate-200 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span>{company.operatingHours}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Col 4: Hotlines & Direct Inquiries */}
          <div className="space-y-3">
            <h3 className="text-white font-bold text-xs sm:text-sm uppercase tracking-wider mb-3 sm:mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span>Hotlines & Contact</span>
            </h3>

            <div className="space-y-2 text-xs">
              <a
                href={`tel:${company.phone?.replace(/[^0-9+]/g, '')}`}
                className="p-2 rounded-xl bg-slate-800/60 dark:bg-slate-900 border border-slate-800 hover:border-amber-400/50 transition flex items-center gap-2 text-slate-200 font-semibold"
              >
                <Phone className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                <span className="truncate">Hotline: {company.phone}</span>
              </a>

              <a
                href={`https://wa.me/${company.whatsapp?.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl bg-emerald-950/40 border border-emerald-800/40 hover:border-emerald-500/50 transition flex items-center gap-2 text-emerald-400 font-medium"
              >
                <MessageSquare className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="truncate">WhatsApp: {company.whatsapp}</span>
              </a>

              <a
                href={`mailto:${company.email}`}
                className="p-2 rounded-xl bg-slate-800/60 dark:bg-slate-900 border border-slate-800 hover:border-slate-700 transition flex items-center gap-2 text-slate-300"
              >
                <Mail className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                <span className="truncate">{company.email}</span>
              </a>
            </div>

            <div className="pt-1">
              <Link
                href="/quotation"
                className="w-full py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs text-center flex items-center justify-center gap-1.5 shadow-md transition"
              >
                <span>Instant Quotation</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <p className="text-center sm:text-left">
            {company.copyrightText || `© ${new Date().getFullYear()} GLX Industries (Pvt) Ltd.`}
          </p>
          <div className="flex items-center gap-3">
            <Link href="/contact" className="hover:text-slate-300 transition">Contact</Link>
            <span>•</span>
            <Link href="/catalog" className="hover:text-slate-300 transition">Catalog</Link>
            <span>•</span>
            <Link
              href="/admin/login"
              className="hover:text-amber-400 transition flex items-center gap-1 text-slate-600 hover:text-amber-400"
            >
              <Lock className="w-3 h-3" />
              <span>Admin</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
