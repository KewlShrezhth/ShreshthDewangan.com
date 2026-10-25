// Turns an admin-typed link into a safe, full URL.
// Plain (non-async) helper so it can be used and self-checked outside "use server" files.
export function normalizeLinkUrl(raw: string): string {
  const value = raw.trim();
  if (value === "") return "";

  if (/^https?:\/\//i.test(value)) return value;
  if (value.startsWith("//")) return `https:${value}`;

  // A "scheme:" prefix (javascript:, data:, mailto:, localhost:3000 ...) is rejected.
  // A dotted host with a port (ranjanabeauty.com:8080) is not a scheme, so it is allowed.
  const scheme = /^([a-z][a-z0-9+.-]*):/i.exec(value);
  if (scheme && !scheme[1].includes(".")) {
    throw new Error(`Unsupported link scheme: ${scheme[1]}:`);
  }

  return `https://${value}`;
}
