import { useEffect, useState } from 'react'
import { Gem } from 'lucide-react'
import { msUntilTomorrow } from '../lib/daily'

export function Diamonds({ n }: { n: number }) {
  return <div className="chip" aria-label={`${n} diamonds`}><Gem size={20} />{n}</div>
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
