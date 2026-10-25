import { cookies } from "next/headers";
import { verifySessionToken } from "./session-token";

export { SESSION_MAX_AGE_SECONDS, createSessionToken } from "./session-token";

export const SESSION_COOKIE = "admin_session";

export async function isValidSession(token: string | undefined): Promise<boolean> {
  return verifySessionToken(token, process.env.ADMIN_SESSION_SECRET);
}

export async function requireAdmin() {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!(await isValidSession(token))) {
    throw new Error("Not authenticated");
  }
}
