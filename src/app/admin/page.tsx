'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Palette, 
  MessageSquare, 
  Send, 
  FileText, 
  TrendingUp, 
  Layers, 
  Truck, 
  ArrowRight,
  ShieldCheck,
  Server,
  ExternalLink,
  Users,
  Wrench,
  BarChart3,
  CheckCircle2,
  Lock,
  Globe,
  Briefcase,
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react';
import { LeadItem } from '@/lib/types';

export default function UnifiedAdminHubPage() {
  const [leads, setLeads] = useState<LeadItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/leads')
      .then((res) => res.json())
      .then((data) => {
        setLeads(data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const totalQuotes = leads.filter((l) => l.type === 'quotation').length;
  const totalInquiries = leads.filter((l) => l.type === 'contact').length;
  const totalPipelineLKR = leads
    .filter((l) => l.type === 'quotation' && l.estimatedPrice)
    .reduce((sum, l) => sum + (l.estimatedPrice || 0), 0);

  return (
    <div className="p-4 sm:p-6 lg:p-10 space-y-8 sm:space-y-10 max-w-7xl mx-auto w-full">
      {/* 1. TOP WELCOME & UNIFIED HOST HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden shadow-xl flex-shrink-0">
            <img src="/logo.jpg" alt="GLX Logo" className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-500/40 uppercase tracking-wider">
                Unified Admin Gateway
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse"></span> Single-Host Live
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 dark:text-white mt-1 leading-tight">
              GLX Industries Central Management Hub
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-0.5">
              Select which management portal you want to access below.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            target="_blank"
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800 text-xs font-semibold flex items-center justify-center gap-2 transition shadow-sm"
          >
            <Globe className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>View Public Website</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </Link>
        </div>
      </div>

      {/* 2. THE TWO PRIMARY PORTAL SELECTOR CARDS */}
      <div className="space-y-4">
        <div>
          <h2 className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-4 h-4 text-amber-500" /> Select Operational Portal:
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* PORTAL 1: WEB MANAGEMENT & VISUAL CMS */}
          <div className="relative rounded-3xl bg-white dark:bg-gradient-to-br dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 border-2 border-amber-400/80 dark:border-amber-500/40 hover:border-amber-500 transition-all duration-300 p-6 sm:p-8 shadow-xl shadow-amber-100/50 dark:shadow-2xl flex flex-col justify-between group hover:-translate-y-1">
            <div className="space-y-5">
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400 group-hover:scale-110 transition shadow-sm">
                  <Palette className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md">
                  Web Management
                </span>
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition">
                  Website CMS & Visual Customizer
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                  Full control over the public showcase web. Click-to-edit pages, add/edit vehicle catalog models, manage incoming customer quotation leads, and customize hero sliders.
                </p>
              </div>

              {/* Feature Tags */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-950/60 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                  <span className="truncate">Visual On-Canvas Editor</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-950/60 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                  <span className="truncate">Vehicle Catalog (CRUD)</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-950/60 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                  <span className="truncate">Web Quotation Leads</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-950/60 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                  <span className="truncate">SMS Dispatch Gateway</span>
                </div>
              </div>
            </div>

            <div className="pt-6 sm:pt-8">
              <Link
                href="/admin/ui-manage"
                className="w-full py-3.5 sm:py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-sm shadow-lg shadow-amber-500/25 active:scale-95 transition flex items-center justify-center gap-2"
              >
                <span>Enter Web Management Portal</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* PORTAL 2: GLX ERP & WORKSHOP MANAGEMENT SYSTEM */}
          <div className="relative rounded-3xl bg-white dark:bg-gradient-to-br dark:from-slate-900 dark:via-blue-950/40 dark:to-slate-950 border-2 border-blue-400/80 dark:border-blue-600/40 hover:border-blue-500 transition-all duration-300 p-6 sm:p-8 shadow-xl shadow-blue-100/50 dark:shadow-2xl flex flex-col justify-between group hover:-translate-y-1">
            <div className="space-y-5">
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-blue-50 dark:bg-blue-600/10 border border-blue-200 dark:border-blue-500/30 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition shadow-sm">
                  <Briefcase className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-blue-600 text-white shadow-md">
                  Factory ERP System
                </span>
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                  GLX Factory & Workshop ERP
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                  Complete operational management for factory workshops. Create official Invoices, Estimates, Job Cards, track Steel Inventory, Customer ledgers, and technician payroll.
                </p>
              </div>

              {/* Feature Tags */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-950/60 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                  <span className="truncate">Invoices & Estimates</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-950/60 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                  <span className="truncate">Job Cards & Production</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-950/60 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                  <span className="truncate">Steel & Raw Materials</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-950/60 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                  <span className="truncate">Accounting & Net Profit</span>
                </div>
              </div>
            </div>

            <div className="pt-6 sm:pt-8">
              <Link
                href="/admin/system"
                className="w-full py-3.5 sm:py-4 px-6 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-extrabold text-sm shadow-lg shadow-blue-600/25 active:scale-95 transition flex items-center justify-center gap-2"
              >
                <span>Enter GLX ERP System</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 3. LIVE METRICS OVERVIEW */}
      <div className="space-y-4 pt-2">
        <h3 className="text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
          Live Website Leads & Activity Overview
        </h3>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
          <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-md shadow-slate-100 dark:shadow-none hover:-translate-y-0.5 transition">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
              <span className="text-xs font-medium">Quotation Requests</span>
              <FileText className="w-4 h-4 text-amber-500" />
            </div>
            <p className="text-xl sm:text-3xl font-black text-slate-900 dark:text-white font-mono">{totalQuotes}</p>
            <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-500">Auto-generated PDF quotes</p>
          </div>

          <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-md shadow-slate-100 dark:shadow-none hover:-translate-y-0.5 transition">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
              <span className="text-xs font-medium">Contact Messages</span>
              <MessageSquare className="w-4 h-4 text-blue-500" />
            </div>
            <p className="text-xl sm:text-3xl font-black text-slate-900 dark:text-white font-mono">{totalInquiries}</p>
            <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-500">Direct inquiries from website</p>
          </div>

          <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-md shadow-slate-100 dark:shadow-none hover:-translate-y-0.5 transition">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
              <span className="text-xs font-medium">Quotation Pipeline</span>
              <TrendingUp className="w-4 h-4 text-emerald-500" />
            </div>
            <p className="text-base sm:text-2xl font-black text-amber-600 dark:text-amber-400 font-mono truncate">
              Rs. {totalPipelineLKR.toLocaleString('en-LK')}
            </p>
            <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-500">Total estimated lead value</p>
          </div>

          <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-md shadow-slate-100 dark:shadow-none hover:-translate-y-0.5 transition">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
              <span className="text-xs font-medium">SMS Gateway</span>
              <Send className="w-4 h-4 text-emerald-500" />
            </div>
            <p className="text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Connected
            </p>
            <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-500">Auto dispatch to admin</p>
          </div>
        </div>
      </div>
    </div>
  );
}
