import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getBlogBySlug, listBlogs, relatedBlogs } from "@/server/repositories/blogs.repository";
import { getSeo } from "@/server/repositories/seo.repository";
import { getSiteContext } from "@/server/services/site";
import { Breadcrumb } from "@/components/seo/Breadcrumb";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildMetadata } from "@/lib/seo/metadata";
import { articleSchema, breadcrumbSchema } from "@/lib/seo/schema";
import { formatDate, siteUrl } from "@/lib/utils/cn";
import { sanitizeHtml } from "@/lib/utils/sanitize";
import { CmsImage } from "@/components/website/CmsImage";
import { SiteLink } from "@/components/website/SiteLink";
import {
  Calendar,
  Clock,
  User,
  ShieldCheck,
  ArrowRight,
  Phone,
  Wrench,
  Sparkles,
} from "lucide-react";

export const revalidate = 60;

export async function generateStaticParams() {
  try {
    const { data } = await listBlogs({ publishedOnly: true, pageSize: 50 });
    return data.map((post) => ({ slug: post.slug }));
  } catch {
    return [];
  }
}

type Params = { params: Promise<{ slug: string }> };

function estimateReadingTime(content?: string | null): string {
  if (!content) return "3 min read";
  const words = content.replace(/<[^>]+>/g, " ").trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
}

function prepareArticleContent(content?: string | null): string {
  if (!content) return "";
  let html = content.trim();
  // If the content starts with plain text before any HTML tag
  const match = html.match(/^([^<]+)(<[\s\S]*)$/);
  if (match && match[1].trim()) {
    html = `<h2>${match[1].trim()}</h2>${match[2]}`;
  }
  return sanitizeHtml(html);
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug).trim();
  const [post, site] = await Promise.all([getBlogBySlug(decodedSlug), getSiteContext()]);
  if (!post) return { title: "Blog" };
  const seo = await getSeo("blog", post.id);
  return buildMetadata({
    seo,
    fallbackTitle: post.title,
    fallbackDescription: post.excerpt || "",
    path: `/blog/${post.slug}`,
    settings: site.settings,
    image: post.image_url,
  });
}

