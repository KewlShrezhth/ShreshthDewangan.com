"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { pool } from "@/lib/db";
import { requireAdmin, SESSION_COOKIE } from "@/lib/auth";

export async function logout() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
  redirect("/admin/login");
}

type ListTable =
  | "projects"
  | "photos"
  | "awards"
  | "music"
  | "movies"
  | "links"
  | "interests"
  | "education";

const LIST_TABLES: Record<ListTable, { columns: string[]; arrayColumns?: string[] }> = {
  projects: { columns: ["name", "description", "stack", "images", "github", "live"], arrayColumns: ["stack", "images"] },
  photos: { columns: ["src", "alt", "caption"] },
  awards: { columns: ["title", "organization", "year", "description", "image"] },
  music: { columns: ["title", "artist", "artwork", "link", "note"] },
  movies: { columns: ["title", "year", "poster", "rating", "thoughts", "link"] },
  links: { columns: ["kind", "label", "url"] },
  interests: { columns: ["label"] },
  education: { columns: ["school", "detail"] },
};

function readField(formData: FormData, table: ListTable, column: string): string | string[] {
  const config = LIST_TABLES[table];
  const raw = formData.get(column);
  const value = typeof raw === "string" ? raw : "";

  if (config.arrayColumns?.includes(column)) {
    return value
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
  }

  return value.trim();
}

export async function createListItem(table: ListTable, formData: FormData) {
  await requireAdmin();
  const config = LIST_TABLES[table];

  const values = config.columns.map((col) => readField(formData, table, col));
  const { rows } = await pool.query(
    `SELECT COALESCE(MAX(sort_order), -1) + 1 AS next FROM ${table}`
  );
  const nextOrder = rows[0].next;

  const columnNames = [...config.columns, "sort_order"].join(", ");
  const placeholders = config.columns.map((_, i) => `$${i + 1}`).concat(`$${config.columns.length + 1}`).join(", ");

  await pool.query(
    `INSERT INTO ${table} (${columnNames}) VALUES (${placeholders})`,
    [...values, nextOrder]
  );

  revalidatePath("/");
  revalidatePath(`/admin/${table}`);
}

export async function updateListItem(table: ListTable, id: number, formData: FormData) {
  await requireAdmin();
  const config = LIST_TABLES[table];

  const values = config.columns.map((col) => readField(formData, table, col));
  const setClause = config.columns.map((col, i) => `${col} = $${i + 1}`).join(", ");

  await pool.query(
    `UPDATE ${table} SET ${setClause} WHERE id = $${config.columns.length + 1}`,
    [...values, id]
  );

  revalidatePath("/");
  revalidatePath(`/admin/${table}`);
}

export async function deleteListItem(table: ListTable, id: number) {
  await requireAdmin();
  await pool.query(`DELETE FROM ${table} WHERE id = $1`, [id]);
  revalidatePath("/");
  revalidatePath(`/admin/${table}`);
}

export async function updateSiteSettings(formData: FormData) {
  await requireAdmin();
  const name = String(formData.get("name") ?? "").trim();
  const tagline = String(formData.get("tagline") ?? "").trim();

  await pool.query(
    `INSERT INTO site_settings (id, name, tagline) VALUES (1, $1, $2)
     ON CONFLICT (id) DO UPDATE SET name = $1, tagline = $2`,
    [name, tagline]
  );

  revalidatePath("/");
  revalidatePath("/admin/profile");
}

export async function updateAbout(formData: FormData) {
  await requireAdmin();
  const name = String(formData.get("name") ?? "").trim();
  const intro = String(formData.get("intro") ?? "").trim();
  const profileImage = String(formData.get("profileImage") ?? "").trim();

  await pool.query(
    `INSERT INTO about (id, name, intro, profile_image) VALUES (1, $1, $2, $3)
     ON CONFLICT (id) DO UPDATE SET name = $1, intro = $2, profile_image = $3`,
    [name, intro, profileImage || null]
  );

  revalidatePath("/");
  revalidatePath("/admin/profile");
}
