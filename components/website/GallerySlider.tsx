"use client";

import { useEffect, useRef, useState } from "react";
import { Images } from "lucide-react";

interface GalleryImage {
  id: number;
  image_url: string;
  alt_text?: string;
  caption?: string;
}

export function GallerySlider({ images }: { images: GalleryImage[] }) {
  const baseSlides = images.slice(0, 10);
  const slides = [...baseSlides, ...baseSlides];
  
  if (!baseSlides.length) return null;

  return (
    <section className="section-pad bg-cream overflow-hidden">
      <div className="container-wide">
        <div className="mb-6 flex flex-col justify-between gap-3 sm:mb-8 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow"><Images size={14} /> Our work</p>
            <h2 className="mt-2 font-display text-2xl sm:text-3xl md:text-4xl">Repair work gallery</h2>
          </div>
          <p className="max-w-sm text-sm leading-6 text-muted sm:text-right">A closer look at the TVs, boards and repair work handled by our team.</p>
        </div>

        {/* Horizontal Slider */}
        <div className="overflow-hidden w-full -mx-4 sm:-mx-6 md:mx-0 px-4 sm:px-6 md:px-0">
          <div className="flex gap-4 w-max animate-marquee hover:[animation-play-state:paused]">
          {slides.map((slide, i) => (
            <div 
              key={`${slide.id}-${i}`} 
              className="group relative aspect-4/3 w-[260px] shrink-0 overflow-hidden rounded-xl bg-navy shadow-soft sm:w-[320px] md:w-[360px]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={slide.image_url} 
                alt={slide.alt_text || slide.caption || "TV repair work"} 
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" 
                loading="lazy" 
                decoding="async" 
              />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-navy/90 via-navy/40 to-transparent opacity-80" />
              {slide.caption && (
                <p className="absolute bottom-4 left-4 right-4 text-sm font-medium text-white sm:bottom-5 sm:left-5">
                  {slide.caption}
                </p>
              )}
            </div>
          ))}
          </div>
        </div>
      </div>
    </section>
  );
}
