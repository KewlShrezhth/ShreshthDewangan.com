"use client";

import { useEffect, useRef, useState } from "react";

export default function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Safety net: some browsers (seen on WebKit/mobile Safari) can fail to
    // ever fire the IntersectionObserver callback for content that's
    // already in view at mount, which would otherwise leave it invisible
    // forever. A fallback timer guarantees content always shows up.
    const fallback = window.setTimeout(() => setVisible(true), 1200);

    let observer: IntersectionObserver | null = null;
    if (typeof IntersectionObserver !== "undefined") {
      try {
        observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              setVisible(true);
              observer?.disconnect();
            }
          },
          { threshold: 0.15 }
        );
        observer.observe(el);
      } catch {
        observer = null;
      }
    }

    return () => {
      window.clearTimeout(fallback);
      observer?.disconnect();
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${
        visible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-7 scale-[0.98]"
      } ${className}`}
      style={{
        transitionDelay: visible ? `${delay}ms` : "0ms",
        transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
      }}
    >
      {children}
    </div>
  );
}
