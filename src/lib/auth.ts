import { cookies } from "next/headers";

export const SESSION_COOKIE = "admin_session";

export function isValidSession(token: string | undefined): boolean {
  if (!token) return false;
  return token === process.env.ADMIN_SESSION_SECRET;
}

export async function requireAdmin() {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!isValidSession(token)) {
    throw new Error("Not authenticated");
  }
}
