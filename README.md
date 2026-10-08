This is a personal portfolio site built with [Next.js](https://nextjs.org) (App Router), TypeScript, Tailwind CSS, and Postgres (Neon).

## Getting Started

Copy the database and admin env vars into `.env.local` (not committed — ask for the values if you don't have them), then:

```bash
npm install
npm run db:migrate   # creates tables if they don't exist yet
npm run db:seed       # only needed once, to seed placeholder content into a fresh database
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Editing content

All content lives in the database now, not in code. Edit everything at **`/admin`** (e.g. `https://yoursite.com/admin`), protected by the password in `ADMIN_PASSWORD`:

- **Profile** — site name, tagline, bio, interests, education, profile photo
- **Projects** — name, description, stack, image URLs, GitHub/live links
- **Photos** — gallery images
- **Awards** — title, organization, year, description, optional image
- **Music** — title, artist, artwork, link, personal note
- **Movies** — title, year, poster, rating, thoughts, link
- **Links** — external links

Changes save straight to the database and appear on the live site immediately — no code, no redeploy.

Image fields currently take a URL (host the image anywhere and paste the link) rather than a file upload.

## Environment variables

Required in `.env.local` locally and in your Vercel project's environment variables for production:

- `DATABASE_URL` — Postgres connection string (from the Vercel/Neon integration)
- `ADMIN_PASSWORD` — the password for `/admin`
- `ADMIN_SESSION_SECRET` — a long random string used to sign the admin session cookie

## Database scripts

- `npm run db:migrate` — creates/updates tables from `scripts/schema.sql`. Safe to re-run.
- `npm run db:seed` — inserts placeholder rows, but only into empty tables. Safe to re-run.
