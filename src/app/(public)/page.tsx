'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Truck, 
  ShieldCheck, 
  Award, 
  Hammer, 
  Zap, 
  FileText, 
  ArrowRight, 
  CheckCircle2, 
  Phone, 
  ChevronRight,
  ChevronLeft,
  Loader2
} from 'lucide-react';
import { useSiteContent } from '@/context/SiteContentContext';
import VehicleCard from '@/components/public/VehicleCard';
import { VehicleItem } from '@/lib/types';

function getButtonClasses(color?: string, isSecondary = false) {
  if (isSecondary) {
    switch (color) {
      case 'amber':
        return 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/40';
      case 'emerald':
        return 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/40';
      case 'blue':
        return 'bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border border-blue-500/40';
      case 'red':
        return 'bg-red-600/10 hover:bg-red-600/20 text-red-400 border border-red-500/40';
      case 'purple':
        return 'bg-purple-600/10 hover:bg-purple-600/20 text-purple-400 border border-purple-500/40';
      default:
        return 'bg-slate-800/90 hover:bg-slate-700 text-white border border-slate-700 hover:border-slate-500';
    }
  }

  switch (color) {
    case 'emerald':
      return 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 shadow-emerald-500/25';
    case 'blue':
      return 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white shadow-blue-600/25';
    case 'purple':
      return 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white shadow-purple-600/25';
    case 'red':
      return 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white shadow-red-600/25';
    case 'slate':
      return 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700';
    case 'amber':
    default:
      return 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-amber-500/25';
  }
}

