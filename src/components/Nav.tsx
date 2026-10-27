"use client";

import { useEffect, useState } from "react";
import { useActiveSection, scrollToId, type SectionId } from "@/components/ScrollSpy";

export default function Nav({
  siteName,
  hasWork = true,
  hasThoughts = false,
  hasLife = true,
}: {
  siteName: string;
  hasWork?: boolean;
  hasThoughts?: boolean;
  hasLife?: boolean;
}) {
  const active = useActiveSection();
  const nav: { id: SectionId; label: string }[] = [
    { id: "about", label: "About" },
    ...(hasWork ? [{ id: "work" as const, label: "Work" }] : []),
    ...(hasThoughts ? [{ id: "thoughts" as const, label: "Thoughts" }] : []),
    ...(hasLife ? [{ id: "life" as const, label: "Life" }] : []),
  ];
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (id: SectionId) => {
    setOpen(false);
    requestAnimationFrame(() => requestAnimationFrame(() => scrollToId(id)));
  };

  return (
    <header
      className={`sticky top-0 z-50 bg-paper transition-shadow duration-300 ${
        scrolled
          ? "shadow-[0_12px_20px_-16px_rgba(0,0,0,0.6)]"
          : "shadow-[0_1px_0_0_var(--line)]"
      }`}
    >
      <div aria-hidden="true" className="h-[2px] w-full bg-gold" />
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <div className="flex h-16 items-center justify-between">
          <button
            onClick={() => go("about")}
            className="press font-display text-lg text-ink transition-colors hover:text-gold"
          >
            {siteName}
          </button>

          <nav className="hidden md:flex items-center gap-7">
            {nav.map((n) => (
              <button
                key={n.id}
                onClick={() => go(n.id)}
                className={`press group relative py-1 text-[15px] transition-colors ${
                  active === n.id
                    ? "text-gold"
                    : "text-ink-soft hover:text-ink"
                }`}
              >
                {n.label}
                <span
                  className={`absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-gold transition-transform duration-300 ease-out group-hover:scale-x-100 ${
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
            className="press md:hidden flex flex-col gap-1.5 p-2"
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
        <nav className="md:hidden border-y border-gold/25 bg-surface px-6 py-2 flex flex-col">
          {nav.map((n) => (
            <button
              key={n.id}
              onClick={() => go(n.id)}
              className={`press py-3 text-left text-base ${
                active === n.id ? "text-gold" : "text-ink-soft"
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
