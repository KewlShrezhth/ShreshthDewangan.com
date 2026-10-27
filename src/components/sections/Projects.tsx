import Image from "next/image";
import Reveal from "@/components/Reveal";
import Placeholder from "@/components/Placeholder";
import SectionHeading from "@/components/SectionHeading";
import { getProjects } from "@/lib/content";
import { unopt } from "@/lib/image";
import { projectStatus, projectSymbol } from "@/components/Ticker";

export default async function Projects() {
  const projects = await getProjects();
  if (projects.length === 0) return null;

  return (
    <section className="pt-20 md:pt-28 pb-14 md:pb-20">
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <Reveal>
          <SectionHeading title="Projects" note="A few things I've built." />
        </Reveal>

        <div className="divide-y divide-line">
          {projects.map((project, i) => (
            <Reveal key={project.id} delay={i * 80}>
              <article className="py-10 md:py-14 grid grid-cols-1 md:grid-cols-[280px_minmax(0,1fr)] gap-8 md:gap-14 items-start">
                <div className="order-2 md:order-1 overflow-hidden rounded-sm border border-gold/35">
                  {project.images[0] ? (
                    <Image
                      src={project.images[0]}
                      alt={project.name}
                      width={560}
                      height={420}
                      sizes="(min-width: 768px) 280px, 100vw"
                      unoptimized={unopt(project.images[0])}
                      className="w-full aspect-[4/3] object-cover"
                    />
                  ) : (
                    <Placeholder
                      label="Project image"
                      className="w-full aspect-[4/3]"
                    />
                  )}
                </div>

                <div className="order-1 md:order-2">
                  {/* Holding row: ticker symbol and status, like a line in a portfolio statement. */}
                  <p className="mb-2 flex max-w-2xl items-baseline justify-between gap-4 font-mono text-xs font-semibold tracking-[0.1em] text-gold">
                    <span>{"$" + projectSymbol(project)}</span>
                    <span className="text-mint">
                      <span aria-hidden="true" className="font-body text-[9px]">▲</span> {projectStatus(project)}
                    </span>
                  </p>
                  <h3 className="font-display text-xl sm:text-2xl md:text-3xl leading-tight text-ink break-words">
                    {project.name}
                  </h3>
                  <p className="mt-3 text-ink-soft leading-relaxed max-w-2xl">
                    {project.description}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {project.stack.map((tech) => (
                      <span
                        key={tech}
                        className="font-mono text-[11px] px-2.5 py-1 border border-gold/25 text-ink-soft rounded-full"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="mt-6 flex gap-5 text-sm">
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noreferrer"
                        className="group/link inline-flex items-center gap-1.5 text-ink underline decoration-line hover:decoration-accent underline-offset-4 transition-colors hover:text-accent"
                      >
                        Code
                        <span className="transition-transform duration-300 group-hover/link:translate-x-1">
                          →
                        </span>
                      </a>
                    )}
                    {project.live && (
                      <a
                        href={project.live}
                        target="_blank"
                        rel="noreferrer"
                        className="group/link inline-flex items-center gap-1.5 text-ink underline decoration-line hover:decoration-accent underline-offset-4 transition-colors hover:text-accent"
                      >
                        Live site
                        <span className="transition-transform duration-300 group-hover/link:translate-x-1">
                          →
                        </span>
                      </a>
                    )}
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
