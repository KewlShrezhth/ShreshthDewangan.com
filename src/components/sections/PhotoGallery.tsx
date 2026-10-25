"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import {
  animate,
  motion,
  useMotionValue,
  type AnimationPlaybackControls,
  type MotionValue,
} from "motion/react";
import Image from "next/image";
import type { Photo } from "@/lib/content";
import { unopt } from "@/lib/image";

const MIN_FRAMES = 10;
const HOLD_MS = 3000; // how long each photo faces the viewer before the film rolls on
const DRAG = 0.3; // degrees of roll per pixel dragged
const sprockets =
  "repeating-linear-gradient(180deg, transparent 0 5px, #d9cdb5 5px 13px, transparent 13px 18px)";
const sprocketStyle = {
  background: sprockets,
  backgroundSize: "60% 18px",
  backgroundPosition: "center",
  backgroundRepeat: "repeat-y",
};

// Apple's momentum projection (Designing Fluid Interfaces): where a flick would come to rest.
const project = (velocity: number, decel = 0.998) => ((velocity / 1000) * decel) / (1 - decel);

function Frame({ photo, angle, rot }: { photo: Photo; angle: number; rot: MotionValue<number> }) {
  const overlay = useRef<HTMLDivElement>(null);

  // The frame facing the viewer is lit; frames rolling away fall into shadow.
  // Painted imperatively so the server HTML and first client render match.
  useEffect(() => {
    const paint = (r: number) => {
      const facing = Math.cos(((r - angle) * Math.PI) / 180);
      if (overlay.current) overlay.current.style.opacity = String(0.8 - Math.max(0, facing) ** 3 * 0.8);
    };
    paint(rot.get());
    return rot.on("change", paint);
  }, [rot, angle]);

  return (
    <div
      className="absolute left-1/2 top-1/2 flex bg-[#0d0c0a] [transform-style:preserve-3d]"
      style={{
        width: "calc(var(--h) * 1.15)",
        height: "var(--h)",
        margin: "calc(var(--h) / -2) 0 0 calc(var(--h) * -0.575)",
        transform: `rotateX(${-angle}deg) translateZ(calc(var(--h) * var(--k)))`,
      }}
    >
      <div className="w-[9%] my-1 mx-[2%] opacity-80" style={sprocketStyle} />
      <div className="relative flex-1 my-[5%] overflow-hidden [backface-visibility:hidden]">
        <Image
          src={photo.src}
          alt={photo.alt}
          fill
          sizes="(min-width: 768px) 220px, 180px"
          unoptimized={unopt(photo.src)}
          draggable={false}
          className="select-none object-cover"
        />
      </div>
      <div className="w-[9%] my-1 mx-[2%] opacity-80" style={sprocketStyle} />
      <div ref={overlay} aria-hidden="true" className="pointer-events-none absolute inset-0 bg-black" style={{ opacity: 0.8 }} />
    </div>
  );
}

