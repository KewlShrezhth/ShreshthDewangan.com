import Image from "next/image";
import Reveal from "@/components/Reveal";
import Placeholder from "@/components/Placeholder";
import GoToTab from "@/components/GoToTab";
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
    <section className="relative overflow-hidden pt-20 md:pt-28 pb-24 md:pb-32">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full opacity-25 blur-3xl"
        style={{ background: "var(--accent)" }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-32 -left-32 h-80 w-80 rounded-full opacity-[0.15] blur-3xl"
        style={{ background: "var(--accent)" }}
      />

      <div className="relative mx-auto max-w-6xl px-6 md:px-10">
        <div>
          <p className="font-display text-sm text-accent tracking-[0.2em] mb-5">
            Hello, I&rsquo;m
          </p>
          <h1 className="font-display inline-block max-w-full bg-accent px-4 py-1.5 text-5xl sm:text-6xl md:text-7xl uppercase tracking-tight text-paper leading-[1.05] shadow-lift">
            {about.name}
          </h1>
          <p className="mt-6 text-lg md:text-xl text-ink-soft max-w-xl">
            {site.tagline}
          </p>

          <GoToTab
            id="work"
            className="press hover-lift group mt-8 inline-flex items-center gap-2 rounded-sm bg-accent px-5 py-2.5 text-sm font-semibold uppercase tracking-wide text-paper shadow-soft hover:shadow-lift"
          >
            See my work
            <span className="transition-transform duration-300 group-hover:translate-y-0.5">
              ↓
            </span>
          </GoToTab>
          {(about.email || about.linkedin) && (
            <a
              href="#contact"
              className="press hover-lift mt-8 ml-3 inline-flex items-center rounded-sm border border-accent px-5 py-2.5 text-sm font-semibold uppercase tracking-wide text-accent"
            >
              Contact
            </a>
          )}
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_280px] gap-12 md:gap-16 items-start">
          <Reveal delay={100}>
            <div className="space-y-5 text-ink-soft leading-relaxed">
              {about.intro.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>

            <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-10">
              <div>
                <h2 className="font-display text-sm tracking-widest text-ink-faint uppercase mb-3">
                  Interests
                </h2>
                <div className="flex flex-wrap gap-2">
                  {interests.map((item) => (
                    <span
                      key={item.id}
                      className="rounded-full border border-line px-3 py-1 text-sm text-ink-soft"
                    >
                      {item.label}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h2 className="font-display text-sm tracking-widest text-ink-faint uppercase mb-3">
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
            </div>

            {(about.email || about.linkedin) && (
              <div id="contact" className="mt-12 scroll-mt-24">
                <h2 className="font-display text-sm tracking-widest text-ink-faint uppercase mb-3">
                  Contact
                </h2>
                <div className="flex flex-wrap gap-2">
                  {about.email && (
                    <a href={`mailto:${about.email}`} className="rounded-full border border-line px-3 py-1 text-sm text-ink-soft transition-colors hover:border-accent/40 hover:text-accent">
                      {about.email}
                    </a>
                  )}
                  {about.linkedin && (
                    <a
                      href={about.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-full border border-line px-3 py-1 text-sm text-ink-soft transition-colors hover:border-accent/40 hover:text-accent"
                    >
                      LinkedIn
                    </a>
                  )}
                </div>
              </div>
            )}
          </Reveal>

          <Reveal delay={200}>
            <div className="hover-lift rounded-sm bg-paper p-1.5 shadow-soft ring-1 ring-gold/30 hover:shadow-lift">
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
      </div>
    </section>
  );
}
