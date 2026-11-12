import type { Metadata } from "next";
import Link from "next/link";
import { listBlogs } from "@/server/repositories/blogs.repository";
import { getPublishedPageBySlug } from "@/server/repositories/pages.repository";
import { getSiteContext } from "@/server/services/site";
import { Breadcrumb } from "@/components/seo/Breadcrumb";
import { PageHero } from "@/components/website/PageHero";
import { CmsImage } from "@/components/website/CmsImage";
import { buildMetadata } from "@/lib/seo/metadata";
import { formatDate } from "@/lib/utils/cn";
import { pageBanner } from "@/lib/page-banner";
import { ArrowUpRight } from "lucide-react";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteContext();
  return buildMetadata({
    seo: null,
    fallbackTitle: "TV Repair Blog",
    fallbackDescription: "Guides and advice on LED, OLED and Smart TV repair.",
    path: "/blog",
    settings: site.settings,
  });
}

export default async function BlogIndexPage() {
  const [{ data }, page] = await Promise.all([
    listBlogs({ publishedOnly: true, all: true }),
    getPublishedPageBySlug("blog"),
  ]);
  return (
    <>
      <Breadcrumb items={[{ name: "Home", href: "/" }, { name: "Blog", href: "/blog" }]} />
      <PageHero
        eyebrow="Journal"
        title="Advice from the bench"
        description="Practical guides from technicians who repair TVs every day."
        image={pageBanner(page)}
      />
      <section className="section-pad">
        <div className="container-wide grid gap-5 md:grid-cols-2">
          {data.map((post) => (
            <article key={post.id} className="group card-surface overflow-hidden rounded-2xl border border-line transition-all duration-200 hover:-translate-y-1 hover:border-copper/40 hover:shadow-xl flex flex-col justify-between">
              <div>
                <Link href={`/blog/${post.slug}`} prefetch={true} className="relative block aspect-video overflow-hidden bg-paper">
                  <CmsImage src={post.image_url} alt={post.title} sizes="(max-width: 768px) 100vw, 50vw" />
                </Link>
                <div className="p-5 sm:p-6">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-copper-dark bg-cream px-2.5 py-0.5 rounded-full border border-line/60">
                      TV Guide
                    </span>
                    <span className="text-xs text-muted">{formatDate(post.published_at)}</span>
                  </div>
                  <h2 className="mt-3 font-display text-xl sm:text-2xl font-bold text-navy group-hover:text-copper-dark transition-colors line-clamp-2">
                    <Link href={`/blog/${post.slug}`} prefetch={true}>
                      {post.title}
                    </Link>
                  </h2>
                  <p className="mt-2.5 text-sm sm:text-base text-muted line-clamp-3 leading-relaxed">{post.excerpt}</p>
                </div>
              </div>
              <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-2 border-t border-line/50">
                <Link
                  href={`/blog/${post.slug}`}
                  prefetch={true}
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-navy group-hover:text-copper-dark transition-colors"
                >
                  Read full article <ArrowUpRight size={17} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
