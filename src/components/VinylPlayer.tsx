"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type RefObject } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { motion, MotionConfig } from "motion/react";
import Placeholder from "@/components/Placeholder";
import { unopt } from "@/lib/image";
import { useModalFocus } from "@/lib/useModalFocus";

type Track = {
  id: number;
  title: string;
  artist: string;
  note: string | null;
  cover: string | null;
  preview: string | null;
  link: string | null;
};

// Width only: touchscreen laptops report pointer: coarse even with a mouse, and drag works for touch too.
const DESKTOP_QUERY = "(min-width: 768px)";

// Server and first client render say "phone", then React switches after mount: no hydration mismatch.
function useIsDesktop() {
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia(DESKTOP_QUERY);
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => window.matchMedia(DESKTOP_QUERY).matches,
    () => false
  );
}

function Turntable({
  track,
  playing,
  over = false,
  turntableRef,
  className = "",
}: {
  track: Track | null;
  playing: boolean;
  over?: boolean;
  turntableRef?: RefObject<HTMLDivElement | null>;
  className?: string;
}) {
  const spinning = playing && track !== null;
  return (
    <div
      ref={turntableRef}
      className={`relative aspect-square rounded-2xl bg-surface shadow-lift transition-shadow ${
        over ? "ring-2 ring-gold shadow-[0_0_48px_-6px_var(--color-gold)]" : "ring-1 ring-line"
      } ${className}`}
    >
      <div
        className="absolute inset-[7%] rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.7)] animate-[spin_1.8s_linear_infinite]"
        style={{
          animationPlayState: spinning ? "running" : "paused",
          background:
            "repeating-radial-gradient(circle, #0b0a09 0 2px, #1a1815 2px 3px), radial-gradient(circle, #111 0, #050505 100%)",
        }}
      >
        <div
          aria-hidden="true"
          className="absolute inset-0 rounded-full"
          style={{ background: "conic-gradient(from 30deg, transparent 0 12%, rgba(255,255,255,0.07) 16%, transparent 22% 62%, rgba(255,255,255,0.05) 66%, transparent 72%)" }}
        />
        <div className="absolute inset-[31%] overflow-hidden rounded-full ring-4 ring-black/60 bg-gold">
          {track?.cover && (
            <Image
              src={track.cover}
              alt=""
              width={180}
              height={180}
              sizes="180px"
              unoptimized={unopt(track.cover)}
              draggable={false}
              className="h-full w-full object-cover"
            />
          )}
        </div>
        <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ink-soft ring-2 ring-black" />
      </div>

      <div
        aria-hidden="true"
        className="absolute right-[6%] top-[6%] h-[62%] w-6 origin-[50%_12px] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{ transform: `rotate(${spinning ? 22 : 2}deg)` }}
      >
        <div className="mx-auto h-6 w-6 rounded-full bg-gold-soft ring-2 ring-gold/60" />
        <div className="mx-auto h-[85%] w-1.5 rounded-full bg-gradient-to-b from-ink-soft to-ink-faint" />
        <div className="mx-auto -mt-1 h-5 w-4 rounded-sm bg-gold" />
      </div>
    </div>
  );
}

