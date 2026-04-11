'use client';

import React, { useEffect, useRef, useState } from 'react';
import AppImage from '@/components/ui/AppImage';
import { aboutImagesService, type AboutPageImage } from '@/lib/services/aboutImagesService';

const defaultMilestones = [
{
  id: 'ms_1',
  imageKey: 'story_2018',
  year: '2018',
  title: 'Founded in Dubai',
  description: 'Mizu opened its doors in Downtown Dubai, bringing authentic Tokyo omakase culture to the UAE.',
  image: "/images/about/mizuabtext.webp",
  alt: 'Mizu Japanese Cuisine restaurant founded in Downtown Dubai'
},
{
  id: 'ms_2',
  imageKey: 'story_2020',
  year: '2020',
  title: 'Expanded the Omakase Bar',
  description: "Added a dedicated 8-seat omakase counter, creating an intimate chef's table experience.",
  image: "/images/restaurant/ext4.webp",
  alt: 'Mizu expanded omakase bar with warm ambient lighting'
},
{
  id: 'ms_3',
  imageKey: 'story_2022',
  year: '2022',
  title: 'Named Best Japanese in Dubai',
  description: "Recognized by Dubai\'s culinary community for excellence in authentic Japanese cuisine.",
  image: "/images/about/best.webp",
  alt: 'Award-winning sushi platter at Mizu Dubai'
},
{
  id: 'ms_4',
  imageKey: 'story_2024',
  year: '2024',
  title: 'Our Expert Sushi Chefs',
  description: 'Our Mizu chefs prepare fresh sushi right in front of guests at the counter, creating an authentic and interactive dining experience.',
  image: "/images/about/chef.webp",
  alt: 'Mizu expert sushi chef preparing fresh sushi'
},
{
  id: 'ms_5',
  imageKey: 'story_2026',
  year: '2026',
  title: 'Continuing the Journey',
  description: 'Mizu remains committed to the art of sushi, serving Downtown Dubai daily from 11 AM to 2 AM.',
  image: "/images/about/mizuabtext-1.webp",
  alt: 'Elegant sushi presentation at Mizu restaurant'
}];


