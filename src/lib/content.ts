import { cacheLife, cacheTag } from "next/cache";
import { pool } from "@/lib/db";

export type SiteSettings = { name: string; tagline: string };
export type About = { name: string; intro: string[]; profileImage: string | null;
  email: string | null;
  linkedin: string | null;
};
export type Interest = { id: number; label: string };
export type Education = { id: number; school: string; detail: string };
export type Project = {
  id: number;
  name: string;
  description: string;
  stack: string[];
  images: string[];
  github: string | null;
  live: string | null;
  symbol: string | null;
  status: string | null;
};
export type Photo = { id: number; src: string; alt: string; caption: string | null };
export type Award = {
  id: number;
  title: string;
  organization: string;
  year: string;
  description: string | null;
  image: string | null;
};
export type MusicEntry = {
  id: number;
  title: string;
  artist: string;
  artwork: string | null;
  link: string | null;
  note: string | null;
};
export type Movie = {
  id: number;
  title: string;
  year: string;
  poster: string | null;
  rating: string | null;
  thoughts: string | null;
  link: string | null;
};

export async function getSiteSettings(): Promise<SiteSettings> {
  const { rows } = await pool.query("SELECT name, tagline FROM site_settings WHERE id = 1");
  return rows[0] ?? { name: "Your Name", tagline: "" };
}

export async function getAbout(): Promise<About> {
  const { rows } = await pool.query(
    "SELECT name, intro, profile_image AS \"profileImage\", email, linkedin FROM about WHERE id = 1"
  );
  const row = rows[0] ?? { name: "Your Name", intro: "", profileImage: null, email: null, linkedin: null };
  return {
    name: row.name,
    intro: row.intro ? row.intro.split("\n\n") : [],
    profileImage: row.profileImage,
    email: row.email ?? null,
    linkedin: row.linkedin ?? null,
  };
}

export async function getInterests(): Promise<Interest[]> {
  const { rows } = await pool.query(
    "SELECT id, label FROM interests ORDER BY sort_order ASC, id ASC"
  );
  return rows;
}

export async function getEducation(): Promise<Education[]> {
  const { rows } = await pool.query(
    "SELECT id, school, detail FROM education ORDER BY sort_order ASC, id ASC"
  );
  return rows;
}

export async function getProjects(): Promise<Project[]> {
  try {
    const { rows } = await pool.query(
      "SELECT id, name, description, stack, images, github, live, symbol, status FROM projects ORDER BY sort_order ASC, id ASC"
    );
    return rows;
  } catch (e) {
    // 42703 = column missing (deploy ran before the migration): fall back to the old columns
    if ((e as { code?: string }).code !== "42703") throw e;
    const { rows } = await pool.query(
      "SELECT id, name, description, stack, images, github, live, NULL AS symbol, NULL AS status FROM projects ORDER BY sort_order ASC, id ASC"
    );
    return rows;
  }
}

export type Stat = { id: number; label: string; value: string };

export async function getStats(): Promise<Stat[]> {
  try {
    const { rows } = await pool.query(
      "SELECT id, label, value FROM stats ORDER BY sort_order ASC, id ASC"
    );
    return rows;
  } catch (e) {
    // 42P01 = table missing (migration not run yet)
    if ((e as { code?: string }).code === "42P01") return [];
    throw e;
  }
}

export async function getPhotos(): Promise<Photo[]> {
  const { rows } = await pool.query(
    "SELECT id, src, alt, caption FROM photos ORDER BY sort_order ASC, id ASC"
  );
  return rows;
}

export type Thought = {
  id: number;
  title: string;
  date: string;
  body: string;
  link: string | null;
};

export async function getThoughts(): Promise<Thought[]> {
  try {
    const { rows } = await pool.query(
      "SELECT id, title, date, body, link FROM thoughts ORDER BY sort_order DESC, id DESC"
    );
    return rows;
  } catch (e) {
    // 42P01 = table missing (migration not run yet)
    if ((e as { code?: string }).code === "42P01") return [];
    throw e;
  }
}

export async function getAwards(): Promise<Award[]> {
  const { rows } = await pool.query(
    "SELECT id, title, organization, year, description, image FROM awards ORDER BY sort_order ASC, id ASC"
  );
  return rows;
}

export async function getMusic(): Promise<MusicEntry[]> {
  const { rows } = await pool.query(
    "SELECT id, title, artist, artwork, link, note FROM music ORDER BY sort_order ASC, id ASC"
  );
  return rows;
}

export async function getMovies(): Promise<Movie[]> {
  const { rows } = await pool.query(
    "SELECT id, title, year, poster, rating, thoughts, link FROM movies ORDER BY sort_order ASC, id ASC"
  );
  return rows;
}

export async function getSiteName(): Promise<string> {
  "use cache";
  cacheLife("hours");
  cacheTag("site");
  return (await getSiteSettings()).name;
}
