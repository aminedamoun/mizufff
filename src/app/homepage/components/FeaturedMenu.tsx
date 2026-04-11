'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';

const featuredItems = [
{
  id: 'feat_1',
  name: 'Dragon Roll',
  description: 'Tempura shrimp, avocado, cucumber topped with thinly sliced avocado and tobiko',
  price: 'AED 85',
  image: "/images/mizu/DSC02254-Edit.webp",
  alt: 'Mizu Dragon Roll with avocado and tobiko on wooden board',
  tag: 'Signature'
},
{
  id: 'feat_2',
  name: 'Bluefin Tuna Sashimi',
  description: 'Premium bluefin tuna, aged 7 days, served with freshly grated wasabi and pickled ginger',
  price: 'AED 120',
  image: "/images/mizu/DSC03000.webp",
  alt: 'Fresh salmon sashimi served on wooden plate at Mizu',
  tag: 'Premium'
},
{
  id: 'feat_3',
  name: 'Omakase Set',
  description: 'Chef\'s selection of 12-piece nigiri featuring the finest seasonal catches, daily curated',
  price: 'AED 280',
  image: "/images/mizu/DSC02706.webp",
  alt: 'Mizu sushi boat platter with assorted signature rolls',
  tag: 'Chef\'s Choice'
},
{
  id: 'feat_4',
  name: 'Wagyu Nigiri',
  description: 'A5 Japanese Wagyu beef torched with yuzu butter glaze, served on hand-pressed shari',
  price: 'AED 95',
  image: "/images/mizu/DSC02912-Edit.webp",
  alt: 'Premium signature rolls platter at Mizu restaurant',
  tag: 'A5 Grade'
}];


export default function FeaturedMenu() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
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
  }, []);

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
                src={item?.image}
                alt={item?.alt}
                className="w-full h-full object-cover" />
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between mb-2">
                  <span className="text-xs uppercase tracking-widest-2 text-primary font-semibold">
                    {item?.tag}
                  </span>
                  <span className="price-tag">{item?.price}</span>
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