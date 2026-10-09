"use client";

import { useEffect, useRef } from "react";

const GUILLOCHE_SVG = `<svg xmlns='http://www.w3.org/2000/svg' width='55' height='55'>
  <g fill='none' stroke='#e2b84a' stroke-width='1'>
    <circle cx='27.5' cy='27.5' r='26' stroke-opacity='0.9'/>
    <circle cx='27.5' cy='27.5' r='18' stroke-opacity='0.75' stroke-width='0.9'/>
    <circle cx='27.5' cy='27.5' r='9' stroke-opacity='0.6' stroke-width='0.9'/>
    <circle cx='0' cy='0' r='26' stroke-opacity='0.65' stroke-width='0.9'/>
    <circle cx='55' cy='55' r='26' stroke-opacity='0.65' stroke-width='0.9'/>
    <circle cx='55' cy='0' r='26' stroke-opacity='0.65' stroke-width='0.9'/>
    <circle cx='0' cy='55' r='26' stroke-opacity='0.65' stroke-width='0.9'/>
  </g>
</svg>`;

const PATTERN_URL = `url("data:image/svg+xml,${encodeURIComponent(GUILLOCHE_SVG)}")`;

export default function CursorSpotlight() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const media = window.matchMedia("(pointer: coarse)");
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
      className="pointer-events-none fixed inset-0 z-0 opacity-100"
      style={{
        backgroundImage: PATTERN_URL,
        maskImage:
          "radial-gradient(320px circle at var(--spot-x, -9999px) var(--spot-y, -9999px), black 0%, black 50%, transparent 90%)",
        WebkitMaskImage:
          "radial-gradient(320px circle at var(--spot-x, -9999px) var(--spot-y, -9999px), black 0%, black 50%, transparent 90%)",
      }}
    />
  );
}
