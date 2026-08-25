"use client";

import { useEffect, useState } from "react";
import { CmsImage } from "@/components/website/CmsImage";

export function HeroBackground({ images }: { images: string[] }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (images.length < 2) return;
    const timer = window.setInterval(() => setActive((index) => (index + 1) % images.length), 5000);
    return () => window.clearInterval(timer);
  }, [images.length]);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {images.map((image, index) => (
        <div key={image} className={`absolute inset-0 transition-opacity duration-1000 ${index === active ? "opacity-100" : "opacity-0"}`}>
          <CmsImage src={image} alt="" className="object-cover" sizes="100vw" priority={index === 0} />
        </div>
      ))}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(15,35,17,0.86)_0%,rgba(15,35,17,0.62)_48%,rgba(15,35,17,0.34)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(15,35,17,0.68)_0%,transparent_55%,rgba(15,35,17,0.2)_100%)]" />
    </div>
  );
}