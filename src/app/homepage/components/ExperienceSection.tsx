'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { imageService, type RestaurantImage } from '@/lib/services/imageService';

export default function ExperienceSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [galleryImages, setGalleryImages] = useState<RestaurantImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [galleryOffset, setGalleryOffset] = useState(0);

  const VISIBLE_COUNT = 6;

  useEffect(() => {
    loadGalleryImages();
  }, []);

  const loadGalleryImages = async () => {
    try {
      const data = await imageService.getActiveImages();
      setGalleryImages(data);
    } catch (error) {
      console.error('Failed to load gallery images:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('.reveal').forEach((el, i) => {
              setTimeout(() => el.classList.add('revealed'), i * 100);
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    if (sectionRef?.current) observer?.observe(sectionRef?.current);
    return () => observer?.disconnect();
  }, []);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
    document.body.style.overflow = 'unset';
  };

  const lightboxPrev = useCallback(() => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex - 1 + galleryImages.length) % galleryImages.length);
  }, [lightboxIndex, galleryImages.length]);

  const lightboxNext = useCallback(() => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex + 1) % galleryImages.length);
  }, [lightboxIndex, galleryImages.length]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === 'ArrowLeft') lightboxPrev();
      if (e.key === 'ArrowRight') lightboxNext();
      if (e.key === 'Escape') closeLightbox();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [lightboxIndex, lightboxPrev, lightboxNext]);

  const galleryPrev = () => {
    setGalleryOffset((prev) => Math.max(0, prev - VISIBLE_COUNT));
  };

  const galleryNext = () => {
    setGalleryOffset((prev) =>
      prev + VISIBLE_COUNT < galleryImages.length ? prev + VISIBLE_COUNT : prev
    );
  };

  const visibleImages = galleryImages.slice(galleryOffset, galleryOffset + VISIBLE_COUNT);
  const canGoPrev = galleryOffset > 0;
  const canGoNext = galleryOffset + VISIBLE_COUNT < galleryImages.length;

  const currentLightboxImage = lightboxIndex !== null ? galleryImages[lightboxIndex] : null;

  return (
    <>
    <section id="experience" ref={sectionRef} className="py-32 bg-[#080808] relative z-10">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div>
            <div className="section-divider reveal"></div>
            <span className="text-sm uppercase tracking-widest-3 text-white/40 mb-3 block reveal font-medium">
              The Atmosphere
            </span>
            <h2 className="font-display text-5xl md:text-7xl text-white font-light leading-tight reveal">
              Experience <span className="italic text-primary">Mizu</span>
            </h2>
          </div>
          <div className="flex items-center gap-4">
            {/* Gallery Prev/Next Arrows */}
            {galleryImages.length > VISIBLE_COUNT && (
              <div className="flex items-center gap-2">
                <button
                  onClick={galleryPrev}
                  disabled={!canGoPrev}
                  className={`w-10 h-10 border flex items-center justify-center transition-all ${
                    canGoPrev
                      ? 'border-white/30 text-white hover:border-primary hover:text-primary' :'border-white/10 text-white/20 cursor-not-allowed'
                  }`}
                  aria-label="Previous images"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={galleryNext}
                  disabled={!canGoNext}
                  className={`w-10 h-10 border flex items-center justify-center transition-all ${
                    canGoNext
                      ? 'border-white/30 text-white hover:border-primary hover:text-primary' :'border-white/10 text-white/20 cursor-not-allowed'
                  }`}
                  aria-label="Next images"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}
            <Link
              href="/about"
              className="hover-line text-sm uppercase tracking-widest-2 text-white/50 hover:text-white transition-colors reveal font-medium">
              Our Story
            </Link>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center text-white/40 py-20">
            Loading gallery...
          </div>
        )}

        {/* No Images State */}
        {!loading && galleryImages.length === 0 && (
          <div className="text-center text-white/40 py-20">
            <p>No gallery images available.</p>
            <p className="text-sm mt-2">Add images from the admin panel to display them here.</p>
          </div>
        )}

        {/* 3-column gallery grid */}
        {!loading && galleryImages.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 reveal">
            {visibleImages?.map((img, idx) => (
              <div
                key={img?.id}
                className="image-zoom overflow-hidden aspect-[4/3] transition-all duration-500 relative group cursor-pointer"
                onClick={() => openLightbox(galleryOffset + idx)}
              >
                <AppImage
                  src={img?.imageUrl}
                  alt={img?.imageAlt}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="transform scale-0 group-hover:scale-100 transition-transform duration-300 ease-out">
                    <MagnifyingGlassIcon className="w-12 h-12 text-white drop-shadow-lg" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Gallery pagination dots */}
        {galleryImages.length > VISIBLE_COUNT && (
          <div className="flex justify-center gap-2 mt-6">
            {Array.from({ length: Math.ceil(galleryImages.length / VISIBLE_COUNT) }).map((_, i) => (
              <button
                key={i}
                onClick={() => setGalleryOffset(i * VISIBLE_COUNT)}
                className={`w-2 h-2 rounded-full transition-all ${
                  Math.floor(galleryOffset / VISIBLE_COUNT) === i ? 'bg-primary w-6' : 'bg-white/20 hover:bg-white/40'
                }`}
                aria-label={`Go to page ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>

    {/* Lightbox Modal */}
    {currentLightboxImage && lightboxIndex !== null && (
      <div
        className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
        onClick={closeLightbox}
      >
        {/* Close button */}
        <button
          onClick={closeLightbox}
          className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors z-10"
          aria-label="Close lightbox"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Prev button */}
        <button
          onClick={(e) => { e.stopPropagation(); lightboxPrev(); }}
          className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-12 h-12 border border-white/30 text-white hover:border-primary hover:text-primary transition-all flex items-center justify-center z-10 bg-black/50"
          aria-label="Previous image"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Next button */}
        <button
          onClick={(e) => { e.stopPropagation(); lightboxNext(); }}
          className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-12 h-12 border border-white/30 text-white hover:border-primary hover:text-primary transition-all flex items-center justify-center z-10 bg-black/50"
          aria-label="Next image"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Image */}
        <div
          className="relative max-w-7xl max-h-[85vh] w-full flex items-center justify-center"
          onClick={(e) => e.stopPropagation()}
        >
          <AppImage
            src={currentLightboxImage.imageUrl}
            alt={currentLightboxImage.imageAlt}
            className="max-h-[85vh] w-auto object-contain"
          />
        </div>

        {/* Counter */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/50 text-sm">
          {lightboxIndex + 1} / {galleryImages.length}
        </div>
      </div>
    )}
    </>
  );
}
