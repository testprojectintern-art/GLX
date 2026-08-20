'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Layers, 
  Clock, 
  CheckCircle2, 
  FileText, 
  ArrowLeft, 
  Phone,
  Loader2
} from 'lucide-react';
import LightboxGallery from '@/components/public/LightboxGallery';
import { VehicleItem } from '@/lib/types';
import { getBadgeClasses, getCategoryBadgeClasses } from '@/components/public/VehicleCard';

export default function CategoryDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [vehicle, setVehicle] = useState<VehicleItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/catalog')
      .then((res) => res.json())
      .then((data: VehicleItem[]) => {
        if (Array.isArray(data)) {
          const found = data.find((v) => v.slug === slug || v.id === slug);
          if (found) setVehicle(found);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="py-32 text-center flex flex-col items-center justify-center gap-3 text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
        <span className="text-xs">Loading Vehicle Details...</span>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="py-24 text-center max-w-lg mx-auto px-4 space-y-4">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Vehicle Category Not Found</h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">The vehicle category you requested does not exist or has been removed.</p>
        <Link href="/catalog" className="inline-block px-6 py-3 rounded-xl bg-blue-600 text-white text-xs font-bold">
          Back to Vehicle Catalog
        </Link>
      </div>
    );
  }

  const formattedPrice = `Rs. ${vehicle.basePrice?.toLocaleString('en-LK')}`;

  return (
    <div className="py-10 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Breadcrumb / Back Link */}
      <div>
        <Link
          href="/catalog"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-amber-400 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Categories</span>
        </Link>
      </div>

      {/* Main Hero Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className={`px-3 py-1 rounded-full text-xs font-bold shadow ${getCategoryBadgeClasses(vehicle.categoryColor)}`}>
              {vehicle.category}
            </span>
            {vehicle.badge && (
              <span className={`px-3 py-1 rounded-full text-xs shadow ${getBadgeClasses(vehicle.badgeColor)}`}>
                {vehicle.badge}
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            {vehicle.name}
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            {vehicle.description || vehicle.tagline}
          </p>
        </div>

        {/* Quick Quote Callout Card */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col justify-between space-y-6">
          <div>
            <span className="text-xs text-slate-500 dark:text-slate-400 uppercase font-medium">Estimated Starting Price</span>
            <p className="text-2xl sm:text-3xl font-extrabold text-blue-600 dark:text-amber-400 mt-1 font-mono">
              {formattedPrice}
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">Est. Production Lead Time: {vehicle.leadTime || '5 - 10 Days'}</p>
          </div>

          <div className="space-y-3">
            <Link
              href={`/quotation?vehicle=${vehicle.id}`}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-xs sm:text-sm text-center shadow-lg shadow-amber-500/20 transition flex items-center justify-center gap-2"
            >
              <FileText className="w-4 h-4" />
              <span>Generate Official Quotation PDF</span>
            </Link>

            <a
              href="tel:+94772268608"
              className="w-full py-3 px-4 rounded-xl bg-slate-100 dark:bg-slate-950 hover:bg-slate-200 dark:hover:bg-slate-850 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 text-xs font-bold text-center transition flex items-center justify-center gap-2"
            >
              <Phone className="w-3.5 h-3.5 text-blue-600 dark:text-amber-400" />
              <span>Direct Hotline: 077 226 8608</span>
            </a>
          </div>
        </div>
      </div>

      {/* Photo Gallery (with Lightbox) */}
      <div className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
          Fabrication Gallery & Portfolio
        </h2>
        <LightboxGallery images={vehicle.gallery && vehicle.gallery.length > 0 ? vehicle.gallery : [vehicle.coverImage]} title={vehicle.name} />
      </div>

      {/* Engineering Specifications Table */}
      {vehicle.specs && (
        <div className="space-y-6">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
            Technical & Structural Specifications
          </h2>

          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 overflow-hidden shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200 dark:divide-slate-800 text-xs sm:text-sm">
              <div className="p-5 space-y-4">
                <div>
                  <span className="text-[11px] font-semibold text-slate-500 uppercase">Chassis Compatibility</span>
                  <p className="font-bold text-slate-900 dark:text-white mt-0.5">{vehicle.specs.chassisCompatibility}</p>
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-slate-500 uppercase">Sheet Material & Gauge</span>
                  <p className="font-bold text-slate-900 dark:text-white mt-0.5">{vehicle.specs.sheetMaterial}</p>
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-slate-500 uppercase">Floor Deck Plate</span>
                  <p className="font-bold text-slate-900 dark:text-white mt-0.5">{vehicle.specs.floorPlate}</p>
                </div>
              </div>

              <div className="p-5 space-y-4">
                <div>
                  <span className="text-[11px] font-semibold text-slate-500 uppercase">Standard Dimensions</span>
                  <p className="font-bold text-slate-900 dark:text-white mt-0.5">{vehicle.specs.dimensions}</p>
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-slate-500 uppercase">Paint & Anti-Corrosion Finish</span>
                  <p className="font-bold text-slate-900 dark:text-white mt-0.5">{vehicle.specs.paintFinish}</p>
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-slate-500 uppercase">Warranty Guarantee</span>
                  <p className="font-bold text-blue-600 dark:text-amber-400 mt-0.5 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    {vehicle.specs.warranty}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Available Custom Options */}
      {vehicle.standardOptions && vehicle.standardOptions.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            Standard & Custom Build Options
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {vehicle.standardOptions.map((opt: string, idx: number) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-3 shadow-sm"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-medium">{opt}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
