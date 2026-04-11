'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';

export default function LocationSection() {
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Map */}
          <div className="reveal">
            <div className="aspect-[4/3] overflow-hidden border border-white/5">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3610.365843722979!2d55.26936807675294!3d25.190882131954044!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f682b63d4390f%3A0xb13255ceb5dfe7b5!2sMizu%20Restaurant!5e0!3m2!1sen!2sae!4v1771576887823!5m2!1sen!2sae"
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg)' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Mizu Restaurant location on Google Maps"
              ></iframe>
            </div>
          </div>

          {/* Info */}
          <div className="lg:pl-8">
            <div className="section-divider reveal"></div>
            <span className="text-sm uppercase tracking-widest-3 text-white/40 mb-3 block reveal font-medium">
              Find Us
            </span>
            <h2 className="font-display text-4xl md:text-6xl text-white font-light mb-10 leading-tight reveal">
              Visit the <span className="italic text-primary">Flagship</span>
            </h2>

            <div className="space-y-8 mb-10">
              <div className="flex gap-4 items-start reveal">
                <Icon name="MapPinIcon" size={18} variant="outline" className="text-primary mt-1 shrink-0" />
                <div>
                  <h4 className="text-sm uppercase tracking-widest-2 text-white/40 mb-1 font-medium">Address</h4>
                  <p className="font-display text-lg text-white font-light">
                    Parking No. 8, Claren Towers – G Floor<br />
                    Sheikh Mohammed bin Rashid Blvd<br />
                    Downtown Dubai, UAE
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start reveal">
                <Icon name="ClockIcon" size={18} variant="outline" className="text-primary mt-1 shrink-0" />
                <div>
                  <h4 className="text-sm uppercase tracking-widest-2 text-white/40 mb-1 font-medium">Hours</h4>
                  <p className="font-display text-lg text-white font-light">
                    Thursday – Wednesday<br />
                    11:00 AM – 2:00 AM
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start reveal">
                <Icon name="PhoneIcon" size={18} variant="outline" className="text-primary mt-1 shrink-0" />
                <div>
                  <h4 className="text-sm uppercase tracking-widest-2 text-white/40 mb-1 font-medium">Contact</h4>
                  <p className="font-display text-lg text-white font-light">+971 4 454 2706</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 reveal">
              <a
                href="https://wa.me/97144542706?text=I'd like to make a reservation at Mizu"
                target="_blank"
                rel="noopener noreferrer"
                className="whatsapp-btn"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                WhatsApp Us
              </a>
              <Link href="/reservations" className="btn-ghost">
                Book a Table
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}