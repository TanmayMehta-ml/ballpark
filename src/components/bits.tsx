import { useEffect, useState } from 'react'
import { Gem } from 'lucide-react'
import { msUntilTomorrow } from '../lib/daily'

export function Diamonds({ n, onClick }: { n: number; onClick?: () => void }) {
  if (onClick) return <button className="chip" aria-label={`${n} gems, open shop`} onClick={onClick}><Gem size={20} />{n}</button>
  return <div className="chip" aria-label={`${n} gems`}><Gem size={20} />{n}</div>
}

export function useCountdown(): string {
  const [ms, setMs] = useState(msUntilTomorrow())
  useEffect(() => {
    const t = setInterval(() => setMs(msUntilTomorrow()), 1000)
    return () => clearInterval(t)
  }, [])
  const s = Math.floor(ms / 1000)
  const p = (n: number) => String(n).padStart(2, '0')
  return `${p(Math.floor(s / 3600))}:${p(Math.floor((s % 3600) / 60))}:${p(s % 60)}`
}
