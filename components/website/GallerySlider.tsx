"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Expand, Images } from "lucide-react";

interface GalleryImage {
  id: number;
  image_url: string;
  alt_text?: string;
  caption?: string;
}

export function GallerySlider({ images }: { images: GalleryImage[] }) {
  const slides = images.slice(0, 8);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (slides.length < 2 || paused) return;
    const timer = window.setInterval(() => setActive((index) => (index + 1) % slides.length), 3500);
    return () => window.clearInterval(timer);
  }, [slides.length, paused]);

  if (!slides.length) return null;
  const current = slides[active];
  const move = (direction: -1 | 1) => setActive((index) => (index + direction + slides.length) % slides.length);

  return (
    <section className="section-pad bg-cream" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="container-wide">
        <div className="mb-6 flex flex-col justify-between gap-3 sm:mb-8 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow"><Images size={14} /> Our work</p>
            <h2 className="mt-2 font-display text-2xl sm:text-3xl md:text-4xl">Repair work gallery</h2>
          </div>
          <p className="max-w-sm text-sm leading-6 text-muted sm:text-right">A closer look at the TVs, boards and repair work handled by our team.</p>
        </div>

        <div className="relative overflow-hidden border border-line bg-navy p-2 shadow-soft sm:p-3">
          <div className="relative aspect-4/3 overflow-hidden bg-[#dfe9da] sm:aspect-16/8">
            <div className="flex h-full transition-transform duration-700 ease-out" style={{ transform: `translateX(-${active * 100}%)` }}>
            {slides.map((slide, index) => (
              <div key={slide.id} className="relative flex h-full min-w-full items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={slide.image_url} alt={slide.alt_text || slide.caption || "TV repair work"} className="h-full w-full object-contain" loading={index === active ? "eager" : "lazy"} decoding="async" />
              </div>
            ))}
            </div>
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-linear-to-t from-black/70 to-transparent" />
            {current.caption ? <p className="absolute bottom-4 left-4 right-4 text-sm font-semibold text-white sm:bottom-6 sm:left-7 sm:text-base">{current.caption}</p> : null}
            <span className="absolute right-3 top-3 inline-flex items-center gap-1.5 border border-white/30 bg-navy/70 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-white backdrop-blur-sm"><Expand size={12} /> {String(active + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}</span>
          </div>
          <button type="button" onClick={() => move(-1)} aria-label="Previous gallery image" className="absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-navy/80 text-white backdrop-blur-sm transition hover:border-copper hover:text-copper sm:left-6"><ChevronLeft size={20} /></button>
          <button type="button" onClick={() => move(1)} aria-label="Next gallery image" className="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-navy/80 text-white backdrop-blur-sm transition hover:border-copper hover:text-copper sm:right-6"><ChevronRight size={20} /></button>
        </div>

        <div className="mt-4 flex justify-center gap-2" role="tablist" aria-label="Gallery images">
          {slides.map((slide, index) => <button key={slide.id} type="button" role="tab" aria-selected={index === active} aria-label={`Show gallery image ${index + 1}`} onClick={() => setActive(index)} className={`h-2 rounded-full transition-all ${index === active ? "w-8 bg-copper" : "w-2 bg-navy/25 hover:bg-navy/50"}`} />)}
        </div>
      </div>
    </section>
  );
}
