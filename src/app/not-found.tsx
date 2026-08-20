'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Home, Truck } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-6">
        <span className="text-2xl font-black">404</span>
      </div>
      <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
        Page Not Found
      </h1>
      <p className="mt-3 text-slate-400 max-w-md text-sm sm:text-base">
        The vehicle model or page you are looking for does not exist or has been moved.
      </p>
      <div className="mt-8 flex items-center gap-4">
        <Link
          href="/"
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/25 hover:from-amber-400 hover:to-amber-500 transition flex items-center gap-2"
        >
          <Home className="w-4 h-4" />
          <span>Return Home</span>
        </Link>
        <Link
          href="/catalog"
          className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-sm transition"
        >
          View Catalog
        </Link>
      </div>
    </div>
  );
}
