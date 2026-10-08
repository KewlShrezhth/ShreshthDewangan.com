export type Movie = {
  id: string;
  title: string;
  year: string;
  poster?: string;
  rating?: string;
  thoughts?: string;
  link?: string;
};

// Add movies here.
export const movies: Movie[] = [
  {
    id: "movie-one",
    title: "Movie title",
    year: "20XX",
    thoughts: "Optional short thoughts on why you liked it.",
  },
];
