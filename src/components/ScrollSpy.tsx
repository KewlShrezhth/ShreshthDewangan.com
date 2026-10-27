"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type SectionId = "about" | "work" | "thoughts" | "life";

const IDS: SectionId[] = ["about", "work", "thoughts", "life"];
const LEGACY = ["work", "thoughts", "life", "projects", "awards", "photos", "music", "movies"];

export function scrollToId(id: string) {
  const el = id === "about" ? null : document.getElementById(id);
  if (!el) {
    window.scrollTo({ top: 0 });
    return;
  }
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
}

const ActiveContext = createContext<SectionId>("about");

export function ScrollSpyProvider({ children }: { children: ReactNode }) {
  const [active, setActive] = useState<SectionId>("about");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(e.target.id as SectionId);
        }
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    for (const id of IDS) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const tab = new URLSearchParams(window.location.search).get("tab");
    if (tab === null) return;
    if (tab && LEGACY.includes(tab)) {
      requestAnimationFrame(() => scrollToId(tab));
      window.history.replaceState(null, "", "/#" + tab);
    } else {
      window.history.replaceState(null, "", window.location.pathname);
    }
  }, []);

  return <ActiveContext.Provider value={active}>{children}</ActiveContext.Provider>;
}

export function useActiveSection() {
  return useContext(ActiveContext);
}
