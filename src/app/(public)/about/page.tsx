'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShieldCheck, Award, Wrench, CheckCircle2, FileText, ArrowRight, Users, Factory } from 'lucide-react';
import { useSiteContent } from '@/context/SiteContentContext';

export default function AboutPage() {
  const { content } = useSiteContent();
  const about = content?.about || {
    title: 'About GLX Industries & Truck Body Engineers',
    subtitle: 'Setting the Gold Standard in Commercial Vehicle Fabrication Across Sri Lanka',
    story: 'Founded with a vision to deliver durable, high-precision commercial vehicle structures, GLX Industries (Pvt) Ltd operates two specialized workshops in Ja-Ela and Kotugoda. Over the past decade and a half, we have engineered thousands of truck bodies, delivery canopies, and specialized refrigerated containers for individual transport owners, logistics conglomerates, and government bodies.',
    mission: 'To provide high-durability, road-tested commercial vehicle body solutions that maximize payload efficiency, ensure cargo security, and offer the lowest lifetime maintenance cost for Sri Lankan businesses.',
    vision: 'To be the most respected automotive body engineering company in South Asia, recognized for cutting-edge structural integrity, robotic welding precision, and customer-first service.',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
    values: [
      'Strict compliance with certified steel gauges and material grades',
      'Full adherence to Motor Traffic Department transport regulations',
      'Transparent quotations with guaranteed zero hidden fees',
      'Dedicated post-delivery maintenance and lifetime support'
    ]
  };

  return (
    <div className="min-h-screen">
      {/* Hero Banner Strip */}
      <div className="relative bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 py-16 sm:py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <Image
            src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1600&q=80"
            alt=""
            fill
            className="object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 to-slate-900/90" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 uppercase tracking-widest mb-6">
            About Our Legacy
          </span>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
            {about.title}
          </h1>
          <p className="mt-5 text-base sm:text-xl text-blue-200 font-medium max-w-2xl mx-auto leading-relaxed">
            {about.subtitle}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-slate-300">
            <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> 15+ Years Experience</span>
            <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> 3,500+ Bodies Built</span>
            <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> BRC Registered</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 space-y-20">
        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="relative h-[320px] sm:h-[420px] lg:h-[480px] rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-2xl shadow-slate-200 dark:shadow-black/40 bg-slate-100 dark:bg-slate-900 order-first lg:order-first">
            <Image
              src={about.image}
              alt="GLX Heavy Fabrication Workshop"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/10" />
            <div className="absolute bottom-5 left-5 right-5 p-4 rounded-2xl bg-slate-950/90 backdrop-blur-md border border-slate-800 text-white">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 text-slate-950 flex items-center justify-center font-black text-sm shadow-lg">
                  15+
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium">Over 15 Years of Precision</p>
                  <p className="text-sm font-bold text-white">Fabrication & Heavy Engineering</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <span className="text-xs font-bold text-amber-500 dark:text-amber-400 uppercase tracking-widest">Our Story</span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-2">
                Engineering Sri Lanka's Commercial Transport Backbone
              </h2>
            </div>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              {about.story}
            </p>

            {/* Mission & Vision cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-slate-900 dark:to-slate-900 border border-amber-200 dark:border-slate-800 shadow-sm">
                <h3 className="text-sm font-bold text-amber-600 dark:text-amber-500 mb-2 flex items-center gap-2">
                  <Wrench className="w-4 h-4" /> Our Mission
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {about.mission}
                </p>
              </div>
              <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-900 border border-blue-200 dark:border-slate-800 shadow-sm">
                <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 mb-2 flex items-center gap-2">
                  <Award className="w-4 h-4" /> Our Vision
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {about.vision}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Core Values */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-50 to-blue-50/50 dark:from-slate-900 dark:to-slate-900/80 border border-slate-200 dark:border-slate-800 p-8 sm:p-14 shadow-xl shadow-slate-100 dark:shadow-black/20">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-blue-500 to-emerald-500" />
          <div className="text-center mb-10">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">What We Stand For</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-2">
              Our Uncompromising Engineering Values
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {about.values?.map((val, idx) => (
              <div
                key={idx}
                className="flex items-start gap-4 p-5 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-md hover:shadow-lg hover:border-emerald-300 dark:hover:border-emerald-800 transition-all duration-200 group"
              >
                <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <span className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 font-medium leading-relaxed">{val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
          {[
            { value: '3,500+', label: 'Bodies Built', icon: <Factory className="w-5 h-5 text-amber-500" /> },
            { value: '15+', label: 'Years Active', icon: <Award className="w-5 h-5 text-blue-500" /> },
            { value: '2', label: 'Workshops', icon: <Wrench className="w-5 h-5 text-emerald-500" /> },
            { value: '99.4%', label: 'Satisfaction', icon: <Users className="w-5 h-5 text-purple-500" /> },
          ].map((stat, idx) => (
            <div key={idx} className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg shadow-slate-100 dark:shadow-black/20 text-center hover:border-amber-300 dark:hover:border-amber-500/40 transition-all hover:-translate-y-0.5">
              <div className="flex justify-center mb-3">{stat.icon}</div>
              <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-mono">{stat.value}</span>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-1 uppercase tracking-wider">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-blue-900 via-blue-950 to-slate-900 p-8 sm:p-14 shadow-2xl text-white">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-amber-400" />
          <div className="max-w-2xl">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">Instant Quote</span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-2 mb-3">
              Ready to Commission Your Commercial Vehicle Body?
            </h3>
            <p className="text-sm sm:text-base text-blue-200 leading-relaxed mb-8">
              Talk to our chief engineers, get a 3D blueprint preview, and receive a fully itemized quotation PDF in under 60 seconds.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/quotation"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-sm shadow-xl shadow-amber-500/30 transition-all active:scale-95"
              >
                <FileText className="w-5 h-5" />
                <span>Get Instant Quotation PDF</span>
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-sm border border-white/20 transition-all"
              >
                <span>Talk to an Engineer</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
