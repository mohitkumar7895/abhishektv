"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export function NavigationProgressBar() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  // When pathname changes, finish progress bar
  useEffect(() => {
    if (loading) {
      setProgress(100);
      const timer = setTimeout(() => {
        setLoading(false);
        setProgress(0);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [pathname]);

  // Listen to clicks on links for instant feedback
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const target = (e.target as HTMLElement).closest("a");
      if (!target || !target.href) return;
      if (target.target && target.target !== "_self") return;
      if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;

      try {
        const url = new URL(target.href);
        const current = new URL(window.location.href);
        // Only trigger for same origin internal navigation with different path
        if (url.origin === current.origin && (url.pathname !== current.pathname || url.search !== current.search)) {
          setLoading(true);
          setProgress(25);
          setTimeout(() => setProgress((p) => (p === 25 ? 65 : p)), 100);
          setTimeout(() => setProgress((p) => (p === 65 ? 85 : p)), 300);
        }
      } catch {
        // ignore invalid urls
      }
    }

    document.addEventListener("click", handleClick, { capture: true });
    return () => document.removeEventListener("click", handleClick, { capture: true });
  }, []);

  if (!loading && progress === 0) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 right-0 z-9999 h-1 bg-transparent"
    >
      <div
        className="h-full bg-gradient-to-r from-copper via-amber-400 to-copper transition-all duration-200 ease-out shadow-[0_0_8px_rgba(245,158,11,0.6)]"
        style={{
          width: `${progress}%`,
          opacity: progress === 100 ? 0 : 1,
          transition: progress === 100 ? "width 150ms ease-out, opacity 200ms 100ms" : "width 250ms ease-out",
        }}
      />
    </div>
  );
}
