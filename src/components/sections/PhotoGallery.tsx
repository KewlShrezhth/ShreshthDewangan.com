"use client";

import { useEffect, useState, useCallback } from "react";
import type { Photo } from "@/data/photos";

export default function PhotoGallery({ photos }: { photos: Photo[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const close = useCallback(() => setActiveIndex(null), []);
  const next = useCallback(
    () => setActiveIndex((i) => (i === null ? null : (i + 1) % photos.length)),
    [photos.length]
  );
  const prev = useCallback(
    () =>
      setActiveIndex((i) =>
        i === null ? null : (i - 1 + photos.length) % photos.length
      ),
    [photos.length]
  );

  useEffect(() => {
    if (activeIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeIndex, close, next, prev]);

  const active = activeIndex !== null ? photos[activeIndex] : null;

  return (
    <>
      <div className="columns-2 md:columns-3 gap-4 [column-fill:_balance]">
        {photos.map((photo, i) => (
          <button
            key={photo.id}
            onClick={() => setActiveIndex(i)}
            className="group mb-4 block w-full overflow-hidden rounded-sm shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photo.src}
              alt={photo.alt}
              className="w-full h-auto object-cover transition-transform duration-500 ease-out group-hover:scale-[1.06]"
              loading="lazy"
            />
          </button>
        ))}
      </div>

      {active && (
        <div
          className="animate-fade-in fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-6"
          onClick={close}
          role="dialog"
          aria-modal="true"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            key={active.id}
            src={active.src}
            alt={active.alt}
            className="animate-scale-in max-h-[85vh] max-w-full rounded-sm object-contain shadow-lift"
            onClick={(e) => e.stopPropagation()}
          />
          {active.caption && (
            <p className="absolute bottom-6 left-0 right-0 text-center text-sm text-ink/80">
              {active.caption}
            </p>
          )}
          <button
            onClick={close}
            aria-label="Close"
            className="absolute top-5 right-5 text-ink/80 hover:text-ink text-2xl leading-none transition-transform duration-200 hover:scale-110"
          >
            ×
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            aria-label="Previous photo"
            className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 text-ink/70 hover:text-ink text-3xl px-2 transition-transform duration-200 hover:scale-125 hover:-translate-x-0.5"
          >
            ‹
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            aria-label="Next photo"
            className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 text-ink/70 hover:text-ink text-3xl px-2 transition-transform duration-200 hover:scale-125 hover:translate-x-0.5"
          >
            ›
          </button>
        </div>
      )}
    </>
  );
}
