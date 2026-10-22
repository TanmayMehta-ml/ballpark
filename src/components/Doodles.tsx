/** Original doodle-style illustrations in the cut-out collage look. */

export function Sparkle({ x, y, s = 1, c = '#111' }: { x: number; y: number; s?: number; c?: string }) {
  return <path transform={`translate(${x} ${y}) scale(${s})`} d="M0 -10 L2.5 -2.5 L10 0 L2.5 2.5 L0 10 L-2.5 2.5 L-10 0 L-2.5 -2.5Z" fill={c} />
}

export function WelcomeArt() {
  return (
    <svg viewBox="0 0 330 300" role="img" aria-label="Thinking about a number">
      <circle cx="190" cy="150" r="104" fill="#e8622d" />
      <circle cx="82" cy="190" r="60" fill="#6a4fc0" />
      <rect x="226" y="176" width="86" height="92" rx="10" fill="#f2b84b" transform="rotate(8 270 222)" />
      <rect x="40" y="250" width="250" height="12" fill="#2a2a2a" />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <rect key={i} x={46 + i * 42} y="250" width="30" height="12" fill={['#f2b84b', '#e8622d', '#6a4fc0', '#3f7d5c', '#6f7fc4', '#f2b84b'][i]} />
      ))}
      {/* head + shoulders */}
      <path d="M96 252 C98 200 128 184 168 184 C208 184 238 200 240 252Z" fill="#3b3b3b" />
      <path d="M150 184 L168 222 L186 184Z" fill="#efe9e1" />
      <rect x="156" y="170" width="24" height="20" rx="8" fill="#e7b999" />
      <ellipse cx="168" cy="140" rx="38" ry="44" fill="#eec8aa" />
      <path d="M128 132 C126 96 150 84 172 88 C198 90 212 108 208 134 C196 118 184 112 164 112 C148 112 136 120 128 132Z" fill="#24201d" />
      <circle cx="150" cy="78" r="17" fill="#24201d" />
      {/* glasses */}
      <g fill="none" stroke="#111" strokeWidth="3.5">
        <circle cx="152" cy="142" r="12" /><circle cx="186" cy="142" r="12" /><path d="M164 142 H174" />
      </g>
      <path d="M150 168 Q168 176 188 166" stroke="#111" strokeWidth="3" fill="none" strokeLinecap="round" />
      {/* hand on chin */}
      <path d="M208 196 C220 190 230 176 214 166 C204 160 196 170 198 180Z" fill="#e7b999" />
      {/* question mark bubble */}
      <circle cx="256" cy="60" r="32" fill="#111" />
      <text x="256" y="76" textAnchor="middle" fontFamily="Anton, Impact, sans-serif" fontSize="48" fill="#fff">?</text>
      <path d="M232 84 L222 98 L246 88Z" fill="#111" />
      {/* light bulb */}
      <g transform="translate(262 150)">
        <circle cx="26" cy="26" r="24" fill="#fff" stroke="#111" strokeWidth="3" />
        <path d="M18 26 L26 36 L34 26 M26 36 V50 M20 56 H32" stroke="#111" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <Sparkle x={40} y={110} s={1.6} />
      <Sparkle x={302} y={112} s={1} />
      <path d="M30 150 q6 -10 12 0 t12 0" stroke="#111" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M268 232 q8 -12 16 0 t16 0" stroke="#111" strokeWidth="3" fill="none" strokeLinecap="round" />
    </svg>
  )
}

export function HeroArt() {
  return (
    <svg viewBox="0 0 160 190" className="art" aria-hidden>
      <circle cx="96" cy="110" r="64" fill="#e8622d" opacity=".95" />
      <rect x="22" y="54" width="46" height="46" rx="8" fill="#f2b84b" transform="rotate(-12 45 77)" />
      {/* calculator */}
      <g transform="translate(40 52) rotate(8 40 60)">
        <rect width="84" height="116" rx="12" fill="#111" />
        <rect x="9" y="10" width="66" height="26" rx="6" fill="#b9e4c9" />
        <text x="70" y="30" textAnchor="end" fontFamily="Anton, Impact, sans-serif" fontSize="18" fill="#111">1.4 Cr</text>
        {[0, 1, 2].map((r) => [0, 1, 2, 3].map((c) => (
          <circle key={`${r}${c}`} cx={17 + c * 17} cy={54 + r * 20} r="6" fill={c === 3 ? '#f2b84b' : '#efe9e1'} />
        )))}
      </g>
      <Sparkle x={20} y={30} s={1.3} c="#fff" />
      <Sparkle x={146} y={40} s={1} c="#fff" />
      <path d="M118 22 q6 -9 12 0 t12 0" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" />
    </svg>
  )
}

export function WideArt({ kind }: { kind: 'bulb' | 'chart' | 'target' }) {
  return (
    <svg viewBox="0 0 140 140" style={{ position: 'absolute', right: 0, top: 0, width: '42%', opacity: 0.95 }} aria-hidden>
      <circle cx="96" cy="46" r="52" fill="rgba(255,255,255,.18)" />
      {kind === 'bulb' && (
        <g transform="translate(60 14)" stroke="#111" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
          <circle cx="32" cy="32" r="28" fill="#f2b84b" />
          <path d="M22 30 L32 42 L42 30 M32 42 V60 M24 68 H40" />
        </g>
      )}
      {kind === 'chart' && (
        <g transform="translate(40 14)">
          <rect x="0" y="40" width="22" height="46" rx="4" fill="#f2b84b" />
          <rect x="30" y="18" width="22" height="68" rx="4" fill="#fff" />
          <rect x="60" y="0" width="22" height="86" rx="4" fill="#111" />
        </g>
      )}
      {kind === 'target' && (
        <g transform="translate(46 8)">
          <circle cx="44" cy="44" r="42" fill="#fff" /><circle cx="44" cy="44" r="28" fill="#e8622d" />
          <circle cx="44" cy="44" r="14" fill="#fff" /><circle cx="44" cy="44" r="6" fill="#111" />
        </g>
      )}
      <Sparkle x={24} y={26} s={1} c="#fff" />
    </svg>
  )
}
