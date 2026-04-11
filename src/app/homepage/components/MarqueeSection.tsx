import React from 'react';

const items = [
  'Omakase Experience',
  '水',
  'Premium Sashimi',
  '寿司',
  'Signature Rolls',
  '刺身',
  'Downtown Dubai',
  '日本料理',
];

export default function MarqueeSection() {
  return (
    <section className="py-12 bg-[#0A0A0A] border-y border-white/5 overflow-hidden relative z-10">
      <div className="flex overflow-hidden">
        <div className="marquee-track">
          {[...items, ...items, ...items, ...items]?.map((item, i) => (
            <span
              key={`m-${i}`}
              className="font-display text-3xl md:text-5xl font-light text-white/10 mx-8 whitespace-nowrap italic"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}