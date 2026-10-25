import { Suspense } from "react";
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { SESSION_COOKIE, isValidSession } from "@/lib/auth";
import { logout } from "../actions";

const sections = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/profile", label: "Profile" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/photos", label: "Photos" },
  { href: "/admin/awards", label: "Awards" },
  { href: "/admin/music", label: "Music" },
  { href: "/admin/movies", label: "Movies" },
];

async function AdminGate({ children }: { children: React.ReactNode }) {
  const store = await cookies();
  if (!(await isValidSession(store.get(SESSION_COOKIE)?.value))) redirect("/admin/login");
  return children;
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <header className="border-b border-line">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-6 py-5">
          <nav className="flex flex-wrap items-center gap-5">
            {sections.map((s) => (
              <Link
                key={s.href}
                href={s.href}
                className="text-sm uppercase tracking-wide text-ink-soft transition-colors hover:text-accent"
              >
                {s.label}
              </Link>
            ))}
          </nav>
          <form action={logout}>
            <button
              type="submit"
              className="text-sm uppercase tracking-wide text-ink-faint transition-colors hover:text-accent"
            >
              Log out
            </button>
          </form>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-6 py-10">
        <Suspense>
          <AdminGate>{children}</AdminGate>
        </Suspense>
      </main>
    </div>
  );
}
