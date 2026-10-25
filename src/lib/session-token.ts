// Signed, expiring admin session token: `<expiryMs>.<base64url HMAC-SHA256(expiryMs)>`.
// Uses only Web Crypto so it runs in the proxy, in Node, and under plain type-stripping.

export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24;
export const MIN_SECRET_LENGTH = 32;

const encoder = new TextEncoder();

function toBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(value: string): Uint8Array {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(base64 + "=".repeat((4 - (base64.length % 4)) % 4));
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

function importKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

export async function createSessionToken(secret: string, now: number = Date.now()): Promise<string> {
  if (secret.length < MIN_SECRET_LENGTH) throw new Error("Session secret is too short.");
  const exp = String(now + SESSION_MAX_AGE_SECONDS * 1000);
  const key = await importKey(secret);
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(exp));
  return `${exp}.${toBase64Url(new Uint8Array(sig))}`;
}

export async function verifySessionToken(
  token: string | undefined,
  secret: string | undefined,
  now: number = Date.now()
): Promise<boolean> {
  if (!token || !secret || secret.length < MIN_SECRET_LENGTH) return false;
  const parts = token.split(".");
  if (parts.length !== 2) return false;
  const [exp, sig] = parts;
  if (!/^\d+$/.test(exp) || Number(exp) <= now) return false;

  let sigBytes: Uint8Array;
  try {
    sigBytes = fromBase64Url(sig);
  } catch {
    return false;
  }

  const key = await importKey(secret);
  return crypto.subtle.verify("HMAC", key, sigBytes as BufferSource, encoder.encode(exp));
}
