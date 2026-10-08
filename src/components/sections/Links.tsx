import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import { Icon } from "@/components/icons";
import { getLinks } from "@/lib/content";

export default async function Links() {
  const links = await getLinks();

  return (
    <section id="links" className="py-24 md:py-32 border-t border-line scroll-mt-16">
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <Reveal>
          <SectionHeading index="06" title="Links" note="Find me elsewhere." />
        </Reveal>

        <Reveal delay={100}>
          <div className="flex flex-col divide-y divide-line border-t border-b border-line max-w-md">
            {links.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="group relative flex items-center justify-between overflow-hidden py-4 px-3 -mx-3 text-ink transition-colors duration-300 hover:text-accent"
              >
                <span
                  aria-hidden="true"
                  className="absolute inset-0 origin-left scale-x-0 bg-accent-soft/40 transition-transform duration-300 ease-out group-hover:scale-x-100"
                />
                <span className="relative flex items-center gap-3">
                  <Icon kind={link.kind} />
                  <span className="font-display text-lg transition-transform duration-300 group-hover:translate-x-1">
                    {link.label}
                  </span>
                </span>
                <span className="relative text-ink-faint transition-all duration-300 group-hover:translate-x-1.5 group-hover:text-gold">
                  →
                </span>
              </a>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
