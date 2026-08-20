'use client';

import React from 'react';
import Link from 'next/link';
import { Truck, Phone, Mail, MapPin, ShieldCheck, Clock, MessageSquare, ChevronRight, Lock } from 'lucide-react';
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
    operatingHours: 'Monday - Saturday: 8:00 AM - 6:00 PM',
    copyrightText: '© 2026 GLX Industries (Pvt) Ltd. All Rights Reserved. Commercial Body Engineering Sri Lanka.',
  };

  const categories = [
    { label: 'Three-Wheelers & Canopies', href: '/catalog/three-wheelers' },
    { label: 'Tata Dimo Batta Bodies', href: '/catalog/tata-dimo-batta' },
    { label: 'Mahindra Maxximo & Bolero Bodies', href: '/catalog/mahindra-maximo' },
    { label: '10.5 ft Commercial Bodies', href: '/catalog/10-5ft-bodies' },
    { label: '14.5 ft Heavy Lorry Bodies', href: '/catalog/14-5ft-bodies' },
    { label: 'Custom & Freezer Boxes', href: '/catalog/custom-special-bodies' },
  ];

  return (
    <footer className="bg-slate-900 dark:bg-slate-950 text-slate-300 border-t border-slate-800 pt-16 pb-28 sm:pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Col 1: Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-lg flex-shrink-0">
                <img src={company.logoUrl || '/logo.jpg'} alt="GLX Logo" className="w-full h-full object-cover" />
              </div>
              <div>
                <span className="font-extrabold text-lg text-white">{company.brandName || 'GLX INDUSTRIES'}</span>
                <span className="block text-[11px] text-amber-400 font-semibold tracking-wider uppercase">
                  {company.tagline || 'Truck Body Engineers'}
                </span>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Sri Lanka's premier engineering company for commercial vehicle bodies, heavy steel canopies, cargo distribution boxes, and PUF freezer containers.
            </p>
            <div className="pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-slate-800/80 dark:bg-slate-900 border border-slate-700 dark:border-slate-800 text-xs text-amber-400 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> BRC Reg: {company.brcNumber}
              </span>
            </div>
          </div>

          {/* Col 2: Vehicle Categories */}
          <div>
            <h3 className="text-white font-bold text-base mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span> Vehicle Categories
            </h3>
            <ul className="space-y-2.5 text-sm">
              {categories.map((cat) => (
                <li key={cat.href}>
                  <Link
                    href={cat.href}
                    className="text-slate-400 hover:text-amber-400 transition flex items-center gap-1.5 group"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-amber-400 transition" />
                    <span>{cat.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Workshop Locations */}
          <div>
            <h3 className="text-white font-bold text-base mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span> Workshop Facilities
            </h3>
            <div className="space-y-4 text-xs sm:text-sm text-slate-400">
              <div className="space-y-1">
                <p className="font-semibold text-slate-200 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  Kotugoda Main Workshop:
                </p>
                <p className="pl-5 text-slate-400 text-xs leading-relaxed">{company.factoryWorkshop}</p>
              </div>

              <div className="space-y-1">
                <p className="font-semibold text-slate-200 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-blue-400 flex-shrink-0" />
                  Thudella Head Office:
                </p>
                <p className="pl-5 text-slate-400 text-xs leading-relaxed">{company.headOffice}</p>
              </div>

              <div className="space-y-1">
                <p className="font-semibold text-slate-200 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  Operating Hours:
                </p>
                <p className="pl-5 text-slate-400 text-xs">{company.operatingHours}</p>
              </div>
            </div>
          </div>

          {/* Col 4: Hotlines & Direct Inquiries */}
          <div className="space-y-4">
            <h3 className="text-white font-bold text-base mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Contact Hotlines
            </h3>
            <ul className="space-y-3 text-sm text-slate-400">
              <li>
                <a
                  href={`tel:${company.phone?.replace(/[^0-9+]/g, '')}`}
                  className="hover:text-amber-400 transition flex items-center gap-2 text-slate-200 font-semibold"
                >
                  <Phone className="w-4 h-4 text-amber-400" />
                  <span>Main Hotline: {company.phone}</span>
                </a>
              </li>
              {company.secondaryPhone && (
                <li>
                  <a
                    href={`tel:${company.secondaryPhone?.replace(/[^0-9+]/g, '')}`}
                    className="hover:text-amber-400 transition flex items-center gap-2 text-slate-300"
                  >
                    <Phone className="w-4 h-4 text-blue-400" />
                    <span>Office Line: {company.secondaryPhone}</span>
                  </a>
                </li>
              )}
              <li>
                <a
                  href={`https://wa.me/${company.whatsapp?.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400 transition flex items-center gap-2 text-emerald-400 font-medium"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>WhatsApp: {company.whatsapp}</span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${company.email}`}
                  className="hover:text-white transition flex items-center gap-2 text-slate-300"
                >
                  <Mail className="w-4 h-4 text-slate-400" />
                  <span>{company.email}</span>
                </a>
              </li>
            </ul>

            <div className="pt-2">
              <Link
                href="/quotation"
                className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs text-center flex items-center justify-center gap-1.5 shadow-md"
              >
                <span>Instant Quotation Generator</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            {company.copyrightText || `© ${new Date().getFullYear()} GLX Industries (Pvt) Ltd. All Rights Reserved.`}
          </p>
          <div className="flex items-center gap-4">
            <Link href="/contact" className="hover:text-slate-400 transition">Contact Workshop</Link>
            <span>•</span>
            <Link href="/catalog" className="hover:text-slate-400 transition">Vehicle Catalog</Link>
            <span>•</span>
            <Link
              href="/admin/login"
              className="hover:text-amber-400 transition flex items-center gap-1 text-slate-600 hover:text-amber-400"
            >
              <Lock className="w-3 h-3" />
              <span>Admin Portal</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
