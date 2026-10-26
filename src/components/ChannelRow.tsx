"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import type { Video } from "@/lib/youtube";
import { useModalFocus } from "@/lib/useModalFocus";

const fmt = (d: string) =>
  new Date(d).toLocaleDateString("en", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });

export default function ChannelRow({ videos }: { videos: Video[] }) {
  const [active, setActive] = useState<Video | null>(null);
  const [overflow, setOverflow] = useState(false);
  const row = useRef<HTMLUListElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  useModalFocus(active !== null, dialogRef, closeRef);

  useEffect(() => {
    const el = row.current;
    if (!el) return;
    const check = () => setOverflow(el.scrollWidth > el.clientWidth + 1);
    check();
    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => ro.disconnect();
  }, [videos]);

  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setActive(null);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [active]);

  const scroll = (dir: number) =>
    row.current?.scrollBy({ left: dir * row.current.clientWidth * 0.8, behavior: "smooth" });
  const arrow =
    "hidden md:flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink transition-colors hover:border-gold/60 hover:text-accent focus-visible:ring-2 focus-visible:ring-accent";

  return (
    <div>
      {overflow && (
        <div className="mb-4 flex justify-end gap-2">
          <button type="button" aria-label="Scroll videos left" onClick={() => scroll(-1)} className={arrow}>
            ‹
          </button>
          <button type="button" aria-label="Scroll videos right" onClick={() => scroll(1)} className={arrow}>
            ›
          </button>
        </div>
      )}
      <ul
        ref={row}
        role="region"
        aria-label="Latest Informator videos"
        tabIndex={0}
        className="flex items-start gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4 outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm [scrollbar-width:thin]"
      >
        {videos.map((v) => (
          <li key={v.id} className="snap-start shrink-0">
            <button
              type="button"
              aria-label={`Play: ${v.title}`}
              onClick={() => setActive(v)}
              className="group flex flex-col text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm"
            >
              <span
                className={`relative block h-44 md:h-56 overflow-hidden rounded-sm shadow-soft ${
                  v.isShort ? "aspect-[9/16]" : "aspect-video"
                }`}
              >
                <Image
                  src={v.thumb}
                  alt=""
                  fill
                  sizes="400px"
                  unoptimized
                  loading="lazy"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <svg width="44" height="44" viewBox="0 0 24 24" aria-hidden="true" className="text-gold drop-shadow">
                    <circle cx="12" cy="12" r="11" fill="rgba(0,0,0,0.55)" />
                    <path d="M10 8l6 4-6 4z" fill="currentColor" />
                  </svg>
                </span>
                {v.isShort && (
                  <span className="absolute left-2 top-2 rounded-sm bg-gold px-1.5 py-0.5 text-[10px] font-semibold tracking-widest text-paper">
                    SHORT
                  </span>
                )}
              </span>
              <span className="mt-3 block w-0 min-w-full">
                <span className="line-clamp-2 text-sm text-ink">{v.title}</span>
                <span className="mt-1 block text-xs text-ink-faint">{fmt(v.publishedAt)}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>

      {/* Portal: the Reveal wrapper's transform would otherwise trap this fixed overlay. */}
      {active &&
        createPortal(
          <div
            className="animate-fade-in fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-6"
            onClick={() => setActive(null)}
            role="dialog"
            aria-modal="true"
            aria-label={active.title}
            ref={dialogRef}
          >
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${active.id}?autoplay=1&rel=0&playsinline=1`}
              title={active.title}
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
              allowFullScreen
              className={`rounded-sm bg-black ${
                active.isShort ? "h-[85vh] max-w-full aspect-[9/16]" : "w-full max-w-4xl aspect-video"
              }`}
            />
            <button
              ref={closeRef}
              onClick={() => setActive(null)}
              aria-label="Close"
              className="absolute top-5 right-5 text-ink/80 hover:text-ink text-2xl leading-none transition-transform duration-200 hover:scale-110 focus-visible:ring-2 focus-visible:ring-accent"
            >
              ×
            </button>
          </div>,
          document.body
        )}
    </div>
  );
}
