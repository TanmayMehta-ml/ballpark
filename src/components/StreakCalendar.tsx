import { useState } from 'react'
import { ChevronLeft, ChevronRight, Snowflake } from 'lucide-react'
import { dateKey, daysInMonth, todayKey } from '../lib/daily'
import { useStore } from '../lib/store'

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const WEEK = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

export const TIER_LABEL: Record<string, string> = {
  perfect: 'Bullseye',
  good: 'In range',
  close: 'Close',
  near: 'Off',
  miss: 'Missed',
  freeze: 'Freeze',
}

/** Month view of the days the daily was solved, coloured by how the answer went. */
export function StreakCalendar() {
  const { profile } = useStore()
  const today = todayKey()
  const now = new Date()
  const [offset, setOffset] = useState(0) // months back from now
  const view = new Date(now.getFullYear(), now.getMonth() - offset, 1)
  const y = view.getFullYear()
  const m = view.getMonth()
  const total = daysInMonth(y, m)
  const lead = (new Date(y, m, 1).getDay() + 6) % 7 // Monday first
  const cells: (number | null)[] = [...Array(lead).fill(null), ...Array.from({ length: total }, (_, i) => i + 1)]

  const solved = Array.from({ length: total }, (_, i) => profile.days[dateKey(y, m, i + 1)]).filter((r) => r && r.tier !== 'freeze').length
  const frozen = Array.from({ length: total }, (_, i) => profile.days[dateKey(y, m, i + 1)]).filter((r) => r?.tier === 'freeze').length

  return (
    <div className="card cal">
      <div className="calHead">
        <button className="iconBtn small" aria-label="Previous month" onClick={() => setOffset((o) => Math.min(o + 1, 24))}><ChevronLeft size={18} /></button>
        <b>{MONTHS[m]} {y}</b>
        <button className="iconBtn small" aria-label="Next month" disabled={offset === 0} onClick={() => setOffset((o) => Math.max(o - 1, 0))}><ChevronRight size={18} /></button>
      </div>
      <div className="calGrid" role="grid" aria-label={`${MONTHS[m]} ${y}`}>
        {WEEK.map((d, i) => <span key={i} className="calDow">{d}</span>)}
        {cells.map((d, i) => {
          if (d === null) return <span key={`e${i}`} />
          const key = dateKey(y, m, d)
          const rec = profile.days[key]
          const isToday = key === today
          const future = key > today
          const label = rec ? `${d} ${MONTHS[m]}: ${TIER_LABEL[rec.tier]}${rec.tier !== 'freeze' ? `, ${rec.score} points` : ''}` : `${d} ${MONTHS[m]}`
          return (
            <span key={key} className={`calDay ${rec ? `t-${rec.tier}` : ''} ${isToday ? 'today' : ''} ${future ? 'future' : ''}`} aria-label={label} title={label}>
              {rec?.tier === 'freeze' ? <Snowflake size={14} /> : d}
            </span>
          )
        })}
      </div>
      <p className="calSum">{solved} solved{frozen ? ` · ${frozen} frozen` : ''} this month</p>
      <div className="calLegend">
        {(['perfect', 'good', 'close', 'near', 'miss', 'freeze'] as const).map((t) => (
          <span key={t}><i className={`sw t-${t}`} />{TIER_LABEL[t]}</span>
        ))}
      </div>
    </div>
  )
}
