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
        className="pointer-events-none hidden md:block absolute -top-24 -right-24 h-96 w-96 rounded-full opacity-25 blur-3xl"
        style={{ background: "var(--accent)" }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none hidden md:block absolute top-32 -left-32 h-80 w-80 rounded-full opacity-[0.15] blur-3xl"
        style={{ background: "var(--accent)" }}
      />

      <div className="relative mx-auto max-w-6xl px-6 md:px-10">
        <div className="grid items-center gap-10 md:grid-cols-[minmax(0,1fr)_280px] md:gap-16">
          <div>
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-ink-soft sm:text-sm">
              Hello, I&rsquo;m
            </p>
            <div>
              <h1 className="font-display box-decoration-clone inline bg-accent px-4 py-1.5 text-5xl uppercase leading-[1.25] tracking-tight text-paper shadow-lift sm:text-6xl md:text-7xl">
                {about.name}
              </h1>
            </div>
            <p className="mt-6 max-w-xl text-lg text-ink-soft md:text-xl">
              {site.tagline}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <GoToTab
                id="work"
                className="press hover-lift group inline-flex items-center gap-2 rounded-sm border border-accent px-5 py-2.5 text-sm font-semibold uppercase tracking-wide text-accent hover:bg-accent hover:text-paper"
              >
                See my work
                <span className="transition-transform duration-300 group-hover:translate-y-0.5">
                  ↓
                </span>
              </GoToTab>
              {(about.email || about.linkedin) && (
                <a
                  href="#contact"
                  className="press hover-lift inline-flex items-center rounded-sm border border-accent px-5 py-2.5 text-sm font-semibold uppercase tracking-wide text-accent hover:bg-accent hover:text-paper"
                >
                  Contact
                </a>
              )}
            </div>
          </div>

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

        <Reveal delay={100}>
          <div className="mt-12 max-w-3xl md:mt-16">
            <div className="space-y-5 text-ink-soft leading-relaxed">
              {about.intro.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>

            <div className="mt-12">
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-ink-faint">
                Interests
              </h2>
              <div className="flex flex-wrap gap-2">
                {interests
                  .filter((i) => i.label?.trim())
                  .map((item) => (
                    <span
                      key={item.id}
                      className="rounded-full border border-line px-3 py-1 text-sm text-ink-soft"
                    >
                      {item.label}
                    </span>
                  ))}
              </div>
            </div>

            <div className="mt-12">
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-ink-faint">
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
                <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-ink-faint">
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
          </div>
        </Reveal>
      </div>
    </section>
  );
}
