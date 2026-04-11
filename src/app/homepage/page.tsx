import React from 'react';
import type { Metadata } from 'next';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';

import HeroSection from './components/HeroSection';
import FeaturedMenu from './components/FeaturedMenu';
import OffersSection from './components/OffersSection';
import MarqueeSection from './components/MarqueeSection';
import ExperienceSection from './components/ExperienceSection';
import LocationSection from './components/LocationSection';

export const metadata: Metadata = {
  title: 'Mizu – Authentic Japanese Sushi | Downtown Dubai',
  description:
    'Experience premium omakase sushi and Japanese cuisine at Mizu, located in Claren Towers, Downtown Dubai. Open daily 11 AM – 2 AM.',
  keywords: 'Mizu, sushi Dubai, Japanese restaurant Dubai, omakase Dubai, Downtown Dubai restaurant',
};

export default function Homepage() {
  return (
    <main className="min-h-screen bg-black">
      <div className="noise-overlay"></div>
      <Header />
      <HeroSection />
      <FeaturedMenu />
      <OffersSection />
      <ExperienceSection />
      <LocationSection />
      <MarqueeSection />
      <Footer />
    </main>
  );
}