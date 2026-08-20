'use client';

import React from 'react';
import Link from 'next/link';
import { Phone, MessageSquare, FileText } from 'lucide-react';
import { useSiteContent } from '@/context/SiteContentContext';

export default function FloatingBar() {
  const { content } = useSiteContent();
  const company = content?.company || {
    phone: '+94 77 226 8608',
    whatsapp: '+94772268608',
  };

  const rawPhone = company.phone.replace(/[^0-9+]/g, '');
  const rawWhatsapp = (company.whatsapp || '+94772268608').replace(/[^0-9]/g, '');

  return (
    <aside aria-label="Quick Actions" className="fixed bottom-0 left-0 right-0 z-50 sm:hidden bg-white/98 dark:bg-slate-950/98 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 shadow-2xl shadow-slate-300/50 dark:shadow-black/50 pb-safe">
      <div className="grid grid-cols-3 gap-2 p-2.5 max-w-md mx-auto">
        {/* Direct Call */}
        <a
          href={`tel:${rawPhone}`}
          className="flex flex-col items-center justify-center py-2.5 px-1 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white active:scale-95 transition-all gap-1"
        >
          <Phone className="w-4 h-4 text-blue-600 dark:text-amber-400" />
          <span className="text-[11px] font-bold">Call Now</span>
        </a>

        {/* WhatsApp */}
        <a
          href={`https://wa.me/${rawWhatsapp}?text=Hello%20GLX%20Industries,%20I%20would%20like%20information%20on%20vehicle%20bodies.`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center py-2.5 px-1 rounded-2xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800/80 text-emerald-700 dark:text-emerald-300 active:scale-95 transition-all gap-1"
        >
          <MessageSquare className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span className="text-[11px] font-bold">WhatsApp</span>
        </a>

        {/* Instant Quote */}
        <Link
          href="/quotation"
          className="flex flex-col items-center justify-center py-2.5 px-1 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold active:scale-95 transition-all shadow-lg shadow-amber-500/30 gap-1"
        >
          <FileText className="w-4 h-4" />
          <span className="text-[11px] font-extrabold">Get Quote</span>
        </Link>
      </div>
    </aside>
  );
}
