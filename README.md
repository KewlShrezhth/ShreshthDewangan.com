This is a personal portfolio site built with [Next.js](https://nextjs.org) (App Router), TypeScript, and Tailwind CSS.

## Getting Started

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Editing content

All editable content lives in `src/data/` — one file per section. No need to touch components to add or change content:

- `src/data/about.ts` — name, intro paragraphs, interests, education, profile image
- `src/data/projects.ts` — project name, description, stack, images, GitHub/live links
- `src/data/photos.ts` — gallery photos (add image files to `public/photos/` and reference them, e.g. `"/photos/my-photo.jpg"`)
- `src/data/awards.ts` — award title, organization, year, description, optional image
- `src/data/music.ts` — song/album, artist, artwork, link, personal note
- `src/data/movies.ts` — title, year, poster, rating, thoughts, link
- `src/data/links.ts` — external links (GitHub stays first)
- `src/data/site.ts` — site name and tagline shown in the nav/hero

Images referenced from these files should be placed under `public/` (e.g. `public/photos/`, `public/projects/`, `public/awards/`, `public/music/`, `public/movies/`) and referenced with a leading `/`.

Sections with no content yet (or missing images) automatically fall back to a clean placeholder, so the site stays visually complete while real content is filled in.
