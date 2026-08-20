'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  FileText, 
  Download, 
  CheckCircle2, 
  Truck, 
  Phone, 
  User, 
  MapPin, 
  Layers, 
  Sparkles, 
  ShieldCheck,
  Send,
  AlertCircle,
  Loader2,
  Clock,
  Award
} from 'lucide-react';
import { generateQuotationPdf } from '@/lib/pdfGenerator';
import { VehicleItem } from '@/lib/types';

function QuotationContent() {
  const searchParams = useSearchParams();
  const preSelectedId = searchParams?.get('vehicle') || '';

  const [vehicles, setVehicles] = useState<VehicleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('');
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerCity, setCustomerCity] = useState('');
  const [customerNotes, setCustomerNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pdfDownloaded, setPdfDownloaded] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [generatedRef, setGeneratedRef] = useState('');

  useEffect(() => {
    fetch('/api/catalog')
      .then((res) => res.json())
      .then((data: VehicleItem[]) => {
        if (Array.isArray(data) && data.length > 0) {
          setVehicles(data);
          if (preSelectedId && data.some((v) => v.id === preSelectedId || v.slug === preSelectedId)) {
            const found = data.find((v) => v.id === preSelectedId || v.slug === preSelectedId);
            if (found) setSelectedVehicleId(found.id);
          } else {
            setSelectedVehicleId(data[0].id);
          }
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [preSelectedId]);

  const currentVehicle =
    vehicles.find((v) => v.id === selectedVehicleId) || vehicles[0] || ({} as VehicleItem);

  const customAddons = [
    { name: 'Heavy-Duty Corrugated Steel Body Reinforcement', price: 35000 },
    { name: 'Weatherproof Full Canopy with Tarpaulin Frame', price: 45000 },
    { name: '3.0mm Heavy Diamond-Checkered Floor Deck Upgrade', price: 28000 },
    { name: 'Chassis Mounted Steel Tool Box & Heavy Latches', price: 18000 },
  ];

  const calculateTotal = () => {
    let total = currentVehicle.basePrice || 0;
    selectedAddons.forEach((addonName) => {
      const found = customAddons.find((a) => a.name === addonName);
      if (found) total += found.price;
    });
    return total;
  };

  const toggleAddon = (name: string) => {
    if (selectedAddons.includes(name)) {
      setSelectedAddons(selectedAddons.filter((a) => a !== name));
    } else {
      setSelectedAddons([...selectedAddons, name]);
    }
  };

  const handleGenerateQuotation = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!customerName.trim() || !customerPhone.trim()) {
      setErrorMsg('Please provide your Name and Mobile Number to generate the quotation.');
      return;
    }

    setIsSubmitting(true);

    const quoteRef = `GLX-QT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    setGeneratedRef(quoteRef);
    const estimatedTotal = calculateTotal();

    // 1. Generate & Download Official Client-Side PDF
    try {
      await generateQuotationPdf({
        quotationRef: quoteRef,
        date: new Date().toLocaleDateString('en-GB'),
        customerName,
        customerPhone,
        customerCity,
        vehicle: currentVehicle,
        selectedOptions: selectedAddons,
        estimatedTotal,
        customerNotes,
      });
      setPdfDownloaded(true);
    } catch (err) {
      console.error('PDF generation error:', err);
    }

    // 2. Submit Lead to Backend & Trigger Real-Time SMS to GLX Admin
    try {
      await fetch('/api/quotation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName,
          customerPhone,
          customerCity,
          vehicleCategory: currentVehicle.category,
          vehicleName: currentVehicle.name,
          selectedOptions: selectedAddons,
          estimatedPrice: estimatedTotal,
          quotationRef: quoteRef,
          customerNotes,
        }),
      });
    } catch (err) {
      console.error('Lead sync error:', err);
    }

    setIsSubmitting(false);
  };

  if (loading) {
    return (
      <div className="py-32 text-center flex flex-col items-center justify-center gap-3 text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
        <span className="text-xs">Loading Live Quotation Builder...</span>
      </div>
    );
  }

  return (
    <div className="bg-slate-50/70 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* 🌟 VIBRANT & ATTRACTIVE HERO BANNER (NO BLINDING WHITE) */}
      <section className="relative overflow-hidden pt-12 pb-14 sm:pt-16 sm:pb-20 border-b border-slate-200/80 dark:border-slate-800/80 bg-gradient-to-b from-amber-500/10 via-slate-100/70 to-slate-50/70 dark:from-slate-900 dark:via-slate-950 dark:to-slate-950">
        {/* Subtle Background Glow Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-24 left-1/4 w-96 h-96 bg-amber-400/15 dark:bg-amber-500/10 rounded-full blur-3xl" />
          <div className="absolute -top-24 right-1/4 w-96 h-96 bg-blue-500/15 dark:bg-blue-600/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5">
          {/* Top Pill Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-500/40 shadow-md shadow-amber-500/10 text-xs font-extrabold text-amber-800 dark:text-amber-300 uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span>Instant Official Quotation & PDF Generator</span>
          </div>

          {/* Bold Eye-Catching Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            Configure Your Vehicle Body &{' '}
            <span className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 dark:from-amber-400 dark:via-amber-300 dark:to-amber-500 bg-clip-text text-transparent">
              Download PDF
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Select your commercial vehicle platform, pick heavy-duty custom engineering options, and download an official 1-page branded PDF estimate in seconds.
          </p>

          {/* Feature Badges Bar */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 shadow-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>10-Year Japan Model Warranty</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 shadow-sm">
              <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Official 1-Page Letterhead PDF</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 shadow-sm">
              <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>Fast 5-7 Days Fabrication</span>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN CONFIGURATOR SECTION */}
      <div className="py-10 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <form onSubmit={handleGenerateQuotation} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left 2 Columns: Configurator */}
          <div className="lg:col-span-2 space-y-8">
            {/* Step 1: Select Vehicle Model */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5 shadow-xl shadow-slate-200/50 dark:shadow-none">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="w-9 h-9 rounded-xl bg-blue-600 text-white font-black flex items-center justify-center text-sm shadow-md shadow-blue-600/30">
                  1
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                    Select Vehicle / Body Platform
                  </h2>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    Choose your base commercial truck or three-wheeler model
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                {vehicles.map((v) => {
                  const isSelected = selectedVehicleId === v.id;
                  return (
                    <div
                      key={v.id}
                      onClick={() => {
                        setSelectedVehicleId(v.id);
                        setSelectedAddons([]);
                      }}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-blue-50/80 dark:bg-blue-950/80 border-blue-600 dark:border-amber-400 shadow-md ring-2 ring-blue-500/20 dark:ring-amber-500/20'
                          : 'bg-slate-50/80 dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-100/60'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <span className="text-[11px] text-blue-600 dark:text-amber-400 font-extrabold uppercase tracking-wide">
                            {v.category}
                          </span>
                          <h3 className="font-bold text-slate-900 dark:text-white text-sm leading-snug">
                            {v.name}
                          </h3>
                          <p className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300 pt-1">
                            Base: <span className="text-amber-600 dark:text-amber-400">Rs. {v.basePrice?.toLocaleString('en-LK')}</span>
                          </p>
                        </div>
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-1 flex-shrink-0 transition ${
                            isSelected
                              ? 'border-amber-500 bg-amber-500'
                              : 'border-slate-400 dark:border-slate-600 bg-white dark:bg-slate-900'
                          }`}
                        >
                          {isSelected && <div className="w-2 h-2 rounded-full bg-slate-950" />}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Custom Options & Addons */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5 shadow-xl shadow-slate-200/50 dark:shadow-none">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="w-9 h-9 rounded-xl bg-blue-600 text-white font-black flex items-center justify-center text-sm shadow-md shadow-blue-600/30">
                  2
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                    Customize Technical Specifications & Add-ons
                  </h2>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    Select specific materials, canopies, floors, and accessories
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                {customAddons.map((addon, idx) => {
                  const isChecked = selectedAddons.includes(addon.name);
                  return (
                    <div
                      key={idx}
                      onClick={() => toggleAddon(addon.name)}
                      className={`p-4 rounded-2xl border cursor-pointer transition flex items-center justify-between gap-3 ${
                        isChecked
                          ? 'bg-amber-50/90 dark:bg-amber-950/40 border-amber-500 text-slate-900 dark:text-white shadow-sm ring-1 ring-amber-400/30'
                          : 'bg-slate-50/80 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-100/60'
                      }`}
                    >
                      <div className="space-y-1 pr-2">
                        <p className="text-xs sm:text-sm font-semibold leading-snug">{addon.name}</p>
                        <span className="text-xs text-amber-600 dark:text-amber-400 font-mono font-bold block">
                          +Rs. {addon.price.toLocaleString('en-LK')}
                        </span>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-lg border flex items-center justify-center flex-shrink-0 transition ${
                          isChecked
                            ? 'border-amber-500 bg-amber-500 text-slate-950 shadow-sm'
                            : 'border-slate-400 dark:border-slate-600 bg-white dark:bg-slate-900'
                        }`}
                      >
                        {isChecked && <CheckCircle2 className="w-3.5 h-3.5 font-black" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Customer Information */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5 shadow-xl shadow-slate-200/50 dark:shadow-none">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="w-9 h-9 rounded-xl bg-blue-600 text-white font-black flex items-center justify-center text-sm shadow-md shadow-blue-600/30">
                  3
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                    Your Contact Details for Official Letterhead
                  </h2>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    Printed directly onto the generated quotation PDF
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Full Name / Business Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Kamal Perera Logistics"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-amber-400 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Mobile Phone Number (SMS Alert) *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      placeholder="077 123 4567"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-amber-400 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Your City / Operational Area
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="e.g. Negombo, Ja-Ela, Colombo"
                      value={customerCity}
                      onChange={(e) => setCustomerCity(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-amber-400 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Special Notes / Custom Requests
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Extra height, hardware transport"
                    value={customerNotes}
                    onChange={(e) => setCustomerNotes(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-amber-400 transition"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right 1 Column: Price Summary & Instant Action */}
          <div className="space-y-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl shadow-slate-200/50 dark:shadow-none sticky top-28 space-y-6">
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center justify-between">
                <span>Quotation Summary</span>
                <span className="text-xs text-blue-600 dark:text-amber-400 font-mono font-bold bg-blue-50 dark:bg-blue-950/60 px-2.5 py-1 rounded-lg border border-blue-200 dark:border-blue-800">
                  GLX-OFFICIAL
                </span>
              </h2>

              {/* Configured Item Preview */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3 text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Selected Model</span>
                  <p className="font-bold text-slate-900 dark:text-white text-sm mt-0.5">{currentVehicle.name}</p>
                </div>

                <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Base Construction</span>
                  <span className="font-mono text-slate-900 dark:text-white font-bold">
                    Rs. {currentVehicle.basePrice?.toLocaleString('en-LK')}
                  </span>
                </div>

                {selectedAddons.length > 0 && (
                  <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">
                      Custom Add-ons ({selectedAddons.length})
                    </span>
                    {selectedAddons.map((a, i) => (
                      <div key={i} className="flex justify-between text-[11px] text-slate-700 dark:text-slate-300">
                        <span className="truncate pr-2">• {a}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-between items-end">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">ESTIMATED TOTAL:</span>
                  <span className="text-xl sm:text-2xl font-black text-blue-600 dark:text-amber-400 font-mono">
                    Rs. {calculateTotal().toLocaleString('en-LK')}
                  </span>
                </div>
              </div>

              {/* Error banner */}
              {errorMsg && (
                <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-500" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-sm shadow-xl shadow-amber-500/25 active:scale-95 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Generating & Sending SMS...</span>
                ) : (
                  <>
                    <Download className="w-5 h-5" />
                    <span>Download Quotation PDF</span>
                  </>
                )}
              </button>

              {/* PDF Success Alert */}
              {pdfDownloaded && (
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 text-emerald-800 dark:text-emerald-300 text-xs space-y-2 animate-in fade-in">
                  <div className="flex items-center gap-2 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>Quotation PDF Downloaded!</span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300">
                    Ref Code: <strong className="text-blue-600 dark:text-amber-400">{generatedRef}</strong>. Our engineering manager has been notified via GLX SMS Gateway.
                  </p>
                </div>
              )}

              {/* Security and Terms Pointers */}
              <div className="space-y-2 text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>Includes 10-Year Japan Model Guarantee</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-500 flex-shrink-0" />
                  <span>Official GLX Letterhead & Registered Seal</span>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function QuotationPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center">Loading Quotation Wizard...</div>}>
      <QuotationContent />
    </Suspense>
  );
}
