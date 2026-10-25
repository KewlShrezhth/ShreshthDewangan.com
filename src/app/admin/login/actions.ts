"use server";

import { createHash, timingSafeEqual } from "node:crypto";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { pool } from "@/lib/db";
import { MIN_SECRET_LENGTH } from "@/lib/session-token";
import { SESSION_COOKIE, SESSION_MAX_AGE_SECONDS, createSessionToken } from "@/lib/auth";

const MAX_FAILED_ATTEMPTS = 5;
const GLOBAL_MAX_FAILURES = 30;
const FAILURE_DELAY_MS = 1000;

function sha256(value: string): Buffer {
  return createHash("sha256").update(value).digest();
}

async function getClientIp(): Promise<string> {
  const h = await headers();
  const forwarded = h.get("x-forwarded-for")?.split(",")[0]?.trim();
  return h.get("x-real-ip")?.trim() || forwarded || "unknown";
}

// DB errors are logged and ignored (fail open) so a missing table can never lock the owner out.
async function safeQuery<T>(label: string, run: () => Promise<T>): Promise<T | undefined> {
  try {
    return await run();
  } catch (error) {
    console.error(`login_attempts ${label} failed:`, error);
    return undefined;
  }
}

export async function login(_prevState: string | undefined, formData: FormData) {
  const password = formData.get("password");

  if (typeof password !== "string" || password.length === 0) {
    return "Enter your password.";
  }

  const secret = process.env.ADMIN_SESSION_SECRET;
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!secret || !adminPassword) {
    return "Server is missing ADMIN_SESSION_SECRET.";
  }
  if (secret.length < MIN_SECRET_LENGTH) {
    return "Server session secret is too short.";
  }

  const ip = await getClientIp();

  const failures = await safeQuery("count", async () => {
    const { rows } = await pool.query(
      `SELECT COUNT(*)::int AS n FROM login_attempts
       WHERE ip = $1 AND attempted_at > now() - interval '15 minutes'`,
      [ip]
    );
    return rows[0].n as number;
  });
  if ((failures ?? 0) >= MAX_FAILED_ATTEMPTS) {
    return "Too many attempts. Try again in 15 minutes.";
  }

  const globalFailures = await safeQuery("global count", async () => {
    const { rows } = await pool.query(
      "SELECT COUNT(*)::int AS n FROM login_attempts WHERE attempted_at > now() - interval '1 hour'"
    );
    return rows[0].n as number;
  });
  if ((globalFailures ?? 0) >= GLOBAL_MAX_FAILURES) {
    return "Too many attempts. Try again later.";
  }

  if (!timingSafeEqual(sha256(password), sha256(adminPassword))) {
    await safeQuery("insert", () => pool.query("INSERT INTO login_attempts (ip) VALUES ($1)", [ip]));
    await safeQuery("cleanup", () =>
      pool.query("DELETE FROM login_attempts WHERE attempted_at < now() - interval '1 day'")
    );
    await new Promise((resolve) => setTimeout(resolve, FAILURE_DELAY_MS));
    return "Incorrect password.";
  }

  await safeQuery("reset", () => pool.query("DELETE FROM login_attempts WHERE ip = $1", [ip]));

  const store = await cookies();
  store.set(SESSION_COOKIE, await createSessionToken(secret), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });

  redirect("/admin");
}
