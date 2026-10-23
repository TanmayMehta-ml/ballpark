import { ChevronLeft, Snowflake } from 'lucide-react'
import type { Nav } from '../App'
import { Flame, STAGES, flameStage } from '../components/Flame'
import { StreakCalendar } from '../components/StreakCalendar'
import { liveStreak } from '../lib/daily'
import { useStore } from '../lib/store'

export default function StreakScreen({ nav }: { nav: Nav }) {
  const { profile } = useStore()
  const streak = liveStreak(profile.streak, profile.lastDay, profile.freezeDays)
  const stage = flameStage(streak)
  const next = STAGES[stage.index + 1]

  return (
    <div className="screen noNav">
      <button className="back" onClick={nav.close}><ChevronLeft size={16} />Back</button>
      <div className="center" style={{ marginBottom: 18 }}>
        <div style={{ height: 96, display: 'grid', placeItems: 'end center' }}><Flame days={streak} size={84} /></div>
        <h1 className="qTitle" style={{ marginTop: 6 }}>{streak}-day streak</h1>
        <p style={{ color: 'var(--muted)', marginTop: 4 }}>{stage.name}{next ? ` · ${next.from - streak} more day${next.from - streak === 1 ? '' : 's'} to the ${next.name.toLowerCase()}` : ' · the final flame'}</p>
        <p style={{ color: 'var(--muted)', fontSize: 13, marginTop: 6 }}>Best streak: {profile.bestStreak} days</p>
      </div>

      <StreakCalendar />

      <div className="card" style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
        <span className="freezeBank"><Snowflake size={14} />{profile.freezeDays} day{profile.freezeDays === 1 ? '' : 's'} frozen</span>
        <p style={{ flex: 1, color: 'var(--muted)', fontSize: 13, lineHeight: 1.4 }}>Freezes cover days you miss so your streak survives.</p>
        <button className="btn small" onClick={() => nav.open({ kind: 'shop' })}>Shop</button>
      </div>
    </div>
  )
}
