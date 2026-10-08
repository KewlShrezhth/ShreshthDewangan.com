import pg from "pg";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("DATABASE_URL is not set. Load .env.local first.");
  process.exit(1);
}

const pool = new pg.Pool({ connectionString });

async function main() {
  await pool.query(
    `INSERT INTO site_settings (id, name, tagline) VALUES (1, $1, $2)
     ON CONFLICT (id) DO NOTHING`,
    ["Your Name", "Short one-line tagline goes here."]
  );

  await pool.query(
    `INSERT INTO about (id, name, intro, profile_image) VALUES (1, $1, $2, NULL)
     ON CONFLICT (id) DO NOTHING`,
    [
      "Your Name",
      "Write a short paragraph about who you are, what you do, and what you care about. Two to three sentences is usually enough.\n\nA second paragraph can cover what you're currently focused on or curious about.",
    ]
  );

  const { rows: existingInterests } = await pool.query("SELECT 1 FROM interests LIMIT 1");
  if (existingInterests.length === 0) {
    const interests = ["Interest one", "Interest two", "Interest three", "Interest four"];
    for (let i = 0; i < interests.length; i++) {
      await pool.query(
        "INSERT INTO interests (label, sort_order) VALUES ($1, $2)",
        [interests[i], i]
      );
    }
  }

  const { rows: existingEducation } = await pool.query("SELECT 1 FROM education LIMIT 1");
  if (existingEducation.length === 0) {
    await pool.query(
      "INSERT INTO education (school, detail, sort_order) VALUES ($1, $2, 0)",
      ["University / School name", "Degree or program, years"]
    );
  }

  const { rows: existingProjects } = await pool.query("SELECT 1 FROM projects LIMIT 1");
  if (existingProjects.length === 0) {
    await pool.query(
      `INSERT INTO projects (name, description, stack, images, github, live, sort_order)
       VALUES ($1, $2, $3, $4, NULL, NULL, 0)`,
      [
        "Project Name",
        "One or two sentences describing what this project is and the problem it solves.",
        ["Tech", "Stack", "Here"],
        [],
      ]
    );
  }

  const { rows: existingAwards } = await pool.query("SELECT 1 FROM awards LIMIT 1");
  if (existingAwards.length === 0) {
    await pool.query(
      `INSERT INTO awards (title, organization, year, description, sort_order)
       VALUES ($1, $2, $3, $4, 0)`,
      ["Award title", "Organization name", "20XX", "Optional short description of the award."]
    );
  }

  const { rows: existingMusic } = await pool.query("SELECT 1 FROM music LIMIT 1");
  if (existingMusic.length === 0) {
    await pool.query(
      `INSERT INTO music (title, artist, note, sort_order) VALUES ($1, $2, $3, 0)`,
      ["Song or album title", "Artist name", "Optional personal note about why this one matters to you."]
    );
  }

  const { rows: existingMovies } = await pool.query("SELECT 1 FROM movies LIMIT 1");
  if (existingMovies.length === 0) {
    await pool.query(
      `INSERT INTO movies (title, year, thoughts, sort_order) VALUES ($1, $2, $3, 0)`,
      ["Movie title", "20XX", "Optional short thoughts on why you liked it."]
    );
  }

  const { rows: existingLinks } = await pool.query("SELECT 1 FROM links LIMIT 1");
  if (existingLinks.length === 0) {
    await pool.query(
      `INSERT INTO links (kind, label, url, sort_order) VALUES ($1, $2, $3, 0)`,
      ["github", "GitHub", "https://github.com/your-username"]
    );
  }

  console.log("Seed complete.");
}

main()
  .catch((err) => {
    console.error("Seed failed:", err);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