function NowPlaying({
  track,
  playing,
  progress,
  onToggle,
}: {
  track: Track | null;
  playing: boolean;
  progress: number;
  onToggle: () => void;
}) {
  if (!track) {
    return (
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Now spinning</p>
        <p className="mt-2 font-display text-2xl uppercase leading-tight text-ink-faint">Nothing spinning yet</p>
      </div>
    );
  }
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Now spinning</p>
      <h3 className="mt-2 font-display text-3xl md:text-4xl uppercase leading-tight text-ink">{track.title}</h3>
      <p className="mt-1 text-ink-soft">{track.artist}</p>
      {track.note && <p className="mt-3 text-sm text-ink-soft">{track.note}</p>}

      <div className="mt-6 flex items-center gap-4">
        <button
          onClick={onToggle}
          disabled={!track.preview}
          aria-label={playing ? "Pause" : "Play"}
          className="press flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-accent text-paper text-xl shadow-soft transition-shadow hover:shadow-lift disabled:opacity-40 disabled:shadow-none"
        >
          <span aria-hidden="true">{playing ? "❚❚" : "▶"}</span>
        </button>
        <div className="flex-1">
          <div className="h-1 w-full overflow-hidden rounded-full bg-line">
            <div className="h-full bg-accent" style={{ width: `${progress * 100}%` }} />
          </div>
          <p className="mt-2 text-xs text-ink-faint">
            {track.preview ? "30-second preview" : "Preview unavailable"}
            {track.link && (
              <>
                {" · "}
                <a href={track.link} target="_blank" rel="noreferrer" className="hover:text-accent transition-colors">
                  Full song ↗
                </a>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

function Cover({ t, sizes, active = false }: { t: Track; sizes: string; active?: boolean }) {
  return (
    <>
      <span
        className={`block overflow-hidden rounded-sm shadow-soft transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lift ${
          active ? "ring-2 ring-gold" : ""
        }`}
      >
        {t.cover ? (
          <Image
            src={t.cover}
            alt={t.title}
            width={300}
            height={300}
            sizes={sizes}
            unoptimized={unopt(t.cover)}
            draggable={false}
            className="w-full aspect-square object-cover transition-transform duration-500 ease-out group-hover:scale-110 group-hover:rotate-3"
          />
        ) : (
          <Placeholder label="Artwork" className="w-full aspect-square" />
        )}
      </span>
      <span className="mt-3 block font-display text-base text-ink group-hover:text-accent transition-colors">
        {t.title}
      </span>
      <span className="block text-sm text-ink-faint">{t.artist}</span>
      {t.note && <span className="mt-1.5 block text-sm text-ink-soft">{t.note}</span>}
    </>
  );
}

function DesktopDeck({
  tracks,
  index,
  playing,
  progress,
  onToggle,
  load,
  setPlaying,
}: {
  tracks: Track[];
  index: number | null;
  playing: boolean;
  progress: number;
  onToggle: () => void;
  load: (i: number) => void;
  setPlaying: (v: boolean) => void;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const turntableRef = useRef<HTMLDivElement>(null);
  const draggedRef = useRef(false);
  const overRef = useRef(false);
  const [over, setOver] = useState(false);
  const track = index === null ? null : tracks[index];

  // Stop the music once the whole deck has scrolled out of view.
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) setPlaying(false);
    });
    io.observe(el);
    return () => io.disconnect();
  }, [setPlaying]);

  // Client coordinates (not info.point, which is page-relative and includes scroll).
  const isOver = (e: PointerEvent | MouseEvent | TouchEvent) => {
    const el = turntableRef.current;
    if (!el) return false;
    const p = "changedTouches" in e ? e.changedTouches[0] : e;
    if (!p) return false;
    const r = el.getBoundingClientRect();
    return p.clientX >= r.left && p.clientX <= r.right && p.clientY >= r.top && p.clientY <= r.bottom;
  };

  const setOverOnce = (v: boolean) => {
    if (v === overRef.current) return;
    overRef.current = v;
    setOver(v);
  };

  return (
    <MotionConfig reducedMotion="user">
      <div
        ref={rootRef}
        className="grid grid-cols-[minmax(0,400px)_minmax(0,1fr)] gap-12 lg:gap-16 items-start"
      >
        <div>
          <Turntable track={track} playing={playing} over={over} turntableRef={turntableRef} className="w-full" />
          <div className="mt-8">
            <NowPlaying track={track} playing={playing} progress={progress} onToggle={onToggle} />
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
            Drag a record onto the turntable, or click one
          </p>
          <div className="mt-6 grid grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-8">
            {tracks.map((t, i) => (
              <motion.button
                key={t.id}
                drag
                dragSnapToOrigin
                dragElastic={0}
                dragMomentum={false}
                whileDrag={{ scale: 1.06, zIndex: 50 }}
                style={{ position: "relative" }}
                aria-pressed={i === index}
                onDragStart={() => {
                  draggedRef.current = true;
                }}
                onDrag={(e) => setOverOnce(isOver(e))}
                onDragEnd={(e) => {
                  if (isOver(e)) load(i);
                  setOverOnce(false);
                  setTimeout(() => {
                    draggedRef.current = false;
                  }, 0);
                }}
                onClick={() => {
                  if (draggedRef.current) return;
                  load(i);
                }}
                className="group text-left cursor-grab active:cursor-grabbing"
              >
                <Cover t={t} sizes="(min-width: 1024px) 180px, 220px" active={i === index} />
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </MotionConfig>
  );
}

export default function VinylPlayer({ tracks }: { tracks: Track[] }) {
  const isDesktop = useIsDesktop();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [index, setIndex] = useState<number | null>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const track = index === null ? null : tracks[index];
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  useModalFocus(!isDesktop && track !== null, dialogRef, closeRef);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) audio.play().catch(() => setPlaying(false));
    else audio.pause();
  }, [playing, index]);

  useEffect(() => {
    if (index === null || isDesktop) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setPlaying(false);
      setIndex(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, isDesktop]);

  const load = (i: number) => {
    setProgress(0);
    setIndex(i);
    setPlaying(!!tracks[i].preview);
  };

  const close = () => {
    setPlaying(false);
    setIndex(null);
  };

  const toggle = () => setPlaying((p) => !p);

  return (
    <>
      {isDesktop ? (
        <DesktopDeck
          tracks={tracks}
          index={index}
          playing={playing}
          progress={progress}
          onToggle={toggle}
          load={load}
          setPlaying={setPlaying}
        />
      ) : (
        <>
          <div
            className={`grid gap-x-6 gap-y-10 ${
              tracks.length <= 2
                ? "grid-cols-2 md:grid-cols-2 max-w-md"
                : tracks.length === 5
                  ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-5"
                  : "grid-cols-2 sm:grid-cols-3 md:grid-cols-4"
            }`}
          >
            {tracks.map((t, i) => (
              <button key={t.id} onClick={() => load(i)} className="press group text-left">
                <Cover t={t} sizes="(min-width: 768px) 260px, (min-width: 640px) 33vw, 50vw" />
              </button>
            ))}
          </div>

          {/* Portal: the Reveal wrapper's transform would otherwise trap this fixed overlay inside it. */}
          {track && createPortal(
            <div
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              aria-label={`${track.title} by ${track.artist}`}
              onClick={close}
              className="animate-fade-in fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/85 p-6 backdrop-blur-sm"
            >
              <div
                onClick={(e) => e.stopPropagation()}
                className="animate-scale-in relative grid w-full max-w-4xl grid-cols-1 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] gap-8 md:gap-12 items-center"
              >
                <button
                  ref={closeRef}
                  onClick={close}
                  aria-label="Close player"
                  className="press absolute -top-11 right-0 md:-top-2 md:-right-2 z-10 text-3xl leading-none text-ink/70 hover:text-ink"
                >
                  ×
                </button>

                <Turntable track={track} playing={playing} className="mx-auto w-full max-w-sm md:max-w-md" />
                <NowPlaying track={track} playing={playing} progress={progress} onToggle={toggle} />
              </div>
            </div>,
            document.body
          )}
        </>
      )}

      {track?.preview && (
        <audio
          ref={audioRef}
          key={track.id}
          src={track.preview}
          preload="none"
          onTimeUpdate={(e) => setProgress(e.currentTarget.currentTime / (e.currentTarget.duration || 30))}
          onEnded={() => {
            setPlaying(false);
            setProgress(0);
          }}
        />
      )}
    </>
  );
}
