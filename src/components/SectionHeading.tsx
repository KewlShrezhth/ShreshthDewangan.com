export default function SectionHeading({
  index,
  title,
  note,
  titleSize = "text-3xl md:text-4xl",
}: {
  titleSize?: string;
  index?: string;
  title: string;
  note?: string;
}) {
  return (
    <div className="mb-10 md:mb-14 flex items-center gap-4">
      {index && (
        <span className="font-mono rounded-sm bg-gold px-2 py-1 text-sm font-semibold text-paper">
          {index}
        </span>
      )}
      <div className="min-w-0">
        <h2 className={`font-display ${titleSize} leading-[1.1] text-ink break-words`}>
          {title}
        </h2>
        <span aria-hidden="true" className="mt-3 block h-[2px] w-10 bg-gold" />
        {note && (
          <p className="mt-3 text-sm text-ink-faint max-w-md">{note}</p>
        )}
      </div>
    </div>
  );
}
