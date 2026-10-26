"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import type { Video } from "@/lib/youtube";
import { useModalFocus } from "@/lib/useModalFocus";

const fmt = (d: string) =>
  new Date(d).toLocaleDateString("en", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });

const badge = "absolute left-2 top-2 rounded-sm bg-gold px-1.5 py-0.5 text-[10px] font-semibold tracking-widest text-paper";

function Card({ v, label, onPlay, className = "" }: { v: Video; label: string; onPlay: (v: Video) => void; className?: string }) {
  return (
    <button
      type="button"
      aria-label={`Play: ${v.title}`}
      onClick={() => onPlay(v)}
      className={`group flex flex-col text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm ${className}`}
    >
      <span
        className={`relative block overflow-hidden rounded-sm shadow-soft ${
          v.isShort
            ? "mx-auto w-full max-w-[280px] aspect-[9/16] md:max-w-none md:aspect-auto md:flex-1 md:min-h-0"
            : "aspect-video w-full"
        }`}
      >
        <Image
          src={v.thumb}
          alt=""
          fill
          sizes="(min-width: 768px) 600px, 100vw"
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
        <span className={badge}>{label}</span>
      </span>
      <span className="mt-3 block w-0 min-w-full">
        <span className="line-clamp-2 text-sm text-ink">{v.title}</span>
        <span className="mt-1 block text-xs text-ink-faint">{fmt(v.publishedAt)}</span>
      </span>
    </button>
  );
}

export default function ChannelRow({ long, short }: { long: Video[]; short: Video | null }) {
  const [active, setActive] = useState<Video | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  useModalFocus(active !== null, dialogRef, closeRef);

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

  const labels = ["LATEST", "MOST VIEWED"];
  const grid = short ? "md:grid-cols-[minmax(0,1fr)_minmax(0,0.55fr)]" : "";

  return (
    <div>
      <div className={`grid gap-6 ${grid}`}>
        {long.map((v, i) => (
          <Card key={v.id} v={v} label={labels[i]} onPlay={setActive} className={short ? "md:col-start-1" : ""} />
        ))}
        {short && (
          <Card
            v={short}
            label="SHORT"
            onPlay={setActive}
            className={`md:col-start-2 md:row-start-1 ${long.length > 1 ? "md:row-span-2" : "md:row-span-1"}`}
          />
        )}
      </div>

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