export default function HomePage() {
  const { content } = useSiteContent();
  const [vehicles, setVehicles] = useState<VehicleItem[]>([]);
  const [loadingVehicles, setLoadingVehicles] = useState(true);

  // Active Hero Slide index
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    fetch('/api/catalog')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setVehicles(data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoadingVehicles(false));
  }, []);

  const home = content?.home || {
    heroBadge: '15+ Years of Automotive Engineering Excellence',
    heroBadgeColor: 'amber',
    heroTitle: 'Engineered for Strength. Built for the Road.',
    heroSubtitle: 'Heavy-duty commercial truck bodies, aerodynamic canopies, freezer containers, and custom three-wheeler fabrication crafted to Japanese manufacturing standards.',
    heroPrimaryBtnText: 'Get Instant Quotation PDF',
    heroPrimaryBtnColor: 'amber',
    heroSecondaryBtnText: 'Explore Vehicle Catalog',
    heroSecondaryBtnColor: 'default',
    heroBannerImage: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1600&q=80',
    heroBannerImages: [
      'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1600&q=80'
    ],
    stats: [
      { label: 'Vehicle Bodies Built', value: '3,500+', description: 'Commercial road units completed' },
      { label: 'Structural Warranty', value: '5 Years', description: 'Full frame & joint guarantee' },
      { label: 'Industrial Workshops', value: '2 Facilities', description: 'Ja-Ela & Kotugoda factories' },
      { label: 'Client Satisfaction', value: '99.4%', description: 'Rated by commercial fleet owners' }
    ],
    highlights: [
      {
        title: "2K Industrial Paint & Anti-Rust",
        description: "Multi-stage epoxy primer with baked 2K automotive polyurethane coating that prevents corrosion in coastal humid climates.",
        icon: "ShieldCheck"
      },
      {
        title: "High-Tensile GI & Steel Plates",
        description: "Built strictly using certified 1.5mm - 3.5mm checkered steel and electro-galvanized sheets for high impact resistance.",
        icon: "Hammer"
      },
      {
        title: "5-Year Structural Frame Warranty",
        description: "Complete peace of mind with our official written warranty covering main chassis runners, cross members, and welding joints.",
        icon: "Award"
      },
      {
        title: "Fast Turnaround & Rapid Delivery",
        description: "Precision laser alignment and experienced fabricators ensure delivery within 3 to 14 days without sacrificing quality.",
        icon: "Zap"
      }
    ],
    ctaTitle: 'Need a Heavy-Duty Body for Your Commercial Vehicle?',
    ctaSubtitle: 'Calculate your exact build cost and download an official GLX Quotation PDF instantly in less than 60 seconds.',
    ctaBtnText: 'Create Instant Quotation',
    ctaBtnColor: 'amber'
  };

  const heroSlides = (home.heroBannerImages && home.heroBannerImages.length > 0)
    ? home.heroBannerImages
    : [home.heroBannerImage || 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1600&q=80'];

  // Auto-play hero slideshow every 5 seconds
  useEffect(() => {
    if (heroSlides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroSlides.length]);

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? heroSlides.length - 1 : prev - 1));
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Hammer':
        return <Hammer className="w-6 h-6 text-blue-500" />;
      case 'Award':
        return <Award className="w-6 h-6 text-amber-500" />;
      case 'Zap':
        return <Zap className="w-6 h-6 text-yellow-500" />;
      default:
        return <ShieldCheck className="w-6 h-6 text-emerald-500" />;
    }
  };

  const primaryBtnClass = getButtonClasses(home.heroPrimaryBtnColor);
  const secondaryBtnClass = getButtonClasses(home.heroSecondaryBtnColor, true);
  const ctaBtnClass = getButtonClasses(home.ctaBtnColor);

  return (
    <div className="space-y-12 sm:space-y-24">
      {/* 1. HERO SECTION WITH AUTO-ROTATING IMAGE SLIDER */}
      <section className="relative min-h-[72vh] sm:min-h-[88vh] flex items-center justify-center pt-6 pb-14 sm:pt-12 sm:pb-20 overflow-hidden bg-slate-900 dark:bg-slate-950 text-white w-full">
        {/* Dynamic Multi-Photo Carousel Background */}
        <div className="absolute inset-0 z-0 w-full h-full">
          {heroSlides.map((slideImg, idx) => (
            <div
              key={idx}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                idx === currentSlide ? 'opacity-85 scale-100' : 'opacity-0 scale-105'
              } transition-transform duration-1000`}
            >
              <Image
                src={slideImg}
                alt={`Commercial Body Fabrication Slide ${idx + 1}`}
                fill
                priority={idx === 0}
                className="object-cover object-[center_30%] sm:object-center"
              />
            </div>
          ))}
          {/* Subtle multi-layer gradient for clear text readability while keeping the truck visible */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-950/40 sm:via-slate-950/45 sm:to-slate-950/20" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-slate-950/25 to-slate-950/60" />
        </div>

        {/* Hero Slider Navigation Arrows (Subtle Desktop) */}
        {heroSlides.length > 1 && (
          <>
            <button
              onClick={handlePrevSlide}
              aria-label="Previous Hero Image"
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-slate-950/75 hover:bg-slate-900 text-white border border-slate-700 shadow-xl transition hidden sm:flex items-center justify-center cursor-pointer backdrop-blur-md"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNextSlide}
              aria-label="Next Hero Image"
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-slate-950/75 hover:bg-slate-900 text-white border border-slate-700 shadow-xl transition hidden sm:flex items-center justify-center cursor-pointer backdrop-blur-md"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Clean Minimalist Corporate Badge */}
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full bg-slate-950/85 border border-amber-500/60 text-amber-300 text-[11px] sm:text-sm font-semibold backdrop-blur-md mb-3 sm:mb-6 shadow-xl shadow-black/40">
            <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 flex-shrink-0" />
            <span>{home.heroBadge}</span>
          </div>

          {/* Heading */}
          <h1
            style={{ color: home.heroTitleColor || undefined }}
            className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-snug sm:leading-tight max-w-4xl mx-auto drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]"
          >
            {home.heroTitle}
          </h1>

          {/* Subtitle */}
          <p className="mt-2.5 sm:mt-5 text-xs sm:text-base md:text-lg text-slate-100 max-w-2xl mx-auto leading-relaxed font-medium drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)] px-2">
            {home.heroSubtitle}
          </p>

          {/* CTAs */}
          <div className="mt-5 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-4 max-w-xs sm:max-w-none mx-auto w-full">
            <Link
              href="/quotation"
              className={`w-full sm:w-auto px-6 py-3 sm:px-8 sm:py-3.5 rounded-xl font-extrabold text-xs sm:text-base shadow-xl hover:scale-105 active:scale-95 transition flex items-center justify-center gap-2 ${primaryBtnClass}`}
            >
              <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>{home.heroPrimaryBtnText}</span>
            </Link>

            <Link
              href="/catalog"
              className={`w-full sm:w-auto px-6 py-3 sm:px-8 sm:py-3.5 rounded-xl font-bold text-xs sm:text-base transition flex items-center justify-center gap-2 ${secondaryBtnClass}`}
            >
              <span>{home.heroSecondaryBtnText}</span>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </Link>
          </div>

          {/* Trust points */}
          <div className="mt-6 sm:mt-12 flex flex-wrap justify-center items-center gap-2.5 sm:gap-6 text-[10px] sm:text-sm text-slate-300 font-medium">
            <span className="flex items-center gap-1 sm:gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
              <span>BRC Reg: PV 00234891</span>
            </span>
            <span className="flex items-center gap-1 sm:gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
              <span>5-Year Structural Frame Warranty</span>
            </span>
            <span className="hidden xs:flex items-center gap-1 sm:gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
              <span>Instant PDF Quotes</span>
            </span>
          </div>

          {/* Slide Indicator Dots */}
          {heroSlides.length > 1 && (
            <div className="mt-4 sm:mt-8 flex items-center justify-center gap-1.5 sm:gap-2">
              {heroSlides.map((_, dotIdx) => (
                <button
                  key={dotIdx}
                  onClick={() => setCurrentSlide(dotIdx)}
                  aria-label={`Slide ${dotIdx + 1}`}
                  className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    dotIdx === currentSlide
                      ? 'w-6 sm:w-8 bg-amber-400 shadow-md shadow-amber-500/50'
                      : 'w-1.5 sm:w-2 bg-slate-600 hover:bg-slate-400'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 2. KEY STATS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {home.stats?.map((stat, idx) => (
            <div
              key={idx}
              className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/80 dark:shadow-black/30 text-center flex flex-col items-center justify-center hover:border-amber-300 dark:hover:border-amber-500/40 hover:-translate-y-0.5 transition-all duration-200"
            >
              <span className="text-2xl sm:text-4xl font-black text-amber-500 dark:text-amber-400 font-mono tracking-tight">
                {stat.value}
              </span>
              <span className="text-[11px] sm:text-sm font-bold text-slate-900 dark:text-white mt-1.5 leading-tight">{stat.label}</span>
              <span className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-tight">{stat.description}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 3. VEHICLE CATEGORIES SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <span className="text-xs sm:text-sm font-bold text-amber-500 dark:text-amber-400 uppercase tracking-wider block mb-1">
              Engineered Product Catalog
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              Commercial Vehicle Body Categories
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Precision-fabricated commercial vehicle bodies engineered for Sri Lankan roads.
            </p>
          </div>
          <Link
            href="/catalog"
            className="mt-4 md:mt-0 inline-flex items-center gap-2 text-sm font-bold text-blue-600 dark:text-amber-400 hover:underline transition"
          >
            <span>View All Models</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {loadingVehicles ? (
          <div className="py-20 text-center flex flex-col items-center justify-center gap-3 text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
            <span className="text-xs">Loading Live Vehicle Catalog...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {vehicles.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        )}
      </section>

      {/* 4. WHY CHOOSE GLX - HIGHLIGHTS */}
      <section className="bg-gradient-to-br from-amber-50 via-slate-50 to-blue-50 dark:from-slate-900 dark:via-slate-900/60 dark:to-slate-900 border-y border-amber-100 dark:border-slate-800/80 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs sm:text-sm font-bold text-amber-500 dark:text-amber-400 uppercase tracking-wider block mb-1">
              Engineering Superiority
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              Why Sri Lankan Fleet Owners Choose GLX
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-2">
              We combine heavy Japanese channel steel, computerized laser bending, and 2K polyurethane coatings to build bodies that outlast the vehicle chassis.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {home.highlights?.map((item, idx) => (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-amber-300 dark:hover:border-amber-500/40 transition-all duration-300 flex flex-col justify-between group shadow-lg shadow-slate-100 dark:shadow-black/20 hover:shadow-xl hover:-translate-y-1"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
                    {getIcon(item.icon)}
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. INSTANT QUOTATION CTA BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-blue-900 via-slate-900 to-slate-950 border border-blue-700/40 p-8 sm:p-14 shadow-2xl text-white">
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-amber-500 text-slate-950 inline-block shadow-md">
              Instant 60-Second Calculation
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              {home.ctaTitle}
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              {home.ctaSubtitle}
            </p>
            <div className="pt-4 flex flex-col sm:flex-row gap-4">
              <Link
                href="/quotation"
                className={`px-8 py-4 rounded-xl font-extrabold text-sm sm:text-base shadow-xl transition flex items-center justify-center gap-2 ${ctaBtnClass}`}
              >
                <FileText className="w-5 h-5" />
                <span>{home.ctaBtnText}</span>
              </Link>
              <a
                href="tel:+94772268608"
                className="px-8 py-4 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-white font-bold text-sm sm:text-base border border-slate-700 transition flex items-center justify-center gap-2"
              >
                <Phone className="w-5 h-5 text-amber-400" />
                <span>Call Hotline: 077 226 8608</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
