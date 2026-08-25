"use client";

import { CheckCircle2, ChevronRight } from "lucide-react";
import { useState } from "react";
import { Reveal } from "@/components/website/Reveal";

const BRAND_NOTES: Record<string, string> = {
  samsung: "QLED backlight, T-con and Smart Hub",
  lg: "OLED care, webOS and power board",
  sony: "Bravia processor, no-picture and audio",
  mi: "PatchWall, Wi-Fi and mainboard",
  tcl: "Google TV, LED strips and power",
  panasonic: "Viera boards and inverter faults",
  oneplus: "Smart board, apps and display",
  vu: "Backlight, smart board and ports",
};

export function BrandsStrip({ heading, items }: { heading?: string; items: string[] }) {
  const brands = items.filter(Boolean);
  const [active, setActive] = useState(0);
  if (!brands.length) return null;
  const current = brands[active];
  const note = BRAND_NOTES[current.toLowerCase()] || "Panel, board and software diagnosis";

  return (
    <section className="section-pad bg-paper">
      <div className="container-wide">
        <Reveal>
          <p className="eyebrow">Trusted across brands</p>
          <div className="mt-2 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <h2 className="max-w-xl wrap-break-word font-display text-2xl sm:text-3xl md:text-4xl">{heading || "Brands we service"}</h2>
            <p className="max-w-sm text-sm leading-6 text-muted sm:text-right">Experienced technicians for common faults across the brands Noida homes use every day.</p>
          </div>
        </Reveal>

        <div className="mt-8 grid gap-5 lg:grid-cols-[1fr_0.8fr] lg:items-stretch lg:gap-8">
          <Reveal className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {brands.map((brand, index) => {
              const selected = index === active;
              return (
                <button
                  key={brand}
                  type="button"
                  onClick={() => setActive(index)}
                  aria-pressed={selected}
                  className={`group flex min-h-24 items-center justify-between border p-4 text-left transition duration-200 sm:min-h-28 sm:p-5 ${selected ? "border-navy bg-navy text-white shadow-soft" : "border-line bg-white text-ink hover:border-copper"}`}
                >
                  <span>
                    <span className={`block text-xs font-bold uppercase tracking-[0.15em] ${selected ? "text-copper" : "text-muted"}`}>Brand</span>
                    <span className="mt-2 block font-display text-lg sm:text-xl">{brand}</span>
                  </span>
                  <ChevronRight size={17} className={`transition group-hover:translate-x-1 ${selected ? "text-copper" : "text-muted"}`} />
                </button>
              );
            })}
          </Reveal>

          <Reveal delay={90} className="h-full">
            <div className="flex h-full flex-col justify-between border-l-4 border-copper bg-navy p-6 text-white sm:p-8">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-copper">Selected brand</p>
                <h3 className="mt-3 font-display text-3xl">{current}</h3>
                <p className="mt-3 max-w-sm text-sm leading-6 text-white/70">{note}</p>
              </div>
              <p className="mt-8 inline-flex items-center gap-2 text-sm font-semibold"><CheckCircle2 size={17} className="text-copper" /> Doorstep diagnosis available in Noida</p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
