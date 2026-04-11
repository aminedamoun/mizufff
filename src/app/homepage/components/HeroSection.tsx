'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

export default function HeroSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoUrl, setVideoUrl] = useState('/images/hero/banner-video.mp4');

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data.banner_video_url) setVideoUrl(data.banner_video_url);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (videoRef?.current) {
      videoRef.current.load();
      videoRef.current.play()?.catch(() => {});
    }
  }, [videoUrl]);

  return (
    <section className="relative min-h-[70vh] sm:min-h-screen flex items-center justify-center overflow-hidden bg-black py-8 sm:py-0">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline>
          <source
            src={videoUrl}
            type="video/mp4" />
        </video>
        <div className="video-overlay absolute inset-0"></div>
      </div>

      {/* Main content */}
      <div className="relative z-20 text-center px-4 sm:px-6 max-w-6xl mx-auto w-full">
        <div className="animate-hero-2 flex flex-col items-center justify-center gap-3 sm:gap-6">
          {/* Mizu Logo */}
          <div className="w-48 h-48 sm:w-56 sm:h-56 md:w-72 md:h-72 lg:w-80 lg:h-80 flex items-center justify-center">
            <img
              src="/assets/images/banner_logo-1774603943117.webp"
              alt="Mizu Logo"
              className="w-full h-full object-contain" />
          </div>
        </div>

        <div className="animate-hero-4 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mt-6 sm:mt-10 md:mt-12">
          <Link href="/reservations" className="btn-red w-full sm:w-auto text-center">
            Reserve a Table
          </Link>
          <Link href="/menu" className="btn-ghost w-full sm:w-auto text-center">
            View Menu
          </Link>
        </div>

        {/* Hours badge */}
        <div className="animate-hero-5 mt-6 sm:mt-10 md:mt-12 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3">
          <span className="text-[9px] uppercase tracking-widest-2 text-white font-black text-center">Open Daily</span>
          <span className="red-sep hidden sm:inline-block"></span>
          <span className="text-[9px] uppercase tracking-widest-2 text-white font-black text-center">11 AM – 2 AM</span>
          <span className="red-sep hidden sm:inline-block"></span>
          <span className="text-[9px] uppercase tracking-widest-2 text-white font-black text-center">DOWNTOWN, DUBAI</span>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 animate-hero-5">
        <div className="scroll-line"></div>
      </div>
    </section>);

}