export default function StorySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [dbImages, setDbImages] = useState<Record<string, AboutPageImage>>({});

  useEffect(() => {
    aboutImagesService.getAllImages().then((imgs) => {
      const map: Record<string, AboutPageImage> = {};
      imgs.forEach((img) => {map[img.imageKey] = img;});
      setDbImages(map);
    });
  }, []);

  const milestones = defaultMilestones.map((ms) => ({
    ...ms,
    image: (dbImages[ms.imageKey]?.imageUrl || '') !== '' ? dbImages[ms.imageKey].imageUrl : ms.image,
    alt: (dbImages[ms.imageKey]?.imageAlt || '') !== '' ? dbImages[ms.imageKey].imageAlt : ms.alt,
  }));

  useEffect(() => {
    const handleScroll = () => {
      if (!timelineRef?.current) return;

      const timelineElement = timelineRef?.current;
      const rect = timelineElement?.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      const start = rect?.top - windowHeight + 200;
      const end = rect?.bottom - 200;
      const total = end - start;
      const current = -start;

      const progress = Math.max(0, Math.min(100, current / total * 100));
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('.reveal').forEach((el, i) => {
              setTimeout(() => el.classList.add('revealed'), i * 100);
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
        <div className="max-w-3xl mx-auto text-center mb-24">
          <div className="section-divider mx-auto reveal"></div>
          <span className="text-xs uppercase tracking-widest-3 text-white/40 mb-4 block reveal font-medium">Our Journey</span>
          <h2 className="font-display text-5xl md:text-7xl text-white font-light leading-tight reveal">
            The <span className="italic text-primary">Mizu</span> Story
          </h2>
        </div>

        {/* Timeline */}
        <div ref={timelineRef} className="relative">
          <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-0.5 bg-white/10 hidden md:block">
            <div
              className="absolute inset-0 w-2 -left-[3px] bg-gradient-to-b from-primary/30 via-primary/20 to-transparent blur-sm"
              style={{ height: `${scrollProgress}%` }}>
            </div>
            <div
              className="relative w-full bg-gradient-to-b from-primary via-primary/90 to-primary/60 shadow-[0_0_20px_rgba(220,38,38,0.5)] transition-all duration-300 ease-out"
              style={{ height: `${scrollProgress}%` }}>
            </div>
          </div>

          <div className="space-y-32 md:space-y-40">
            {milestones?.map((ms, i) => {
              const milestoneProgress = Math.max(0, Math.min(100, scrollProgress - i * 20));
              const isActive = milestoneProgress > 0;

              return (
                <div
                  key={ms?.id}
                  className="reveal relative"
                  style={{
                    opacity: isActive ? 1 : 0.4,
                    transform: isActive ? 'translateY(0)' : 'translateY(30px)',
                    transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}>
                  
                  <div className={`flex flex-col ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-12 md:gap-16`}>
                    
                    {/* Content side */}
                    <div className={`flex-1 ${i % 2 === 0 ? 'md:text-right md:pr-16' : 'md:text-left md:pl-16'} space-y-6`}>
                      <div>
                        <span className="font-display text-7xl md:text-8xl text-white/15 font-light block mb-4 tracking-tight">{ms?.year}</span>
                        <h3 className="font-display text-3xl md:text-4xl text-white font-light italic mb-4 leading-tight">{ms?.title}</h3>
                        <p className="text-lg md:text-xl text-white/60 leading-relaxed max-w-md font-normal">
                          {ms?.description}
                        </p>
                      </div>
                    </div>
                    
                    {/* Animated dot */}
                    <div className="relative shrink-0 hidden md:flex z-20">
                      {isActive &&
                      <div className="absolute inset-0 flex items-center justify-center">
                          <div
                          className="w-24 h-24 border-2 border-primary/30 animate-ping"
                          style={{ transform: 'rotate(45deg)', animationDuration: '2s' }}>
                        </div>
                        </div>
                      }
                      {isActive &&
                      <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-20 h-20 bg-primary/20 blur-xl" style={{ transform: 'rotate(45deg)' }}></div>
                        </div>
                      }
                      <div
                        className="w-16 h-16 border-[3px] flex items-center justify-center relative z-10 bg-black transition-all duration-700 shadow-lg"
                        style={{
                          borderColor: isActive ? '#DC2626' : 'rgba(220, 38, 38, 0.3)',
                          transform: isActive ? 'scale(1.15) rotate(45deg)' : 'scale(1) rotate(0deg)',
                          boxShadow: isActive ? '0 0 30px rgba(220, 38, 38, 0.6), inset 0 0 20px rgba(220, 38, 38, 0.1)' : 'none'
                        }}>
                        <div
                          className="w-5 h-5 bg-primary transition-all duration-700"
                          style={{
                            opacity: isActive ? 1 : 0.3,
                            transform: isActive ? 'scale(1) rotate(-45deg)' : 'scale(0.5) rotate(-45deg)',
                            boxShadow: isActive ? '0 0 15px rgba(220, 38, 38, 0.8)' : 'none'
                          }}>
                        </div>
                      </div>
                    </div>
                    
                    {/* Image side */}
                    <div className="flex-1">
                      <div
                        className={`relative overflow-hidden border-2 ${i % 2 === 0 ? 'md:mr-auto' : 'md:ml-auto'} max-w-lg w-full`}
                        style={{
                          borderColor: isActive ? 'rgba(220, 38, 38, 0.3)' : 'rgba(255, 255, 255, 0.1)',
                          transform: isActive ? 'scale(1)' : 'scale(0.95)',
                          opacity: isActive ? 1 : 0.6,
                          transition: 'all 0.9s cubic-bezier(0.4, 0, 0.2, 1) 0.2s',
                          boxShadow: isActive ? '0 10px 40px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(220, 38, 38, 0.1)' : 'none'
                        }}>
                        <div className="aspect-[4/3] relative group">
                          <AppImage
                            src={ms?.image}
                            alt={ms?.alt}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                          <div className="absolute inset-0 border-2 border-primary/0 group-hover:border-primary/30 transition-all duration-500"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>);

            })}
          </div>
        </div>
      </div>
    </section>);

}