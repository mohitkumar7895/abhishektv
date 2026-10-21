export default function BlogListLoading() {
  return (
    <>
      {/* Hero skeleton */}
      <div className="bg-paper-subtle py-16 sm:py-24 border-b border-line">
        <div className="container-wide">
          <div className="h-4 w-20 rounded bg-line animate-pulse mb-3" />
          <div className="h-10 sm:h-12 w-80 rounded-lg bg-line animate-pulse mb-4" />
          <div className="h-5 w-96 max-w-full rounded bg-line animate-pulse" />
        </div>
      </div>

      {/* Grid skeleton */}
      <section className="section-pad">
        <div className="container-wide grid gap-5 md:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="card-surface overflow-hidden rounded-2xl border border-line">
              <div className="aspect-video w-full bg-line animate-pulse" />
              <div className="p-5 sm:p-6 space-y-3">
                <div className="h-3 w-28 rounded bg-line animate-pulse" />
                <div className="h-6 w-5/6 rounded bg-line animate-pulse" />
                <div className="h-4 w-full rounded bg-line animate-pulse" />
                <div className="h-4 w-2/3 rounded bg-line animate-pulse" />
                <div className="pt-2 h-4 w-24 rounded bg-line animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
