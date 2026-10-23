/** Streak flame. It starts as ordinary fire and changes colour as the streak grows. */
export const STAGES = [
  { from: 0, name: 'Spark', outer: '#ff8a1f', inner: '#ffd23f', glow: 'rgba(255,138,31,.55)' },
  { from: 10, name: 'Yellow flame', outer: '#ffc400', inner: '#fff59d', glow: 'rgba(255,196,0,.55)' },
  { from: 25, name: 'Orange flame', outer: '#ff6d00', inner: '#ffb74d', glow: 'rgba(255,109,0,.55)' },
  { from: 50, name: 'Red flame', outer: '#e0201a', inner: '#ff6b4a', glow: 'rgba(224,32,26,.55)' },
  { from: 100, name: 'Magenta flame', outer: '#d4189f', inner: '#ff7ad9', glow: 'rgba(212,24,159,.55)' },
  { from: 200, name: 'Purple flame', outer: '#8a2fd0', inner: '#cf9bff', glow: 'rgba(138,47,208,.55)' },
  { from: 300, name: 'Violet flame', outer: '#4f3df0', inner: '#aaa3ff', glow: 'rgba(79,61,240,.6)' },
] as const

export function flameStage(days: number) {
  let idx = 0
  STAGES.forEach((s, i) => {
    if (days >= s.from) idx = i
  })
  return { ...STAGES[idx], index: idx }
}

export function Flame({ days, size = 24 }: { days: number; size?: number }) {
  const st = flameStage(days)
  const lit = days > 0
  // The flame grows a little with each stage.
  const grow = 1 + st.index * 0.06
  return (
    <svg
      viewBox="0 0 32 40"
      width={size * 0.8 * grow}
      height={size * grow}
      className={`flame ${lit ? '' : 'out'}`}
      style={{ filter: lit ? `drop-shadow(0 0 ${3 + st.index}px ${st.glow})` : undefined }}
      role="img"
      aria-label={lit ? `${days}-day streak, ${st.name}` : 'No streak yet'}
    >
      <path className="flame-outer" d="M16 1 C17 9 27 13 27 25 C27 33 22 39 16 39 C10 39 5 33 5 25 C5 20 8 17 10 14 C10 18 12 20 14 20 C13 12 14 6 16 1Z" fill={lit ? st.outer : '#b9b2a8'} />
      <path className="flame-inner" d="M16 17 C16.5 22 22 24 22 30 C22 34.5 19.5 37 16 37 C12.5 37 10 34.5 10 30 C10 27 12 25 13 23 C13.5 25 14.5 26 15.5 26 C15 22 15.2 19.5 16 17Z" fill={lit ? st.inner : '#d8d2c8'} />
    </svg>
  )
}