function FilmReel({ photos, onOpen }: { photos: Photo[]; onOpen: () => void }) {
  const frames: Photo[] = [];
  while (frames.length < MIN_FRAMES) frames.push(...photos);
  const step = 360 / frames.length;
  // Radius that makes adjacent frames meet edge to edge around the ring.
  const k = 1 / (2 * Math.tan(Math.PI / frames.length));

  const rot = useMotionValue(0);
  const [frame, setFrame] = useState(0);
  const anim = useRef<AnimationPlaybackControls | null>(null);
  const drag = useRef<{ y: number; t: number; moved: number; v: number } | null>(null);
  const hovering = useRef(false);
  const lastInput = useRef(0);

  const rollTo = useCallback(
    (target: number, velocity = 0) => {
      anim.current?.stop();
      anim.current = animate(rot, target, {
        type: "spring",
        bounce: 0,
        duration: 0.9,
        velocity,
        onComplete: () => setFrame(Math.round(target / step)),
      });
    },
    [rot, step]
  );

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => {
      const idle = Date.now() - lastInput.current > HOLD_MS;
      if (hovering.current || drag.current || document.hidden || !idle) return;
      rollTo(Math.round(rot.get() / step) * step + step);
    }, HOLD_MS);
    return () => clearInterval(id);
  }, [rollTo, rot, step]);

  const current = photos[(((frame % frames.length) + frames.length) % frames.length) % photos.length];
  const number = (((frame % photos.length) + photos.length) % photos.length) + 1;

  return (
    <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] gap-6 md:gap-12 items-center">
      <div className="order-2 md:order-1 text-center md:text-left">
        <p className="font-display text-6xl md:text-8xl leading-none text-ink">
          {String(number).padStart(2, "0")}
          <span className="text-2xl md:text-3xl text-ink-faint"> / {String(photos.length).padStart(2, "0")}</span>
        </p>
        <p className="mt-4 min-h-[1.5rem] text-ink-soft">{current.caption}</p>
        <button
          onClick={onOpen}
          className="press mt-6 rounded-full border border-line px-5 py-2 text-sm uppercase tracking-wide text-ink transition-colors hover:border-gold/60 hover:text-accent"
        >
          View all {photos.length}
        </button>
        <p className="mt-3 text-xs text-ink-faint">Drag to roll · tap to see them all</p>
      </div>

      <div
        role="button"
        tabIndex={0}
        aria-label="Photo film roll — open all photos"
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), onOpen())}
        onPointerEnter={(e) => e.pointerType === "mouse" && (hovering.current = true)}
        onPointerLeave={() => (hovering.current = false)}
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId);
          anim.current?.stop();
          drag.current = { y: e.clientY, t: e.timeStamp, moved: 0, v: 0 };
        }}
        onPointerMove={(e) => {
          const d = drag.current;
          if (!d) return;
          const dy = d.y - e.clientY; // dragging up rolls the film up
          const dt = Math.max(1, e.timeStamp - d.t);
          rot.set(rot.get() + dy * DRAG);
          drag.current = { y: e.clientY, t: e.timeStamp, moved: d.moved + Math.abs(dy), v: ((dy * DRAG) / dt) * 1000 };
        }}
        onPointerUp={(e) => {
          const d = drag.current;
          drag.current = null;
          if (!d) return;
          lastInput.current = Date.now();
          if (d.moved < 6) {
            rollTo(Math.round(rot.get() / step) * step);
            return onOpen();
          }
          const v = e.timeStamp - d.t > 80 ? 0 : d.v; // held still before letting go
          rollTo(Math.round((rot.get() + project(v, 0.99)) / step) * step, v);
        }}
        onPointerCancel={() => {
          drag.current = null;
          rollTo(Math.round(rot.get() / step) * step);
        }}
        className="order-1 md:order-2 relative h-[26rem] md:h-[34rem] overflow-hidden cursor-grab active:cursor-grabbing touch-pan-y select-none outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-xl [--h:12rem] md:[--h:15rem]"
        style={{
          perspective: "1800px",
          ["--k" as string]: k,
          maskImage: "linear-gradient(transparent, black 18%, black 82%, transparent)",
          WebkitMaskImage: "linear-gradient(transparent, black 18%, black 82%, transparent)",
        }}
      >
        {/* Tilt pivots on the front frame (one radius forward), so the photo stays centred. */}
        <div
          className="absolute inset-0 [transform-style:preserve-3d]"
          style={{
            transform:
              "translateZ(calc(var(--h) * var(--k))) rotateY(-10deg) translateZ(calc(var(--h) * var(--k) * -1))",
          }}
        >
          <motion.div className="absolute inset-0 [transform-style:preserve-3d]" style={{ rotateX: rot }}>
            {frames.map((photo, i) => (
              <Frame key={i} photo={photo} angle={i * step} rot={rot} />
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default function PhotoGallery({ photos }: { photos: Photo[] }) {
  const [view, setView] = useState<"reel" | "grid">("reel");
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

  if (view === "reel") return <FilmReel photos={photos} onOpen={() => setView("grid")} />;

  return (
    <>
      <button
        onClick={() => setView("reel")}
        className="press mb-6 text-sm uppercase tracking-wide text-ink-soft transition-colors hover:text-accent"
      >
        ← Back to film roll
      </button>
      <div className="animate-fade-in columns-2 md:columns-3 gap-4 [column-fill:_balance]">
        {photos.map((photo, i) => (
          <button
            key={photo.id}
            onClick={() => setActiveIndex(i)}
            className="group mb-4 block w-full overflow-hidden rounded-sm shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              width={800}
              height={600}
              sizes="(min-width: 1152px) 370px, (min-width: 768px) 33vw, 50vw"
              unoptimized={unopt(photo.src)}
              style={{ height: "auto" }}
              className="w-full h-auto object-cover transition-transform duration-500 ease-out group-hover:scale-[1.06]"
              loading="lazy"
            />
          </button>
        ))}
      </div>

      {/* Portal: the Reveal wrapper's transform would otherwise trap this fixed overlay inside it. */}
      {active && createPortal(
        <div
          className="animate-fade-in fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-6"
          onClick={close}
          role="dialog"
          aria-modal="true"
        >
          <Image
            key={active.id}
            src={active.src}
            alt={active.alt}
            width={1600}
            height={1200}
            sizes="100vw"
            unoptimized={unopt(active.src)}
            className="animate-scale-in h-auto w-auto max-h-[85vh] max-w-full rounded-sm object-contain shadow-lift"
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
        </div>,
        document.body
      )}
    </>
  );
}
