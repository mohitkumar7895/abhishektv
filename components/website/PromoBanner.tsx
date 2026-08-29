import Link from "next/link";
import { CmsImage } from "@/components/website/CmsImage";

export function PromoBanner({ image }: { image?: string }) {
  return (
    <section className="section-pad pb-0 bg-paper">
      <div className="container-wide">
        <Link href="/book-service" className="block relative overflow-hidden rounded-2xl bg-navy shadow-soft hover:opacity-95 transition-opacity">
          <div className="relative aspect-[21/9] w-full sm:aspect-[3/1]">
            <CmsImage
              src={image || "/images/tv-banner.jpg"}
              alt="TV Repair Offer"
              className="absolute inset-0 h-full w-full object-cover"
              sizes="100vw"
            />
          </div>
        </Link>
      </div>
    </section>
  );
}
