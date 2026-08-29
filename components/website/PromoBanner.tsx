import Link from "next/link";
import { ArrowRight, Tag } from "lucide-react";
import { CmsImage } from "@/components/website/CmsImage";

export function PromoBanner() {
  return (
    <section className="section-pad pb-0 bg-paper">
      <div className="container-wide">
        <div className="relative overflow-hidden rounded-2xl bg-navy text-white shadow-soft">
          <CmsImage
            src="/images/tv-banner.jpg"
            alt="TV Repair Offer"
            className="absolute inset-0 h-full w-full object-cover opacity-40 mix-blend-overlay"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/80 to-transparent" />
          
          <div className="relative z-10 flex flex-col justify-center px-6 py-10 sm:px-12 sm:py-16 md:w-2/3 lg:w-1/2">
            <span className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-copper/30 bg-copper/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-copper backdrop-blur-sm">
              <Tag size={14} />
              Limited Time Offer
            </span>
            <h2 className="font-display text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
              Flat 20% Off on <br /> Panel Replacements
            </h2>
            <p className="mt-4 max-w-md text-sm text-white/80 sm:text-base">
              Get your TV screen replaced with original panels at the best price. Free doorstep pickup and delivery in Delhi NCR.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/book-service" className="btn-primary inline-flex items-center gap-2 border-none bg-copper text-white hover:bg-copper/90">
                Claim Offer <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
