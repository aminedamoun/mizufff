'use client';

import React, { useEffect, useState } from 'react';
import AppImage from '@/components/ui/AppImage';
import Link from 'next/link';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import { deliverySettingsService, type DeliveryPartner } from '@/lib/services/deliverySettingsService';

const defaultPartners: DeliveryPartner[] = [
  {
    id: 'talabat',
    partnerKey: 'talabat',
    partnerName: 'Talabat',
    imageUrl: '/assets/images/talabat_partner.webp',
    imageAlt: 'Talabat food delivery platform logo',
    partnerUrl: 'https://www.talabat.com/uae/tonos-restaurant',
    isActive: true,
    createdAt: '',
    updatedAt: '',
  },
  {
    id: 'deliveroo',
    partnerKey: 'deliveroo',
    partnerName: 'Deliveroo',
    imageUrl: '/assets/images/deliveroo_partner.webp',
    imageAlt: 'Deliveroo food delivery platform logo',
    partnerUrl: 'https://deliveroo.ae/menu/dubai/downtown-dubai-mall/tonos-restaurant',
    isActive: true,
    createdAt: '',
    updatedAt: '',
  },
];

const infoCards = [
  {
    title: 'Delivery Coverage',
    desc: "Downtown Dubai, Business Bay, DIFC, Dubai Marina, JBR, Palm Jumeirah, Jumeirah, Deira & more major areas.",
  },
  {
    title: 'Delivery Hours',
    desc: "Daily 11 AM – 2:30 AM. Order late and we'll still deliver fresh flavors to your door.",
  },
  {
    title: 'Minimum Order',
    desc: 'Minimum order amount depends on your location and the delivery platform you choose.',
  },
];

const paymentMethods = [
  { label: 'Cash on Delivery' },
  { label: 'Credit / Debit Cards' },
  { label: 'Apple Pay / Google Pay' },
  { label: 'Delivery App Payments' },
];

const steps = [
  { num: '01', label: 'Browse the Menu' },
  { num: '02', label: 'Choose Your Dishes' },
  { num: '03', label: 'Place Your Order' },
  { num: '04', label: 'Track Your Delivery' },
  { num: '05', label: 'Enjoy Fresh Food' },
];

const trackingSteps = [
  { label: 'Order Placed' },
  { label: 'Preparing' },
  { label: 'On the Way' },
  { label: 'Delivered' },
];

const trackingFeatures = [
  'Order confirmed instantly',
  'Kitchen prepares your meal',
  'Rider picks up your order',
  'Live GPS tracking on the way',
  'Notification when arrived',
];

