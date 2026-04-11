'use client';

import React, { useEffect, useRef, useState } from 'react';
import AppImage from '@/components/ui/AppImage';
import { aboutImagesService, type AboutPageImage } from '@/lib/services/aboutImagesService';

const values = [
  { id: 'val_1', title: 'Sourced with Integrity', description: 'Every fish is sourced from sustainable fisheries and trusted suppliers who share our commitment to ocean health.' },
  { id: 'val_2', title: 'Crafted with Precision', description: 'Our itamae (sushi chefs) train for years to master the delicate balance of temperature, texture, and seasoning.' },
  { id: 'val_3', title: 'Served with Respect', description: 'We honor the Japanese tradition of omotenashi — wholehearted hospitality that anticipates every need.' }
];

const DEFAULT_MAIN = '/images/about/mastery.webp';
const DEFAULT_SECONDARY = '/images/about/mastery1.webp';

export default function PhilosophySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [dbImages, setDbImages] = useState<Record<string, AboutPageImage>>({});

  useEffect(() => {
    aboutImagesService.getAllImages().then((imgs) => {
      const map: Record<string, AboutPageImage> = {};
      imgs.forEach((img) => { map[img.imageKey] = img; });
      setDbImages(map);
    });
  }, []);

  const mainImage = (dbImages['philosophy_main']?.imageUrl || '') !== '' ? dbImages['philosophy_main'].imageUrl : DEFAULT_MAIN;
  const mainAlt = (dbImages['philosophy_main']?.imageAlt || '') !== '' ? dbImages['philosophy_main'].imageAlt : 'Mizu head chef preparing omakase nigiri with precise hand movements';
  const secondaryImage = (dbImages['philosophy_secondary']?.imageUrl || '') !== '' ? dbImages['philosophy_secondary'].imageUrl : DEFAULT_SECONDARY;
  const secondaryAlt = (dbImages['philosophy_secondary']?.imageAlt || '') !== '' ? dbImages['philosophy_secondary'].imageAlt : 'Close up of sushi preparation tools and fresh fish on cutting board';

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('.reveal').forEach((el, i) => {
              setTimeout(() => el.classList.add('revealed'), i * 130);
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
    <section ref={sectionRef} className="py-32 bg-[#080808] relative z-10">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          {/* Images */}
          <div className="relative reveal">
            <div className="aspect-[3/4] overflow-hidden border border-white/5">
              <AppImage
                src={mainImage}
                alt={mainAlt}
                className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity duration-700" />
            </div>
            <div className="absolute -bottom-10 -right-6 w-2/3 aspect-square bg-black border border-white/5 p-4 hidden md:block">
              <AppImage
                src={secondaryImage}
                alt={secondaryAlt}
                className="w-full h-full object-cover transition-all duration-700 opacity-60 hover:opacity-100" />
            </div>
          </div>

          {/* Text */}
          <div className="lg:pl-8 lg:pb-20">
            <div className="section-divider reveal"></div>
            <span className="text-sm uppercase tracking-widest-3 text-white/40 mb-3 block reveal font-medium">
              Our Philosophy
            </span>
            <h2 className="font-display text-5xl md:text-6xl text-white font-light leading-tight mb-8 reveal">
              Mastery in <br /><span className="italic text-primary">Every Detail</span>
            </h2>
            <p className="text-white/50 text-lg leading-relaxed mb-12 reveal font-medium">
              At Mizu, we believe sushi is not merely food — it is a conversation between chef and guest, a meditation on seasonality, and a tribute to centuries of Japanese artistry. Every grain of rice, every slice of fish, every brushstroke of soy is intentional.
            </p>
            <ul className="space-y-6">
              {values?.map((val) =>
                <li key={val?.id} className="flex items-start gap-4 group reveal">
                  <span className="w-8 h-px bg-primary mt-3 group-hover:w-12 transition-all shrink-0"></span>
                  <div>
                    <h4 className="text-sm uppercase tracking-widest-2 text-white mb-1 font-semibold">{val?.title}</h4>
                    <p className="text-base text-white/50 leading-relaxed font-medium">{val?.description}</p>
                  </div>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}