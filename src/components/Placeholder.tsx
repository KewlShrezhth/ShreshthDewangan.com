export default function Placeholder({
  label,
  className = "",
}: {
  label: string;
  className?: string;
}) {
  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden bg-surface ${className}`}
    >
      <div
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, var(--line) 0, var(--line) 1px, transparent 1px, transparent 14px)",
        }}
      />
      <span className="relative z-10 px-3 text-center font-display text-xs uppercase tracking-widest text-ink-faint">
        {label}
      </span>
    </div>
  );
}
