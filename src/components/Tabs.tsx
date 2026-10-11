"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

export const SECTION_IDS = [
  "about",
  "projects",
  "photos",
  "awards",
  "music",
  "movies",
  "links",
] as const;

export type SectionId = (typeof SECTION_IDS)[number];

const TabContext = createContext<{
  active: SectionId;
  setActive: (id: SectionId) => void;
} | null>(null);

export function TabsProvider({ children }: { children: ReactNode }) {
  const [active, setActiveState] = useState<SectionId>("about");

  const setActive = (id: SectionId) => {
    setActiveState(id);
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
