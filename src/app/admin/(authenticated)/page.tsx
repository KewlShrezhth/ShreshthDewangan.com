import Link from "next/link";

const sections = [
  { href: "/admin/profile", label: "Profile", desc: "Site name, tagline, bio, interests, education, profile photo" },
  { href: "/admin/projects", label: "Projects", desc: "Add, edit, remove, and reorder projects" },
  { href: "/admin/photos", label: "Photos", desc: "Manage the photo gallery" },
  { href: "/admin/awards", label: "Awards", desc: "Manage awards and recognition" },
  { href: "/admin/music", label: "Music", desc: "Manage songs and albums" },
  { href: "/admin/movies", label: "Movies", desc: "Manage movies" },
  { href: "/admin/links", label: "Links", desc: "Manage external links" },
];

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="font-display text-3xl uppercase tracking-tight text-ink mb-8">
        Dashboard
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {sections.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="hover-lift block rounded-sm border border-line bg-surface p-5 shadow-soft hover:shadow-lift hover:border-accent/40"
          >
            <h2 className="font-display text-lg uppercase tracking-tight text-ink">{s.label}</h2>
            <p className="mt-1 text-sm text-ink-faint">{s.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
