'use client';

import React, { useEffect, useState, useRef } from 'react';
import { 
  Truck, 
  Plus, 
  Edit3, 
  Trash2, 
  Upload, 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  Loader2, 
  Tag,
  Palette,
  Sparkles,
  Image as ImageIcon
} from 'lucide-react';
import { VehicleItem } from '@/lib/types';
import { getBadgeClasses, getCategoryBadgeClasses } from '@/components/public/VehicleCard';

export default function AdminCatalogManagerPage() {
  const [vehicles, setVehicles] = useState<VehicleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Partial<VehicleItem> | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [modalError, setModalError] = useState('');
  const [actionSuccessMsg, setActionSuccessMsg] = useState('');
  const [galleryUrlInput, setGalleryUrlInput] = useState('');

  const coverFileRef = useRef<HTMLInputElement>(null);
  const galleryFileRef = useRef<HTMLInputElement>(null);

  const colorOptions = [
    { id: 'amber', label: 'Gold / Amber', class: 'bg-amber-500 text-slate-950' },
    { id: 'emerald', label: 'Emerald Green', class: 'bg-emerald-500 text-slate-950' },
    { id: 'blue', label: 'Classic Blue', class: 'bg-blue-600 text-white' },
    { id: 'purple', label: 'Royal Purple', class: 'bg-purple-600 text-white' },
    { id: 'red', label: 'Crimson Red', class: 'bg-red-600 text-white' },
    { id: 'cyan', label: 'Electric Cyan', class: 'bg-cyan-500 text-slate-950' },
    { id: 'slate', label: 'Dark Slate', class: 'bg-slate-800 text-slate-200 border border-slate-700' },
  ];

  const categoryPresets = [
    'Three Wheel',
    'Mini Truck',
    'Light Truck',
    'Medium Truck',
    'Heavy Truck',
    'Special Purpose',
    'Tipper Body',
    'Freezer Box',
  ];

  const badgePresets = [
    'Most Popular',
    'Best Seller',
    'Heavy Duty',
    'High Demand',
    'Commercial Grade',
    'Custom Built',
    'Express Delivery',
    'Eco Aluminum',
  ];

  const fetchVehicles = () => {
    fetch('/api/catalog')
      .then((res) => res.json())
      .then((data) => {
        setVehicles(data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const showNotification = (msg: string) => {
    setActionSuccessMsg(msg);
    setTimeout(() => setActionSuccessMsg(''), 4000);
  };

  const handleOpenAddModal = () => {
    setGalleryUrlInput('');
    setEditingVehicle({
      id: `vh-${Date.now()}`,
      slug: '',
      name: '',
      category: 'Mini Truck',
      categoryColor: 'amber',
      tagline: '',
      badge: 'Most Popular',
      badgeColor: 'amber',
      coverImage: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1000&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=1000&q=80',
      ],
      galleryImages: [
        'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=1000&q=80',
      ],
      standardOptions: [],
      basePrice: 150000,
      leadTime: '5 - 7 Days',
      isPopular: true,
      description: '',
      specs: {
        dimensions: '8.5ft x 5.0ft x 5.5ft',
        sheetMaterial: '1.2mm High-Tensile Electro-Galvanized (GI) Sheet',
        floorPlate: '2.0mm Heavy Checkered Steel / Non-Slip Aluminum',
        paintFinish: '2K Industrial Automotive Polyurethane with Anti-Rust Epoxy Primer',
        chassisCompatibility: 'Tata Ace / Mahindra Bolero / Dimo Batta',
        warranty: '3-Year Structural Warranty on all welds and subframe joints',
      },
      availableOptions: [
        { id: 'opt-ladder', name: 'Rear Heavy-Duty Loading Ladder', price: 18000, defaultSelected: false },
        { id: 'opt-rack', name: 'Full-Length Overhead Rooftop Luggage Carrier', price: 32000, defaultSelected: true },
        { id: 'opt-camera', name: 'Night-Vision Reverse Camera & Dash Display', price: 25000, defaultSelected: false },
      ],
    });
    setModalError('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (vehicle: VehicleItem) => {
    setGalleryUrlInput('');
    const curGallery = vehicle.gallery && vehicle.gallery.length > 0
      ? vehicle.gallery
      : (vehicle.galleryImages && vehicle.galleryImages.length > 0 ? vehicle.galleryImages : (vehicle.coverImage ? [vehicle.coverImage] : []));

    setEditingVehicle({
      ...vehicle,
      categoryColor: vehicle.categoryColor || 'amber',
      badgeColor: vehicle.badgeColor || 'amber',
      availableOptions: vehicle.availableOptions ? [...vehicle.availableOptions] : [],
      gallery: [...curGallery],
      galleryImages: [...curGallery],
    });
    setModalError('');
    setIsModalOpen(true);
  };

  const handleDeleteVehicle = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}" from the vehicle catalog?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/catalog?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setVehicles((prev) => prev.filter((v) => v.id !== id));
        showNotification(`Vehicle "${name}" removed successfully.`);
      } else {
        alert('Failed to delete vehicle.');
      }
    } catch (err) {
      console.error(err);
      alert('Error deleting vehicle.');
    }
  };

  // Upload Cover Handler
  const handleUploadCover = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.url) {
        setEditingVehicle((prev) => {
          if (!prev) return null;
          const currentGal = prev.gallery || prev.galleryImages || [];
          const updatedGal = currentGal.includes(data.url) ? currentGal : [data.url, ...currentGal];
          return {
            ...prev,
            coverImage: data.url,
            gallery: updatedGal,
            galleryImages: updatedGal,
          };
        });
        showNotification('Cover photo uploaded successfully.');
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

  // Upload Gallery Item Handler
  const handleUploadGallery = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.url) {
        setEditingVehicle((prev) => {
          if (!prev) return null;
          const current = prev.gallery && prev.gallery.length > 0 ? prev.gallery : (prev.galleryImages || []);
          const updated = [...current, data.url];
          return { ...prev, gallery: updated, galleryImages: updated };
        });
        showNotification('Gallery image added successfully.');
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

  const handleRemoveGalleryImage = (indexToRemove: number) => {
    setEditingVehicle((prev) => {
      if (!prev) return null;
      const current = prev.gallery && prev.gallery.length > 0 ? prev.gallery : (prev.galleryImages || []);
      const updated = current.filter((_, idx) => idx !== indexToRemove);
      return { ...prev, gallery: updated, galleryImages: updated };
    });
  };

  const handleAddGalleryUrl = () => {
    if (!galleryUrlInput.trim()) return;
    setEditingVehicle((prev) => {
      if (!prev) return null;
      const current = prev.gallery && prev.gallery.length > 0 ? prev.gallery : (prev.galleryImages || []);
      const updated = [...current, galleryUrlInput.trim()];
      return { ...prev, gallery: updated, galleryImages: updated };
    });
    setGalleryUrlInput('');
  };

  // Save Modal (Create or Update)
  const handleSaveVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVehicle?.name?.trim()) {
      setModalError('Please enter a vehicle name.');
      return;
    }

    setIsSaving(true);
    setModalError('');

    // Generate slug if empty
    const slug =
      editingVehicle.slug ||
      editingVehicle.name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');

    const curGal = editingVehicle.gallery && editingVehicle.gallery.length > 0
      ? editingVehicle.gallery
      : (editingVehicle.galleryImages && editingVehicle.galleryImages.length > 0
          ? editingVehicle.galleryImages
          : (editingVehicle.coverImage ? [editingVehicle.coverImage] : []));

    const payload = {
      ...editingVehicle,
      slug,
      gallery: curGal,
      galleryImages: curGal,
      basePrice: Number(editingVehicle.basePrice) || 0,
    };

    try {
      const exists = vehicles.some((v) => v.id === editingVehicle.id);
      const res = await fetch('/api/catalog', {
        method: exists ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        if (exists) {
          setVehicles((prev) =>
            prev.map((v) => (v.id === editingVehicle.id ? (payload as VehicleItem) : v))
          );
          showNotification(`Vehicle "${payload.name}" updated successfully.`);
        } else {
          setVehicles((prev) => [...prev, payload as VehicleItem]);
          showNotification(`New vehicle "${payload.name}" added to catalog.`);
        }
        setIsModalOpen(false);
      } else {
        setModalError(data.error || 'Failed to save vehicle.');
      }
    } catch (err: any) {
      setModalError(err.message || 'Error saving vehicle.');
    }

    setIsSaving(false);
  };

  const categories = ['All', ...Array.from(new Set(vehicles.map((v) => v.category)))];

  const filtered = vehicles.filter((v) => {
    const matchCat = selectedCategory === 'All' || v.category === selectedCategory;
    const matchSearch =
      v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (v.specs?.chassisCompatibility &&
        v.specs.chassisCompatibility.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchCat && matchSearch;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-10 space-y-6 sm:space-y-8 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
            Vehicle Catalog & Inventory CMS
          </span>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            Manage Vehicle Models & Badges
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Add unlimited vehicle models, customize badges & colors, upload photos, and edit specifications.
          </p>
        </div>

        <div>
          <button
            onClick={handleOpenAddModal}
            className="w-full sm:w-auto py-3 px-5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 active:scale-95 transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Vehicle Model</span>
          </button>
        </div>
      </div>

      {/* Success Notification Alert */}
      {actionSuccessMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in shadow-sm">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
          <span>{actionSuccessMsg}</span>
        </div>
      )}

      {/* Toolbar: Category Filters & Search */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row gap-4 items-center justify-between shadow-sm">
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'bg-slate-100 dark:bg-slate-950 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search models, specs, chassis..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-amber-400 transition"
          />
        </div>
      </div>

      {/* Vehicle Grid */}
      {loading ? (
        <div className="py-16 text-center text-xs text-slate-500">Loading Vehicle Catalog...</div>
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 space-y-3 shadow-sm">
          <Truck className="w-10 h-10 mx-auto text-slate-400 dark:text-slate-600" />
          <p className="text-sm font-bold text-slate-800 dark:text-white">No vehicles found.</p>
          <p className="text-xs">Click "+ Add New Vehicle Model" to create your first item.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((vehicle) => {
            const catClass = getCategoryBadgeClasses(vehicle.categoryColor);
            const badgeClass = getBadgeClasses(vehicle.badgeColor);

            return (
              <div
                key={vehicle.id}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col justify-between shadow-md hover:border-amber-400 dark:hover:border-amber-500 transition group hover:-translate-y-1"
              >
                {/* Cover Photo */}
                <div className="relative h-48 w-full bg-slate-100 dark:bg-slate-950 overflow-hidden">
                  <img
                    src={vehicle.coverImage}
                    alt={vehicle.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  {/* Customized Badges */}
                  <div className="absolute top-3 left-3 right-3 flex justify-between items-center gap-2">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold shadow backdrop-blur-md ${catClass}`}>
                      {vehicle.category}
                    </span>
                    {vehicle.badge && (
                      <span className={`px-2.5 py-1 rounded-full text-[10px] shadow ${badgeClass}`}>
                        {vehicle.badge}
                      </span>
                    )}
                  </div>

                  <div className="absolute bottom-3 right-3">
                    <span className="px-3 py-1 rounded-xl text-xs font-black bg-black/80 text-amber-400 border border-white/10 font-mono shadow-md">
                      Rs. {vehicle.basePrice?.toLocaleString('en-LK')}
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition">
                      {vehicle.name}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                      {vehicle.tagline || vehicle.description}
                    </p>

                    <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 grid grid-cols-2 gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                      <div>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 block">Dimensions</span>
                        <span className="font-medium text-slate-700 dark:text-slate-300 truncate block">{vehicle.specs?.dimensions}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 block">Lead Time</span>
                        <span className="font-medium text-slate-700 dark:text-slate-300 truncate block">{vehicle.leadTime}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                    <button
                      onClick={() => handleOpenEditModal(vehicle)}
                      className="flex-1 py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 text-slate-800 dark:text-white text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer border border-slate-200 dark:border-slate-700"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-amber-500" />
                      <span>Edit & Customize</span>
                    </button>

                    <button
                      onClick={() => handleDeleteVehicle(vehicle.id, vehicle.name)}
                      className="py-2 px-3 rounded-xl bg-red-50 dark:bg-red-950/50 hover:bg-red-100 dark:hover:bg-red-900/60 text-red-600 dark:text-red-400 text-xs font-bold border border-red-200 dark:border-red-900/60 transition flex items-center justify-center gap-1 cursor-pointer"
                      title="Delete Vehicle"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CREATE / EDIT MODAL WITH BADGE CUSTOMIZER */}
      {isModalOpen && editingVehicle && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  {vehicles.some((v) => v.id === editingVehicle.id)
                    ? `Edit Vehicle & Tags: ${editingVehicle.name}`
                    : 'Add New Vehicle Model'}
                </h2>
                <span className="text-xs text-slate-500 dark:text-slate-400">Customize labels, pill tags, colors, and engineering specs</span>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleSaveVehicle} className="p-6 overflow-y-auto space-y-6 flex-1 text-xs text-slate-800 dark:text-slate-200">
              {modalError && (
                <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/80 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                  <span>{modalError}</span>
                </div>
              )}

              {/* 🌟 LIVE BADGE & TAG CUSTOMIZER BOX */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-amber-500/30 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                  <span className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider flex items-center gap-2">
                    <Tag className="w-4 h-4 text-amber-500" />
                    Badge & Tag Styling Customizer
                  </span>
                  <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold">Live Preview Active</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Category Pill */}
                  <div className="space-y-2">
                    <label className="font-semibold text-slate-700 dark:text-slate-300 block">Category Label</label>
                    <input
                      type="text"
                      list="category-options"
                      value={editingVehicle.category || ''}
                      onChange={(e) => setEditingVehicle({ ...editingVehicle, category: e.target.value })}
                      placeholder="e.g. Tipper Body, Mini Truck"
                      className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:border-amber-400 focus:outline-none"
                    />
                    <datalist id="category-options">
                      {categoryPresets.map((p) => (
                        <option key={p} value={p} />
                      ))}
                    </datalist>

                    {/* Category Color Picker */}
                    <div>
                      <label className="text-[11px] text-slate-500 block mb-1.5">Category Pill Color</label>
                      <div className="flex flex-wrap gap-1.5">
                        {colorOptions.map((c) => (
                          <button
                            type="button"
                            key={c.id}
                            onClick={() => setEditingVehicle({ ...editingVehicle, categoryColor: c.id })}
                            className={`px-2 py-1 rounded-lg text-[10px] font-bold transition border cursor-pointer ${
                              editingVehicle.categoryColor === c.id
                                ? 'ring-2 ring-amber-400 scale-105 ' + c.class
                                : 'bg-slate-200 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-800'
                            }`}
                          >
                            {c.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Corner Ribbon / Badge */}
                  <div className="space-y-2">
                    <label className="font-semibold text-slate-700 dark:text-slate-300 block">Corner Badge (Promotion / Tag)</label>
                    <input
                      type="text"
                      list="badge-options"
                      value={editingVehicle.badge || ''}
                      onChange={(e) => setEditingVehicle({ ...editingVehicle, badge: e.target.value })}
                      placeholder="e.g. Most Popular, Commercial Grade"
                      className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:border-amber-400 focus:outline-none"
                    />
                    <datalist id="badge-options">
                      {badgePresets.map((b) => (
                        <option key={b} value={b} />
                      ))}
                    </datalist>

                    {/* Badge Color Picker */}
                    <div>
                      <label className="text-[11px] text-slate-500 block mb-1.5">Badge Accent Color</label>
                      <div className="flex flex-wrap gap-1.5">
                        {colorOptions.map((c) => (
                          <button
                            type="button"
                            key={c.id}
                            onClick={() => setEditingVehicle({ ...editingVehicle, badgeColor: c.id })}
                            className={`px-2 py-1 rounded-lg text-[10px] font-bold transition border cursor-pointer ${
                              editingVehicle.badgeColor === c.id
                                ? 'ring-2 ring-amber-400 scale-105 ' + c.class
                                : 'bg-slate-200 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-800'
                            }`}
                          >
                            {c.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Badge Preview Banner */}
                <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center gap-3">
                  <span className="text-[11px] text-slate-500">Live Preview:</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold shadow ${getCategoryBadgeClasses(editingVehicle.categoryColor)}`}>
                    {editingVehicle.category || 'Category'}
                  </span>
                  {editingVehicle.badge && (
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] shadow ${getBadgeClasses(editingVehicle.badgeColor)}`}>
                      {editingVehicle.badge}
                    </span>
                  )}
                </div>
              </div>

              {/* General Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Vehicle Model Name *</label>
                  <input
                    type="text"
                    required
                    value={editingVehicle.name || ''}
                    onChange={(e) => setEditingVehicle({ ...editingVehicle, name: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:border-amber-400 focus:outline-none"
                    placeholder="e.g. 10.5FT ALUMINIUM BOX BODY"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Base Price (LKR) *</label>
                  <input
                    type="number"
                    required
                    value={editingVehicle.basePrice || 0}
                    onChange={(e) => setEditingVehicle({ ...editingVehicle, basePrice: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Lead Time</label>
                  <input
                    type="text"
                    value={editingVehicle.leadTime || ''}
                    onChange={(e) => setEditingVehicle({ ...editingVehicle, leadTime: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:border-amber-400 focus:outline-none"
                    placeholder="e.g. 7 - 10 Days"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Tagline</label>
                  <input
                    type="text"
                    value={editingVehicle.tagline || ''}
                    onChange={(e) => setEditingVehicle({ ...editingVehicle, tagline: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:border-amber-400 focus:outline-none"
                    placeholder="e.g. Heavy Duty Cargo Solution"
                  />
                </div>
              </div>

              {/* Cover Image Uploader */}
              <div className="space-y-2">
                <label className="block font-semibold text-slate-700 dark:text-slate-300">Cover Photo (URL or File Upload)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={editingVehicle.coverImage || ''}
                    onChange={(e) => setEditingVehicle({ ...editingVehicle, coverImage: e.target.value })}
                    className="flex-1 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:border-amber-400 focus:outline-none"
                    placeholder="https://..."
                  />
                  <button
                    type="button"
                    onClick={() => coverFileRef.current?.click()}
                    disabled={isUploading}
                    className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-bold flex items-center gap-1.5 cursor-pointer border border-slate-200 dark:border-slate-700"
                  >
                    {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4 text-amber-500" />}
                    <span>Upload</span>
                  </button>
                  <input
                    ref={coverFileRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleUploadCover}
                  />
                </div>
              </div>

              {/* 🌟 VEHICLE PHOTO ALBUM & GALLERY MANAGER */}
              <div className="space-y-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200 dark:border-slate-800">
                  <div>
                    <label className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-amber-500" />
                      <span>Photo Album / Gallery ({editingVehicle.gallery?.length || editingVehicle.galleryImages?.length || 0} Photos)</span>
                    </label>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      Add multiple fabrication portfolio photos for this vehicle model.
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => galleryFileRef.current?.click()}
                      disabled={isUploading}
                      className="py-1.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow cursor-pointer transition disabled:opacity-50"
                    >
                      {isUploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                      <span>Upload from PC</span>
                    </button>
                    <input
                      ref={galleryFileRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleUploadGallery}
                    />
                  </div>
                </div>

                {/* Direct Image URL Add */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={galleryUrlInput}
                    onChange={(e) => setGalleryUrlInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddGalleryUrl();
                      }
                    }}
                    className="flex-1 p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:border-amber-400 focus:outline-none"
                    placeholder="Or paste image URL (https://...) and click Add to Album"
                  />
                  <button
                    type="button"
                    onClick={handleAddGalleryUrl}
                    disabled={!galleryUrlInput.trim()}
                    className="px-3 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-900 dark:text-white text-xs font-bold disabled:opacity-40 cursor-pointer transition flex items-center gap-1 border border-slate-300 dark:border-slate-700"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add to Album</span>
                  </button>
                </div>

                {/* Gallery Thumbnails Grid with Delete buttons */}
                {((editingVehicle.gallery && editingVehicle.gallery.length > 0) || (editingVehicle.galleryImages && editingVehicle.galleryImages.length > 0)) ? (
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2.5 pt-2">
                    {(editingVehicle.gallery && editingVehicle.gallery.length > 0 ? editingVehicle.gallery : editingVehicle.galleryImages)!.map((imgUrl, gIdx) => (
                      <div
                        key={gIdx}
                        className="relative h-20 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 group shadow-sm"
                      >
                        <img src={imgUrl} alt={`Photo ${gIdx + 1}`} className="w-full h-full object-cover" />
                        
                        {/* Always visible or hover delete button */}
                        <button
                          type="button"
                          onClick={() => handleRemoveGalleryImage(gIdx)}
                          className="absolute top-1 right-1 p-1 rounded-md bg-red-600 hover:bg-red-500 text-white cursor-pointer shadow-md transition z-10"
                          title="Remove this photo"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>

                        <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-slate-950/80 text-[9px] font-mono text-amber-400">
                          #{gIdx + 1}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-4 text-center text-slate-400 text-xs italic bg-white dark:bg-slate-900/50 rounded-xl border border-dashed border-slate-300 dark:border-slate-800">
                    No album photos added yet. Click &ldquo;Upload from PC&rdquo; or paste a URL above to add gallery photos.
                  </div>
                )}
              </div>

              {/* Engineering Specs */}
              <div className="space-y-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">Engineering Specs</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-slate-500 block mb-1">Body Dimensions</label>
                    <input
                      type="text"
                      value={editingVehicle.specs?.dimensions || ''}
                      onChange={(e) =>
                        setEditingVehicle({
                          ...editingVehicle,
                          specs: { ...(editingVehicle.specs as any), dimensions: e.target.value },
                        })
                      }
                      className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                      placeholder="e.g. 10.5ft x 6.0ft x 6.5ft"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-500 block mb-1">Sheet Material</label>
                    <input
                      type="text"
                      value={editingVehicle.specs?.sheetMaterial || ''}
                      onChange={(e) =>
                        setEditingVehicle({
                          ...editingVehicle,
                          specs: { ...(editingVehicle.specs as any), sheetMaterial: e.target.value },
                        })
                      }
                      className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-500 block mb-1">Floor Plate</label>
                    <input
                      type="text"
                      value={editingVehicle.specs?.floorPlate || ''}
                      onChange={(e) =>
                        setEditingVehicle({
                          ...editingVehicle,
                          specs: { ...(editingVehicle.specs as any), floorPlate: e.target.value },
                        })
                      }
                      className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-500 block mb-1">Chassis Compatibility</label>
                    <input
                      type="text"
                      value={editingVehicle.specs?.chassisCompatibility || ''}
                      onChange={(e) =>
                        setEditingVehicle({
                          ...editingVehicle,
                          specs: { ...(editingVehicle.specs as any), chassisCompatibility: e.target.value },
                        })
                      }
                      className="w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold cursor-pointer border border-slate-200 dark:border-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20 active:scale-95 transition cursor-pointer flex items-center gap-2"
                >
                  {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>Save Vehicle</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
