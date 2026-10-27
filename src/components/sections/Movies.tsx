import Image from "next/image";
import Reveal from "@/components/Reveal";
import Placeholder from "@/components/Placeholder";
import SectionHeading from "@/components/SectionHeading";
import { getMovies } from "@/lib/content";
import { unopt } from "@/lib/image";

export default async function Movies() {
  const movies = await getMovies();
  if (movies.length === 0) return null;
  const gridCls =
    movies.length === 1
      ? "grid-cols-1 max-w-[12rem]"
      : movies.length === 2
        ? "grid-cols-2 max-w-md"
        : "grid-cols-2 sm:grid-cols-3 md:grid-cols-5";

  return (
    <section className="py-14 md:py-20">
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <Reveal>
          <SectionHeading title="Movies" note="Films I keep coming back to." />
        </Reveal>

        <div className={`grid ${gridCls} gap-x-6 gap-y-10`}>
          {movies.map((movie, i) => (
            <Reveal key={movie.id} delay={i * 80}>
              <div className="group">
                <div className="overflow-hidden rounded-sm transition-transform duration-300 group-hover:-translate-y-0.5">
                  {movie.poster ? (
                    <Image
                      src={movie.poster}
                      alt={movie.title}
                      width={400}
                      height={600}
                      sizes="(min-width: 768px) 200px, (min-width: 640px) 33vw, 50vw"
                      unoptimized={unopt(movie.poster)}
                      className="w-full aspect-[2/3] object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                    />
                  ) : (
                    <Placeholder
                      label="Poster"
                      className="w-full aspect-[2/3] transition-transform duration-500 ease-out group-hover:scale-110"
                    />
                  )}
                </div>
                <h3 className="mt-3 font-display text-base text-ink leading-snug">
                  {movie.link ? (
                    <a href={movie.link} target="_blank" rel="noreferrer" className="hover:text-accent transition-colors">
                      {movie.title}
                    </a>
                  ) : (
                    movie.title
                  )}
                </h3>
                <p className="mt-0.5 font-mono text-[13px] text-ink-faint">
                  {movie.year}
                  {movie.rating ? ` · ${movie.rating}` : ""}
                </p>
                {movie.thoughts && (
                  <p className="text-sm text-ink-soft mt-1.5">{movie.thoughts}</p>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
