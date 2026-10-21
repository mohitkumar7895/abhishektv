export default function BlogDetailLoading() {
  return (
    <div className="container-narrow pt-8 pb-16 sm:pt-12 sm:pb-20">
      {/* Breadcrumb skeleton */}
      <div className="flex items-center gap-2 mb-6">
        <div className="h-4 w-12 rounded bg-line animate-pulse" />
        <span className="text-muted">/</span>
        <div className="h-4 w-12 rounded bg-line animate-pulse" />
        <span className="text-muted">/</span>
        <div className="h-4 w-32 rounded bg-line animate-pulse" />
      </div>

      {/* Meta date/author pill */}
      <div className="h-4 w-44 rounded bg-line animate-pulse" />

      {/* Title skeleton */}
      <div className="mt-4 space-y-3">
        <div className="h-8 sm:h-12 w-11/12 rounded-lg bg-line animate-pulse" />
        <div className="h-8 sm:h-12 w-3/4 rounded-lg bg-line animate-pulse" />
      </div>

      {/* Excerpt skeleton */}
      <div className="mt-4 space-y-2">
        <div className="h-5 w-full rounded bg-line animate-pulse" />
        <div className="h-5 w-5/6 rounded bg-line animate-pulse" />
      </div>

      {/* Featured image skeleton */}
      <div className="relative mt-8 aspect-video w-full overflow-hidden rounded-2xl bg-line animate-pulse" />

      {/* Article body skeleton */}
      <div className="mt-10 space-y-4">
        <div className="h-4 w-full rounded bg-line animate-pulse" />
        <div className="h-4 w-full rounded bg-line animate-pulse" />
        <div className="h-4 w-4/5 rounded bg-line animate-pulse" />
        <div className="h-4 w-full rounded bg-line animate-pulse" />
        <div className="h-4 w-3/4 rounded bg-line animate-pulse" />
      </div>
    </div>
  );
}
