import AdminListEditor from "../_components/AdminListEditor";
import { getMovies } from "@/lib/content";

export const instant = false;

export default async function AdminMoviesPage() {
  const movies = await getMovies();

  return (
    <AdminListEditor
      table="movies"
      title="Movies"
      items={movies}
      fields={[
        { name: "title", label: "Title" },
        { name: "year", label: "Year" },
        { name: "poster", label: "Poster URL (optional)" },
        { name: "rating", label: "Rating (optional)" },
        { name: "thoughts", label: "Thoughts (optional)", type: "textarea" },
        { name: "link", label: "Link (optional)" },
      ]}
    />
  );
}
