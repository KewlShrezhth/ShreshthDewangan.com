export default function Footer({ siteName }: { siteName: string }) {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto max-w-6xl px-6 md:px-10 py-8 text-center text-sm text-ink-faint">
        <p>© {new Date().getFullYear()} {siteName}</p>
      </div>
    </footer>
  );
}
