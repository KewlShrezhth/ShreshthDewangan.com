import { getProjects, getStats, type Project } from "@/lib/content";
import { Fragment } from "react";
import { getChannel } from "@/lib/youtube";

// Ticker symbol shown on a project: the admin value, else up to 4 initials of the name.
export function projectSymbol(p: Pick<Project, "name" | "symbol">): string {
  const initials = p.name.split(/\s+/).map((w) => w.replace(/[^A-Za-z0-9]/g, "")[0] ?? "").join("");
  return p.symbol || initials.slice(0, 4).toUpperCase();
}

export function projectStatus(p: Pick<Project, "status" | "live">): string {
  return p.status || (p.live ? "LIVE" : "SHIPPED");
}

type Item = { label: string; value: string };

// ▲ only on growing counts: a plain number, optionally with K/M/+ and a word unit ("21", "4 STUDENTS", "1.2K+").
// No ▲ on placings ("6TH", "15 / 65") or a 4-digit year ("2027"); those read "LABEL · VALUE".
const rising = (v: string) => {
  const t = v.trim();
  return /^\d[\d,.]*[KkMm]?\+?(\s+[A-Za-z]+)*$/.test(t) && !/^(19|20)\d\d$/.test(t);
};

// Unstyled data component; Design styles it (plan P14 step 6).
// Curated values (ranks, tutoring counts) are owner-maintained in /admin/stats.
// Only live counts (projects, YouTube videos) are derived here. Never hard-code view counts.
export default async function Ticker() {
  const [stats, projects, channel] = await Promise.all([getStats(), getProjects(), getChannel()]);
  const items: Item[] = [
    ...stats.map((s) => ({ label: s.label, value: s.value })),
    ...(projects.length ? [{ label: "PROJECTS", value: String(projects.length) }] : []),
    ...(channel?.videoCount ? [{ label: "YOUTUBE VIDEOS", value: String(channel.videoCount) }] : []),
  ];
  if (items.length === 0) return null;

  const list = (copy: boolean) => (
    <ul
      className={`flex shrink-0 motion-reduce:shrink motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:gap-y-1 ${copy ? "ticker-copy" : ""}`}
      aria-hidden={copy || undefined}
    >
      {items.map((item, i) => (
        <li key={i} className="mx-[22px] whitespace-nowrap">
          {item.label}{" "}
          {rising(item.value) ? (
            <span aria-hidden="true" className="font-body text-[10px]">
              ▲
            </span>
          ) : (
            <span aria-hidden="true">·</span>
          )}{" "}
          {item.value}
        </li>
      ))}
    </ul>
  );

  // Gold strip under the nav. Pauses on hover/focus; under reduced motion it stops (globals.css) and wraps (motion-reduce classes).
  return (
    <div
      role="region"
      aria-label="Highlights"
      tabIndex={0}
      className="ticker overflow-hidden bg-gold py-2 font-mono text-[13px] font-semibold text-paper focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-paper"
    >
      {/* Four copies so each half is wider than any screen; only the first is read aloud. */}
      <div className="ticker-track">
        {[false, true, true, true].map((copy, i) => (
          <Fragment key={i}>{list(copy)}</Fragment>
        ))}
      </div>
    </div>
  );
}
