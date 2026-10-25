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

Changes save straight to the database and appear on the live site immediately — no code, no redeploy.

Image fields (profile photo, project image, photos, award image, artwork, poster) use "Choose from library" to upload a file directly from your device — it uploads to Vercel Blob storage and fills in the URL automatically.

## Environment variables

Required in `.env.local` locally and in your Vercel project's environment variables for production:

- `DATABASE_URL` — Postgres connection string (from the Vercel/Neon integration)
- `ADMIN_PASSWORD` — the password for `/admin`
- `ADMIN_SESSION_SECRET` — a long random string used as the HMAC key that signs the admin session token (the secret itself is never put in the cookie)
- `BLOB_READ_WRITE_TOKEN` — from a **public** Vercel Blob store (image uploads need public read access; private stores won't work for this)

## Admin sessions

- Logging in sets a signed session token in the `admin_session` cookie. It expires after 7 days.
- Changing `ADMIN_SESSION_SECRET` logs out every session at once. That is the only way to end sessions early.
- Logging out only clears the cookie in that browser.
- Login is limited to 5 failed attempts per IP address per 15 minutes, tracked in the `login_attempts` table. Each failed attempt also waits 1 second.
- After deploying this, the site owner must run `npm run db:migrate` once against the production `DATABASE_URL` so the `login_attempts` table exists. Until then login still works, but only the 1-second delay slows down guessing.

## Database scripts

- `npm run db:migrate` — creates/updates tables from `scripts/schema.sql`. Safe to re-run.
- `npm run db:seed` — inserts placeholder rows, but only into empty tables. Safe to re-run.
- `npm run test:session` — checks that session tokens verify when valid and fail when tampered with or expired. Needs no database.
