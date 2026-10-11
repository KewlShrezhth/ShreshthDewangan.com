"use client";

import { useEffect, useState } from "react";
import { useTabs, type SectionId } from "@/components/Tabs";

const nav: { id: SectionId; label: string }[] = [
  { id: "about", label: "About" },
  { id: "projects", label: "Projects" },
  { id: "photos", label: "Photos" },
  { id: "awards", label: "Awards" },
  { id: "music", label: "Music" },
  { id: "movies", label: "Movies" },
  { id: "links", label: "Links" },
];

export default function Nav({ siteName }: { siteName: string }) {
  const { active, setActive } = useTabs();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (id: SectionId) => {
    setActive(id);
    setOpen(false);
  };

  return (
    <header
      className={`sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-paper/80 bg-paper/95 border-b border-line transition-shadow duration-300 ${
        scrolled ? "shadow-soft" : ""
      }`}
    >
      <div aria-hidden="true" className="h-[2px] w-full bg-gold" />
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <div className="flex h-16 items-center justify-between">
          <button
            onClick={() => go("about")}
            className="font-display text-lg uppercase tracking-tight text-ink transition-colors hover:text-accent"
          >
            {siteName}
          </button>

          <nav className="hidden md:flex items-center gap-7">
            {nav.map((n) => (
              <button
                key={n.id}
                onClick={() => go(n.id)}
                className={`group relative py-1 text-sm uppercase tracking-wide transition-colors ${
                  active === n.id
                    ? "text-accent"
                    : "text-ink-soft hover:text-ink"
                }`}
              >
                {n.label}
                <span
                  className={`absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-accent transition-transform duration-300 ease-out group-hover:scale-x-100 ${
                    active === n.id ? "scale-x-100" : ""
                  }`}
                />
              </button>
            ))}
          </nav>

          <button
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
            aria-expanded={open}
            className="md:hidden flex flex-col gap-1.5 p-2"
          >
            <span
              className={`block h-px w-5 bg-ink transition-transform ${
                open ? "translate-y-[3px] rotate-45" : ""
              }`}
            />
            <span
              className={`block h-px w-5 bg-ink transition-transform ${
                open ? "-translate-y-[3px] -rotate-45" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {open && (
        <nav className="md:hidden border-t border-line px-6 py-4 flex flex-col gap-4 bg-paper">
          {nav.map((n) => (
            <button
              key={n.id}
              onClick={() => go(n.id)}
              className={`text-left text-sm ${
                active === n.id ? "text-accent" : "text-ink-soft"
              }`}
            >
              {n.label}
            </button>
          ))}
        </nav>
      )}
    </header>
  );
}
