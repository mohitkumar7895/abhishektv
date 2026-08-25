import { Fragment } from "react";
import Link from "next/link";
import { ArrowUpRight, CheckCircle2, Phone, ShieldCheck } from "lucide-react";
import type { PageSection } from "@/models";
import type { Faq, Service, Testimonial } from "@/models";
import type { SettingsMap } from "@/types";
import { ContactForm } from "@/components/forms/ContactForm";
import { FAQSection } from "@/components/website/FAQSection";
import { TestimonialsSection } from "@/components/website/TestimonialsSection";
import { ServiceCard } from "@/components/website/ServiceCard";
import { BrandsStrip } from "@/components/website/BrandsStrip";
import { BookingSection } from "@/components/website/BookingSection";
import { SiteLink } from "@/components/website/SiteLink";
import { FeaturesSection } from "@/components/website/FeaturesSection";
import { StatsSection } from "@/components/website/StatsSection";
import { OfferSlider } from "@/components/website/OfferSlider";
import { Reveal } from "@/components/website/Reveal";
import { phoneHref } from "@/lib/utils/cn";
import { sanitizeHtml } from "@/lib/utils/sanitize";
import { resolveWorkImage, SITE_IMAGES } from "@/lib/site-images";
import { applySettingsTokens } from "@/lib/site-settings";
import { CmsImage } from "@/components/website/CmsImage";
import { HeroBackground } from "@/components/website/HeroBackground";

export interface RendererExtras {
  services: Service[];
  faqs: Faq[];
  testimonials: Testimonial[];
  settings: SettingsMap;
}

export function PageRenderer({
  sections,
  extras,
  homeVariant = false,
}: {
  sections: PageSection[];
  extras: RendererExtras;
  homeVariant?: boolean;
}) {
  const visible = sections.filter((s) => s.is_visible);
  return (
    <>
      {visible.map((section) => (
        <Fragment key={section.id || `${section.type}-${section.sort_order}`}>
          <Section section={section} extras={extras} homeVariant={homeVariant} />
          {section.type === "hero" && section.content.showBookingForm ? (
            <BookingSection settings={extras.settings} source="hero" />
          ) : null}
        </Fragment>
      ))}
    </>
  );
}

