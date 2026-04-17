'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import { menuService, type MenuItem } from '@/lib/services/menuService';

const SIGNATURE_CATEGORY_ID = 'cat-008-mizu-speciality-maki';
const FEATURED_COUNT = 4;

export default function FeaturedMenu() {
  const sectionRef = useRef<HTMLElement>(null);
  const [featuredItems, setFeaturedItems] = useState<MenuItem[]>([]);

  useEffect(() => {
    menuService.getAllItems().then((items) => {
      const signatures = items
        .filter((i) => i.categoryId === SIGNATURE_CATEGORY_ID && i.isAvailable)
        .sort((a, b) => a.displayOrder - b.displayOrder)
        .slice(0, FEATURED_COUNT);
      setFeaturedItems(signatures);
    });
  }, []);

  useEffect(() => {
    if (featuredItems.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('.reveal').forEach((el, i) => {
              setTimeout(() => el.classList.add('revealed'), i * 120);
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    if (sectionRef?.current) observer?.observe(sectionRef?.current);
    return () => observer?.disconnect();
  }, [featuredItems]);

  return (
    <section ref={sectionRef} className="py-32 bg-black relative z-10">
      <div className="max-w-[1400px] mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-6">
          <div>
            <div className="section-divider reveal"></div>
            <span className="text-sm uppercase tracking-widest-3 text-white/40 mb-3 block reveal font-medium">
              Seasonal Signatures
            </span>
            <h2 className="font-display text-5xl md:text-7xl text-white font-light leading-tight reveal">
              Mizu <span className="italic text-primary">Signatures</span>
            </h2>
          </div>
          <Link
            href="/menu"
            className="inline-flex items-center gap-3 bg-primary text-white px-8 py-4 text-sm uppercase tracking-widest-2 font-semibold hover:bg-primary/90 transition-all duration-300 reveal shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:scale-105">
            Full Menu
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 stagger-children">
          {featuredItems?.map((item) =>
          <div key={item?.id} className="menu-card group reveal">
              <div className="image-zoom aspect-[4/3] overflow-hidden relative">
                <AppImage
                src={item?.imageUrl}
                alt={item?.imageAlt || item?.name}
                className="w-full h-full object-cover" />
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between mb-2">
                  <span className="text-xs uppercase tracking-widest-2 text-primary font-semibold">
                    {item?.tag || 'Signature'}
                  </span>
                  <span className="price-tag">AED {item?.price}</span>
                </div>
                <h3 className="font-display text-xl text-white mb-2 font-light">{item?.name}</h3>
                <p className="text-base text-white/40 leading-relaxed mb-4">{item?.description}</p>
                <a
                href={`https://wa.me/97144542706?text=I'd like to order: ${encodeURIComponent(item?.name)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm uppercase tracking-widest-2 text-white/40 hover:text-white transition-colors hover-line">

                  Order
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );

}