import type { ReactNode } from 'react'

/** Original animated animal avatars. Each bobs gently and blinks; motion is disabled for reduced-motion users. */
export const ANIMALS: { id: string; label: string; bg: string }[] = [
  { id: 'fox', label: 'Fox', bg: '#f2b84b' },
  { id: 'cat', label: 'Cat', bg: '#b9b3ec' },
  { id: 'panda', label: 'Panda', bg: '#9fd3b4' },
  { id: 'owl', label: 'Owl', bg: '#e8a28a' },
  { id: 'frog', label: 'Frog', bg: '#f6d88a' },
  { id: 'bear', label: 'Bear', bg: '#9db8ea' },
  { id: 'bunny', label: 'Bunny', bg: '#f0b5d6' },
  { id: 'penguin', label: 'Penguin', bg: '#b6e0f2' },
]

const Eyes = ({ y = 54, gap = 15, r = 5, fill = '#1b1b1b' }: { y?: number; gap?: number; r?: number; fill?: string }) => (
  <g className="av-blink" fill={fill}>
    <circle cx={50 - gap} cy={y} r={r} />
    <circle cx={50 + gap} cy={y} r={r} />
    <circle cx={50 - gap + 1.6} cy={y - 1.6} r={r * 0.3} fill="#fff" />
    <circle cx={50 + gap + 1.6} cy={y - 1.6} r={r * 0.3} fill="#fff" />
  </g>
)
const Smile = ({ y = 70 }: { y?: number }) => <path d={`M42 ${y} Q50 ${y + 7} 58 ${y}`} stroke="#1b1b1b" strokeWidth="2.6" fill="none" strokeLinecap="round" />

