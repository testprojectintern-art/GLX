'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Wrench, CheckCircle2, ArrowRight, ShieldCheck, FileText, Cog } from 'lucide-react';
import { useSiteContent } from '@/context/SiteContentContext';

export default function ServicesPage() {
  const { content } = useSiteContent();
  const services = content?.services || {
    title: 'Our Fabrication & Engineering Services',
    subtitle: 'End-to-end commercial vehicle body manufacturing, custom engineering, and body restoration.',
    list: [
      {
        id: "commercial-lorry",
        name: "Commercial Lorry Body Fabrication",
        description: "Full-body fabrication for 10.5ft, 14.5ft, and multi-axle trucks including corrugated steel boxes, drop-side hardware carriers, and flatbed transporters.",
        image: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=800&q=80"
      },
      {
        id: "three-wheeler",
        name: "Three-Wheeler Canopies & Food-Trucks",
        description: "Customized delivery boxes, mobile food kiosks, beverage carts, and heavy-duty steel canopies for Bajaj, TVS, and Piaggio.",
        image: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80"
      },
      {
        id: "dimo-maximo",
        name: "Dimo Batta & Maxximo Light Truck Bodies",
        description: "Aerodynamic, fuel-efficient half/full canopies and closed aluminum boxes designed specifically for Tata Ace and Mahindra chassis.",
        image: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=800&q=80"
      },
      {
        id: "refrigerated-boxes",
        name: "Freezer & Insulated Cold-Chain Boxes",
        description: "High-density PUF insulation boxes (-20°C to +4°C) with food-grade SS304 interiors for dairy, seafood, and pharmaceutical transport.",
        image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80"
      },
      {
        id: "repair-painting",
        name: "Body Repair, 2K Painting & Re-Modifications",
        description: "Complete restoration of accident-damaged bodies, chassis straightening, rust removal, sheet replacement, and 2K oven baked re-spray.",
        image: "https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=800&q=80"
      }
    ]
  };

  const fallbackServiceImages = [
    'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1506015391300-4802dc74de2e?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80'
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Banner Strip */}
      <div className="relative bg-gradient-to-br from-blue-950 via-slate-900 to-slate-900 py-16 sm:py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-15">
          <Image
            src="https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1600&q=80"
            alt=""
            fill
            className="object-cover object-center"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 to-slate-900/95" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold bg-blue-500/20 text-blue-200 border border-blue-500/40 uppercase tracking-widest mb-6">
            Engineering Capabilities
          </span>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
            {services.title}
          </h1>
          <p className="mt-5 text-base sm:text-xl text-slate-300 font-medium max-w-2xl mx-auto leading-relaxed">
            {services.subtitle}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-slate-300">
            <span className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-amber-400" /> 5-Year Warranty</span>
            <span className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-amber-400" /> BRC Certified</span>
            <span className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-amber-400" /> 3–14 Day Delivery</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 space-y-16">
        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {services.list?.map((srv, idx) => (
            <div
              key={srv.id || idx}
              className="group bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-500/50 transition-all duration-300 overflow-hidden flex flex-col shadow-md hover:shadow-2xl hover:shadow-amber-100 dark:hover:shadow-amber-950/20 hover:-translate-y-1"
            >
              <div className="relative h-52 sm:h-56 w-full overflow-hidden bg-slate-100 dark:bg-slate-950">
                <Image
                  src={srv.image || fallbackServiceImages[idx % fallbackServiceImages.length]}
                  alt={srv.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="absolute top-3 left-3">
                  <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-blue-600 text-white shadow-lg">
                    Service {String(idx + 1).padStart(2, '0')}
                  </span>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between gap-4">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition leading-snug">
                    {srv.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                    {srv.description}
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <Link
                    href="/quotation"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 transition group/link"
                  >
                    <span>Request Quotation</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition" />
                  </Link>
                  <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center border border-amber-200 dark:border-amber-800/50">
                    <Wrench className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quality Commitment Callout */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-blue-900 via-blue-950 to-slate-900 p-8 sm:p-14 shadow-2xl">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-amber-400" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4 text-white">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">Custom Engineering Support</span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                Have a unique commercial vehicle requirement?
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Our engineers provide computerized 3D blueprints and exact weight distribution calculations before fabrication begins. No project is too specialized.
              </p>
              <div className="space-y-2 pt-2">
                {['Free consultation & site visit', 'Computerized 3D design blueprints', 'Written warranty & service agreement'].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-blue-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <Link
                href="/contact"
                className="flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-sm shadow-xl shadow-amber-500/30 transition-all active:scale-95"
              >
                <FileText className="w-5 h-5" />
                Talk to Chief Engineer
              </Link>
              <Link
                href="/quotation"
                className="flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-sm border border-white/20 transition-all"
              >
                Get Instant Quotation
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
