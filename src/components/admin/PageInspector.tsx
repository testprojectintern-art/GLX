'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSiteContent } from '@/context/SiteContentContext';
import { 
  Palette, 
  Type, 
  Image as ImageIcon, 
  Phone, 
  Save, 
  RotateCcw, 
  Sparkles, 
  Upload, 
  CheckCircle2, 
  Loader2, 
  Plus, 
  Trash2,
  Truck,
  Layers,
  Wrench,
  Award
} from 'lucide-react';
import { VehicleItem } from '@/lib/types';

export default function PageInspector() {
  const {
    content,
    updateContent,
    saveToServer,
    resetToDefault,
    isSaving,
    hasUnsavedChanges,
    selectedPreviewPage,
    setSelectedPreviewPage,
  } = useSiteContent();

  const [catalog, setCatalog] = useState<VehicleItem[]>([]);
  const [selectedVehicleIdx, setSelectedVehicleIdx] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<string | null>(null);
  const [catalogSaving, setCatalogSaving] = useState(false);
  const [catalogSavedSuccess, setCatalogSavedSuccess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const heroFileInputRef = useRef<HTMLInputElement>(null);
  const aboutFileInputRef = useRef<HTMLInputElement>(null);

  // Load catalog on mount
  useEffect(() => {
    fetch('/api/catalog')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setCatalog(data);
      })
      .catch((err) => console.error(err));
  }, []);

  const handleTextChange = (path: string[], value: any) => {
    const newContent = JSON.parse(JSON.stringify(content));
    let cur = newContent;
    for (let i = 0; i < path.length - 1; i++) {
      if (!cur[path[i]]) cur[path[i]] = {};
      cur = cur[path[i]];
    }
    cur[path[path.length - 1]] = value;
    updateContent(newContent);
  };

  // Upload an image file from PC
  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    onSuccess: (url: string) => void,
    uploadKey: string
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(uploadKey);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success && data.url) {
        onSuccess(data.url);
      } else {
        alert('Upload failed: ' + (data.message || 'Unknown error'));
      }
    } catch (err) {
      console.error(err);
      alert('Error uploading file');
    }
    setIsUploading(null);
    e.target.value = '';
  };

  const handleVehicleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileUpload(
      e,
      (url) => {
        const updated = [...catalog];
        updated[selectedVehicleIdx].coverImage = url;
        if (!updated[selectedVehicleIdx].gallery.includes(url)) {
          updated[selectedVehicleIdx].gallery.unshift(url);
        }
        setCatalog(updated);
        saveCatalogToServer(updated);
      },
      'vehicle-cover'
    );
  };

  const handleVehicleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileUpload(
      e,
      (url) => {
        const updated = [...catalog];
        updated[selectedVehicleIdx].gallery.push(url);
        setCatalog(updated);
        saveCatalogToServer(updated);
      },
      'vehicle-gallery'
    );
  };

  const saveCatalogToServer = async (updatedList = catalog) => {
    setCatalogSaving(true);
    try {
      const res = await fetch('/api/catalog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedList),
      });
      if (res.ok) {
        setCatalogSavedSuccess(true);
        setTimeout(() => setCatalogSavedSuccess(false), 3000);
      }
    } catch (err) {
      console.error(err);
    }
    setCatalogSaving(false);
  };

  const pages = [
    { id: 'home', label: '🏠 Home Page' },
    { id: 'catalog', label: '🚚 Vehicle Catalog & Photos' },
    { id: 'header_footer', label: '🌐 Header, Footer & Numbers' },
    { id: 'about', label: 'ℹ️ About Us' },
    { id: 'services', label: '🛠️ Services' },
    { id: 'contact', label: '📞 Contact & Locations' },
    { id: 'theme', label: '🎨 Global Theme & Colors' },
  ];

  const currentVehicle = catalog[selectedVehicleIdx];

  return (
    <div className="bg-slate-900 border-r border-slate-800 flex flex-col h-full overflow-y-auto">
      {/* Top Header & Page Selector */}
      <div className="p-4 border-b border-slate-800 bg-slate-950 sticky top-0 z-20 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Visual UI & Text Customizer</span>
          </div>
          {hasUnsavedChanges && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse">
              Unsaved Changes
            </span>
          )}
        </div>

        {/* Page Dropdown Selector */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-400 mb-1">
            Select Section / Page to Edit:
          </label>
          <select
            value={selectedPreviewPage}
            onChange={(e) => setSelectedPreviewPage(e.target.value)}
            className="w-full py-2 px-3 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-xs font-semibold focus:outline-none focus:border-amber-400 transition"
          >
            {pages.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
        </div>

        {/* Save & Reset Bar */}
        {selectedPreviewPage !== 'catalog' && (
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={saveToServer}
              disabled={isSaving || !hasUnsavedChanges}
              className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition ${
                hasUnsavedChanges
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/40 cursor-pointer'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              {isSaving ? (
                <span>Saving Changes...</span>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
            <button
              onClick={resetToDefault}
              disabled={!hasUnsavedChanges}
              className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-medium border border-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
              title="Reset to last saved"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Dynamic Property Editor Body */}
      <div className="p-4 space-y-6 text-xs text-slate-300 flex-1">
        {/* VEHICLE CATALOG & PHOTO MANAGER */}
        {selectedPreviewPage === 'catalog' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h4 className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-amber-400" /> Vehicle Photos & Pricing
              </h4>
              {catalogSavedSuccess && (
                <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Saved Live!
                </span>
              )}
            </div>

            {/* Select Vehicle Card to Edit */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                Select Vehicle Model to Change Photos:
              </label>
              <select
                value={selectedVehicleIdx}
                onChange={(e) => setSelectedVehicleIdx(Number(e.target.value))}
                className="w-full py-2 px-3 rounded-xl bg-slate-950 border border-slate-700 text-white font-bold text-xs focus:outline-none focus:border-amber-400 transition"
              >
                {catalog.map((veh, idx) => (
                  <option key={veh.id} value={idx}>
                    {veh.name} ({veh.category})
                  </option>
                ))}
              </select>
            </div>

            {currentVehicle && (
              <div className="space-y-5 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                {/* 1. Cover Image Box & Direct Upload */}
                <div className="space-y-2">
                  <label className="block text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                    Main Cover Image
                  </label>
                  <div className="relative h-40 w-full rounded-xl overflow-hidden border border-slate-800 bg-slate-900">
                    <img
                      src={currentVehicle.coverImage}
                      alt={currentVehicle.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-2 left-2 right-2 flex gap-2">
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading === 'vehicle-cover'}
                        className="flex-1 py-2 px-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg cursor-pointer disabled:opacity-50 transition"
                      >
                        {isUploading === 'vehicle-cover' ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>Uploading Photo...</span>
                          </>
                        ) : (
                          <>
                            <Upload className="w-3.5 h-3.5" />
                            <span>Upload Photo from Computer</span>
                          </>
                        )}
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleVehicleCoverUpload}
                        className="hidden"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Vehicle Name & Price */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-400 mb-1">
                      Model Title
                    </label>
                    <input
                      type="text"
                      value={currentVehicle.name}
                      onChange={(e) => {
                        const updated = [...catalog];
                        updated[selectedVehicleIdx].name = e.target.value;
                        setCatalog(updated);
                      }}
                      onBlur={() => saveCatalogToServer()}
                      className="w-full py-1.5 px-3 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-400 mb-1">
                      Base Starting Price (Rs.)
                    </label>
                    <input
                      type="number"
                      value={currentVehicle.basePrice}
                      onChange={(e) => {
                        const updated = [...catalog];
                        updated[selectedVehicleIdx].basePrice = Number(e.target.value);
                        setCatalog(updated);
                      }}
                      onBlur={() => saveCatalogToServer()}
                      className="w-full py-1.5 px-3 rounded-lg bg-slate-900 border border-slate-800 text-amber-400 font-mono font-bold text-xs"
                    />
                  </div>
                </div>

                {/* Save Catalog Button */}
                <div className="pt-2">
                  <button
                    onClick={() => saveCatalogToServer()}
                    disabled={catalogSaving}
                    className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition cursor-pointer disabled:opacity-50"
                  >
                    {catalogSaving ? (
                      <span>Saving Catalog...</span>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>Save Vehicle & Photos Live</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Home Page Editor */}
        {selectedPreviewPage === 'home' && (
          <div className="space-y-6">
            {/* 1. Hero Content */}
            <div className="space-y-3 p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <h4 className="font-bold text-amber-400 text-xs uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-800">
                <Type className="w-4 h-4" /> Hero Headings & Text
              </h4>

              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">
                  Hero Top Badge Text
                </label>
                <input
                  type="text"
                  value={content?.home?.heroBadge || ''}
                  onChange={(e) => handleTextChange(['home', 'heroBadge'], e.target.value)}
                  className="w-full py-2 px-3 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">
                  Hero Main Heading Title
                </label>
                <input
                  type="text"
                  value={content?.home?.heroTitle || ''}
                  onChange={(e) => handleTextChange(['home', 'heroTitle'], e.target.value)}
                  className="w-full py-2 px-3 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">
                  Hero Subtitle Paragraph
                </label>
                <textarea
                  rows={3}
                  value={content?.home?.heroSubtitle || ''}
                  onChange={(e) => handleTextChange(['home', 'heroSubtitle'], e.target.value)}
                  className="w-full py-2 px-3 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">
                    Primary Button Text
                  </label>
                  <input
                    type="text"
                    value={content?.home?.heroPrimaryBtnText || ''}
                    onChange={(e) => handleTextChange(['home', 'heroPrimaryBtnText'], e.target.value)}
                    className="w-full py-2 px-3 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">
                    Secondary Button Text
                  </label>
                  <input
                    type="text"
                    value={content?.home?.heroSecondaryBtnText || ''}
                    onChange={(e) => handleTextChange(['home', 'heroSecondaryBtnText'], e.target.value)}
                    className="w-full py-2 px-3 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs"
                  />
                </div>
              </div>

              {/* Hero Multi-Image Slider Carousel Manager */}
              <div className="space-y-3 pt-2 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <label className="block text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                    Hero Slider Photos ({content?.home?.heroBannerImages?.length || 1})
                  </label>
                  <button
                    type="button"
                    onClick={() => heroFileInputRef.current?.click()}
                    className="text-amber-400 font-bold text-[11px] flex items-center gap-1 cursor-pointer hover:underline"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add New Slide</span>
                  </button>
                  <input
                    ref={heroFileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleFileUpload(
                        e,
                        (url) => {
                          const curSlides = content?.home?.heroBannerImages || [content?.home?.heroBannerImage || url];
                          const updated = [...curSlides, url];
                          // Batch both field updates into one updateContent call to prevent overwrite
                          const newContent = JSON.parse(JSON.stringify(content));
                          if (!newContent.home) newContent.home = {};
                          newContent.home.heroBannerImages = updated;
                          newContent.home.heroBannerImage = updated[0];
                          updateContent(newContent);
                        },
                        'hero-image'
                      )
                    }
                    className="hidden"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {(content?.home?.heroBannerImages || [content?.home?.heroBannerImage]).map((slideImg: string, sIdx: number) => (
                    <div key={sIdx} className="relative h-20 rounded-xl overflow-hidden border border-slate-800 bg-slate-900 group">
                      <img src={slideImg} alt="" className="w-full h-full object-cover" />
                      {/* Always-visible delete button in top-right corner */}
                      <button
                        type="button"
                        onClick={() => {
                          const cur = content?.home?.heroBannerImages || [content?.home?.heroBannerImage];
                          const filtered = cur.filter((_: any, i: number) => i !== sIdx);
                          if (filtered.length > 0) {
                            // Batch both updates into one updateContent call to avoid overwrite
                            const newContent = JSON.parse(JSON.stringify(content));
                            if (!newContent.home) newContent.home = {};
                            newContent.home.heroBannerImages = filtered;
                            newContent.home.heroBannerImage = filtered[0];
                            updateContent(newContent);
                          } else {
                            alert('At least one Hero Slide is required.');
                          }
                        }}
                        className="absolute top-1 right-1 p-1 rounded-md bg-red-600 hover:bg-red-500 text-white cursor-pointer transition shadow-lg z-10"
                        title="Remove Slide"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                      <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-slate-950/80 text-[9px] font-mono text-amber-400">
                        Slide #{sIdx + 1}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 2. Key Stats Editor */}
            <div className="space-y-3 p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <h4 className="font-bold text-amber-400 text-xs uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-800">
                <Layers className="w-4 h-4" /> Key Statistics Numbers & Labels
              </h4>

              {content?.home?.stats?.map((stat, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Stat #{idx + 1}</span>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-[10px] text-slate-500 block">Number / Value</span>
                      <input
                        type="text"
                        value={stat.value}
                        onChange={(e) => {
                          const newStats = [...content.home.stats];
                          newStats[idx].value = e.target.value;
                          handleTextChange(['home', 'stats'], newStats);
                        }}
                        className="w-full py-1.5 px-2.5 rounded-lg bg-slate-950 border border-slate-800 text-amber-400 font-mono font-bold text-xs"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">Main Label</span>
                      <input
                        type="text"
                        value={stat.label}
                        onChange={(e) => {
                          const newStats = [...content.home.stats];
                          newStats[idx].label = e.target.value;
                          handleTextChange(['home', 'stats'], newStats);
                        }}
                        className="w-full py-1.5 px-2.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs"
                      />
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Sub Description</span>
                    <input
                      type="text"
                      value={stat.description}
                      onChange={(e) => {
                        const newStats = [...content.home.stats];
                        newStats[idx].description = e.target.value;
                        handleTextChange(['home', 'stats'], newStats);
                      }}
                      className="w-full py-1.5 px-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 text-xs"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* 3. Bottom CTA Banner Editor */}
            <div className="space-y-3 p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <h4 className="font-bold text-amber-400 text-xs uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-800">
                <Award className="w-4 h-4" /> Bottom Quotation CTA Banner
              </h4>

              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">
                  CTA Banner Title
                </label>
                <input
                  type="text"
                  value={content?.home?.ctaTitle || ''}
                  onChange={(e) => handleTextChange(['home', 'ctaTitle'], e.target.value)}
                  className="w-full py-2 px-3 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">
                  CTA Banner Subtitle
                </label>
                <textarea
                  rows={2}
                  value={content?.home?.ctaSubtitle || ''}
                  onChange={(e) => handleTextChange(['home', 'ctaSubtitle'], e.target.value)}
                  className="w-full py-2 px-3 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs resize-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">
                  CTA Button Text
                </label>
                <input
                  type="text"
                  value={content?.home?.ctaBtnText || ''}
                  onChange={(e) => handleTextChange(['home', 'ctaBtnText'], e.target.value)}
                  className="w-full py-2 px-3 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs"
                />
              </div>
            </div>
          </div>
        )}

        {/* Header, Footer & Contact Numbers Editor */}
        {selectedPreviewPage === 'header_footer' && (
          <div className="space-y-6">
            {/* 1. Header Branding & Announcement */}
            <div className="space-y-3 p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <h4 className="font-bold text-blue-400 text-xs uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-800">
                <Sparkles className="w-4 h-4" /> Header Logo, Tagline & Top Bar
              </h4>

              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">
                  Brand Logo Name
                </label>
                <input
                  type="text"
                  value={content?.company?.brandName || ''}
                  onChange={(e) => handleTextChange(['company', 'brandName'], e.target.value)}
                  className="w-full py-2 px-3 rounded-lg bg-slate-900 border border-slate-800 text-white font-bold text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">
                  Brand Subtitle / Tagline
                </label>
                <input
                  type="text"
                  value={content?.company?.tagline || ''}
                  onChange={(e) => handleTextChange(['company', 'tagline'], e.target.value)}
                  className="w-full py-2 px-3 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs"
                />
              </div>

              {/* Top Micro Bar Details */}
              <div className="pt-2 border-t border-slate-800/80 space-y-3">
                <span className="text-[11px] font-bold text-amber-400 block uppercase">
                  Top Micro Header Bar Items:
                </span>

                <div>
                  <label className="block text-[10px] text-slate-400 mb-1">
                    1. Top Left Badge Text (e.g. BRC Registered: PV 00234891)
                  </label>
                  <input
                    type="text"
                    placeholder="BRC Registered: PV 00234891"
                    value={content?.theme?.topBarLeftBadge || ''}
                    onChange={(e) => handleTextChange(['theme', 'topBarLeftBadge'], e.target.value)}
                    className="w-full py-2 px-3 rounded-lg bg-slate-900 border border-slate-800 text-amber-300 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 mb-1">
                    2. Location / Facility Notice (e.g. Ja-Ela & Kotugoda Facilities)
                  </label>
                  <input
                    type="text"
                    placeholder="Ja-Ela & Kotugoda Facilities"
                    value={content?.theme?.topBarLocationText || ''}
                    onChange={(e) => handleTextChange(['theme', 'topBarLocationText'], e.target.value)}
                    className="w-full py-2 px-3 rounded-lg bg-slate-900 border border-slate-800 text-blue-300 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 mb-1">
                    3. WhatsApp Button Label (e.g. WhatsApp Support)
                  </label>
                  <input
                    type="text"
                    placeholder="WhatsApp Support"
                    value={content?.theme?.topBarWhatsAppText || ''}
                    onChange={(e) => handleTextChange(['theme', 'topBarWhatsAppText'], e.target.value)}
                    className="w-full py-2 px-3 rounded-lg bg-slate-900 border border-slate-800 text-emerald-400 text-xs"
                  />
                </div>
              </div>
            </div>

            {/* 2. Official Phone Numbers, WhatsApp & Email */}
            <div className="space-y-3 p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <h4 className="font-bold text-amber-400 text-xs uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-800">
                <Phone className="w-4 h-4" /> Phone Numbers, WhatsApp & Emails
              </h4>

              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">
                  Primary Hotline Phone Number *
                </label>
                <input
                  type="text"
                  value={content?.company?.phone || ''}
                  onChange={(e) => handleTextChange(['company', 'phone'], e.target.value)}
                  className="w-full py-2 px-3 rounded-lg bg-slate-900 border border-slate-800 text-amber-400 font-mono font-bold text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">
                  Secondary / Office Landline (Optional)
                </label>
                <input
                  type="text"
                  value={content?.company?.secondaryPhone || ''}
                  onChange={(e) => handleTextChange(['company', 'secondaryPhone'], e.target.value)}
                  className="w-full py-2 px-3 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">
                  WhatsApp 24/7 Hotline Number *
                </label>
                <input
                  type="text"
                  value={content?.company?.whatsapp || ''}
                  onChange={(e) => handleTextChange(['company', 'whatsapp'], e.target.value)}
                  className="w-full py-2 px-3 rounded-lg bg-slate-900 border border-slate-800 text-emerald-400 font-mono font-bold text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">
                  Official Inquiries Email
                </label>
                <input
                  type="email"
                  value={content?.company?.email || ''}
                  onChange={(e) => handleTextChange(['company', 'email'], e.target.value)}
                  className="w-full py-2 px-3 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">
                  BRC Registration Number
                </label>
                <input
                  type="text"
                  value={content?.company?.brcNumber || ''}
                  onChange={(e) => handleTextChange(['company', 'brcNumber'], e.target.value)}
                  className="w-full py-2 px-3 rounded-lg bg-slate-900 border border-slate-800 text-amber-300 font-mono text-xs"
                />
              </div>
            </div>

            {/* 3. Footer Details, Addresses & Copyright */}
            <div className="space-y-3 p-4 rounded-2xl bg-slate-950 border border-slate-800">
              <h4 className="font-bold text-emerald-400 text-xs uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-800">
                <Award className="w-4 h-4" /> Footer Addresses & Copyright
              </h4>

              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">
                  Kotugoda Main Workshop Address
                </label>
                <textarea
                  rows={2}
                  value={content?.company?.factoryWorkshop || ''}
                  onChange={(e) => handleTextChange(['company', 'factoryWorkshop'], e.target.value)}
                  className="w-full py-2 px-3 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs resize-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">
                  Thudella Head Office Address
                </label>
                <textarea
                  rows={2}
                  value={content?.company?.headOffice || ''}
                  onChange={(e) => handleTextChange(['company', 'headOffice'], e.target.value)}
                  className="w-full py-2 px-3 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs resize-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">
                  Operating Hours
                </label>
                <input
                  type="text"
                  value={content?.company?.operatingHours || ''}
                  onChange={(e) => handleTextChange(['company', 'operatingHours'], e.target.value)}
                  className="w-full py-2 px-3 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1">
                  Footer Copyright Notice
                </label>
                <textarea
                  rows={2}
                  value={content?.company?.copyrightText || ''}
                  onChange={(e) => handleTextChange(['company', 'copyrightText'], e.target.value)}
                  className="w-full py-2 px-3 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 text-xs resize-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* About Page Editor */}
        {selectedPreviewPage === 'about' && (
          <div className="space-y-4">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-800">
              <Type className="w-4 h-4 text-amber-400" /> About Page Details
            </h4>

            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">
                Page Title
              </label>
              <input
                type="text"
                value={content?.about?.title || ''}
                onChange={(e) => handleTextChange(['about', 'title'], e.target.value)}
                className="w-full py-2 px-3 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">
                Subtitle
              </label>
              <input
                type="text"
                value={content?.about?.subtitle || ''}
                onChange={(e) => handleTextChange(['about', 'subtitle'], e.target.value)}
                className="w-full py-2 px-3 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">
                Company Legacy & Story
              </label>
              <textarea
                rows={4}
                value={content?.about?.story || ''}
                onChange={(e) => handleTextChange(['about', 'story'], e.target.value)}
                className="w-full py-2 px-3 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs resize-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">
                Mission Statement
              </label>
              <textarea
                rows={3}
                value={content?.about?.mission || ''}
                onChange={(e) => handleTextChange(['about', 'mission'], e.target.value)}
                className="w-full py-2 px-3 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs resize-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">
                Vision Statement
              </label>
              <textarea
                rows={3}
                value={content?.about?.vision || ''}
                onChange={(e) => handleTextChange(['about', 'vision'], e.target.value)}
                className="w-full py-2 px-3 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs resize-none"
              />
            </div>

            {/* About Image Upload */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <label className="block text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                Workshop Feature Photo
              </label>
              <div className="relative h-32 w-full rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
                <img
                  src={content?.about?.image}
                  alt="About Workshop"
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => aboutFileInputRef.current?.click()}
                  className="absolute bottom-2 right-2 py-1.5 px-3 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs flex items-center gap-1 shadow cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Workshop Photo</span>
                </button>
                <input
                  ref={aboutFileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    handleFileUpload(
                      e,
                      (url) => handleTextChange(['about', 'image'], url),
                      'about-image'
                    )
                  }
                  className="hidden"
                />
              </div>
            </div>
          </div>
        )}

        {/* Services Page Editor */}
        {selectedPreviewPage === 'services' && (
          <div className="space-y-4">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-800">
              <Wrench className="w-4 h-4 text-amber-400" /> Services Page Details
            </h4>

            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">
                Services Main Heading
              </label>
              <input
                type="text"
                value={content?.services?.title || ''}
                onChange={(e) => handleTextChange(['services', 'title'], e.target.value)}
                className="w-full py-2 px-3 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">
                Services Subtitle
              </label>
              <input
                type="text"
                value={content?.services?.subtitle || ''}
                onChange={(e) => handleTextChange(['services', 'subtitle'], e.target.value)}
                className="w-full py-2 px-3 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs"
              />
            </div>

            <div className="space-y-3 pt-2">
              <span className="text-[11px] font-bold text-amber-400 block uppercase">Individual Services:</span>
              {content?.services?.list?.map((srv, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <input
                    type="text"
                    value={srv.name}
                    onChange={(e) => {
                      const newList = [...content.services.list];
                      newList[idx].name = e.target.value;
                      handleTextChange(['services', 'list'], newList);
                    }}
                    className="w-full py-1.5 px-2.5 rounded-lg bg-slate-900 border border-slate-800 text-white font-bold text-xs"
                  />
                  <textarea
                    rows={2}
                    value={srv.description}
                    onChange={(e) => {
                      const newList = [...content.services.list];
                      newList[idx].description = e.target.value;
                      handleTextChange(['services', 'list'], newList);
                    }}
                    className="w-full py-1.5 px-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 text-xs resize-none"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Global Theme Editor */}
        {selectedPreviewPage === 'theme' && (
          <div className="space-y-4">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-800">
              <Palette className="w-4 h-4 text-amber-400" /> Color Scheme & Branding
            </h4>

            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">
                Primary Brand Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={content?.theme?.primaryColor || '#1e3a8a'}
                  onChange={(e) => handleTextChange(['theme', 'primaryColor'], e.target.value)}
                  className="w-9 h-9 rounded-lg cursor-pointer bg-transparent border-0"
                />
                <input
                  type="text"
                  value={content?.theme?.primaryColor || '#1e3a8a'}
                  onChange={(e) => handleTextChange(['theme', 'primaryColor'], e.target.value)}
                  className="flex-1 py-1.5 px-3 rounded-lg bg-slate-950 border border-slate-800 text-white font-mono text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">
                Accent Gold / Amber Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={content?.theme?.accentColor || '#f59e0b'}
                  onChange={(e) => handleTextChange(['theme', 'accentColor'], e.target.value)}
                  className="w-9 h-9 rounded-lg cursor-pointer bg-transparent border-0"
                />
                <input
                  type="text"
                  value={content?.theme?.accentColor || '#f59e0b'}
                  onChange={(e) => handleTextChange(['theme', 'accentColor'], e.target.value)}
                  className="flex-1 py-1.5 px-3 rounded-lg bg-slate-950 border border-slate-800 text-white font-mono text-xs"
                />
              </div>
            </div>

            <div className="pt-2">
              <label className="block text-[11px] font-medium text-slate-400 mb-1">
                Brand Title
              </label>
              <input
                type="text"
                value={content?.company?.brandName || ''}
                onChange={(e) => handleTextChange(['company', 'brandName'], e.target.value)}
                className="w-full py-2 px-3 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">
                Main Hotline Phone
              </label>
              <input
                type="text"
                value={content?.company?.phone || ''}
                onChange={(e) => handleTextChange(['company', 'phone'], e.target.value)}
                className="w-full py-2 px-3 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">
                WhatsApp Phone Number
              </label>
              <input
                type="text"
                value={content?.company?.whatsapp || ''}
                onChange={(e) => handleTextChange(['company', 'whatsapp'], e.target.value)}
                className="w-full py-2 px-3 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs"
              />
            </div>
          </div>
        )}

        {/* Contact Page Editor */}
        {selectedPreviewPage === 'contact' && (
          <div className="space-y-4">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-800">
              <Phone className="w-4 h-4 text-amber-400" /> Workshop & Contact Info
            </h4>

            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">
                Kotugoda Workshop Address
              </label>
              <textarea
                rows={2}
                value={content?.company?.factoryWorkshop || ''}
                onChange={(e) => handleTextChange(['company', 'factoryWorkshop'], e.target.value)}
                className="w-full py-2 px-3 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs resize-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">
                Thudella Head Office Address
              </label>
              <textarea
                rows={2}
                value={content?.company?.headOffice || ''}
                onChange={(e) => handleTextChange(['company', 'headOffice'], e.target.value)}
                className="w-full py-2 px-3 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs resize-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">
                Operating Hours
              </label>
              <input
                type="text"
                value={content?.company?.operatingHours || ''}
                onChange={(e) => handleTextChange(['company', 'operatingHours'], e.target.value)}
                className="w-full py-2 px-3 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