export default async function BlogPostPage({ params }: Params) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug).trim();
  const [post, site] = await Promise.all([getBlogBySlug(decodedSlug), getSiteContext()]);
  if (!post) notFound();

  const related = await relatedBlogs(post.id, post.category_id, 3);
  const crumbs = [
    { name: "Home", href: "/" },
    { name: "Blog", href: "/blog" },
    { name: post.title, href: `/blog/${post.slug}` },
  ];

  const authorName = post.author_name?.trim() || "Certified TV Technician";
  const readingTime = estimateReadingTime(post.content);
  const cleanContent = prepareArticleContent(post.content);
  const phone = site.settings["business.phone"] || "+91 99999 99999";

  return (
    <>
      <JsonLd data={breadcrumbSchema(crumbs.map((c) => ({ name: c.name, path: c.href })))} />
      <JsonLd
        data={articleSchema({
          title: post.title,
          description: post.excerpt || "",
          url: siteUrl(`/blog/${post.slug}`),
          image: post.image_url,
          datePublished: post.published_at,
          dateModified: post.updated_at,
          author: authorName,
          settings: site.settings,
        })}
      />

      <Breadcrumb items={crumbs} />

      {/* Editorial Article Hero Header */}
      <header className="relative border-b border-line/60 bg-gradient-to-b from-cream/40 via-paper to-paper pt-8 pb-12 sm:pt-12 sm:pb-16">
        <div className="container-narrow">
          {/* Category Tag & Badge */}
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-cream px-3 py-1 text-xs font-semibold uppercase tracking-wider text-navy">
              <span className="h-1.5 w-1.5 rounded-full bg-copper-dark animate-pulse" />
              {post.category_name || "TV Repair Guide"}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-line/70 bg-white/80 px-2.5 py-1 text-xs font-medium text-muted">
              <ShieldCheck size={14} className="text-copper-dark" /> Verified Solution
            </span>
          </div>

          {/* Main Title */}
          <h1 className="mt-4 wrap-break-word font-display text-3xl font-bold leading-tight tracking-tight text-navy sm:text-4xl md:text-5xl">
            {post.title}
          </h1>

          {/* Excerpt / Subheading */}
          {post.excerpt ? (
            <p className="mt-4 text-base font-normal leading-relaxed text-muted sm:text-lg">
              {post.excerpt}
            </p>
          ) : null}

          {/* Meta Information Bar */}
          <div className="mt-6 flex flex-wrap items-center gap-y-2 gap-x-5 border-t border-line/60 pt-4 text-xs sm:text-sm text-muted">
            <span className="inline-flex items-center gap-1.5">
              <Calendar size={15} className="text-copper-dark" />
              <time dateTime={post.published_at ? new Date(post.published_at).toISOString() : ""}>
                {formatDate(post.published_at)}
              </time>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <User size={15} className="text-copper-dark" />
              <span>{authorName}</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock size={15} className="text-copper-dark" />
              <span>{readingTime}</span>
            </span>
          </div>

          {/* Featured Hero Image */}
          {post.image_url ? (
            <div className="relative mt-8 sm:mt-10 aspect-video w-full overflow-hidden rounded-2xl sm:rounded-3xl border border-line/60 bg-paper-subtle shadow-xl">
              <CmsImage
                src={post.image_url}
                alt={post.title}
                sizes="(max-width: 768px) 100vw, 840px"
                priority
              />
            </div>
          ) : null}
        </div>
      </header>

      {/* Main Content Body */}
      <main className="container-narrow py-10 sm:py-16">
        {/* Rendered Prose Content with rich typography */}
        <article className="prose-site" dangerouslySetInnerHTML={{ __html: cleanContent }} />

        {/* Technician Assurance Card */}
        <div className="mt-14 rounded-2xl border border-line bg-cream/40 p-6 sm:p-7 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-copper/20 text-navy">
            <Wrench size={22} className="text-copper-dark" />
          </div>
          <div className="flex-1">
            <h3 className="font-display text-base font-bold text-navy">
              Certified Doorstep Repair Guarantee
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-muted leading-relaxed">
              Every TV repair handled by Abhishek TV Care uses authentic manufacturer parts and includes up to 90 days service warranty with zero visit fees on repair completion.
            </p>
          </div>
        </div>

        {/* High-Impact Doorstep Booking CTA Card */}
        <div className="mt-8 rounded-3xl bg-gradient-to-br from-navy via-navy-2 to-navy p-7 sm:p-9 text-ink-light shadow-2xl relative overflow-hidden border border-white/10">
          <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-copper/10 blur-3xl" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="max-w-xl">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-copper/15 px-3 py-1 text-xs font-semibold text-copper border border-copper/30">
                <Sparkles size={13} /> 60-Minute Fast Doorstep Visit
              </span>
              <h2 className="mt-3 font-display text-2xl sm:text-3xl font-bold tracking-tight text-ink-light">
                Need Help Fixing Your TV Today?
              </h2>
              <p className="mt-2 text-sm sm:text-base text-ink-light/80 leading-relaxed">
                Don&apos;t risk further display panel or motherboard damage. Our local technicians diagnose and repair Sony, Samsung, LG, MI, and all LED TVs at your doorstep in Delhi NCR.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
              <a
                href={`tel:${phone.replace(/\s+/g, "")}`}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-copper px-6 py-3.5 text-sm font-bold text-navy shadow-md hover:bg-copper-dark transition-colors"
              >
                <Phone size={16} /> Call Technician
              </a>
              <SiteLink
                href="/book-service"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-6 py-3.5 text-sm font-semibold text-ink-light hover:bg-white/20 transition-colors"
              >
                Book Inspection
              </SiteLink>
            </div>
          </div>
        </div>
      </main>

      {/* Related Reading Section with modern rich cards */}
      {related.length ? (
        <section className="border-t border-line/70 bg-paper-subtle/60 py-12 sm:py-16">
          <div className="container-wide">
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-copper-dark">
                  Related Guides
                </p>
                <h2 className="mt-1 font-display text-2xl sm:text-3xl font-bold text-navy">
                  More TV Repair Articles
                </h2>
              </div>
              <Link
                href="/blog"
                prefetch={true}
                className="inline-flex items-center gap-1 text-sm font-semibold text-navy hover:text-copper-dark transition-colors"
              >
                View all <ArrowRight size={15} />
              </Link>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <Link
                  key={item.id}
                  href={`/blog/${item.slug}`}
                  prefetch={true}
                  className="group flex flex-col justify-between rounded-2xl border border-line bg-card-surface p-5 transition-all duration-200 hover:-translate-y-1 hover:border-copper/40 hover:shadow-lg"
                >
                  <div>
                    {item.image_url ? (
                      <div className="relative mb-4 aspect-video w-full overflow-hidden rounded-xl bg-paper">
                        <CmsImage
                          src={item.image_url}
                          alt={item.title}
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      </div>
                    ) : null}
                    <h3 className="font-display text-base sm:text-lg font-bold text-navy group-hover:text-copper-dark transition-colors line-clamp-2">
                      {item.title}
                    </h3>
                    {item.excerpt ? (
                      <p className="mt-2 text-xs sm:text-sm text-muted line-clamp-2 leading-relaxed">
                        {item.excerpt}
                      </p>
                    ) : null}
                  </div>
                  <div className="mt-4 pt-3 border-t border-line/60 flex items-center justify-between text-xs font-bold text-copper-dark">
                    <span>Read Article</span>
                    <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
