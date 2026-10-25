const link = "text-ink-faint hover:text-accent transition-colors";

export default function Footer({
  siteName,
  email,
  linkedin,
}: {
  siteName: string;
  email?: string | null;
  linkedin?: string | null;
}) {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto max-w-6xl px-6 md:px-10 py-8 text-sm text-ink-faint flex flex-col sm:flex-row items-center justify-center gap-x-6 gap-y-2">
        <p>© {new Date().getFullYear()} {siteName}</p>
        {email && <a href={`mailto:${email}`} className={link}>{email}</a>}
        {linkedin && (
          <a href={linkedin} target="_blank" rel="noreferrer" className={link}>
            LinkedIn
          </a>
        )}
      </div>
    </footer>
  );
}
