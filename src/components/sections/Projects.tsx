import Reveal from "@/components/Reveal";
import Placeholder from "@/components/Placeholder";
import SectionHeading from "@/components/SectionHeading";
import { projects } from "@/data/projects";

export default function Projects() {
  return (
    <section id="projects" className="py-24 md:py-32 border-t border-line scroll-mt-16">
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <Reveal>
          <SectionHeading index="01" title="Projects" note="A few things I've built." />
        </Reveal>

        <div className="divide-y divide-line">
          {projects.map((project, i) => (
            <Reveal key={project.id} delay={i * 80}>
              <article className="py-10 md:py-14 grid grid-cols-1 md:grid-cols-[280px_minmax(0,1fr)] gap-8 md:gap-14 items-start group transition-transform duration-300 md:hover:-translate-y-1">
                <div className="order-2 md:order-1 overflow-hidden rounded-sm shadow-soft transition-shadow duration-300 group-hover:shadow-lift">
                  {project.images[0] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={project.images[0]}
                      alt={project.name}
                      className="w-full aspect-[4/3] object-cover transition-transform duration-500 ease-out group-hover:scale-[1.06] group-hover:-rotate-1"
                    />
                  ) : (
                    <Placeholder
                      label="Project image"
                      className="w-full aspect-[4/3] transition-transform duration-500 ease-out group-hover:scale-[1.06] group-hover:-rotate-1"
                    />
                  )}
                </div>

                <div className="order-1 md:order-2">
                  <h3 className="font-display text-2xl md:text-3xl text-ink transition-colors duration-300 group-hover:text-accent">
                    {project.name}
                  </h3>
                  <p className="mt-3 text-ink-soft leading-relaxed max-w-2xl">
                    {project.description}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {project.stack.map((tech) => (
                      <span
                        key={tech}
                        className="text-xs tracking-wide uppercase px-2.5 py-1 border border-line text-ink-faint rounded-full transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/40 hover:text-accent hover:shadow-soft"
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
