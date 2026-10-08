import Reveal from "@/components/Reveal";
import Placeholder from "@/components/Placeholder";
import SectionHeading from "@/components/SectionHeading";
import { awards } from "@/data/awards";

export default function Awards() {
  return (
    <section id="awards" className="py-24 md:py-32 border-t border-line scroll-mt-16">
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <Reveal>
          <SectionHeading index="03" title="Awards" note="Recognition along the way." />
        </Reveal>

        <div className="space-y-0 border-t border-line">
          {awards.map((award, i) => (
            <Reveal key={award.id} delay={i * 80}>
              <div className="group py-8 border-b border-line flex flex-col sm:flex-row gap-6 sm:items-center transition-all duration-300 hover:px-3 hover:bg-surface/50 hover:shadow-soft rounded-sm">
                {award.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={award.image}
                    alt={award.title}
                    className="w-20 h-20 object-cover rounded-sm shrink-0 shadow-soft ring-1 ring-gold/30 transition-transform duration-300 group-hover:scale-105 group-hover:rotate-2"
                  />
                ) : (
                  <Placeholder
                    label=""
                    className="w-20 h-20 rounded-sm shrink-0 shadow-soft ring-1 ring-gold/30 transition-transform duration-300 group-hover:scale-105 group-hover:rotate-2"
                  />
                )}

                <div className="flex-1">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <h3 className="font-display text-xl text-ink transition-colors duration-300 group-hover:text-accent">
                      {award.title}
                    </h3>
                    <span className="text-sm text-accent">{award.year}</span>
                  </div>
                  <p className="text-sm text-ink-faint mt-0.5">{award.organization}</p>
                  {award.description && (
                    <p className="text-ink-soft mt-2 max-w-2xl">{award.description}</p>
                  )}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
