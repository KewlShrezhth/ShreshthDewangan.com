import Reveal from "@/components/Reveal";
import Placeholder from "@/components/Placeholder";
import SectionHeading from "@/components/SectionHeading";
import { getMovies } from "@/lib/content";

export default async function Movies() {
  const movies = await getMovies();

  return (
    <section id="movies" className="py-24 md:py-32 border-t border-line scroll-mt-16">
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <Reveal>
          <SectionHeading index="05" title="Movies" note="Films I keep coming back to." />
        </Reveal>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-x-6 gap-y-10">
          {movies.map((movie, i) => (
            <Reveal key={movie.id} delay={i * 80}>
              <div className="group">
                <div className="overflow-hidden rounded-sm shadow-soft transition-all duration-300 group-hover:-translate-y-1.5 group-hover:shadow-lift">
                  {movie.poster ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={movie.poster}
                      alt={movie.title}
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
                <p className="text-sm text-ink-faint">
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
