import Image from "next/image";
import Reveal from "@/components/Reveal";
import Placeholder from "@/components/Placeholder";
import { getAbout, getEducation, getInterests, getSiteSettings } from "@/lib/content";
import { unopt } from "@/lib/image";

export default async function About() {
  const [about, interests, education, site] = await Promise.all([
    getAbout(),
    getInterests(),
    getEducation(),
    getSiteSettings(),
  ]);

  return (
    <section className="relative pt-16 md:pt-24 pb-24 md:pb-32">
      <div className="relative mx-auto max-w-6xl px-6 md:px-10">
        <div className="grid items-center gap-10 md:grid-cols-[minmax(0,1fr)_280px] md:gap-16">
          <div>
            {/* Banknote: a gold border, a fainter second line outside it, and a serial number. */}
            <div className="relative rounded-md border-[1.5px] border-gold px-6 pb-7 pt-10 outline outline-1 outline-offset-[5px] outline-gold/35 sm:px-8 sm:pb-8">
              <span
                aria-hidden="true"
                className="absolute right-3.5 top-2.5 font-mono text-xs tracking-[0.1em] text-gold"
              >
                SD · 2027 · 0001
              </span>
              <p className="mb-3 text-sm font-semibold tracking-[0.12em] text-gold">
                Hello, I&rsquo;m
              </p>
              <h1 className="font-display text-4xl leading-[1.08] text-ink break-words sm:text-5xl md:text-6xl">
                {about.name}
              </h1>
              <p className="mt-4 max-w-xl text-lg italic leading-relaxed text-ink-soft md:text-xl">
                {site.tagline}
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#work"
                className="press group inline-flex items-center gap-2 rounded-sm border border-gold px-5 py-2.5 text-sm font-semibold text-gold transition-colors hover:bg-gold hover:text-paper"
              >
                See my work
                <span className="transition-transform duration-300 group-hover:translate-y-0.5">
                  ↓
                </span>
              </a>
              {(about.email || about.linkedin) && (
                <a
                  href="#contact"
                  className="press inline-flex items-center rounded-sm border border-gold px-5 py-2.5 text-sm font-semibold text-gold transition-colors hover:bg-gold hover:text-paper"
                >
                  Contact
                </a>
              )}
            </div>
          </div>

          <Reveal delay={200}>
            <div className="rounded-sm bg-paper p-1.5 ring-1 ring-gold/60">
              {about.profileImage ? (
                <Image
                  src={about.profileImage}
                  alt={about.name}
                  width={560}
                  height={700}
                  sizes="(min-width: 768px) 280px, 100vw"
                  preload
                  unoptimized={unopt(about.profileImage)}
                  className="w-full aspect-[4/5] object-cover rounded-sm"
                />
              ) : (
                <Placeholder label="Profile photo" className="w-full aspect-[4/5] rounded-sm" />
              )}
            </div>
          </Reveal>
        </div>

        <Reveal delay={100}>
          <div className="mt-12 max-w-3xl md:mt-16">
            <div className="space-y-5 text-ink leading-relaxed">
              {about.intro.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>

            <div className="mt-12">
              <h2 className="mb-3 font-mono text-[13px] font-semibold uppercase tracking-[0.1em] text-gold">
                Interests
              </h2>
              <div className="flex flex-wrap gap-2">
                {interests
                  .filter((i) => i.label?.trim())
                  .map((item) => (
                    <span
                      key={item.id}
                      className="rounded-full border border-gold/25 px-3 py-1 text-sm text-ink-soft"
                    >
                      {item.label}
                    </span>
                  ))}
              </div>
            </div>

            <div className="mt-12">
              <h2 className="mb-3 font-mono text-[13px] font-semibold uppercase tracking-[0.1em] text-gold">
                Education
              </h2>
              <ul className="space-y-3 text-ink-soft">
                {education.map((e) => (
                  <li key={e.id}>
                    <p className="text-ink">{e.school}</p>
                    <p className="text-sm">{e.detail}</p>
                  </li>
                ))}
              </ul>
            </div>

            {(about.email || about.linkedin) && (
              <div id="contact" className="mt-12 scroll-mt-24">
                <h2 className="mb-3 font-mono text-[13px] font-semibold uppercase tracking-[0.1em] text-gold">
                  Contact
                </h2>
                <div className="flex flex-wrap gap-2">
                  {about.email && (
                    <a href={`mailto:${about.email}`} className="rounded-full border border-gold/25 px-3 py-1 text-sm text-ink-soft transition-colors hover:border-gold hover:text-gold">
                      {about.email}
                    </a>
                  )}
                  {about.linkedin && (
                    <a
                      href={about.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-full border border-gold/25 px-3 py-1 text-sm text-ink-soft transition-colors hover:border-gold hover:text-gold"
                    >
                      LinkedIn
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
