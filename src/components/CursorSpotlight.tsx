"use client";

import { useEffect, useRef } from "react";

const GUILLOCHE_SVG = `<svg xmlns='http://www.w3.org/2000/svg' width='55' height='55'>
  <g fill='none' stroke='#c99a34' stroke-width='0.6'>
    <circle cx='27.5' cy='27.5' r='26' stroke-opacity='0.55'/>
    <circle cx='27.5' cy='27.5' r='18' stroke-opacity='0.4' stroke-width='0.5'/>
    <circle cx='27.5' cy='27.5' r='9' stroke-opacity='0.3' stroke-width='0.5'/>
    <circle cx='0' cy='0' r='26' stroke-opacity='0.35' stroke-width='0.5'/>
    <circle cx='55' cy='55' r='26' stroke-opacity='0.35' stroke-width='0.5'/>
    <circle cx='55' cy='0' r='26' stroke-opacity='0.35' stroke-width='0.5'/>
    <circle cx='0' cy='55' r='26' stroke-opacity='0.35' stroke-width='0.5'/>
  </g>
</svg>`;

const PATTERN_URL = `url("data:image/svg+xml,${encodeURIComponent(GUILLOCHE_SVG)}")`;

export default function CursorSpotlight() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const media = window.matchMedia("(prefers-reduced-motion: reduce), (pointer: coarse)");
    if (media.matches) return;

    let frame = 0;
    const onMove = (e: PointerEvent) => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        el.style.setProperty("--spot-x", `${e.clientX}px`);
        el.style.setProperty("--spot-y", `${e.clientY}px`);
        frame = 0;
      });
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 opacity-70 transition-[mask-position] duration-100"
      style={{
        backgroundImage: PATTERN_URL,
        maskImage:
          "radial-gradient(260px circle at var(--spot-x, -9999px) var(--spot-y, -9999px), black 0%, black 35%, transparent 80%)",
        WebkitMaskImage:
          "radial-gradient(260px circle at var(--spot-x, -9999px) var(--spot-y, -9999px), black 0%, black 35%, transparent 80%)",
      }}
    />
  );
}
