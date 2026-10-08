"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE } from "@/lib/auth";

export async function login(_prevState: string | undefined, formData: FormData) {
  const password = formData.get("password");

  if (typeof password !== "string" || password.length === 0) {
    return "Enter your password.";
  }

  if (password !== process.env.ADMIN_PASSWORD) {
    return "Incorrect password.";
  }

  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    return "Server is missing ADMIN_SESSION_SECRET.";
  }

  const store = await cookies();
  store.set(SESSION_COOKIE, secret, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  redirect("/admin");
}
