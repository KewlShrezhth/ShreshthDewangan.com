"use client";

import { useTabs, type SectionId } from "@/components/Tabs";

export default function GoToTab({
  id,
  className,
  children,
}: {
  id: SectionId;
  className?: string;
  children: React.ReactNode;
}) {
  const { setActive } = useTabs();
  return (
    <button onClick={() => setActive(id)} className={className}>
      {children}
    </button>
  );
}
