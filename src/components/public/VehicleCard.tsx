'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { VehicleItem } from '@/lib/types';
import { ShieldCheck, Layers, ArrowRight, FileText } from 'lucide-react';

interface VehicleCardProps {
  vehicle: VehicleItem;
}

export function getBadgeClasses(color?: string) {
  switch (color) {
    case 'emerald':
    case 'green':
      return 'bg-emerald-500 text-white font-bold';
    case 'blue':
      return 'bg-blue-600 text-white font-bold';
    case 'purple':
      return 'bg-purple-600 text-white font-bold';
    case 'red':
      return 'bg-red-600 text-white font-bold';
    case 'cyan':
      return 'bg-cyan-500 text-slate-950 font-bold';
    case 'rose':
      return 'bg-rose-500 text-white font-bold';
    case 'slate':
      return 'bg-slate-800 text-slate-200 border border-slate-700 font-bold';
    case 'amber':
    case 'gold':
    default:
      return 'bg-amber-500 text-slate-950 font-bold';
  }
}

export function getCategoryBadgeClasses(color?: string) {
  switch (color) {
    case 'emerald':
      return 'bg-emerald-600 text-white';
    case 'purple':
      return 'bg-purple-600 text-white';
    case 'amber':
      return 'bg-amber-500 text-slate-950 font-bold';
    case 'red':
      return 'bg-red-600 text-white';
    case 'cyan':
      return 'bg-cyan-600 text-white';
    case 'slate':
      return 'bg-slate-800 text-slate-200';
    case 'blue':
    default:
      return 'bg-blue-600 text-white';
  }
}

export default function VehicleCard({ vehicle }: VehicleCardProps) {
  const formattedPrice = vehicle.basePrice
    ? `From Rs. ${vehicle.basePrice.toLocaleString('en-LK')}`
    : 'Price on Request';

  const categoryStyle = getCategoryBadgeClasses(vehicle.categoryColor);
  const badgeStyle = getBadgeClasses(vehicle.badgeColor);

  return (
    <div className="group bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-500/50 transition-all duration-300 flex flex-col overflow-hidden shadow-md hover:shadow-2xl hover:shadow-amber-100 dark:hover:shadow-amber-950/20 hover:-translate-y-1">
      {/* Cover Image & Badges */}
      <div className="relative h-56 sm:h-60 w-full overflow-hidden bg-slate-100 dark:bg-slate-950">
        <Image
          src={vehicle.coverImage}
          alt={vehicle.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex justify-between items-start gap-2">
          <span className={`px-3 py-1 rounded-full text-[11px] font-bold shadow-lg backdrop-blur-sm ${categoryStyle}`}>
            {vehicle.category}
          </span>
          {vehicle.badge && (
            <span className={`px-3 py-1 rounded-full text-[11px] shadow-lg backdrop-blur-sm ${badgeStyle}`}>
              {vehicle.badge}
            </span>
          )}
        </div>

        {/* Price Tag */}
        <div className="absolute bottom-3 right-3">
          <span className="px-3 py-1.5 rounded-xl text-xs font-extrabold bg-slate-950/90 text-amber-400 border border-slate-700/80 shadow-xl backdrop-blur-sm">
            {formattedPrice}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between gap-4">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors duration-200 leading-snug">
            {vehicle.name}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mt-2">
            {vehicle.tagline || vehicle.description}
          </p>

          {/* Quick Specs */}
          {vehicle.specs && (
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 min-w-0">
                <Layers className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                <span className="truncate">{vehicle.specs.dimensions}</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 min-w-0">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                <span className="truncate">{vehicle.specs.warranty}</span>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Link
            href={`/catalog/${vehicle.slug}`}
            className="flex-1 py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold text-center transition-all duration-200 flex items-center justify-center gap-1.5 border border-slate-200 dark:border-slate-700"
          >
            <span>View Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            href={`/quotation?vehicle=${vehicle.id}`}
            className="py-2.5 px-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-extrabold transition-all duration-200 flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20 active:scale-95"
            title="Instant Quotation PDF"
          >
            <FileText className="w-4 h-4" />
            <span className="hidden sm:inline">Quote</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
