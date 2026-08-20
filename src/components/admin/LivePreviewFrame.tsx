'use client';

import React, { useState, useRef } from 'react';
import { useSiteContent } from '@/context/SiteContentContext';
import { 
  Monitor, 
  Tablet, 
  Smartphone, 
  Edit3, 
  Sparkles, 
  Upload, 
  Check, 
  X, 
  Palette, 
  Type, 
  Image as ImageIcon, 
  Loader2,
  CheckCircle2,
  Phone,
  MapPin,
  Clock,
  Layers,
  Wrench,
  Award,
  Truck
} from 'lucide-react';
import HomePageView from '@/app/(public)/page';
import AboutPageView from '@/app/(public)/about/page';
import ServicesPageView from '@/app/(public)/services/page';
import CatalogPageView from '@/app/(public)/catalog/page';
import ContactPageView from '@/app/(public)/contact/page';
import Navbar from '@/components/public/Navbar';
import Footer from '@/components/public/Footer';

interface QuickEditTarget {
  type: 'text' | 'textarea' | 'button' | 'image' | 'badge' | 'stat';
  label: string;
  fieldPath: string[];
  currentValue: any;
  colorPath?: string[];
  currentColor?: string;
  imagePath?: string[];
}

export default function LivePreviewFrame() {
  const { selectedPreviewPage, setSelectedPreviewPage, content, updateContent, hasUnsavedChanges, saveToServer, isSaving } = useSiteContent();
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [clickToEditActive, setClickToEditActive] = useState(true);

  // Quick edit popover state
  const [activeTarget, setActiveTarget] = useState<QuickEditTarget | null>(null);
  const [editInputValue, setEditInputValue] = useState('');
  const [editColorValue, setEditColorValue] = useState('amber');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const buttonColorPresets = [
    { id: 'amber', label: 'Amber Gold', class: 'bg-amber-500 text-slate-950' },
    { id: 'emerald', label: 'Emerald Green', class: 'bg-emerald-500 text-slate-950' },
    { id: 'blue', label: 'Royal Blue', class: 'bg-blue-600 text-white' },
    { id: 'red', label: 'Crimson Red', class: 'bg-red-600 text-white' },
    { id: 'purple', label: 'Royal Purple', class: 'bg-purple-600 text-white' },
    { id: 'slate', label: 'Slate Dark', class: 'bg-slate-800 text-white' },
  ];

  const getDeviceWidth = () => {
    switch (deviceMode) {
      case 'mobile':
        return 'max-w-[375px]';
      case 'tablet':
        return 'max-w-[768px]';
      default:
        return 'w-full';
    }
  };

  const handleOpenQuickEdit = (target: QuickEditTarget) => {
    if (!clickToEditActive) return;
    setActiveTarget(target);
    setEditInputValue(target.currentValue || '');
    setEditColorValue(target.currentColor || 'amber');
  };

  const handleApplyQuickEdit = () => {
    if (!activeTarget) return;

    const newContent = JSON.parse(JSON.stringify(content));

    // Update value path
    if (activeTarget.fieldPath && activeTarget.fieldPath.length > 0) {
      let cur = newContent;
      for (let i = 0; i < activeTarget.fieldPath.length - 1; i++) {
        if (!cur[activeTarget.fieldPath[i]]) cur[activeTarget.fieldPath[i]] = {};
        cur = cur[activeTarget.fieldPath[i]];
      }
      cur[activeTarget.fieldPath[activeTarget.fieldPath.length - 1]] = editInputValue;
    }

    // Update color path if specified
    if (activeTarget.colorPath && activeTarget.colorPath.length > 0) {
      let cur = newContent;
      for (let i = 0; i < activeTarget.colorPath.length - 1; i++) {
        if (!cur[activeTarget.colorPath[i]]) cur[activeTarget.colorPath[i]] = {};
        cur = cur[activeTarget.colorPath[i]];
      }
      cur[activeTarget.colorPath[activeTarget.colorPath.length - 1]] = editColorValue;
    }

    updateContent(newContent);
    setActiveTarget(null);
  };

  const handleDirectImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeTarget) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success && data.url) {
        setEditInputValue(data.url);
        // Automatically apply immediately
        const newContent = JSON.parse(JSON.stringify(content));
        let cur = newContent;
        for (let i = 0; i < activeTarget.fieldPath.length - 1; i++) {
          if (!cur[activeTarget.fieldPath[i]]) cur[activeTarget.fieldPath[i]] = {};
          cur = cur[activeTarget.fieldPath[i]];
        }
        cur[activeTarget.fieldPath[activeTarget.fieldPath.length - 1]] = data.url;
        updateContent(newContent);
      } else {
        alert('Upload failed: ' + (data.message || 'Error'));
      }
    } catch (err) {
      console.error(err);
      alert('Error uploading file');
    }
    setIsUploading(false);
    e.target.value = '';
  };

  const renderSelectedPage = () => {
    switch (selectedPreviewPage) {
      case 'about':
        return <AboutPageView />;
      case 'services':
        return <ServicesPageView />;
      case 'catalog':
        return <CatalogPageView />;
      case 'contact':
        return <ContactPageView />;
      case 'home':
      case 'theme':
      default:
        return <HomePageView />;
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 overflow-hidden relative">
      {/* Top Device & Visual Customizer Toolbar */}
      <div className="h-14 bg-slate-900 border-b border-slate-800 px-4 sm:px-6 flex items-center justify-between z-20 shadow-md">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setClickToEditActive(!clickToEditActive)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              clickToEditActive
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 ring-2 ring-amber-400/50'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>{clickToEditActive ? '🎯 Visual Click-to-Edit: ON' : 'Click-to-Edit: OFF'}</span>
          </button>
          <span className="hidden md:inline-block text-[11px] text-slate-400 font-medium">
            (Click any text, button, or photo on this page to edit live)
          </span>
        </div>

        {/* Device Switcher */}
        <div className="flex items-center gap-2">
          {hasUnsavedChanges && (
            <button
              onClick={saveToServer}
              disabled={isSaving}
              className="py-1.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition flex items-center gap-1 cursor-pointer"
            >
              {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
              <span>Save Live</span>
            </button>
          )}

          <div className="flex items-center bg-slate-950 rounded-lg p-1 border border-slate-800">
            <button
              onClick={() => setDeviceMode('desktop')}
              className={`p-1.5 rounded-md text-xs transition ${
                deviceMode === 'desktop' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="Desktop View"
            >
              <Monitor className="w-4 h-4" />
            </button>
            <button
              onClick={() => setDeviceMode('tablet')}
              className={`p-1.5 rounded-md text-xs transition ${
                deviceMode === 'tablet' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="Tablet View"
            >
              <Tablet className="w-4 h-4" />
            </button>
            <button
              onClick={() => setDeviceMode('mobile')}
              className={`p-1.5 rounded-md text-xs transition ${
                deviceMode === 'mobile' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="Mobile View"
            >
              <Smartphone className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Frame Canvas Wrapper */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex justify-center items-start bg-slate-950/80">
        <div
          className={`${getDeviceWidth()} w-full transition-all duration-300 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-950 relative`}
        >
          {/* Simulated Browser Address Bar */}
          {deviceMode !== 'desktop' && (
            <div className="bg-slate-900 px-4 py-2 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span className="font-mono text-[10px]">https://glxindustries.lk/{selectedPreviewPage === 'home' ? '' : selectedPreviewPage}</span>
              <div className="flex gap-1.5">
                <span className="w-2 h-2 rounded-full bg-slate-700"></span>
                <span className="w-2 h-2 rounded-full bg-slate-700"></span>
                <span className="w-2 h-2 rounded-full bg-slate-700"></span>
              </div>
            </div>
          )}

          {/* Interactive Live Page Body */}
          <div className="relative">
            <Navbar />
            
            {/* ============================================================ */}
            {/* 🌟 1. HOME PAGE VISUAL CLICK-TO-EDIT HOTSPOTS                */}
            {/* ============================================================ */}
            {selectedPreviewPage === 'home' && clickToEditActive && (
              <div className="absolute top-20 left-0 right-0 z-30 pointer-events-none">
                <div className="max-w-7xl mx-auto px-4 text-center space-y-6 pt-10">
                  {/* Hero Badge */}
                  <div className="pointer-events-auto inline-block">
                    <button
                      onClick={() =>
                        handleOpenQuickEdit({
                          type: 'badge',
                          label: 'Hero Badge',
                          fieldPath: ['home', 'heroBadge'],
                          currentValue: content?.home?.heroBadge,
                          colorPath: ['home', 'heroBadgeColor'],
                          currentColor: content?.home?.heroBadgeColor || 'amber',
                        })
                      }
                      className="px-3 py-1 rounded-full border-2 border-dashed border-amber-400 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-xs font-bold cursor-pointer transition flex items-center gap-1.5 shadow-lg group"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110" />
                      <span>Edit Badge: {content?.home?.heroBadge}</span>
                    </button>
                  </div>

                  {/* Hero Main Heading */}
                  <div className="pointer-events-auto max-w-4xl mx-auto">
                    <div
                      onClick={() =>
                        handleOpenQuickEdit({
                          type: 'text',
                          label: 'Hero Main Heading Title',
                          fieldPath: ['home', 'heroTitle'],
                          currentValue: content?.home?.heroTitle,
                          colorPath: ['home', 'heroTitleColor'],
                          currentColor: content?.home?.heroTitleColor,
                        })
                      }
                      className="p-3 rounded-2xl border-2 border-dashed border-blue-400/60 hover:border-blue-400 hover:bg-blue-600/10 cursor-pointer transition relative group"
                    >
                      <span className="absolute -top-3 right-4 px-2 py-0.5 rounded text-[10px] font-bold bg-blue-600 text-white shadow opacity-0 group-hover:opacity-100 transition flex items-center gap-1">
                        <Edit3 className="w-3 h-3" /> Click to Edit Title & Color
                      </span>
                      <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-transparent opacity-0 select-none pointer-events-none">
                        {content?.home?.heroTitle}
                      </h1>
                    </div>
                  </div>

                  {/* Hero Subtitle */}
                  <div className="pointer-events-auto max-w-2xl mx-auto">
                    <div
                      onClick={() =>
                        handleOpenQuickEdit({
                          type: 'textarea',
                          label: 'Hero Subtitle Paragraph',
                          fieldPath: ['home', 'heroSubtitle'],
                          currentValue: content?.home?.heroSubtitle,
                        })
                      }
                      className="p-2 rounded-xl border-2 border-dashed border-slate-500/50 hover:border-amber-400 hover:bg-amber-400/10 cursor-pointer transition relative group"
                    >
                      <span className="absolute -top-3 right-4 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500 text-slate-950 shadow opacity-0 group-hover:opacity-100 transition flex items-center gap-1">
                        <Edit3 className="w-3 h-3" /> Click to Edit Subtitle Text
                      </span>
                      <p className="text-base sm:text-lg opacity-0 select-none pointer-events-none">
                        {content?.home?.heroSubtitle}
                      </p>
                    </div>
                  </div>

                  {/* Buttons & Banner Action */}
                  <div className="pointer-events-auto flex flex-wrap items-center justify-center gap-4 pt-2">
                    <button
                      onClick={() =>
                        handleOpenQuickEdit({
                          type: 'button',
                          label: 'Primary CTA Button',
                          fieldPath: ['home', 'heroPrimaryBtnText'],
                          currentValue: content?.home?.heroPrimaryBtnText,
                          colorPath: ['home', 'heroPrimaryBtnColor'],
                          currentColor: content?.home?.heroPrimaryBtnColor || 'amber',
                        })
                      }
                      className="px-6 py-3.5 rounded-xl border-2 border-dashed border-amber-400 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-sm font-bold flex items-center gap-2 cursor-pointer shadow-lg transition"
                    >
                      <Palette className="w-4 h-4 text-amber-400" />
                      <span>Edit Button: {content?.home?.heroPrimaryBtnText}</span>
                    </button>

                    <button
                      onClick={() =>
                        handleOpenQuickEdit({
                          type: 'button',
                          label: 'Secondary Button',
                          fieldPath: ['home', 'heroSecondaryBtnText'],
                          currentValue: content?.home?.heroSecondaryBtnText,
                          colorPath: ['home', 'heroSecondaryBtnColor'],
                          currentColor: content?.home?.heroSecondaryBtnColor || 'default',
                        })
                      }
                      className="px-6 py-3.5 rounded-xl border-2 border-dashed border-slate-400 bg-slate-800/40 hover:bg-slate-800/60 text-slate-200 text-sm font-bold flex items-center gap-2 cursor-pointer shadow-lg transition"
                    >
                      <Palette className="w-4 h-4 text-blue-400" />
                      <span>Edit Button: {content?.home?.heroSecondaryBtnText}</span>
                    </button>

                    <button
                      onClick={() =>
                        handleOpenQuickEdit({
                          type: 'image',
                          label: 'Hero Background Banner Photo',
                          fieldPath: ['home', 'heroBannerImage'],
                          currentValue: content?.home?.heroBannerImage,
                        })
                      }
                      className="px-4 py-3.5 rounded-xl border-2 border-dashed border-purple-400 bg-purple-900/30 hover:bg-purple-900/50 text-purple-300 text-xs font-bold flex items-center gap-2 cursor-pointer shadow-lg transition"
                    >
                      <ImageIcon className="w-4 h-4 text-purple-400" />
                      <span>Change Hero Photo</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ============================================================ */}
            {/* 🌟 2. ABOUT US PAGE VISUAL CLICK-TO-EDIT HOTSPOTS            */}
            {/* ============================================================ */}
            {selectedPreviewPage === 'about' && clickToEditActive && (
              <div className="absolute top-20 left-0 right-0 z-30 pointer-events-none">
                <div className="max-w-7xl mx-auto px-4 space-y-8 pt-8">
                  {/* Top Heading & Subtitle */}
                  <div className="text-center space-y-2 max-w-3xl mx-auto pointer-events-auto">
                    <div
                      onClick={() =>
                        handleOpenQuickEdit({
                          type: 'text',
                          label: 'About Page Title',
                          fieldPath: ['about', 'title'],
                          currentValue: content?.about?.title,
                        })
                      }
                      className="p-2 rounded-xl border-2 border-dashed border-blue-400/70 hover:bg-blue-600/10 cursor-pointer transition"
                    >
                      <span className="text-xs text-blue-400 font-bold flex items-center justify-center gap-1">
                        <Edit3 className="w-3 h-3" /> Click to Edit Title: {content?.about?.title}
                      </span>
                    </div>

                    <div
                      onClick={() =>
                        handleOpenQuickEdit({
                          type: 'text',
                          label: 'About Page Subtitle',
                          fieldPath: ['about', 'subtitle'],
                          currentValue: content?.about?.subtitle,
                        })
                      }
                      className="p-1.5 rounded-xl border-2 border-dashed border-amber-400/70 hover:bg-amber-400/10 cursor-pointer transition"
                    >
                      <span className="text-xs text-amber-400 font-medium flex items-center justify-center gap-1">
                        <Edit3 className="w-3 h-3" /> Click to Edit Subtitle: {content?.about?.subtitle}
                      </span>
                    </div>
                  </div>

                  {/* Story & Image Row */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4 pointer-events-auto">
                    {/* Workshop Image Upload Button */}
                    <div
                      onClick={() =>
                        handleOpenQuickEdit({
                          type: 'image',
                          label: 'Workshop Facility Photo',
                          fieldPath: ['about', 'image'],
                          currentValue: content?.about?.image,
                        })
                      }
                      className="h-64 rounded-3xl border-2 border-dashed border-purple-400 bg-purple-950/30 hover:bg-purple-950/50 flex flex-col items-center justify-center gap-2 cursor-pointer shadow-xl transition"
                    >
                      <ImageIcon className="w-8 h-8 text-purple-400" />
                      <span className="text-xs font-bold text-white">Click to Upload Workshop Feature Photo</span>
                    </div>

                    {/* Story & Mission Paragraphs */}
                    <div className="space-y-4">
                      <div
                        onClick={() =>
                          handleOpenQuickEdit({
                            type: 'textarea',
                            label: 'Company Legacy & Story',
                            fieldPath: ['about', 'story'],
                            currentValue: content?.about?.story,
                          })
                        }
                        className="p-4 rounded-2xl border-2 border-dashed border-slate-500 hover:border-amber-400 hover:bg-amber-400/10 cursor-pointer transition space-y-1"
                      >
                        <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                          <Edit3 className="w-3.5 h-3.5" /> Edit Company Story Paragraph
                        </span>
                        <p className="text-xs text-slate-300 line-clamp-3">{content?.about?.story}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div
                          onClick={() =>
                            handleOpenQuickEdit({
                              type: 'textarea',
                              label: 'Our Mission Statement',
                              fieldPath: ['about', 'mission'],
                              currentValue: content?.about?.mission,
                            })
                          }
                          className="p-3 rounded-xl border-2 border-dashed border-amber-500/60 hover:bg-amber-500/10 cursor-pointer transition"
                        >
                          <span className="text-xs font-bold text-amber-400 block mb-1">Edit Mission</span>
                          <p className="text-[11px] text-slate-300 line-clamp-2">{content?.about?.mission}</p>
                        </div>

                        <div
                          onClick={() =>
                            handleOpenQuickEdit({
                              type: 'textarea',
                              label: 'Our Vision Statement',
                              fieldPath: ['about', 'vision'],
                              currentValue: content?.about?.vision,
                            })
                          }
                          className="p-3 rounded-xl border-2 border-dashed border-blue-500/60 hover:bg-blue-500/10 cursor-pointer transition"
                        >
                          <span className="text-xs font-bold text-blue-400 block mb-1">Edit Vision</span>
                          <p className="text-[11px] text-slate-300 line-clamp-2">{content?.about?.vision}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ============================================================ */}
            {/* 🌟 3. SERVICES PAGE VISUAL CLICK-TO-EDIT HOTSPOTS            */}
            {/* ============================================================ */}
            {selectedPreviewPage === 'services' && clickToEditActive && (
              <div className="absolute top-20 left-0 right-0 z-30 pointer-events-none">
                <div className="max-w-7xl mx-auto px-4 space-y-6 pt-8">
                  <div className="text-center space-y-2 max-w-3xl mx-auto pointer-events-auto">
                    <div
                      onClick={() =>
                        handleOpenQuickEdit({
                          type: 'text',
                          label: 'Services Page Heading',
                          fieldPath: ['services', 'title'],
                          currentValue: content?.services?.title,
                        })
                      }
                      className="p-2 rounded-xl border-2 border-dashed border-blue-400/70 hover:bg-blue-600/10 cursor-pointer transition"
                    >
                      <span className="text-xs text-blue-400 font-bold flex items-center justify-center gap-1">
                        <Edit3 className="w-3 h-3" /> Click to Edit Heading: {content?.services?.title}
                      </span>
                    </div>

                    <div
                      onClick={() =>
                        handleOpenQuickEdit({
                          type: 'text',
                          label: 'Services Subtitle',
                          fieldPath: ['services', 'subtitle'],
                          currentValue: content?.services?.subtitle,
                        })
                      }
                      className="p-1.5 rounded-xl border-2 border-dashed border-slate-500 hover:border-amber-400 hover:bg-amber-400/10 cursor-pointer transition"
                    >
                      <span className="text-xs text-slate-300 flex items-center justify-center gap-1">
                        <Edit3 className="w-3 h-3" /> Click to Edit Subtitle
                      </span>
                    </div>
                  </div>

                  {/* Individual Services Cards Click Hotspots */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4 pointer-events-auto">
                    {content?.services?.list?.map((srv, idx) => (
                      <div
                        key={idx}
                        onClick={() =>
                          handleOpenQuickEdit({
                            type: 'textarea',
                            label: `Service #${idx + 1}: ${srv.name}`,
                            fieldPath: ['services', 'list', `${idx}`, 'description'],
                            currentValue: srv.description,
                          })
                        }
                        className="p-4 rounded-2xl border-2 border-dashed border-slate-700 hover:border-amber-400 hover:bg-slate-900/80 cursor-pointer transition space-y-2 shadow-lg"
                      >
                        <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                          <Wrench className="w-3.5 h-3.5" /> Edit: {srv.name}
                        </span>
                        <p className="text-[11px] text-slate-300 line-clamp-2">{srv.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ============================================================ */}
            {/* 🌟 4. CONTACT PAGE VISUAL CLICK-TO-EDIT HOTSPOTS             */}
            {/* ============================================================ */}
            {selectedPreviewPage === 'contact' && clickToEditActive && (
              <div className="absolute top-20 left-0 right-0 z-30 pointer-events-none">
                <div className="max-w-7xl mx-auto px-4 space-y-6 pt-8">
                  {/* Hotline and WhatsApp quick edit */}
                  <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto pointer-events-auto">
                    <div
                      onClick={() =>
                        handleOpenQuickEdit({
                          type: 'text',
                          label: 'Main Hotline Number',
                          fieldPath: ['company', 'phone'],
                          currentValue: content?.company?.phone,
                        })
                      }
                      className="p-3 rounded-2xl border-2 border-dashed border-amber-400 bg-amber-500/10 hover:bg-amber-500/20 cursor-pointer transition text-center"
                    >
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Hotline Phone</span>
                      <span className="text-sm font-bold text-amber-300 flex items-center justify-center gap-1 mt-0.5">
                        <Phone className="w-3.5 h-3.5" /> {content?.company?.phone}
                      </span>
                    </div>

                    <div
                      onClick={() =>
                        handleOpenQuickEdit({
                          type: 'text',
                          label: 'WhatsApp Phone Number',
                          fieldPath: ['company', 'whatsapp'],
                          currentValue: content?.company?.whatsapp,
                        })
                      }
                      className="p-3 rounded-2xl border-2 border-dashed border-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 cursor-pointer transition text-center"
                    >
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">WhatsApp 24/7</span>
                      <span className="text-sm font-bold text-emerald-400 flex items-center justify-center gap-1 mt-0.5">
                        <Phone className="w-3.5 h-3.5" /> {content?.company?.whatsapp}
                      </span>
                    </div>
                  </div>

                  {/* Workshop Addresses */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto pointer-events-auto pt-2">
                    <div
                      onClick={() =>
                        handleOpenQuickEdit({
                          type: 'textarea',
                          label: 'Kotugoda Main Workshop Address',
                          fieldPath: ['company', 'factoryWorkshop'],
                          currentValue: content?.company?.factoryWorkshop,
                        })
                      }
                      className="p-4 rounded-2xl border-2 border-dashed border-blue-400 hover:bg-blue-600/10 cursor-pointer transition space-y-1"
                    >
                      <span className="text-xs font-bold text-blue-400 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" /> Edit Kotugoda Workshop Address
                      </span>
                      <p className="text-xs text-slate-300">{content?.company?.factoryWorkshop}</p>
                    </div>

                    <div
                      onClick={() =>
                        handleOpenQuickEdit({
                          type: 'textarea',
                          label: 'Thudella Head Office Address',
                          fieldPath: ['company', 'headOffice'],
                          currentValue: content?.company?.headOffice,
                        })
                      }
                      className="p-4 rounded-2xl border-2 border-dashed border-purple-400 hover:bg-purple-600/10 cursor-pointer transition space-y-1"
                    >
                      <span className="text-xs font-bold text-purple-400 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" /> Edit Thudella Head Office Address
                      </span>
                      <p className="text-xs text-slate-300">{content?.company?.headOffice}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ============================================================ */}
            {/* 🌟 5. CATALOG PAGE QUICK ACTION                              */}
            {/* ============================================================ */}
            {selectedPreviewPage === 'catalog' && clickToEditActive && (
              <div className="absolute top-20 left-0 right-0 z-30 pointer-events-none">
                <div className="max-w-7xl mx-auto px-4 pt-6 text-center">
                  <button
                    onClick={() => setSelectedPreviewPage('catalog')}
                    className="pointer-events-auto py-2.5 px-6 rounded-2xl border-2 border-dashed border-amber-400 bg-slate-900/90 text-amber-300 text-xs font-bold shadow-xl hover:scale-105 transition flex items-center gap-2 mx-auto cursor-pointer"
                  >
                    <Truck className="w-4 h-4 text-amber-400" />
                    <span>Manage All Vehicles & Photos in Catalog CMS</span>
                  </button>
                </div>
              </div>
            )}

            <main>{renderSelectedPage()}</main>
            <Footer />
          </div>
        </div>
      </div>

      {/* 🌟 DIRECT CLICK-TO-EDIT FLOATING QUICK-EDITOR MODAL */}
      {activeTarget && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200 text-xs text-slate-200">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <h3 className="font-extrabold text-sm text-white">
                  Customize {activeTarget.label}
                </h3>
              </div>
              <button
                onClick={() => setActiveTarget(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Editor Controls */}
            <div className="space-y-4">
              {/* Text Input / Textarea */}
              {activeTarget.type !== 'image' && (
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Text / Content:
                  </label>
                  {activeTarget.type === 'textarea' ? (
                    <textarea
                      rows={4}
                      value={editInputValue}
                      onChange={(e) => setEditInputValue(e.target.value)}
                      className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-amber-400 transition resize-none"
                    />
                  ) : (
                    <input
                      type="text"
                      value={editInputValue}
                      onChange={(e) => setEditInputValue(e.target.value)}
                      className="w-full py-2.5 px-3 rounded-xl bg-slate-950 border border-slate-700 text-white font-bold focus:outline-none focus:border-amber-400 transition"
                    />
                  )}
                </div>
              )}

              {/* Color Customizer (For Buttons, Badges, Titles) */}
              {(activeTarget.type === 'button' || activeTarget.type === 'badge' || activeTarget.colorPath) && (
                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <label className="block font-semibold text-amber-400">
                    Choose Element Color Theme:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {buttonColorPresets.map((preset) => (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => setEditColorValue(preset.id)}
                        className={`py-2 px-3 rounded-xl font-bold text-xs transition flex items-center justify-between cursor-pointer ${
                          editColorValue === preset.id
                            ? 'ring-2 ring-white scale-105 shadow-lg ' + preset.class
                            : 'opacity-70 hover:opacity-100 ' + preset.class
                        }`}
                      >
                        <span>{preset.label}</span>
                        {editColorValue === preset.id && <Check className="w-3.5 h-3.5" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Image Upload Option (For Photos) */}
              {activeTarget.type === 'image' && (
                <div className="space-y-3">
                  <label className="block font-semibold text-slate-300">
                    Upload New Image File:
                  </label>
                  <div className="relative h-36 rounded-2xl overflow-hidden border border-slate-800 bg-slate-950">
                    <img
                      src={editInputValue}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold flex items-center justify-center gap-2 shadow cursor-pointer disabled:opacity-50 transition"
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Uploading Photo from Computer...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4" />
                        <span>Upload Photo from Computer (PC/Phone)</span>
                      </>
                    )}
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleDirectImageUpload}
                    className="hidden"
                  />

                  <div>
                    <span className="text-[10px] text-slate-400 block mb-1">Or paste image URL:</span>
                    <input
                      type="text"
                      value={editInputValue}
                      onChange={(e) => setEditInputValue(e.target.value)}
                      className="w-full py-2 px-3 rounded-xl bg-slate-950 border border-slate-700 text-slate-200"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setActiveTarget(null)}
                className="py-2 px-4 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 font-bold transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleApplyQuickEdit}
                className="py-2 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-md transition flex items-center gap-1.5 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Apply Changes</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
