import React from 'react';

export default function QuoteSection() {
  return (
    <section className="py-32 bg-[#080808] border-y border-white/5 relative z-10 overflow-hidden">
      <span className="kanji-bg left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 opacity-10 select-none pointer-events-none">美</span>
      <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
        <span className="font-display text-6xl text-primary/20 block mb-6">"</span>
        <p className="font-display text-3xl md:text-5xl text-white font-light italic leading-tight mb-10">
          The finest sushi is not about the most expensive fish. It is about the perfect harmony between rice, fish, and the chef's spirit.
        </p>
        <div className="flex items-center justify-center gap-4">
          <div className="w-12 h-px bg-white/20"></div>
          <span className="text-sm uppercase tracking-widest-2 text-white/40 font-medium">Mizu</span>
          <div className="w-12 h-px bg-white/20"></div>
        </div>
      </div>
    </section>);

}