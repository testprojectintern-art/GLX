'use client';

import React, { useState } from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  MessageSquare, 
  Clock, 
  Send, 
  CheckCircle2, 
  AlertCircle,
  HeadphonesIcon
} from 'lucide-react';
import { useSiteContent } from '@/context/SiteContentContext';

export default function ContactPage() {
  const { content } = useSiteContent();
  const company = content?.company || {
    name: 'GLX Industries (Pvt) Ltd',
    phone: '+94 77 226 8608',
    secondaryPhone: '+94 11 223 4567',
    whatsapp: '+94772268608',
    email: 'info@glxindustries.lk',
    brcNumber: 'PV 00234891',
    headOffice: 'No.14, Negombo Road, Thudella, Ja-Ela, Sri Lanka (11350)',
    factoryWorkshop: 'No.2020/3L, 2, Seeduwa Road, Kotugoda, Ja-Ela, Sri Lanka',
    operatingHours: 'Monday - Saturday: 8:00 AM - 6:00 PM (Sunday Closed)'
  };

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim() || !phone.trim() || !message.trim()) {
      setErrorMsg('Please complete all required fields.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: name,
          customerPhone: phone,
          subject: subject || 'General Inquiry',
          message: message,
        }),
      });

      if (res.ok) {
        setSuccess(true);
        setName(''); setPhone(''); setSubject(''); setMessage('');
      } else {
        setErrorMsg('Failed to send message. Please call our hotline directly.');
      }
    } catch (err) {
      setErrorMsg('Network error. Please contact us via phone or WhatsApp.');
    }

    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Banner Strip */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-14 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 uppercase tracking-widest mb-6">
            Workshop Facilities & Support
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Get in Touch with GLX Engineers
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Visit our workshops or contact our engineering team to discuss your commercial vehicle body requirements.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
        {/* Quick Contact Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-14">
          <a
            href={`tel:${company.phone.replace(/[^0-9+]/g, '')}`}
            className="group p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-500/50 transition-all duration-200 shadow-md hover:shadow-xl hover:shadow-amber-100 dark:hover:shadow-amber-950/20 hover:-translate-y-0.5"
          >
            <div className="w-11 h-11 rounded-2xl bg-amber-100 dark:bg-amber-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition">
              <Phone className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest block">Main Hotline</span>
            <p className="text-sm font-extrabold text-slate-900 dark:text-white mt-1">{company.phone}</p>
          </a>

          {company.secondaryPhone && (
            <a
              href={`tel:${company.secondaryPhone.replace(/[^0-9+]/g, '')}`}
              className="group p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500/50 transition-all duration-200 shadow-md hover:shadow-xl hover:-translate-y-0.5"
            >
              <div className="w-11 h-11 rounded-2xl bg-blue-100 dark:bg-blue-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition">
                <Phone className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest block">Office Line</span>
              <p className="text-sm font-extrabold text-slate-900 dark:text-white mt-1">{company.secondaryPhone}</p>
            </a>
          )}

          <a
            href={`https://wa.me/${company.whatsapp?.replace(/[^0-9]/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-400 dark:hover:border-emerald-500/50 transition-all duration-200 shadow-md hover:shadow-xl hover:-translate-y-0.5"
          >
            <div className="w-11 h-11 rounded-2xl bg-emerald-100 dark:bg-emerald-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition">
              <MessageSquare className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest block">WhatsApp 24/7</span>
            <p className="text-sm font-extrabold text-emerald-700 dark:text-emerald-400 mt-1">{company.whatsapp}</p>
          </a>

          <a
            href={`mailto:${company.email}`}
            className="group p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-purple-400 dark:hover:border-purple-500/50 transition-all duration-200 shadow-md hover:shadow-xl hover:-translate-y-0.5"
          >
            <div className="w-11 h-11 rounded-2xl bg-purple-100 dark:bg-purple-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition">
              <Mail className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest block">Email</span>
            <p className="text-sm font-extrabold text-slate-900 dark:text-white mt-1 truncate">{company.email}</p>
          </a>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left: Workshop Locations */}
          <div className="space-y-6">
            <div>
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest">Our Facilities</span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
                Fabrication Workshops in Sri Lanka
              </h2>
            </div>

            <div className="space-y-4">
              <div className="relative p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg overflow-hidden hover:border-blue-300 dark:hover:border-blue-700 transition-all">
                <div className="absolute top-0 left-0 bottom-0 w-1 bg-blue-500 rounded-l-3xl" />
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">Kotugoda Main Factory Workshop</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{company.factoryWorkshop}</p>
                    </div>
                  </div>
                  <span className="flex-shrink-0 px-2.5 py-1 rounded-xl text-[10px] font-bold bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700">
                    Heavy Fab
                  </span>
                </div>
              </div>

              <div className="relative p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg overflow-hidden hover:border-amber-300 dark:hover:border-amber-700 transition-all">
                <div className="absolute top-0 left-0 bottom-0 w-1 bg-amber-500 rounded-l-3xl" />
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">Thudella Head Office & Showroom</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{company.headOffice}</p>
                    </div>
                  </div>
                  <span className="flex-shrink-0 px-2.5 py-1 rounded-xl text-[10px] font-bold bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-700">
                    Admin
                  </span>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/50 flex items-center gap-3">
                <Clock className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                <div>
                  <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 block">Operating Hours</span>
                  <span className="text-xs text-slate-600 dark:text-slate-300">{company.operatingHours}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Inquiry Form */}
          <div className="relative p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl shadow-slate-100 dark:shadow-black/30 overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-blue-500 to-emerald-500" />
            <div className="mb-6">
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Send Direct Message to Engineers</h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Your inquiry will be dispatched directly to our workshop managers via SMS gateway.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Kamal Perera"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full py-3 px-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="077 123 4567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full py-3 px-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Subject / Vehicle Type
                </label>
                <input
                  type="text"
                  placeholder="e.g. 14.5ft Lorry Body Custom Inquiry"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full py-3 px-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Message / Specifications *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Explain the vehicle type, cargo, dimensions, or custom requirements..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full py-3 px-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition resize-none"
                />
              </div>

              {errorMsg && (
                <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-500" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {success && (
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-500" />
                  <span>Thank you! Your inquiry has been sent to our engineers. We will contact you shortly.</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-sm shadow-lg shadow-amber-500/25 active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Sending Message...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Inquiry to Workshop</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
