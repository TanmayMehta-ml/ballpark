import type { ReactNode } from 'react'

/** Illustrated profile banners. Each is an SVG scene, 360 x 120, cropped to fit. */

function Pine({ x, y, s = 1, snow = false, fill = '#2f6a4a' }: { x: number; y: number; s?: number; snow?: boolean; fill?: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x="-2.5" y="0" width="5" height="9" fill="#5a3d2b" />
      <path d="M0 -34 L11 -14 L5 -14 L14 2 L-14 2 L-5 -14 L-11 -14Z" fill={fill} />
      {snow && <path d="M0 -34 L5 -25 L-1 -23 L-5 -25Z M-6 -12 L-1 -14 L4 -12 L0 -9Z M-9 0 L-3 -3 L3 0 L-1 3Z" fill="#fff" opacity=".95" />}
    </g>
  )
}

const STARS = Array.from({ length: 26 }, (_, i) => ({ x: (i * 53) % 350 + 6, y: (i * 37) % 70 + 6, r: i % 4 === 0 ? 1.7 : 1 }))
const FLAKES = Array.from({ length: 22 }, (_, i) => ({ x: (i * 47) % 350 + 5, y: (i * 29) % 100, r: i % 3 === 0 ? 2.2 : 1.4, d: (i % 7) * 0.8 }))

