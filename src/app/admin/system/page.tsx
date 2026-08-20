'use client';

import React, { useState } from 'react';
import { ExternalLink, RefreshCw, Layers, ShieldCheck, ArrowRight, Server, Globe, Briefcase } from 'lucide-react';
import Link from 'next/link';

export default function EmbeddedSystemPage() {
  const erpUrl = process.env.NEXT_PUBLIC_ERP_URL || 'http://localhost:5173';
  const [iframeKey, setIframeKey] = useState(0);

  const handleRefresh = () => {
    setIframeKey((prev) => prev + 1);
  };

  return (
    <div className="flex flex-col h-full w-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white">
      {/* Top Embedded Header */}
      <div className="h-14 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 flex items-center justify-between z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-xs shadow-md">
            ERP
          </div>
          <div>
            <h1 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>GLX Factory & Workshop ERP</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                Standalone App
              </span>
            </h1>
            <p className="text-[10px] text-slate-500 hidden sm:block">Connected to separate ERP portal</p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/admin"
            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition border border-slate-200 dark:border-slate-700"
          >
            <span>← Admin Hub</span>
          </Link>

          <button
            onClick={handleRefresh}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs flex items-center gap-1.5 transition cursor-pointer border border-slate-200 dark:border-slate-700"
            title="Reload ERP Session"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Refresh</span>
          </button>

          <a
            href={erpUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-blue-900/30 transition"
          >
            <span>Open Standalone Portal</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Embedded Iframe Container */}
      <div className="flex-1 w-full h-[calc(100vh-3.5rem)] bg-slate-100 dark:bg-slate-950 relative overflow-hidden">
        <iframe
          key={iframeKey}
          src={erpUrl}
          title="GLX Main ERP System"
          className="w-full h-full border-0 bg-white"
          allow="fullscreen; clipboard-read; clipboard-write;"
        />
      </div>
    </div>
  );
}