function Section({ section, extras, homeVariant }: { section: PageSection; extras: RendererExtras; homeVariant: boolean }) {
  const c = section.content;
  const settings = extras.settings;
  const align = section.settings?.alignment === "center" ? "text-center mx-auto" : "";
  const str = (key: string, fallback = "") => {
    const value = c[key];
    const text = typeof value === "string" ? value : fallback;
    return applySettingsTokens(text, settings);
  };
  const img = (key: string) => resolveWorkImage(str(key));

  if (section.type === "hero") {
    const badges = Array.isArray(c.badges) ? (c.badges as string[]) : [];
    const image = img("image");
    return (
      <section className={`relative isolate overflow-hidden bg-navy text-white ${homeVariant ? "home-hero" : ""}`}>
        <div className="page-hero-mesh pointer-events-none absolute inset-0" />
        {homeVariant ? <HeroBackground images={[SITE_IMAGES.hero, SITE_IMAGES.bench, SITE_IMAGES.soldering, SITE_IMAGES.screen, SITE_IMAGES.smart]} /> : null}
        <div className={`container-wide relative z-10 grid min-w-0 items-center gap-5 py-7 sm:gap-8 sm:py-10 md:gap-10 md:py-12 lg:gap-12 lg:py-20 ${image && !homeVariant ? "md:grid-cols-2" : ""} ${c.showBookingForm ? "pb-10 sm:pb-14 lg:pb-24" : ""}`}>
          <div className={`min-w-0 ${homeVariant ? "home-hero-copy mx-auto w-full max-w-3xl text-center" : ""}`}>
            <p className="eyebrow">{str("eyebrow", "Doorstep TV Repair")}</p>
            <h1 className={`mt-2 max-w-lg wrap-break-word font-display text-[1.75rem] leading-[1.1] sm:mt-3 sm:text-[2rem] md:text-[2.25rem] lg:text-[3.2rem] ${homeVariant ? "mx-auto" : ""}`}>
              {str("heading")}
            </h1>
            <p className={`mt-2 max-w-lg text-[0.95rem] leading-6 text-white/90 sm:mt-3 sm:text-base sm:leading-7 md:mt-4 md:text-lg ${homeVariant ? "mx-auto" : ""}`}>
              {str("description")}
            </p>
            <div className={`mt-4 flex flex-col gap-2 min-[480px]:flex-row min-[480px]:flex-wrap sm:mt-7 sm:gap-3 ${homeVariant ? "justify-center" : ""}`}>
              <SiteLink href={str("primaryHref", "/book-service")} className="btn-primary w-full min-[480px]:w-auto" source="hero">
                {str("primaryLabel", "Book a Repair")}
              </SiteLink>
              <SiteLink
                href={str("secondaryHref", "/contact")}
                className="btn-outline w-full border-white/40 text-white hover:bg-white hover:text-navy min-[480px]:w-auto"
                source="hero"
              >
                {str("secondaryLabel", "Call Now")}
              </SiteLink>
            </div>
            <p className="mt-4 max-w-lg text-sm leading-6 text-white/85">{str("availabilityText")}</p>
          </div>
          {image && !homeVariant ? (
            <div className={`relative aspect-16/10 overflow-hidden rounded-2xl sm:aspect-4/3 ${homeVariant ? "home-hero-frame" : ""}`}>
              <CmsImage src={image} alt="" sizes="(max-width: 768px) 100vw, 50vw" priority />
              <div className="absolute inset-0 bg-linear-to-t from-navy/40 to-transparent" />
              {homeVariant ? <span className="absolute bottom-3 left-3 rounded-md border border-copper/40 bg-navy/85 px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-copper backdrop-blur-sm">Noida service desk</span> : null}
            </div>
          ) : null}
          {badges.length ? (
            <div className={`flex flex-wrap gap-2 ${homeVariant ? "justify-center" : "md:col-span-2"}`}>
              {badges.map((badge) => (
                <span
                  key={badge}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-white/12 px-3 py-1.5 text-xs font-medium text-white"
                >
                  <CheckCircle2 size={13} className="text-copper" />
                  {badge}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </section>
    );
  }

  if (section.type === "text" || section.type === "rich_text") {
    return (
      <section className="section-pad">
        <div className={`container-narrow ${align}`}>
          {str("heading") ? <h2 className="wrap-break-word font-display text-2xl sm:text-3xl md:text-4xl">{str("heading")}</h2> : null}
          <div
            className="prose-site mt-5"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(str("html") || str("body") || str("description")) }}
          />
        </div>
      </section>
    );
  }

  if (section.type === "image_text") {
    const image = img("image");
    return (
      <section className="section-pad">
        <div className={`container-wide grid min-w-0 items-center gap-8 sm:gap-10 ${image ? "lg:grid-cols-2 lg:gap-16" : ""}`}>
          {image ? (
            <Reveal from="left" className="relative min-w-0 overflow-hidden md:overflow-visible">
              <div className="absolute -bottom-3 -right-3 hidden h-full w-full rounded-2xl bg-copper/20 md:block" />
              <div className="relative aspect-5/4 overflow-hidden rounded-2xl">
                <CmsImage src={image} alt={str("heading")} sizes="(max-width: 1024px) 100vw, 50vw" />
              </div>
            </Reveal>
          ) : null}
          <Reveal from="right" delay={80} className="min-w-0">
            <h2 className="wrap-break-word font-display text-2xl sm:text-3xl md:text-4xl">{str("heading")}</h2>
            <p className="mt-4 text-lg leading-8 text-muted">{str("body") || str("description")}</p>
            {str("buttonLabel") ? (
              <SiteLink href={str("buttonHref", "/contact")} className="btn-navy mt-7" source="image-text">
                {str("buttonLabel")}
              </SiteLink>
            ) : null}
          </Reveal>
        </div>
      </section>
    );
  }

  if (section.type === "services_grid") {
    const limit = Number(c.limit || 6);
    const services = extras.services.slice(0, limit);
    return (
      <section className="section-pad border-y border-line bg-paper">
        <div className="container-wide">
          <Reveal>
            <div className="mb-8 flex flex-col justify-between gap-4 sm:mb-10 sm:flex-row sm:items-end">
              <div>
              <p className="eyebrow">Repair menu</p>
              <h2 className="mt-2 font-display text-3xl sm:text-4xl md:text-5xl text-ink">
                {str("heading", "Our Services")}
              </h2>
              </div>
              <p className="max-w-sm text-sm leading-6 text-muted sm:text-right">From a dead screen to a stubborn Smart TV, choose the fault and see how we can help.</p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((service, i) => (
              <Reveal key={service.id} delay={i * 60}>
                <Link
                  href={`/tv-repair/${service.slug}`}
                  prefetch={true}
                  className="group flex h-full flex-col overflow-hidden border border-line bg-white transition duration-300 hover:-translate-y-1 hover:border-copper hover:shadow-soft"
                >
                  <span className="relative aspect-4/3 overflow-hidden bg-cream">
                    {service.image_url ? (
                      <CmsImage
                        src={service.image_url}
                        alt={service.name}
                        className="object-cover transition duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                    ) : (
                      <span className="flex h-full w-full items-center justify-center text-4xl text-navy/30">TV</span>
                    )}
                  </span>
                  <span className="flex flex-1 flex-col p-4">
                    <span className="block font-display text-lg font-semibold leading-snug text-ink group-hover:text-navy">
                      {service.name}
                    </span>
                    {service.short_description ? (
                      <span className="mt-2 line-clamp-2 text-sm leading-5 text-muted">
                        {service.short_description}
                      </span>
                    ) : null}
                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-copper">View service <ArrowUpRight size={15} className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></span>
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>

          {extras.services.length > limit ? (
            <div className="mt-10 text-center">
              <Link href="/services" className="btn-primary inline-flex">
                View All Services
              </Link>
            </div>
          ) : null}
        </div>
      </section>
    );
  }



  if (section.type === "faq") {
    const category = str("category");
    const items = extras.faqs.filter((f) => !category || f.category === category);
    return <FAQSection heading={str("heading")} items={items} />;
  }

  if (section.type === "testimonials") {
    const items = c.featuredOnly ? extras.testimonials.filter((t) => t.is_featured) : extras.testimonials;
    return <TestimonialsSection heading={str("heading")} items={items.slice(0, 3)} />;
  }

  if (section.type === "cta") {
    const phone = extras.settings["business.phone"] || "";
    const image = img("image");
    return (
      <section className="relative overflow-hidden bg-navy py-8 text-white sm:py-16 lg:py-20">
        {image ? <CmsImage src={image} alt="" className="object-cover opacity-35" sizes="100vw" /> : null}
        <div className={`absolute inset-0 ${image ? "bg-navy/70" : ""}`} />
        <div className={`container-wide relative grid min-w-0 items-center gap-8 lg:grid-cols-[1.2fr_0.8fr] ${align || ""}`}>
          <Reveal className="min-w-0">
            <h2 className="max-w-2xl wrap-break-word font-display text-2xl sm:text-3xl md:text-5xl">{str("heading")}</h2>
            <p className="mt-3 max-w-xl text-sm text-white/70 sm:mt-4 sm:text-base">{str("body")}</p>
            <div className="mt-5 flex flex-col gap-2 sm:mt-8 sm:gap-3 min-[480px]:flex-row min-[480px]:flex-wrap">
              <SiteLink href={str("primaryHref", "/book-service")} className="btn-primary w-full min-[480px]:w-auto" source="cta">
                {str("primaryLabel", "Book a Repair")}
              </SiteLink>
              <SiteLink href={str("secondaryHref", "/contact")} className="btn-outline w-full border-white/30 text-white hover:bg-white hover:text-navy min-[480px]:w-auto" source="cta">
                {str("secondaryLabel", "WhatsApp Us")}
              </SiteLink>
            </div>
          </Reveal>
          {phone ? (
            <Reveal delay={100}>
              <a
                href={phoneHref(phone)}
                className="block min-w-0 rounded-xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm transition duration-300 hover:bg-white/15 sm:rounded-2xl sm:p-6"
              >
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/50">Call the desk</p>
              <p className="mt-2 inline-flex max-w-full items-center gap-2 break-all font-display text-lg sm:mt-3 sm:text-2xl">
                <Phone size={22} className="shrink-0 text-copper" />
                {phone}
              </p>
              <p className="mt-2 text-sm text-white/55">7 days · usually under 90 minutes in Noida & Delhi</p>
              </a>
            </Reveal>
          ) : null}
        </div>
      </section>
    );
  }

  if (section.type === "features") {
    const items = Array.isArray(c.items)
      ? (c.items as { title: string; body: string; image?: string }[]).map((item) => ({
          ...item,
          image: resolveWorkImage(item.image),
        }))
      : [];
    return <FeaturesSection heading={str("heading", "Why choose us")} items={items} />;
  }

  if (section.type === "statistics") {
    return <StatsSection />;
  }

  if (section.type === "gallery") {
    const images = Array.isArray(c.images) ? (c.images as string[]).filter(Boolean) : [];
    if (!images.length) return null;
    return (
      <div className="relative pt-12">
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-center text-navy -mb-8 z-10 relative">{str("heading", "Gallery")}</h2>
        <OfferSlider images={images} />
      </div>
    );
  }

  if (section.type === "offer_slider") {
    const images = Array.isArray(c.images) ? (c.images as string[]).filter(Boolean) : [];
    if (!images.length) return null;
    return <OfferSlider images={images} />;
  }

  if (section.type === "contact_form") {
    return (
      <section className="section-pad">
        <div className="container-narrow">
          <h2 className="font-display text-2xl sm:text-3xl">{str("heading", "Contact")}</h2>
          <p className="mt-3 text-muted">{str("body")}</p>
          <div className="card-surface mt-8 p-5 sm:p-6">
            <ContactForm />
          </div>
        </div>
      </section>
    );
  }

  if (section.type === "booking_form") {
    return (
      <BookingSection
        settings={extras.settings}
        source="booking-section"
        heading={str("heading", "Book a doorstep visit")}
      />
    );
  }

  if (section.type === "video" && str("url")) {
    return (
      <section className="section-pad">
        <div className="container-narrow">
          <h2 className="font-display text-2xl sm:text-3xl">{str("heading")}</h2>
          <div className="mt-6 aspect-video overflow-hidden rounded-xl">
            <iframe src={str("url")} className="h-full w-full" title={str("heading")} allowFullScreen />
          </div>
        </div>
      </section>
    );
  }

  if (section.type === "custom_html") {
    return <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(str("html")) }} />;
  }

  if (section.type === "brands" || section.type === "trust_badges") {
    const items = Array.isArray(c.items) ? (c.items as string[]) : [];
    return <BrandsStrip heading={str("heading")} items={items} />;
  }

  if (section.type === "before_after") {
    const beforeImage = img("beforeImage");
    const afterImage = img("afterImage");
    return (
      <section className="section-pad">
        <div className="container-wide grid gap-6 lg:grid-cols-2">
          {beforeImage ? (
            <div className="relative aspect-4/3 overflow-hidden rounded-xl">
              <CmsImage src={beforeImage} alt="Before" />
            </div>
          ) : null}
          {afterImage ? (
            <div className="relative aspect-4/3 overflow-hidden rounded-xl">
              <CmsImage src={afterImage} alt="After" />
            </div>
          ) : null}
        </div>
      </section>
    );
  }

  return null;
}

export function TrustNote() {
  return (
    <p className="inline-flex items-center gap-2 text-sm text-muted">
      <ShieldCheck size={16} className="text-copper" />
      Workmanship warranty on completed repairs
    </p>
  );
}
