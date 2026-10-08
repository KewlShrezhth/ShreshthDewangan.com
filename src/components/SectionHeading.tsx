export default function SectionHeading({
  index,
  title,
  note,
}: {
  index: string;
  title: string;
  note?: string;
}) {
  return (
    <div className="mb-10 md:mb-14 flex items-center gap-4">
      <span className="font-display rounded-sm bg-gold px-2 py-1 text-sm text-paper tracking-widest">
        {index}
      </span>
      <div>
        <h2 className="font-display text-3xl md:text-4xl uppercase tracking-tight text-ink">
          {title}
        </h2>
        <span
          className="mt-2 block h-[3px] w-10 origin-left bg-accent"
          style={{ animation: "draw-in 0.6s cubic-bezier(0.22, 1, 0.36, 1) 0.1s both" }}
        />
        {note && (
          <p className="mt-3 text-sm text-ink-faint max-w-md">{note}</p>
        )}
      </div>
    </div>
  );
}
