import { pool } from "@/lib/db";

export type SiteSettings = { name: string; tagline: string };
export type About = { name: string; intro: string[]; profileImage: string | null };
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
export type LinkEntry = { id: number; kind: string; label: string; url: string };

export async function getSiteSettings(): Promise<SiteSettings> {
  const { rows } = await pool.query("SELECT name, tagline FROM site_settings WHERE id = 1");
  return rows[0] ?? { name: "Your Name", tagline: "" };
}

export async function getAbout(): Promise<About> {
  const { rows } = await pool.query(
    "SELECT name, intro, profile_image AS \"profileImage\" FROM about WHERE id = 1"
  );
  const row = rows[0] ?? { name: "Your Name", intro: "", profileImage: null };
  return {
    name: row.name,
    intro: row.intro ? row.intro.split("\n\n") : [],
    profileImage: row.profileImage,
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
  const { rows } = await pool.query(
    "SELECT id, name, description, stack, images, github, live FROM projects ORDER BY sort_order ASC, id ASC"
  );
  return rows;
}

export async function getPhotos(): Promise<Photo[]> {
  const { rows } = await pool.query(
    "SELECT id, src, alt, caption FROM photos ORDER BY sort_order ASC, id ASC"
  );
  return rows;
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

export async function getLinks(): Promise<LinkEntry[]> {
  const { rows } = await pool.query(
    "SELECT id, kind, label, url FROM links ORDER BY sort_order ASC, id ASC"
  );
  return rows;
}
