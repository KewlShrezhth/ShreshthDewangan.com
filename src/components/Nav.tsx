"use client";

import { useEffect, useState } from "react";

const nav = [
  { id: "about", label: "About" },
  { id: "projects", label: "Projects" },
  { id: "photos", label: "Photos" },
  { id: "awards", label: "Awards" },
  { id: "music", label: "Music" },
  { id: "movies", label: "Movies" },
  { id: "links", label: "Links" },
] as const;

export default function Nav({ siteName }: { siteName: string }) {
  const [active, setActive] = useState<string>("about");
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = nav
      .map((n) => document.getElementById(n.id))
      .filter((el): el is HTMLElement => !!el);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: [0, 0.25, 0.5, 1] }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-paper/80 bg-paper/95 border-b border-line transition-shadow duration-300 ${
        scrolled ? "shadow-soft" : ""
      }`}
    >
      <div aria-hidden="true" className="h-[2px] w-full bg-gold" />
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <div className="flex h-16 items-center justify-between">
          <a
            href="#about"
            className="font-display text-lg uppercase tracking-tight text-ink transition-colors hover:text-accent"
          >
            {siteName}
          </a>

          <nav className="hidden md:flex items-center gap-7">
            {nav.map((n) => (
              <a
                key={n.id}
                href={`#${n.id}`}
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
              </a>
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
            <a
              key={n.id}
              href={`#${n.id}`}
              onClick={() => setOpen(false)}
              className={`text-sm ${
                active === n.id ? "text-accent" : "text-ink-soft"
              }`}
            >
              {n.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
