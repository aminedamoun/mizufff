import React from 'react';
import type { Metadata } from 'next';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import ContactForm from './components/ContactForm';

export const metadata: Metadata = {
  title: 'Contact – Mizu Japanese Restaurant | Downtown Dubai',
  description:
    'Get in touch with Mizu. Visit us at Claren Towers, Downtown Dubai. Phone: +971 4 454 2706. Email: media.mizu@gmail.com',
};

export default function ContactPage() {
  return (
    <main className="bg-black min-h-screen">
      <div className="noise-overlay"></div>
      <Header />

      {/* Page Header */}
      <section className="pt-40 pb-20 px-6 bg-black border-b border-white/5 relative overflow-hidden">
        <span className="kanji-bg right-0 top-0 opacity-20 select-none pointer-events-none">連</span>
        <div className="max-w-[1400px] mx-auto relative z-10">
          <span className="text-[10px] uppercase tracking-widest-3 text-white/30 mb-4 block animate-slide-down">
            水 · Get in Touch
          </span>
          <h1 className="font-display text-6xl md:text-8xl text-white font-light leading-none animate-hero-1">
            Contact <span className="italic text-primary">Us</span>
          </h1>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 px-6">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
            {/* Left: Info */}
            <div>
              <div className="section-divider mb-6"></div>
              <h2 className="font-display text-4xl text-white font-light italic mb-10">
                Visit the Flagship
              </h2>

              {/* Map */}
              <div className="aspect-[4/3] overflow-hidden border border-white/5 mb-10">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3610.365843722979!2d55.26936807675294!3d25.190882131954044!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f682b63d4390f%3A0xb13255ceb5dfe7b5!2sMizu%20Restaurant!5e0!3m2!1sen!2sae!4v1771576887823!5m2!1sen!2sae"
                  width="100%"
                  height="100%"
                  style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg)' }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Mizu Restaurant Google Maps location"
                ></iframe>
              </div>

              {/* Contact Details */}
              <div className="space-y-8">
                <div>
                  <h4 className="text-[9px] uppercase tracking-widest-2 text-white/30 mb-2">Address</h4>
                  <p className="font-display text-lg text-white font-light">
                    Parking No. 8, Claren Towers – G Floor<br />
                    Sheikh Mohammed bin Rashid Blvd<br />
                    Burj Khalifa, Downtown Dubai, UAE
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-[9px] uppercase tracking-widest-2 text-white/30 mb-2">Phone</h4>
                    <a href="tel:+97144542706" className="font-display text-lg text-white font-light hover:text-primary transition-colors">
                      +971 4 454 2706
                    </a>
                  </div>
                  <div>
                    <h4 className="text-[9px] uppercase tracking-widest-2 text-white/30 mb-2">Email</h4>
                    <a href="mailto:media.mizu@gmail.com" className="font-display text-lg text-white font-light hover:text-primary transition-colors break-all">
                      media.mizu@gmail.com
                    </a>
                  </div>
                </div>
                <div>
                  <h4 className="text-[9px] uppercase tracking-widest-2 text-white/30 mb-2">Hours</h4>
                  <p className="font-display text-lg text-white font-light">
                    Thursday – Wednesday: 11:00 AM – 2:00 AM
                  </p>
                </div>
                <div>
                  <h4 className="text-[9px] uppercase tracking-widest-2 text-white/30 mb-3">Follow Us</h4>
                  <div className="flex gap-6">
                    <a
                      href="https://instagram.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] uppercase tracking-widest-2 text-white/40 hover:text-white transition-colors border-b border-transparent hover:border-primary pb-1"
                    >
                      Instagram
                    </a>
                    <a
                      href={`https://wa.me/97144542706`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] uppercase tracking-widest-2 text-white/40 hover:text-white transition-colors border-b border-transparent hover:border-primary pb-1"
                    >
                      WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Form */}
            <div>
              <div className="section-divider mb-6"></div>
              <h2 className="font-display text-4xl text-white font-light italic mb-10">
                Send an Enquiry
              </h2>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}