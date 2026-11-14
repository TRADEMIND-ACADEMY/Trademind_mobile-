type MonogramProps = {
  className?: string;
  title?: string;
};

/**
 * Original TM monogram: a precise "T" spine crossing an "M" built from
 * an ascending market structure — precision, discipline, controlled growth.
 */
export function Monogram({ className, title = "TRADEMIND ACADEMY monogram" }: MonogramProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      role="img"
      aria-label={title}
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="tm-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.55" />
          <stop offset="45%" stopColor="currentColor" stopOpacity="1" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.6" />
        </linearGradient>
      </defs>

      <rect
        x="2.5"
        y="2.5"
        width="59"
        height="59"
        rx="14"
        stroke="url(#tm-gold)"
        strokeOpacity="0.35"
        strokeWidth="1"
      />

      {/* T */}
      <path
        d="M17 20h30M32 20v12"
        stroke="url(#tm-gold)"
        strokeWidth="2.4"
        strokeLinecap="square"
      />

      {/* M as controlled ascent */}
      <path
        d="M17 46V31l7.5 8.5L32 31l7.5 8.5L47 31v15"
        stroke="url(#tm-gold)"
        strokeWidth="2.4"
        strokeLinejoin="miter"
        strokeLinecap="square"
      />

      <circle cx="47" cy="31" r="2.6" fill="url(#tm-gold)" />
    </svg>
  );
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={className}>
      <span className="font-display text-[1.05rem] tracking-[0.28em] text-ivory">TRADEMIND</span>
      <span className="ml-2 text-[0.62rem] tracking-[0.42em] text-gold-soft">ACADEMY</span>
    </span>
  );
}
