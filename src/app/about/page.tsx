import React from 'react';
import type { Metadata } from 'next';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import PhilosophySection from './components/PhilosophySection';
import StorySection from './components/StorySection';
import QuoteSection from './components/QuoteSection';

export const metadata: Metadata = {
  title: 'About – Mizu Japanese Restaurant | Downtown Dubai',
  description:
    'Discover the story of Mizu — authentic Japanese omakase culture brought to Downtown Dubai. Our philosophy, journey, and culinary vision.',
};

export default function AboutPage() {
  return (
    <main className="bg-black min-h-screen">
      <div className="noise-overlay"></div>
      <Header />

      {/* Page Header */}
      <section className="pt-40 pb-20 px-6 bg-black border-b border-white/5 relative overflow-hidden">
        <span className="kanji-bg right-0 top-0 opacity-20 select-none pointer-events-none">水</span>
        <div className="max-w-[1400px] mx-auto relative z-10">
          <span className="text-[10px] uppercase tracking-widest-3 text-white/30 mb-4 block animate-slide-down">
            水 · Our Story
          </span>
          <h1 className="font-display text-6xl md:text-8xl text-white font-light leading-none animate-hero-1">
            About <span className="italic text-primary">Mizu</span>
          </h1>
          <p className="text-white/40 text-sm mt-6 max-w-xl animate-hero-2">
            水 (Mizu) means water in Japanese — fluid, essential, ever-changing. Like water, our cuisine adapts to the seasons while remaining true to its origins.
          </p>
        </div>
      </section>

      <StorySection />
      <QuoteSection />
      <PhilosophySection />

      {/* CTA */}
      <section className="py-24 bg-black border-t border-white/5">
        <div className="max-w-[1400px] mx-auto px-6 text-center">
          <h2 className="font-display text-4xl md:text-6xl text-white font-light italic mb-6">
            Come taste the difference
          </h2>
          <p className="text-white/40 text-sm mb-8 max-w-md mx-auto">
            Reserve your table and experience the Mizu philosophy firsthand.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/reservations" className="btn-red">Reserve a Table</a>
            <a href="/menu" className="btn-ghost">View Menu</a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}