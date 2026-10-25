import Image from "next/image";
import Reveal from "@/components/Reveal";
import Placeholder from "@/components/Placeholder";
import SectionHeading from "@/components/SectionHeading";
import { getProjects } from "@/lib/content";
import { unopt } from "@/lib/image";

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
                <div className="order-2 md:order-1 overflow-hidden rounded-sm shadow-soft">
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
                  <h3 className="font-display uppercase text-2xl md:text-3xl text-ink">
                    {project.name}
                  </h3>
                  <p className="mt-3 text-ink-soft leading-relaxed max-w-2xl">
                    {project.description}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {project.stack.map((tech) => (
                      <span
                        key={tech}
                        className="text-xs tracking-wide uppercase px-2.5 py-1 border border-line text-ink-faint rounded-full"
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
