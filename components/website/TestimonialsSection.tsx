import { BadgeCheck, MapPin, Star } from "lucide-react";
import type { Testimonial } from "@/models";
import { Reveal } from "@/components/website/Reveal";

export function TestimonialsSection({
  heading,
  items,
}: {
  heading?: string;
  items: Testimonial[];
}) {
  const reviews = items.slice(0, 6);
  if (!reviews.length) return null;

  return (
    <section className="section-pad bg-cream">
      <div className="container-wide">
        <Reveal>
          <div className="flex flex-col justify-between gap-4 border-b border-line pb-6 sm:flex-row sm:items-end">
            <div>
              <p className="eyebrow">Customer notes</p>
              <h2 className="mt-2 wrap-break-word font-display text-2xl sm:text-3xl md:text-4xl">{heading || "What customers say"}</h2>
            </div>
            <p className="max-w-sm text-sm leading-6 text-muted sm:text-right">Real feedback from TV owners across Noida and nearby service areas.</p>
          </div>
        </Reveal>

        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review, index) => (
            <Reveal key={review.id} delay={index * 60} className="h-full">
              <article className="flex h-full flex-col border border-line bg-white p-5 shadow-[0_16px_35px_-28px_rgba(7,18,7,0.8)] transition duration-300 hover:-translate-y-1 hover:border-copper/50 sm:p-6">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex gap-0.5 text-copper" aria-label={`${review.rating} out of 5 stars`}>
                    {Array.from({ length: review.rating }).map((_, star) => <Star key={star} size={15} fill="currentColor" />)}
                  </div>
                  <BadgeCheck size={18} className="text-copper" aria-label="Verified visit" />
                </div>
                <blockquote className="mt-5 flex-1 font-display text-lg leading-8 text-ink">“{review.review}”</blockquote>
                <footer className="mt-6 flex items-center gap-3 border-t border-line pt-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-navy text-sm font-bold text-copper">
                    {review.customer_name.slice(0, 1)}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold">{review.customer_name}</span>
                    {review.location ? <span className="mt-0.5 inline-flex items-center gap-1 text-xs text-muted"><MapPin size={12} />{review.location}</span> : null}
                  </span>
                </footer>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