export default function DeliveryPage() {
  const [etaCount, setEtaCount] = useState(12);
  const [activeStep, setActiveStep] = useState(2);
  const [partners, setPartners] = useState<DeliveryPartner[]>(defaultPartners);

  useEffect(() => {
    deliverySettingsService.getAllPartners().then((data) => {
      if (data && data.length > 0) setPartners(data);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setEtaCount((prev) => (prev <= 1 ? 12 : prev - 1));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev >= 3 ? 0 : prev + 1));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen bg-black overflow-x-hidden">
      <div className="noise-overlay" />
      <Header />

      {/* ── HERO ── */}
      <section className="pt-40 pb-20 px-6 bg-black border-b border-white/5 relative overflow-hidden">
        <span className="kanji-bg right-0 top-0 opacity-20 select-none pointer-events-none">配</span>
        <div className="max-w-[1400px] mx-auto relative z-10">
          <span className="text-[10px] uppercase tracking-widest text-white/30 mb-4 block animate-slide-down">
            水 · Fast Delivery Available
          </span>
          <h1 className="font-display text-6xl md:text-8xl text-white font-light leading-none animate-hero-1">
            Delivered to <span className="italic text-primary">Your Door.</span>
          </h1>
          <p className="text-white/40 text-sm mt-6 max-w-xl animate-hero-2">
            Authentic Japanese cuisine crafted with precision, packaged with care, and delivered straight to you — hot, fresh, and on time.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-8 animate-hero-3">
            <a
              href="https://wa.me/971581391113"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-red"
            >
              Order via WhatsApp
            </a>
            <Link href="/menu" className="btn-ghost">
              View Full Menu
            </Link>
          </div>
        </div>
      </section>

      {/* ── DELIVERY PARTNERS ── */}
      <section className="py-24 px-6 border-b border-white/5">
        <div className="max-w-[1400px] mx-auto">
          <div className="mb-16">
            <span className="text-[10px] uppercase tracking-widest text-white/30 mb-3 block">Order Anywhere</span>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <h2 className="font-display text-4xl md:text-5xl text-white font-light">
                Our Delivery <span className="italic text-primary">Partners</span>
              </h2>
              <p className="text-white/40 text-sm max-w-xs leading-relaxed">
                Find us on all major food delivery platforms. Order through your favourite app.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
            {partners.map((partner, i) => (
              <div
                key={partner.id}
                className="group border border-white/10 bg-[#0D0D0D] hover:border-white/20 transition-all duration-500 overflow-hidden"
                style={{ transitionDelay: `${i * 0.1}s` }}
              >
                <div className="relative aspect-square w-full bg-[#111] overflow-hidden">
                  <AppImage
                    src={partner.imageUrl}
                    alt={partner.imageAlt}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700 w-full h-full"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
                <div className="p-6 border-t border-white/5">
                  <h3 className="font-display text-2xl text-white font-light mb-1">{partner.partnerName}</h3>
                  <p className="text-white/30 text-xs uppercase tracking-widest mb-5">Order on {partner.partnerName}</p>
                  <a
                    href={partner.partnerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-red w-full text-center block"
                  >
                    Order on {partner.partnerName}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DELIVERY INFORMATION ── */}
      <section className="py-24 px-6 border-b border-white/5">
        <div className="max-w-[1400px] mx-auto">
          <div className="mb-16">
            <span className="text-[10px] uppercase tracking-widest text-white/30 mb-3 block">Good to Know</span>
            <h2 className="font-display text-4xl md:text-5xl text-white font-light">
              Delivery <span className="italic text-primary">Information</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/5">
            {infoCards.map((card, i) => (
              <div
                key={card.title}
                className="bg-black p-8 md:p-10 group hover:bg-[#0D0D0D] transition-colors duration-300"
                style={{ transitionDelay: `${i * 0.1}s` }}
              >
                <span className="text-[10px] text-primary/60 font-mono tracking-widest block mb-4">0{i + 1}</span>
                <h3 className="font-display text-xl text-white font-light mb-3">{card.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{card.desc}</p>
                <div className="mt-6 w-8 h-px bg-primary group-hover:w-16 transition-all duration-500" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PREMIUM PACKAGING ── */}
      <section className="py-24 px-6 border-b border-white/5 bg-[#080808]">
        <div className="max-w-[1400px] mx-auto">
          <span className="text-[10px] uppercase tracking-widest text-white/30 mb-3 block">Premium Quality</span>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="font-display text-4xl md:text-5xl text-white font-light mb-6">
                Packed with <span className="italic text-primary">Perfection</span>
              </h2>
              <p className="text-white/40 text-sm leading-relaxed mb-8 max-w-lg">
                Every dish leaves our kitchen in premium, food-grade packaging designed to lock in freshness, preserve presentation, and arrive at your door exactly as it left our hands — beautiful and delicious.
              </p>
              <div className="flex flex-wrap gap-3">
                {['Temperature Sealed', 'Eco-Friendly', 'Presentation Ready', 'Leak-Proof'].map((tag) => (
                  <span key={tag} className="text-[11px] text-white/50 border border-white/10 bg-white/5 px-4 py-2 tracking-wide">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="relative flex items-center justify-center">
              <div className="w-64 h-64 border border-white/10 relative flex items-center justify-center">
                <div className="absolute inset-4 border border-white/5" />
                <div className="absolute inset-8 border border-primary/20" />
                <span className="font-display text-7xl text-white/10 select-none">水</span>
                <div className="absolute -top-3 -right-3 w-6 h-6 bg-primary" />
                <div className="absolute -bottom-3 -left-3 w-6 h-6 border border-white/20" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PAYMENT OPTIONS ── */}
      <section className="py-24 px-6 border-b border-white/5">
        <div className="max-w-[1400px] mx-auto">
          <div className="mb-16">
            <span className="text-[10px] uppercase tracking-widest text-white/30 mb-3 block">Flexible Payments</span>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <h2 className="font-display text-4xl md:text-5xl text-white font-light">
                Payment <span className="italic text-primary">Options</span>
              </h2>
              <p className="text-white/40 text-sm max-w-xs">We accept all major payment methods for your convenience.</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/5">
            {paymentMethods.map((method, i) => (
              <div
                key={method.label}
                className="bg-black p-8 text-center group hover:bg-[#0D0D0D] transition-colors duration-300"
                style={{ transitionDelay: `${i * 0.08}s` }}
              >
                <span className="text-[10px] text-primary/60 font-mono tracking-widest block mb-4">0{i + 1}</span>
                <p className="text-white/60 text-xs uppercase tracking-widest leading-relaxed">{method.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-24 px-6 border-b border-white/5 bg-[#080808]">
        <div className="max-w-[1400px] mx-auto">
          <div className="mb-16">
            <span className="text-[10px] uppercase tracking-widest text-white/30 mb-3 block">Simple Process</span>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <h2 className="font-display text-4xl md:text-5xl text-white font-light">
                How It <span className="italic text-primary">Works</span>
              </h2>
              <p className="text-white/40 text-sm max-w-xs">Getting your favourite Japanese food delivered is as easy as 1-2-3.</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-px bg-white/5">
            {steps.map((step, i) => (
              <div
                key={step.num}
                className="bg-[#080808] p-6 md:p-8 group hover:bg-[#0D0D0D] transition-colors duration-300 relative overflow-hidden"
                style={{ transitionDelay: `${i * 0.08}s` }}
              >
                <span className="text-[10px] text-primary/60 font-mono tracking-widest block mb-4">{step.num}</span>
                <p className="text-white/70 text-sm font-light leading-snug">{step.label}</p>
                <div className="mt-4 w-6 h-px bg-primary/40 group-hover:w-12 transition-all duration-500" />
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute right-0 top-1/2 w-px h-8 bg-white/10 -translate-y-1/2" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── REAL-TIME TRACKING ── */}
      <section className="py-24 px-6 border-b border-white/5">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-white/30 mb-3 block">Live Updates</span>
              <h2 className="font-display text-4xl md:text-5xl text-white font-light mb-6">
                Real-Time Order <span className="italic text-primary">Tracking</span>
              </h2>
              <p className="text-white/40 text-sm leading-relaxed mb-8 max-w-md">
                Once your order is confirmed, you can track it live — from our kitchen to your doorstep. No more guessing. Just sit back and get ready to enjoy.
              </p>
              <ul className="space-y-3">
                {trackingFeatures.map((feat) => (
                  <li key={feat} className="flex items-center gap-3 text-sm text-white/60">
                    <span className="w-4 h-4 border border-primary/60 flex items-center justify-center flex-shrink-0">
                      <span className="w-1.5 h-1.5 bg-primary block" />
                    </span>
                    {feat}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex justify-center lg:justify-end">
              <div className="relative w-64 md:w-72">
                <div className="border border-white/10 bg-[#0A0A0A] rounded-[2.5rem] overflow-hidden shadow-2xl shadow-black/60">
                  <div className="flex justify-center pt-4 pb-2">
                    <div className="w-20 h-5 bg-black rounded-full border border-white/10" />
                  </div>
                  <div className="px-5 pb-8 pt-2">
                    <div className="flex items-center justify-between mb-5">
                      <span className="text-white text-xs font-semibold tracking-wide">Mizu Delivery</span>
                      <span className="text-[10px] text-primary border border-primary/30 px-2 py-0.5 animate-pulse">
                        Live
                      </span>
                    </div>
                    <div className="bg-white/5 border border-white/10 p-3 mb-5 text-center">
                      <p className="text-[10px] text-white/30 uppercase tracking-widest mb-1">Estimated Arrival</p>
                      <p className="text-white font-display text-2xl font-light">
                        {etaCount} <span className="text-sm text-white/40">min</span>
                      </p>
                    </div>
                    <div className="bg-[#111] h-28 mb-5 relative overflow-hidden flex items-center justify-center border border-white/5">
                      <div
                        className="absolute inset-0 opacity-20"
                        style={{
                          backgroundImage:
                            'repeating-linear-gradient(0deg, transparent, transparent 20px, rgba(255,255,255,0.05) 20px, rgba(255,255,255,0.05) 21px), repeating-linear-gradient(90deg, transparent, transparent 20px, rgba(255,255,255,0.05) 20px, rgba(255,255,255,0.05) 21px)',
                        }}
                      />
                      <div className="relative z-10 flex flex-col items-center gap-1">
                        <span className="text-xs text-white/30 uppercase tracking-widest">On the way</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {trackingSteps.map((step, i) => (
                        <div key={step.label} className="flex items-center gap-3">
                          <div
                            className={`w-2 h-2 flex-shrink-0 transition-all duration-500 ${
                              i === activeStep
                                ? 'bg-primary scale-125'
                                : i < activeStep
                                ? 'bg-primary/40' :'bg-white/10'
                            }`}
                          />
                          <span
                            className={`text-[11px] transition-colors duration-500 ${
                              i === activeStep
                                ? 'text-white'
                                : i < activeStep
                                ? 'text-white/40 line-through' :'text-white/20'
                            }`}
                          >
                            {step.label}
                          </span>
                          {i === activeStep && (
                            <span className="ml-auto text-[9px] text-primary animate-pulse">●</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-primary/20 border border-primary/30" />
                <div className="absolute -bottom-4 -left-4 w-6 h-6 border border-white/10" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="py-24 bg-black border-t border-white/5">
        <div className="max-w-[1400px] mx-auto px-6 text-center">
          <h2 className="font-display text-4xl md:text-6xl text-white font-light italic mb-6">
            Ready to Order?
          </h2>
          <p className="text-white/40 text-sm mb-8 max-w-md mx-auto">
            Authentic Japanese flavors are just a few taps away. Order now and experience the taste of Mizu at home.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/menu" className="btn-red">View Full Menu</Link>
            <a
              href="https://wa.me/971581391113"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost"
            >
              Order on WhatsApp
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
