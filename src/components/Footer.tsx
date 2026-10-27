const link = "text-ink-soft hover:text-gold transition-colors";

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
    <footer className="border-t border-gold/25">
      <div className="mx-auto max-w-6xl px-6 md:px-10 py-8 text-sm text-ink-faint flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-x-6 gap-y-2">
        <p>© <span className="font-mono">{new Date().getFullYear()}</span> {siteName}</p>
        {email && <a href={`mailto:${email}`} className={link}>{email}</a>}
        {linkedin && (
          <a href={linkedin} target="_blank" rel="noreferrer" className={link}>
            LinkedIn
          </a>
        )}
        <p aria-hidden="true" className="font-mono text-xs tracking-[0.1em] text-gold sm:ml-auto">SD · 2027 · 0001</p>
      </div>
    </footer>
  );
}
