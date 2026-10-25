"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Placeholder from "@/components/Placeholder";
import { unopt } from "@/lib/image";

type Track = {
  id: number;
  title: string;
  artist: string;
  note: string | null;
  cover: string | null;
  preview: string | null;
  link: string | null;
};

export default function VinylPlayer({ tracks }: { tracks: Track[] }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [index, setIndex] = useState<number | null>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const track = index === null ? null : tracks[index];

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) audio.play().catch(() => setPlaying(false));
    else audio.pause();
  }, [playing, index]);

  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setPlaying(false);
      setIndex(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index]);

  const open = (i: number) => {
    setProgress(0);
    setIndex(i);
    setPlaying(!!tracks[i].preview);
  };

  const close = () => {
    setPlaying(false);
    setIndex(null);
  };

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-6 gap-y-10">
        {tracks.map((t, i) => (
          <button key={t.id} onClick={() => open(i)} className="press group text-left">
            <span className="block overflow-hidden rounded-sm shadow-soft transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lift">
              {t.cover ? (
                <Image
                  src={t.cover}
                  alt={t.title}
                  width={300}
                  height={300}
                  sizes="(min-width: 768px) 260px, (min-width: 640px) 33vw, 50vw"
                  unoptimized={unopt(t.cover)}
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
          </button>
        ))}
      </div>

      {/* Portal: the Reveal wrapper's transform would otherwise trap this fixed overlay inside it. */}
      {track && createPortal(
        <div
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
              onClick={close}
              aria-label="Close player"
              className="press absolute -top-11 right-0 md:-top-2 md:-right-2 z-10 text-3xl leading-none text-ink/70 hover:text-ink"
            >
              ×
            </button>

            <div className="relative mx-auto w-full max-w-sm md:max-w-md aspect-square rounded-2xl bg-surface ring-1 ring-line shadow-lift">
              <div
                className="absolute inset-[7%] rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.7)] animate-[spin_1.8s_linear_infinite]"
                style={{
                  animationPlayState: playing ? "running" : "paused",
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
                  {track.cover && (
                    <Image
                      src={track.cover}
                      alt=""
                      width={180}
                      height={180}
                      sizes="180px"
                      unoptimized={unopt(track.cover)}
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>
                <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ink-soft ring-2 ring-black" />
              </div>

              <div
                aria-hidden="true"
                className="absolute right-[6%] top-[6%] h-[62%] w-6 origin-[50%_12px] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
                style={{ transform: `rotate(${playing ? 22 : 2}deg)` }}
              >
                <div className="mx-auto h-6 w-6 rounded-full bg-gold-soft ring-2 ring-gold/60" />
                <div className="mx-auto h-[85%] w-1.5 rounded-full bg-gradient-to-b from-ink-soft to-ink-faint" />
                <div className="mx-auto -mt-1 h-5 w-4 rounded-sm bg-gold" />
              </div>
            </div>

            <div>
              <p className="font-display text-xs uppercase tracking-[0.2em] text-gold">Now spinning</p>
              <h3 className="mt-2 font-display text-3xl md:text-4xl uppercase leading-tight text-ink">{track.title}</h3>
              <p className="mt-1 text-ink-soft">{track.artist}</p>
              {track.note && <p className="mt-3 text-sm text-ink-soft">{track.note}</p>}

              <div className="mt-6 flex items-center gap-4">
                <button
                  onClick={() => setPlaying((p) => !p)}
                  disabled={!track.preview}
                  aria-label={playing ? "Pause" : "Play"}
                  className="press flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-accent text-paper text-xl shadow-soft transition-shadow hover:shadow-lift disabled:opacity-40 disabled:shadow-none"
                >
                  {playing ? "❚❚" : "▶"}
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
          </div>

          {track.preview && (
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
        </div>,
        document.body
      )}
    </>
  );
}
