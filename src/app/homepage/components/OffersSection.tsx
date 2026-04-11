'use client';

import React, { useEffect, useState } from 'react';
import AppImage from '@/components/ui/AppImage';
import { offerService, type Offer } from '@/lib/services/offerService';

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = rating >= star;
        const halfFilled = !filled && rating >= star - 0.5;
        return (
          <svg
            key={star}
            className={`w-4 h-4 ${
              filled ? 'text-primary' : halfFilled ? 'text-primary/60' : 'text-white/20'
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        );
      })}
      <span className="text-xs text-white/40 ml-1">{rating?.toFixed(1)}</span>
    </div>
  );
}

export default function OffersSection() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOffers();
  }, []);

  const loadOffers = async () => {
    try {
      const data = await offerService.getActiveOffers();
      setOffers(data);
    } catch (error) {
      console.error('Failed to load offers:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-24 bg-black relative z-10">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="text-center text-white/40">Loading offers...</div>
        </div>
      </section>
    );
  }

  if (offers.length === 0) {
    return null;
  }

  return (
    <section className="py-24 bg-black relative z-10">
      <div className="max-w-[1400px] mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="section-divider mx-auto"></div>
          <span className="text-sm uppercase tracking-widest-3 text-white/40 mb-3 block font-medium">
            Limited Time
          </span>
          <h2 className="font-display text-5xl md:text-7xl text-white font-light leading-tight">
            Special <span className="italic text-primary">Offers</span>
          </h2>
        </div>

        {/* Offers Grid - 2 columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {offers?.map((offer) => (
            <div key={offer?.id} className="offer-card group">
              <div className="image-zoom aspect-[16/10] overflow-hidden relative">
                <AppImage
                  src={offer?.imageUrl}
                  alt={offer?.imageAlt}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <div className="mb-3">
                  <StarRating rating={offer?.rating ?? 5} />
                </div>
                <h3 className="font-display text-2xl md:text-3xl text-white mb-3 font-light">
                  {offer?.title}
                </h3>
                <p className="text-base text-white/50 leading-relaxed mb-5">
                  {offer?.description}
                </p>
                <a
                  href={`https://wa.me/97144542706?text=I'd like to order: ${encodeURIComponent(offer?.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm uppercase tracking-widest-2 text-white/40 hover:text-white transition-colors hover-line"
                >
                  Order
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}