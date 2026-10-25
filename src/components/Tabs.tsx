"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export const SECTION_IDS = [
  "about",
  "work",
  "life",
] as const;

export type SectionId = (typeof SECTION_IDS)[number];

const LEGACY: Record<string, SectionId> = {
  projects: "work",
  awards: "work",
  photos: "life",
  music: "life",
  movies: "life",
};

const TabContext = createContext<{
  active: SectionId;
  setActive: (id: SectionId) => void;
} | null>(null);

export function TabsProvider({
  initial,
  children,
}: {
  initial?: string;
  children: ReactNode;
}) {
  const [active, setActiveState] = useState<SectionId>(
    SECTION_IDS.includes(initial as SectionId)
      ? (initial as SectionId)
      : (initial && LEGACY[initial]) || "about"
  );

  useEffect(() => {
    if (initial && LEGACY[initial]) {
      window.history.replaceState(null, "", `?tab=${LEGACY[initial]}`);
      document.getElementById(initial)?.scrollIntoView();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setActive = (id: SectionId) => {
    setActiveState(id);
    window.history.replaceState(null, "", id === "about" ? window.location.pathname : `?tab=${id}`);
    window.scrollTo({ top: 0 });
  };

  return (
    <TabContext.Provider value={{ active, setActive }}>
      {children}
    </TabContext.Provider>
  );
}

export function useTabs() {
  const ctx = useContext(TabContext);
  if (!ctx) throw new Error("useTabs must be used within TabsProvider");
  return ctx;
}

export function TabPanel({
  id,
  children,
}: {
  id: SectionId;
  children: ReactNode;
}) {
  const { active } = useTabs();
  return (
    <div id={id} className={active === id ? "block" : "hidden"}>
      {children}
    </div>
  );
}
