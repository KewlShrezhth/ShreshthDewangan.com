export default function Footer({ siteName }: { siteName: string }) {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto max-w-6xl px-6 md:px-10 py-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-ink-faint">
        <p>
          © 2026 {siteName}
        </p>
        <p>Built with Next.js & Tailwind CSS.</p>
      </div>
    </footer>
  );
}
