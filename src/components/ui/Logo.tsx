export default function Logo({
  className = "",
  withWordmark = true,
}: {
  className?: string;
  withWordmark?: boolean;
}) {
  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <svg
        viewBox="0 0 64 64"
        className="h-9 w-9 shrink-0"
        aria-hidden="true"
        fill="none"
      >
        <circle cx="32" cy="32" r="30" stroke="currentColor" strokeWidth="1" opacity="0.55" />
        {/* laurel leaves left */}
        <g stroke="currentColor" strokeWidth="1.1" opacity="0.85" fill="none">
          <path d="M16 44 C12 38 12 30 16 22" />
          <path d="M16 40 c-3 -1 -4 -3 -4 -6" />
          <path d="M15 34 c-3 -1 -4 -3 -4 -6" />
          <path d="M15 28 c-3 0 -4 -2 -4 -5" />
          {/* laurel leaves right */}
          <path d="M48 44 C52 38 52 30 48 22" />
          <path d="M48 40 c3 -1 4 -3 4 -6" />
          <path d="M49 34 c3 -1 4 -3 4 -6" />
          <path d="M49 28 c3 0 4 -2 4 -5" />
        </g>
        <text
          x="32"
          y="42"
          textAnchor="middle"
          fontFamily="var(--font-cormorant), serif"
          fontSize="30"
          fontStyle="italic"
          fill="currentColor"
        >
          S
        </text>
      </svg>
      {withWordmark && (
        <span className="font-display text-xl tracking-[0.2em] text-current">
          S<span className="italic">è</span>VES
        </span>
      )}
    </span>
  );
}
