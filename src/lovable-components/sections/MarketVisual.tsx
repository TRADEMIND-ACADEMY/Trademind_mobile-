/**
 * Abstract, non-numeric market visualization. Deliberately contains no
 * figures, profits, win rates or statistics — pure geometry.
 */
export function MarketVisual({ className }: { className?: string }) {
  return (
    <div className={className}>
      <div className="relative aspect-4/3 w-full overflow-hidden rounded-2xl glass-panel">
        <div
          className="pointer-events-none absolute -top-24 -right-16 h-64 w-64 rounded-full opacity-40 blur-3xl animate-drift"
          style={{ background: "color-mix(in oklab, var(--violet) 45%, transparent)" }}
        />
        <div
          className="pointer-events-none absolute -bottom-20 -left-10 h-56 w-56 rounded-full opacity-25 blur-3xl"
          style={{ background: "color-mix(in oklab, var(--gold) 35%, transparent)" }}
        />

        <svg
          viewBox="0 0 400 300"
          className="relative h-full w-full"
          aria-hidden="true"
          fill="none"
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <line
              key={`h${i}`}
              x1="24"
              x2="376"
              y1={40 + i * 40}
              y2={40 + i * 40}
              stroke="currentColor"
              className="text-border"
              strokeWidth="0.6"
            />
          ))}
          {Array.from({ length: 9 }).map((_, i) => (
            <line
              key={`v${i}`}
              y1="24"
              y2="276"
              x1={24 + i * 44}
              x2={24 + i * 44}
              stroke="currentColor"
              className="text-border"
              strokeWidth="0.4"
              strokeOpacity="0.6"
            />
          ))}

          <path
            d="M24 236C64 226 76 196 108 190s44 26 74 6 42-58 72-72 62-8 98-28"
            className="animate-draw text-gold"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <path
            d="M24 262C70 256 92 240 124 232s56 4 84-14 48-40 78-48 66 2 90-14"
            className="animate-draw text-accent"
            stroke="currentColor"
            strokeWidth="1"
            strokeOpacity="0.55"
            strokeLinecap="round"
            style={{ animationDelay: "300ms" }}
          />

          {[
            [108, 190],
            [182, 196],
            [254, 130],
            [326, 58],
          ].map(([cx, cy]) => (
            <g key={`${cx}-${cy}`}>
              <circle cx={cx} cy={cy} r="7" className="text-gold" fill="currentColor" opacity="0.1" />
              <circle cx={cx} cy={cy} r="2.4" className="text-gold" fill="currentColor" />
            </g>
          ))}
        </svg>

        <div className="absolute inset-x-6 bottom-5 flex items-center justify-between">
          <span className="eyebrow">Structure</span>
          <span className="eyebrow">Discipline</span>
          <span className="eyebrow">Process</span>
        </div>
      </div>
    </div>
  );
}
