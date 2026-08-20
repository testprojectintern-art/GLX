'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';

interface LightboxGalleryProps {
  images: string[];
  title: string;
}

export default function LightboxGallery({ images, title }: LightboxGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => setSelectedIndex(index);
  const closeLightbox = () => setSelectedIndex(null);

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex - 1 + images.length) % images.length);
    }
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex + 1) % images.length);
    }
  };

  return (
    <div>
      {/* Thumbnail Grid — 2 cols on mobile, 3 cols on desktop */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-2.5 sm:gap-4">
        {images.map((img, idx) => (
          <div
            key={idx}
            onClick={() => openLightbox(idx)}
            className="group relative h-36 sm:h-56 md:h-60 rounded-xl sm:rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 dark:border-slate-800 cursor-pointer hover:border-amber-500/60 transition shadow-sm hover:shadow-lg"
          >
            <Image
              src={img}
              alt={`${title} photo ${idx + 1}`}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-slate-950/10 group-hover:bg-slate-950/40 transition-colors flex items-center justify-center">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-slate-900/80 backdrop-blur-md text-amber-400 flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:scale-110 transition duration-300 shadow-lg">
                <Maximize2 className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
            </div>
            <div className="absolute bottom-1.5 right-1.5 sm:bottom-2 sm:right-2 px-2 py-0.5 rounded-md bg-slate-950/85 text-[9px] sm:text-[10px] text-slate-300 backdrop-blur-sm border border-slate-800">
              {idx + 1}/{images.length}
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedIndex !== null && (
        <div
          onClick={closeLightbox}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
        >
          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="absolute top-5 right-5 p-3 rounded-full bg-slate-900/80 text-white hover:bg-slate-800 transition z-10"
            aria-label="Close Lightbox"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Navigation Buttons */}
          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 sm:left-8 p-3 rounded-full bg-slate-900/80 text-white hover:bg-slate-800 hover:text-amber-400 transition z-10"
                aria-label="Previous Photo"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 sm:right-8 p-3 rounded-full bg-slate-900/80 text-white hover:bg-slate-800 hover:text-amber-400 transition z-10"
                aria-label="Next Photo"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Main Large Image Container */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-5xl w-full max-h-[85vh] h-[75vh] flex flex-col items-center justify-center"
          >
            <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl border border-slate-800">
              <Image
                src={images[selectedIndex]}
                alt={`${title} - Expanded Image`}
                fill
                className="object-contain"
              />
            </div>
            <div className="mt-4 text-center">
              <p className="text-white font-semibold text-sm sm:text-base">{title}</p>
              <p className="text-xs text-slate-400 mt-0.5">
                Image {selectedIndex + 1} of {images.length}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
