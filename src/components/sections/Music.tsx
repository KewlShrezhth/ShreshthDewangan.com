import Reveal from "@/components/Reveal";
import Placeholder from "@/components/Placeholder";
import SectionHeading from "@/components/SectionHeading";
import { music } from "@/data/music";

export default function Music() {
  return (
    <section id="music" className="py-24 md:py-32 border-t border-line scroll-mt-16">
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <Reveal>
          <SectionHeading index="04" title="Music" note="On repeat lately." />
        </Reveal>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-6 gap-y-10">
          {music.map((entry, i) => (
            <Reveal key={entry.id} delay={i * 80}>
              <div className="group">
                <div className="overflow-hidden rounded-sm shadow-soft transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lift">
                  {entry.artwork ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={entry.artwork}
                      alt={entry.title}
                      className="w-full aspect-square object-cover transition-transform duration-500 ease-out group-hover:scale-110 group-hover:rotate-3"
                    />
                  ) : (
                    <Placeholder
                      label="Artwork"
                      className="w-full aspect-square transition-transform duration-500 ease-out group-hover:scale-110 group-hover:rotate-3"
                    />
                  )}
                </div>
                <h3 className="mt-3 font-display text-base text-ink">
                  {entry.link ? (
                    <a href={entry.link} target="_blank" rel="noreferrer" className="hover:text-accent transition-colors">
                      {entry.title}
                    </a>
                  ) : (
                    entry.title
                  )}
                </h3>
                <p className="text-sm text-ink-faint">{entry.artist}</p>
                {entry.note && (
                  <p className="text-sm text-ink-soft mt-1.5">{entry.note}</p>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