const ART: Record<string, () => ReactNode> = {
  fox: () => (
    <>
      <path d="M20 44 L24 14 L44 32Z M80 44 L76 14 L56 32Z" fill="#e8622d" />
      <path d="M26 36 L28 22 L38 31Z M74 36 L72 22 L62 31Z" fill="#2a2018" />
      <ellipse cx="50" cy="58" rx="33" ry="29" fill="#e8622d" />
      <path d="M17 62 Q36 60 50 78 Q64 60 83 62 Q70 90 50 90 Q30 90 17 62Z" fill="#fff6ea" />
      <Eyes />
      <ellipse cx="50" cy="70" rx="5" ry="3.6" fill="#1b1b1b" />
    </>
  ),
  cat: () => (
    <>
      <path d="M22 46 L22 14 L46 30Z M78 46 L78 14 L54 30Z" fill="#8c8c9a" />
      <path d="M27 36 L27 23 L38 30Z M73 36 L73 23 L62 30Z" fill="#f4a9c0" />
      <ellipse cx="50" cy="58" rx="32" ry="28" fill="#8c8c9a" />
      <Eyes fill="#2b6b3c" />
      <path d="M46 65 L54 65 L50 70Z" fill="#f4a9c0" />
      <path d="M50 70 Q44 77 38 73 M50 70 Q56 77 62 73" stroke="#1b1b1b" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <path d="M14 62 L32 64 M14 70 L32 68 M86 62 L68 64 M86 70 L68 68" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
    </>
  ),
  panda: () => (
    <>
      <circle cx="26" cy="26" r="13" fill="#1f1f1f" /><circle cx="74" cy="26" r="13" fill="#1f1f1f" />
      <ellipse cx="50" cy="56" rx="33" ry="29" fill="#fff" />
      <ellipse cx="36" cy="52" rx="9" ry="12" fill="#1f1f1f" transform="rotate(20 36 52)" />
      <ellipse cx="64" cy="52" rx="9" ry="12" fill="#1f1f1f" transform="rotate(-20 64 52)" />
      <Eyes y={52} gap={14} r={4} fill="#fff" />
      <ellipse cx="50" cy="66" rx="5.5" ry="4" fill="#1f1f1f" />
      <Smile y={72} />
    </>
  ),
  owl: () => (
    <>
      <path d="M22 40 L18 12 L42 28Z M78 40 L82 12 L58 28Z" fill="#7a4a2b" />
      <ellipse cx="50" cy="58" rx="34" ry="32" fill="#8d5a36" />
      <circle cx="35" cy="52" r="15" fill="#fff3d6" /><circle cx="65" cy="52" r="15" fill="#fff3d6" />
      <Eyes y={52} gap={15} r={7} />
      <path d="M44 64 L56 64 L50 76Z" fill="#f2b84b" />
      <path d="M30 82 Q50 92 70 82" stroke="#6a3f22" strokeWidth="3" fill="none" strokeLinecap="round" />
    </>
  ),
  frog: () => (
    <>
      <ellipse cx="50" cy="62" rx="36" ry="28" fill="#4fa36a" />
      <circle cx="32" cy="32" r="15" fill="#4fa36a" /><circle cx="68" cy="32" r="15" fill="#4fa36a" />
      <circle cx="32" cy="32" r="10" fill="#fff" /><circle cx="68" cy="32" r="10" fill="#fff" />
      <g className="av-blink" fill="#1b1b1b"><circle cx="33" cy="33" r="5" /><circle cx="67" cy="33" r="5" /></g>
      <path d="M26 66 Q50 88 74 66" stroke="#1b1b1b" strokeWidth="3" fill="none" strokeLinecap="round" />
      <circle cx="40" cy="55" r="1.8" fill="#2c6e45" /><circle cx="60" cy="55" r="1.8" fill="#2c6e45" />
      <circle cx="24" cy="70" r="5" fill="#f4a9a0" opacity=".7" /><circle cx="76" cy="70" r="5" fill="#f4a9a0" opacity=".7" />
    </>
  ),
  bear: () => (
    <>
      <circle cx="24" cy="26" r="12" fill="#8a5a3b" /><circle cx="76" cy="26" r="12" fill="#8a5a3b" />
      <circle cx="24" cy="26" r="6" fill="#d9a678" /><circle cx="76" cy="26" r="6" fill="#d9a678" />
      <ellipse cx="50" cy="56" rx="33" ry="30" fill="#8a5a3b" />
      <ellipse cx="50" cy="68" rx="14" ry="11" fill="#e7c49c" />
      <Eyes y={50} gap={15} r={4.5} />
      <ellipse cx="50" cy="64" rx="5" ry="3.6" fill="#1b1b1b" />
      <Smile y={71} />
    </>
  ),
  bunny: () => (
    <>
      <ellipse cx="34" cy="22" rx="9" ry="22" fill="#fdf5f0" /><ellipse cx="66" cy="22" rx="9" ry="22" fill="#fdf5f0" />
      <ellipse cx="34" cy="24" rx="4.5" ry="15" fill="#f4a9c0" /><ellipse cx="66" cy="24" rx="4.5" ry="15" fill="#f4a9c0" />
      <ellipse cx="50" cy="64" rx="31" ry="27" fill="#fdf5f0" />
      <Eyes y={60} gap={13} r={4.5} />
      <path d="M46 68 L54 68 L50 73Z" fill="#f4a9c0" />
      <path d="M50 73 Q44 80 40 76 M50 73 Q56 80 60 76" stroke="#1b1b1b" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <circle cx="30" cy="70" r="5" fill="#f4a9c0" opacity=".6" /><circle cx="70" cy="70" r="5" fill="#f4a9c0" opacity=".6" />
    </>
  ),
  penguin: () => (
    <>
      <ellipse cx="50" cy="58" rx="34" ry="34" fill="#25283d" />
      <path d="M20 56 Q22 40 36 40 Q50 48 64 40 Q78 40 80 56 Q80 86 50 90 Q20 86 20 56Z" fill="#fff" />
      <Eyes y={54} gap={14} r={4.5} />
      <path d="M43 62 L57 62 L50 72Z" fill="#f2a03d" />
      <circle cx="26" cy="66" r="4" fill="#f4a9a0" opacity=".7" /><circle cx="74" cy="66" r="4" fill="#f4a9a0" opacity=".7" />
    </>
  ),
}

export function Avatar({ id, size = 56, animate = true }: { id: string; size?: number; animate?: boolean }) {
  const a = ANIMALS.find((x) => x.id === id) ?? ANIMALS[0]
  const draw = ART[a.id] ?? ART.fox
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} role="img" aria-label={a.label} style={{ borderRadius: '50%', background: a.bg, flex: 'none' }}>
      <g className={animate ? 'av-bob' : undefined}>{draw()}</g>
    </svg>
  )
}

export function AvatarPicker({ value, onChange }: { value: string; onChange: (id: string) => void }) {
  return (
    <div className="avGrid" role="radiogroup" aria-label="Choose your animal">
      {ANIMALS.map((a) => (
        <button key={a.id} role="radio" aria-checked={value === a.id} className={`avOpt ${value === a.id ? 'on' : ''}`} onClick={() => onChange(a.id)}>
          <Avatar id={a.id} size={64} />
          <span>{a.label}</span>
        </button>
      ))}
    </div>
  )
}
