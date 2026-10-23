import type { ReactNode } from 'react'

/** Original animated animal avatars. Each bobs gently and blinks; motion is disabled for reduced-motion users. */
export const ANIMALS: { id: string; label: string; bg: string; shop?: string; insect?: boolean }[] = [
  { id: 'fox', label: 'Fox', bg: '#f2b84b' },
  { id: 'cat', label: 'Cat', bg: '#b9b3ec' },
  { id: 'panda', label: 'Panda', bg: '#9fd3b4' },
  { id: 'owl', label: 'Owl', bg: '#e8a28a' },
  { id: 'frog', label: 'Frog', bg: '#f6d88a' },
  { id: 'bear', label: 'Bear', bg: '#9db8ea' },
  { id: 'bunny', label: 'Bunny', bg: '#f0b5d6' },
  { id: 'penguin', label: 'Penguin', bg: '#b6e0f2' },
  { id: 'lion', label: 'Lion', bg: '#f6d88a', shop: 'animal-lion' },
  { id: 'koala', label: 'Koala', bg: '#c9d6ea', shop: 'animal-koala' },
  { id: 'tiger', label: 'Tiger', bg: '#f7c9a0', shop: 'animal-tiger' },
  { id: 'elephant', label: 'Elephant', bg: '#cfe3f3', shop: 'animal-elephant' },
  { id: 'turtle', label: 'Turtle', bg: '#cfe8c4', shop: 'animal-turtle' },
  { id: 'monkey', label: 'Monkey', bg: '#f1c7d0', shop: 'animal-monkey' },
  { id: 'dog', label: 'Dog', bg: '#f6dcb4', shop: 'animal-dog' },
  { id: 'pig', label: 'Pig', bg: '#fbd3dc', shop: 'animal-pig' },
  { id: 'duck', label: 'Duck', bg: '#bfe4f5', shop: 'animal-duck' },
  { id: 'giraffe', label: 'Giraffe', bg: '#fbe6a8', shop: 'animal-giraffe' },
  { id: 'zebra', label: 'Zebra', bg: '#d8def2', shop: 'animal-zebra' },
  { id: 'hedgehog', label: 'Hedgehog', bg: '#ead7c6', shop: 'animal-hedgehog' },
  { id: 'wolf', label: 'Wolf', bg: '#c9d3e6', shop: 'animal-wolf' },
  { id: 'hippo', label: 'Hippo', bg: '#d8cdf0', shop: 'animal-hippo' },
  { id: 'bee', label: 'Bee', bg: '#fff0a8', shop: 'animal-bee', insect: true },
  { id: 'ladybug', label: 'Ladybug', bg: '#cfe8c4', shop: 'animal-ladybug', insect: true },
  { id: 'butterfly', label: 'Butterfly', bg: '#cfe6f8', shop: 'animal-butterfly', insect: true },
  { id: 'ant', label: 'Ant', bg: '#f1d3c4', shop: 'animal-ant', insect: true },
  { id: 'caterpillar', label: 'Caterpillar', bg: '#e1f0b8', shop: 'animal-caterpillar', insect: true },
  { id: 'grasshopper', label: 'Grasshopper', bg: '#d7efd0', shop: 'animal-grasshopper', insect: true },
]
export const BASE_ANIMALS = ANIMALS.filter((a) => !a.shop)

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
  lion: () => (
    <>
      <circle cx="50" cy="54" r="42" fill="#b8741f" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((d) => <circle key={d} cx={50 + 40 * Math.cos((d * Math.PI) / 180)} cy={54 + 40 * Math.sin((d * Math.PI) / 180)} r="9" fill="#c9822b" />)}
      <circle cx="28" cy="26" r="8" fill="#f2c36b" /><circle cx="72" cy="26" r="8" fill="#f2c36b" />
      <ellipse cx="50" cy="58" rx="28" ry="26" fill="#f2c36b" />
      <Eyes y={52} gap={13} r={4.2} />
      <ellipse cx="50" cy="66" rx="12" ry="9" fill="#fbe3ad" />
      <path d="M45 62 L55 62 L50 68Z" fill="#6b3d1a" />
      <path d="M50 68 Q44 74 39 71 M50 68 Q56 74 61 71" stroke="#1b1b1b" strokeWidth="2.2" fill="none" strokeLinecap="round" />
    </>
  ),
  koala: () => (
    <>
      <circle cx="20" cy="38" r="17" fill="#9aa3b4" /><circle cx="80" cy="38" r="17" fill="#9aa3b4" />
      <circle cx="20" cy="38" r="9" fill="#e7e9f0" /><circle cx="80" cy="38" r="9" fill="#e7e9f0" />
      <ellipse cx="50" cy="58" rx="31" ry="29" fill="#9aa3b4" />
      <Eyes y={52} gap={14} r={3.8} />
      <ellipse cx="50" cy="64" rx="9" ry="12" fill="#3a3a44" />
      <path d="M42 78 Q50 84 58 78" stroke="#3a3a44" strokeWidth="2.4" fill="none" strokeLinecap="round" />
    </>
  ),
  tiger: () => (
    <>
      <circle cx="24" cy="28" r="12" fill="#f08a2c" /><circle cx="76" cy="28" r="12" fill="#f08a2c" />
      <circle cx="24" cy="28" r="6" fill="#fff0dc" /><circle cx="76" cy="28" r="6" fill="#fff0dc" />
      <ellipse cx="50" cy="58" rx="33" ry="30" fill="#f08a2c" />
      <path d="M50 30 V44 M40 32 L43 44 M60 32 L57 44 M20 54 L30 56 M20 64 L30 63 M80 54 L70 56 M80 64 L70 63" stroke="#1d1410" strokeWidth="3.4" strokeLinecap="round" />
      <ellipse cx="50" cy="70" rx="17" ry="12" fill="#fff0dc" />
      <Eyes y={52} gap={14} r={4.2} />
      <path d="M45 64 L55 64 L50 70Z" fill="#1b1b1b" />
      <Smile y={73} />
    </>
  ),
  elephant: () => (
    <>
      <circle cx="18" cy="52" r="19" fill="#9fb2c4" /><circle cx="82" cy="52" r="19" fill="#9fb2c4" />
      <circle cx="18" cy="52" r="11" fill="#d9a8b4" /><circle cx="82" cy="52" r="11" fill="#d9a8b4" />
      <ellipse cx="50" cy="52" rx="30" ry="29" fill="#b5c6d6" />
      <Eyes y={46} gap={14} r={4} />
      <path d="M42 62 Q42 90 52 90 Q60 90 58 80" stroke="#b5c6d6" strokeWidth="15" fill="none" strokeLinecap="round" />
      <path d="M36 66 Q40 76 36 80 M64 66 Q60 76 64 80" stroke="#fff" strokeWidth="4" fill="none" strokeLinecap="round" />
    </>
  ),
  turtle: () => (
    <>
      <circle cx="50" cy="46" r="38" fill="#2f6b3e" />
      <path d="M50 10 V82 M18 30 L82 62 M82 30 L18 62" stroke="#245733" strokeWidth="2.2" opacity=".7" />
      <ellipse cx="50" cy="66" rx="25" ry="24" fill="#94cf7c" />
      <Eyes y={62} gap={11} r={4.2} />
      <Smile y={74} />
      <circle cx="34" cy="72" r="3.5" fill="#f4a9a0" opacity=".7" /><circle cx="66" cy="72" r="3.5" fill="#f4a9a0" opacity=".7" />
    </>
  ),
  monkey: () => (
    <>
      <circle cx="18" cy="52" r="13" fill="#7a4a2b" /><circle cx="82" cy="52" r="13" fill="#7a4a2b" />
      <circle cx="18" cy="52" r="7" fill="#e7b999" /><circle cx="82" cy="52" r="7" fill="#e7b999" />
      <ellipse cx="50" cy="52" rx="32" ry="31" fill="#7a4a2b" />
      <path d="M50 40 C34 30 22 46 30 62 C34 74 66 74 70 62 C78 46 66 30 50 40Z" fill="#f0d2b0" />
      <Eyes y={52} gap={12} r={4} />
      <ellipse cx="50" cy="64" rx="4" ry="2.6" fill="#7a4a2b" />
      <Smile y={69} />
    </>
  ),
  dog: () => (
    <>
      <ellipse cx="19" cy="48" rx="11" ry="22" fill="#a86a28" transform="rotate(12 19 48)" />
      <ellipse cx="81" cy="48" rx="11" ry="22" fill="#a86a28" transform="rotate(-12 81 48)" />
      <ellipse cx="50" cy="56" rx="31" ry="29" fill="#e8b878" />
      <ellipse cx="50" cy="68" rx="16" ry="12" fill="#fbe8c8" />
      <Eyes y={52} gap={13} r={4} />
      <ellipse cx="50" cy="62" rx="6" ry="4.2" fill="#1b1b1b" />
      <ellipse cx="50" cy="79" rx="4.5" ry="5.5" fill="#f4788f" />
      <path d="M50 66 V71 M50 71 Q44 76 40 73 M50 71 Q56 76 60 73" stroke="#1b1b1b" strokeWidth="2.2" fill="none" strokeLinecap="round" />
    </>
  ),
  pig: () => (
    <>
      <path d="M20 40 L26 14 L44 30Z M80 40 L74 14 L56 30Z" fill="#f08aa4" />
      <ellipse cx="50" cy="56" rx="34" ry="30" fill="#f7a9bd" />
      <Eyes y={48} gap={15} r={4.2} />
      <ellipse cx="50" cy="66" rx="14" ry="10" fill="#f08aa4" />
      <ellipse cx="45" cy="66" rx="2.6" ry="3.6" fill="#b84a68" /><ellipse cx="55" cy="66" rx="2.6" ry="3.6" fill="#b84a68" />
      <circle cx="26" cy="62" r="5" fill="#f4788f" opacity=".6" /><circle cx="74" cy="62" r="5" fill="#f4788f" opacity=".6" />
    </>
  ),
  duck: () => (
    <>
      <path d="M44 22 Q50 8 58 22 Q52 18 44 22Z" fill="#f2c200" />
      <ellipse cx="50" cy="54" rx="34" ry="32" fill="#ffd93b" />
      <Eyes y={46} gap={16} r={4.2} />
      <ellipse cx="50" cy="66" rx="19" ry="11" fill="#ff9a2e" />
      <path d="M33 66 Q50 70 67 66" stroke="#d9741a" strokeWidth="2" fill="none" strokeLinecap="round" />
      <circle cx="26" cy="60" r="5" fill="#ff9a8a" opacity=".6" /><circle cx="74" cy="60" r="5" fill="#ff9a8a" opacity=".6" />
    </>
  ),
  giraffe: () => (
    <>
      <path d="M34 28 L32 10 M66 28 L68 10" stroke="#8a5a2b" strokeWidth="4" strokeLinecap="round" />
      <circle cx="32" cy="9" r="4.5" fill="#8a5a2b" /><circle cx="68" cy="9" r="4.5" fill="#8a5a2b" />
      <ellipse cx="17" cy="42" rx="12" ry="7" fill="#f2c36b" transform="rotate(-24 17 42)" /><ellipse cx="83" cy="42" rx="12" ry="7" fill="#f2c36b" transform="rotate(24 83 42)" />
      <ellipse cx="50" cy="56" rx="29" ry="31" fill="#f6cf7a" />
      <circle cx="36" cy="36" r="4" fill="#c98a3a" /><circle cx="62" cy="40" r="3.4" fill="#c98a3a" /><circle cx="50" cy="30" r="3" fill="#c98a3a" /><circle cx="68" cy="56" r="3.2" fill="#c98a3a" />
      <Eyes y={50} gap={13} r={4.2} />
      <ellipse cx="50" cy="70" rx="17" ry="12" fill="#fbe2b0" />
      <ellipse cx="44" cy="69" rx="2.2" ry="3" fill="#8a5a2b" /><ellipse cx="56" cy="69" rx="2.2" ry="3" fill="#8a5a2b" />
    </>
  ),
  zebra: () => (
    <>
      <path d="M24 38 L24 12 L44 28Z M76 38 L76 12 L56 28Z" fill="#1d1d24" />
      <ellipse cx="50" cy="56" rx="31" ry="31" fill="#fafafa" />
      <path d="M50 26 V44 M38 28 L41 44 M62 28 L59 44 M22 52 L33 54 M22 62 L32 61 M78 52 L67 54 M78 62 L68 61" stroke="#1d1d24" strokeWidth="4" strokeLinecap="round" />
      <ellipse cx="50" cy="70" rx="17" ry="13" fill="#4a4a58" />
      <Eyes y={50} gap={13} r={4.2} />
      <ellipse cx="44" cy="69" rx="2.2" ry="3" fill="#1d1d24" /><ellipse cx="56" cy="69" rx="2.2" ry="3" fill="#1d1d24" />
    </>
  ),
  hedgehog: () => (
    <>
      <path d="M10 56 L16 36 L22 46 L26 24 L34 38 L40 16 L46 34 L54 14 L58 34 L66 18 L68 38 L76 22 L78 44 L86 32 L90 56 Q50 28 10 56Z" fill="#6a4a3a" />
      <ellipse cx="50" cy="60" rx="32" ry="27" fill="#e8c9a8" />
      <path d="M18 54 Q50 24 82 54 Q82 42 50 38 Q18 42 18 54Z" fill="#6a4a3a" />
      <Eyes y={58} gap={13} r={4} />
      <ellipse cx="50" cy="70" rx="5" ry="4" fill="#1b1b1b" />
      <Smile y={75} />
      <circle cx="26" cy="68" r="4.5" fill="#f4a9a0" opacity=".6" /><circle cx="74" cy="68" r="4.5" fill="#f4a9a0" opacity=".6" />
    </>
  ),
  wolf: () => (
    <>
      <path d="M18 48 L20 8 L44 28Z M82 48 L80 8 L56 28Z" fill="#7b8499" />
      <path d="M24 38 L25 18 L38 30Z M76 38 L75 18 L62 30Z" fill="#c9cfdc" />
      <ellipse cx="50" cy="56" rx="33" ry="29" fill="#8d96ab" />
      <path d="M17 62 Q36 56 50 80 Q64 56 83 62 Q70 90 50 90 Q30 90 17 62Z" fill="#e9edf5" />
      <Eyes y={48} gap={13} r={4.2} fill="#2a2a3a" />
      <ellipse cx="50" cy="68" rx="6" ry="4.4" fill="#1b1b1b" />
      <path d="M50 72 Q44 78 39 75 M50 72 Q56 78 61 75" stroke="#1b1b1b" strokeWidth="2.2" fill="none" strokeLinecap="round" />
    </>
  ),
  hippo: () => (
    <>
      <circle cx="27" cy="24" r="8" fill="#a99bd4" /><circle cx="73" cy="24" r="8" fill="#a99bd4" />
      <ellipse cx="50" cy="52" rx="35" ry="29" fill="#b8aae0" />
      <Eyes y={40} gap={16} r={4.2} />
      <ellipse cx="50" cy="68" rx="30" ry="19" fill="#d3c8f0" />
      <ellipse cx="40" cy="64" rx="3.4" ry="4.6" fill="#7a6aae" /><ellipse cx="60" cy="64" rx="3.4" ry="4.6" fill="#7a6aae" />
      <path d="M38 76 Q50 84 62 76" stroke="#7a6aae" strokeWidth="2.4" fill="none" strokeLinecap="round" />
    </>
  ),
  bee: () => (
    <>
      <ellipse cx="26" cy="26" rx="14" ry="9" fill="#fff" opacity=".85" transform="rotate(-30 26 26)" /><ellipse cx="74" cy="26" rx="14" ry="9" fill="#fff" opacity=".85" transform="rotate(30 74 26)" />
      <path d="M38 32 Q34 14 28 12 M62 32 Q66 14 72 12" stroke="#2a2218" strokeWidth="3" fill="none" strokeLinecap="round" />
      <circle cx="28" cy="11" r="3.4" fill="#2a2218" /><circle cx="72" cy="11" r="3.4" fill="#2a2218" />
      <circle cx="50" cy="56" r="33" fill="#ffd23b" />
      <path d="M23 38 Q50 28 77 38 L76 44 Q50 34 24 44Z M27 80 Q50 72 73 80 L71 86 Q50 78 29 86Z" fill="#2a2218" />
      <Eyes y={56} gap={14} r={5} />
      <Smile y={68} />
      <circle cx="26" cy="64" r="4" fill="#ff9a8a" opacity=".6" /><circle cx="74" cy="64" r="4" fill="#ff9a8a" opacity=".6" />
    </>
  ),
  ladybug: () => (
    <>
      <path d="M40 30 Q36 14 30 12 M60 30 Q64 14 70 12" stroke="#1b1b1b" strokeWidth="3" fill="none" strokeLinecap="round" />
      <circle cx="30" cy="11" r="3.4" fill="#1b1b1b" /><circle cx="70" cy="11" r="3.4" fill="#1b1b1b" />
      <circle cx="50" cy="56" r="35" fill="#e0262d" />
      <path d="M50 22 V92" stroke="#1b1b1b" strokeWidth="2.6" />
      <path d="M15 62 Q50 40 85 62 Q82 92 50 92 Q18 92 15 62Z" fill="#1b1b1b" />
      <circle cx="30" cy="36" r="6" fill="#1b1b1b" /><circle cx="70" cy="36" r="6" fill="#1b1b1b" /><circle cx="20" cy="50" r="4" fill="#1b1b1b" /><circle cx="80" cy="50" r="4" fill="#1b1b1b" />
      <g className="av-blink"><circle cx="36" cy="68" r="8" fill="#fff" /><circle cx="64" cy="68" r="8" fill="#fff" /><circle cx="37" cy="69" r="4" fill="#1b1b1b" /><circle cx="63" cy="69" r="4" fill="#1b1b1b" /></g>
      <path d="M43 82 Q50 88 57 82" stroke="#fff" strokeWidth="2.4" fill="none" strokeLinecap="round" />
    </>
  ),
  butterfly: () => (
    <>
      <ellipse cx="24" cy="36" rx="22" ry="26" fill="#9a7be8" transform="rotate(-20 24 36)" /><ellipse cx="76" cy="36" rx="22" ry="26" fill="#9a7be8" transform="rotate(20 76 36)" />
      <ellipse cx="28" cy="70" rx="16" ry="18" fill="#ff8fc6" transform="rotate(20 28 70)" /><ellipse cx="72" cy="70" rx="16" ry="18" fill="#ff8fc6" transform="rotate(-20 72 70)" />
      <circle cx="22" cy="34" r="7" fill="#fff" opacity=".85" /><circle cx="78" cy="34" r="7" fill="#fff" opacity=".85" /><circle cx="30" cy="70" r="5" fill="#ffe27a" /><circle cx="70" cy="70" r="5" fill="#ffe27a" />
      <path d="M45 34 Q40 16 34 14 M55 34 Q60 16 66 14" stroke="#2a2218" strokeWidth="2.6" fill="none" strokeLinecap="round" />
      <circle cx="34" cy="13" r="3" fill="#2a2218" /><circle cx="66" cy="13" r="3" fill="#2a2218" />
      <ellipse cx="50" cy="60" rx="14" ry="30" fill="#4a3a6a" />
      <circle cx="50" cy="46" r="15" fill="#6a549a" />
      <Eyes y={45} gap={6} r={3.6} />
      <Smile y={53} />
    </>
  ),
  ant: () => (
    <>
      <path d="M40 30 Q30 14 22 18 M60 30 Q70 14 78 18" stroke="#2a1a14" strokeWidth="3" fill="none" strokeLinecap="round" />
      <circle cx="22" cy="18" r="3.4" fill="#2a1a14" /><circle cx="78" cy="18" r="3.4" fill="#2a1a14" />
      <ellipse cx="50" cy="56" rx="33" ry="31" fill="#3a2a22" />
      <ellipse cx="38" cy="38" rx="9" ry="5" fill="#fff" opacity=".18" />
      <g className="av-blink"><ellipse cx="36" cy="54" rx="10" ry="12" fill="#fff" /><ellipse cx="64" cy="54" rx="10" ry="12" fill="#fff" /><circle cx="38" cy="56" r="5.5" fill="#1b1b1b" /><circle cx="62" cy="56" r="5.5" fill="#1b1b1b" /><circle cx="40" cy="53" r="1.8" fill="#fff" /><circle cx="64" cy="53" r="1.8" fill="#fff" /></g>
      <path d="M40 76 Q50 84 60 76" stroke="#fff" strokeWidth="2.6" fill="none" strokeLinecap="round" />
      <path d="M36 80 L32 86 M64 80 L68 86" stroke="#2a1a14" strokeWidth="3" strokeLinecap="round" />
    </>
  ),
  caterpillar: () => (
    <>
      <circle cx="18" cy="76" r="14" fill="#8fd05a" /><circle cx="82" cy="76" r="14" fill="#8fd05a" /><circle cx="30" cy="86" r="14" fill="#a5dd6c" /><circle cx="70" cy="86" r="14" fill="#a5dd6c" />
      <path d="M40 28 Q36 12 30 10 M60 28 Q64 12 70 10" stroke="#3f7d2a" strokeWidth="3" fill="none" strokeLinecap="round" />
      <circle cx="30" cy="9" r="4" fill="#e8483a" /><circle cx="70" cy="9" r="4" fill="#e8483a" />
      <circle cx="50" cy="54" r="33" fill="#b6e87a" />
      <circle cx="30" cy="42" r="3" fill="#8fd05a" /><circle cx="70" cy="40" r="3" fill="#8fd05a" />
      <Eyes y={52} gap={14} r={5} />
      <Smile y={68} />
      <circle cx="26" cy="64" r="4.5" fill="#ff9a8a" opacity=".6" /><circle cx="74" cy="64" r="4.5" fill="#ff9a8a" opacity=".6" />
    </>
  ),
  grasshopper: () => (
    <>
      <path d="M40 26 Q30 6 14 4 M60 26 Q70 6 86 4" stroke="#2f6a2a" strokeWidth="2.6" fill="none" strokeLinecap="round" />
      <ellipse cx="50" cy="56" rx="26" ry="33" fill="#7fcf4a" />
      <ellipse cx="26" cy="46" rx="13" ry="16" fill="#a9e06a" /><ellipse cx="74" cy="46" rx="13" ry="16" fill="#a9e06a" />
      <g className="av-blink"><circle cx="26" cy="46" r="8" fill="#fff" /><circle cx="74" cy="46" r="8" fill="#fff" /><circle cx="27" cy="47" r="4.5" fill="#1b1b1b" /><circle cx="73" cy="47" r="4.5" fill="#1b1b1b" /></g>
      <path d="M44 38 Q50 34 56 38" stroke="#4a9a2a" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      <ellipse cx="50" cy="74" rx="11" ry="9" fill="#5fb534" />
      <path d="M44 74 Q50 80 56 74" stroke="#1b1b1b" strokeWidth="2.4" fill="none" strokeLinecap="round" />
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

/** Avatar wrapped in the border the player has equipped. */
export function ProfilePic({ id, border = 'none', size = 56 }: { id: string; border?: string; size?: number }) {
  return (
    <span className={`frame frame-${border}`} style={{ width: size, height: size }}>
      <Avatar id={id} size={size} />
    </span>
  )
}

/** Shows base animals plus any the player owns. */
export function AvatarPicker({ value, onChange, owned = [] }: { value: string; onChange: (id: string) => void; owned?: string[] }) {
  const list = ANIMALS.filter((a) => !a.shop || owned.includes(a.shop))
  return (
    <div className="avGrid" role="radiogroup" aria-label="Choose your animal">
      {list.map((a) => (
        <button key={a.id} role="radio" aria-checked={value === a.id} className={`avOpt ${value === a.id ? 'on' : ''}`} onClick={() => onChange(a.id)}>
          <Avatar id={a.id} size={64} />
          <span>{a.label}</span>
        </button>
      ))}
    </div>
  )
}
