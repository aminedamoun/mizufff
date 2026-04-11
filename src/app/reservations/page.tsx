import React from 'react';
import type { Metadata } from 'next';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import ReservationForm from './components/ReservationForm';

export const metadata: Metadata = {
  title: 'Reservations – Mizu Japanese Restaurant | Downtown Dubai',
  description:
    'Reserve your table at Mizu. Online booking available. Open daily 11 AM – 2 AM at Claren Towers, Downtown Dubai.',
};

export default function ReservationsPage() {
  return (
    <main className="bg-black min-h-screen">
      <div className="noise-overlay"></div>
      <Header />

      {/* Page Header */}
      <section className="pt-40 pb-20 px-6 bg-black border-b border-white/5 relative overflow-hidden">
        <span className="kanji-bg right-0 top-0 opacity-30 select-none pointer-events-none">予</span>
        <div className="max-w-[1400px] mx-auto relative z-10">
          <span className="text-xs uppercase tracking-widest-3 text-white/40 mb-4 block animate-slide-down font-medium">
            水 · Table Booking
          </span>
          <h1 className="font-display text-6xl md:text-8xl text-white font-light leading-none animate-hero-1">
            Reserve a <span className="italic text-primary">Table</span>
          </h1>
          <p className="text-white/50 text-base mt-6 max-w-lg animate-hero-2 font-medium">
            Book your dining experience at Mizu. For groups of 10+, please contact us directly for private dining arrangements.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 px-6">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            {/* Form */}
            <div className="lg:col-span-2">
              <ReservationForm />
            </div>

            {/* Sidebar Info */}
            <div className="lg:col-span-1 space-y-10">
              <div className="border border-white/5 p-8">
                <h3 className="font-display text-2xl text-white font-light italic mb-6">Hours</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm uppercase tracking-widest-2 text-white/50 font-medium">Thu – Wed</span>
                    <span className="text-sm uppercase tracking-widest-2 text-white font-medium">11 AM – 2 AM</span>
                  </div>
                  <div className="w-full h-px bg-white/5"></div>
                  <p className="text-sm text-white/40 leading-relaxed font-medium">
                    Last seating at 1:00 AM. Kitchen closes at 1:30 AM.
                  </p>
                </div>
              </div>

              <div className="border border-white/5 p-8">
                <h3 className="font-display text-2xl text-white font-light italic mb-6">Location</h3>
                <p className="text-sm text-white/60 leading-relaxed mb-4 font-medium">
                  Parking No. 8, Claren Towers – G Floor<br />
                  Sheikh Mohammed bin Rashid Blvd<br />
                  Downtown Dubai, UAE
                </p>
                <a
                  href="https://maps.app.goo.gl/oKEodvKKJbEXeMD76"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs uppercase tracking-widest-2 text-primary hover:text-white transition-colors hover-line font-medium"
                >
                  Get Directions
                </a>
              </div>

              <div className="border border-primary/20 p-8 bg-primary/5">
                <h3 className="font-display text-2xl text-white font-light italic mb-4">Private Dining</h3>
                <p className="text-sm text-white/50 leading-relaxed mb-5 font-medium">
                  Hosting a special event? We offer exclusive private dining experiences for groups of 10 or more.
                </p>
                <a
                  href="https://wa.me/97144542706?text=I'm interested in private dining at Mizu for a group"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs uppercase tracking-widest-2 text-primary hover:text-white transition-colors hover-line font-medium"
                >
                  Enquire Now
                </a>
              </div>

              <div className="border border-white/5 p-8">
                <h3 className="font-display text-2xl text-white font-light italic mb-4">Dress Code</h3>
                <p className="text-sm text-white/50 leading-relaxed font-medium">
                  Smart casual. We ask that guests maintain an elegant appearance in keeping with the Mizu dining experience.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}