const SCENES: Record<string, () => ReactNode> = {
  // The free default: BallPark purple with the app's doodles
  cream: () => (
    <>
      <defs><linearGradient id="bp" x1="0" x2="1"><stop offset="0" stopColor="#6e59bb" /><stop offset="1" stopColor="#9d89e6" /></linearGradient></defs>
      <rect width="360" height="120" fill="url(#bp)" />
      <circle cx="295" cy="70" r="52" fill="#e8622d" />
      <rect x="215" y="16" width="44" height="44" rx="9" fill="#f2b84b" transform="rotate(-14 237 38)" />
      <circle cx="60" cy="96" r="30" fill="#5b46a8" />
      <path d="M150 30 q8 -12 16 0 t16 0 t16 0" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M0 0" />
      {[[40, 28, 1.3], [180, 88, 1], [340, 22, 1.1], [120, 60, 0.8]].map(([x, y, s], i) => (
        <path key={i} transform={`translate(${x} ${y}) scale(${s})`} d="M0 -10 L2.5 -2.5 L10 0 L2.5 2.5 L0 10 L-2.5 2.5 L-10 0 L-2.5 -2.5Z" fill="#fff" />
      ))}
    </>
  ),
  desert: () => (
    <>
      <defs>
        <linearGradient id="dsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ffdca8" /><stop offset="1" stopColor="#ffb06a" /></linearGradient>
        <radialGradient id="dsun"><stop offset="0" stopColor="#fffbe0" /><stop offset="1" stopColor="#fff3c4" stopOpacity="0" /></radialGradient>
      </defs>
      <rect width="360" height="120" fill="url(#dsky)" />
      <circle cx="268" cy="40" r="46" fill="url(#dsun)" />
      <circle cx="268" cy="40" r="20" fill="#fff6d0" />
      <path d="M0 78 Q60 52 130 74 T260 66 T360 72 V120 H0Z" fill="#f2b863" />
      <path d="M0 92 Q80 70 170 90 T360 84 V120 H0Z" fill="#dd9444" />
      <path d="M0 106 Q100 88 200 104 T360 100 V120 H0Z" fill="#c47a2e" />
      <g transform="translate(72 74)" fill="#3f8a4f">
        <rect x="-4" y="-26" width="8" height="38" rx="4" />
        <path d="M-4 -8 H-14 V-20 a4 4 0 0 1 8 0 V-12 H-4Z" />
        <path d="M4 -14 H14 V-26 a4 4 0 0 0 -8 0 V-18 H4Z" />
      </g>
      <g transform="translate(300 92)" fill="#3f8a4f"><rect x="-3" y="-18" width="6" height="26" rx="3" /><path d="M3 -8 H10 V-16 a3 3 0 0 0 -6 0 V-10 H3Z" /></g>
      <path d="M150 28 q4 -5 8 0 q4 -5 8 0" stroke="#7a4a1f" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <path d="M180 20 q3 -4 6 0 q3 -4 6 0" stroke="#7a4a1f" strokeWidth="1.6" fill="none" strokeLinecap="round" />
    </>
  ),
  forest: () => (
    <>
      <defs><linearGradient id="fsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#d4f0df" /><stop offset="1" stopColor="#9cd6b0" /></linearGradient></defs>
      <rect width="360" height="120" fill="url(#fsky)" />
      <circle cx="300" cy="30" r="16" fill="#fff6c8" opacity=".9" />
      <path d="M0 70 L50 34 L95 66 L150 26 L210 68 L270 36 L330 66 L360 50 V120 H0Z" fill="#86bf9d" />
      <path d="M0 86 Q90 62 180 84 T360 78 V120 H0Z" fill="#4d9168" />
      {[20, 58, 96, 140, 205, 248, 292, 335].map((x, i) => <Pine key={x} x={x} y={86 + (i % 3) * 3} s={0.8 + (i % 4) * 0.12} fill={i % 2 ? '#2f6a4a' : '#3b7a55'} />)}
      <path d="M0 102 Q110 86 220 102 T360 96 V120 H0Z" fill="#2f6a4a" />
      {[40, 120, 190, 270, 340].map((x, i) => <Pine key={x} x={x} y={110} s={1.15 + (i % 2) * 0.25} fill="#255a3d" />)}
    </>
  ),
  snow: () => (
    <>
      <defs><linearGradient id="ssky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#bcd8f5" /><stop offset="1" stopColor="#eef6ff" /></linearGradient></defs>
      <rect width="360" height="120" fill="url(#ssky)" />
      <circle cx="70" cy="28" r="14" fill="#fff" opacity=".9" />
      <path d="M0 74 L60 30 L110 66 L170 22 L235 70 L295 34 L360 72 V120 H0Z" fill="#9db8d8" />
      <path d="M60 30 L72 41 L62 40 L56 45 L48 41Z M170 22 L184 36 L173 35 L166 41 L156 36Z M295 34 L307 45 L298 44 L292 49 L284 45Z" fill="#fff" />
      <path d="M0 88 Q90 66 180 86 T360 80 V120 H0Z" fill="#e6f0fb" />
      {[34, 88, 250, 318].map((x, i) => <Pine key={x} x={x} y={92 + (i % 2) * 4} s={0.9 + (i % 3) * 0.12} snow fill="#3d7a62" />)}
      <path d="M0 104 Q110 90 220 104 T360 98 V120 H0Z" fill="#fff" />
      <g fill="#fff">
        {FLAKES.map((f, i) => <circle key={i} className="snowfall" cx={f.x} cy={f.y} r={f.r} style={{ animationDelay: `${f.d}s` }} />)}
      </g>
    </>
  ),
  ocean: () => (
    <>
      <defs><linearGradient id="osky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#8fdcf8" /><stop offset="1" stopColor="#3b8fe0" /></linearGradient></defs>
      <rect width="360" height="120" fill="url(#osky)" />
      <circle cx="80" cy="30" r="15" fill="#fff6c8" />
      <path d="M0 62 Q30 52 60 62 T120 62 T180 62 T240 62 T300 62 T360 62 V120 H0Z" fill="#2f78d6" />
      <path d="M0 78 Q30 68 60 78 T120 78 T180 78 T240 78 T300 78 T360 78 V120 H0Z" fill="#2563bf" />
      <path d="M0 94 Q30 84 60 94 T120 94 T180 94 T240 94 T300 94 T360 94 V120 H0Z" fill="#1d4f9f" />
      <g transform="translate(250 52)"><path d="M-14 8 H14 L10 16 H-10Z" fill="#fff" /><path d="M0 -20 V8 L-12 6Z" fill="#fff" /><path d="M2 -16 V8 L14 6Z" fill="#f2b84b" /></g>
    </>
  ),
  sunset: () => (
    <>
      <defs><linearGradient id="ssg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#6a4fc0" /><stop offset=".5" stopColor="#e8622d" /><stop offset="1" stopColor="#ffc15a" /></linearGradient></defs>
      <rect width="360" height="120" fill="url(#ssg)" />
      <circle cx="180" cy="74" r="30" fill="#fff0b0" />
      <rect y="74" width="360" height="46" fill="#4a3a8a" />
      {[0, 1, 2, 3].map((i) => <rect key={i} x={150 + i * 4} y={78 + i * 9} width={60 - i * 8} height="3" rx="1.5" fill="#ffd27a" opacity={0.8 - i * 0.15} />)}
      <path d="M40 32 q5 -6 10 0 q5 -6 10 0" stroke="#2a1a4a" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M290 24 q4 -5 8 0 q4 -5 8 0" stroke="#2a1a4a" strokeWidth="1.8" fill="none" strokeLinecap="round" />
    </>
  ),
  night: () => (
    <>
      <defs><linearGradient id="nsg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#14143a" /><stop offset="1" stopColor="#3a2f8a" /></linearGradient></defs>
      <rect width="360" height="120" fill="url(#nsg)" />
      {STARS.map((s, i) => <circle key={i} className="twinkle" cx={s.x} cy={s.y} r={s.r} fill="#fff" style={{ animationDelay: `${(i % 6) * 0.5}s` }} />)}
      <circle cx="290" cy="34" r="17" fill="#fff3c4" />
      <circle cx="298" cy="30" r="15" fill="#2a2a70" />
      <path d="M0 100 Q60 74 130 96 T260 88 T360 94 V120 H0Z" fill="#14143a" />
      <path d="M0 112 Q90 98 180 110 T360 106 V120 H0Z" fill="#0b0b26" />
    </>
  ),
  candy: () => (
    <>
      <defs><linearGradient id="cg" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stopColor="#ffc1e0" /><stop offset=".55" stopColor="#c9a6ff" /><stop offset="1" stopColor="#8fd3ff" /></linearGradient></defs>
      <rect width="360" height="120" fill="url(#cg)" />
      {[[50, 40, 22], [140, 78, 16], [250, 34, 20], [320, 88, 24]].map(([x, y, r], i) => (
        <g key={i}><circle cx={x} cy={y} r={r} fill="#fff" opacity=".85" /><circle cx={x} cy={y} r={r * 0.62} fill="none" stroke={['#ff7ab6', '#7bd6ff', '#ffd45a', '#a98bff'][i]} strokeWidth={r * 0.28} /><circle cx={x} cy={y} r={r * 0.2} fill={['#ff7ab6', '#7bd6ff', '#ffd45a', '#a98bff'][i]} /></g>
      ))}
    </>
  ),
  gold: () => (
    <>
      <defs><linearGradient id="gg" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stopColor="#fff1b8" /><stop offset=".5" stopColor="#f2b84b" /><stop offset="1" stopColor="#c98a1a" /></linearGradient></defs>
      <rect width="360" height="120" fill="url(#gg)" />
      {Array.from({ length: 9 }, (_, i) => <path key={i} d={`M300 130 L${300 - 340 * Math.cos((i * 12 + 6) * Math.PI / 180)} ${130 - 340 * Math.sin((i * 12 + 6) * Math.PI / 180)} L${300 - 340 * Math.cos((i * 12 + 12) * Math.PI / 180)} ${130 - 340 * Math.sin((i * 12 + 12) * Math.PI / 180)}Z`} fill="#fff" opacity=".18" />)}
      {[[60, 30, 1.4], [150, 82, 1], [230, 26, 1.1], [320, 70, 1.3]].map(([x, y, s], i) => (
        <path key={i} transform={`translate(${x} ${y}) scale(${s})`} d="M0 -10 L2.5 -2.5 L10 0 L2.5 2.5 L0 10 L-2.5 2.5 L-10 0 L-2.5 -2.5Z" fill="#fff" />
      ))}
    </>
  ),
}

export const BANNER_IDS = Object.keys(SCENES)

export function BannerArt({ id }: { id: string }) {
  const draw = SCENES[id] ?? SCENES.cream
  return (
    <svg className="bannerSvg" viewBox="0 0 360 120" preserveAspectRatio="xMidYMid slice" aria-hidden>
      {draw()}
    </svg>
  )
}
