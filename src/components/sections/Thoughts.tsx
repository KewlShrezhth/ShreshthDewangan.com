import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import { getThoughts } from "@/lib/content";

export default async function Thoughts() {
  const thoughts = await getThoughts();
  if (thoughts.length === 0) return null;

  return (
    <section className="py-14 md:py-20">
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <Reveal>
          <SectionHeading title="Thoughts" note="Things I've been thinking about." />
        </Reveal>

        <div className="border-t border-line">
          {thoughts.map((t, i) => (
            <Reveal key={t.id} delay={i * 80}>
              <article className="py-8 border-b border-line">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <h3 className="font-display text-xl text-ink">{t.title}</h3>
                  <span className="font-mono text-sm text-gold">{t.date}</span>
                </div>
                <div className="mt-3 max-w-2xl space-y-4 text-ink-soft leading-relaxed">
                  {t.body
                    .split(/\n\s*\n/)
                    .filter((p) => p.trim() !== "")
                    .map((p, j) => (
                      <p key={j}>{p.trim()}</p>
                    ))}
                </div>
                {t.link && (
                  <a
                    href={t.link}
                    target="_blank"
                    rel="noreferrer"
                    className="group/link mt-5 inline-flex items-center gap-1.5 text-sm text-ink underline decoration-line hover:decoration-accent underline-offset-4 transition-colors hover:text-accent"
                  >
                    Read the post
                    <span className="transition-transform duration-300 group-hover/link:translate-x-1">
                      →
                    </span>
                  </a>
                )}
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
