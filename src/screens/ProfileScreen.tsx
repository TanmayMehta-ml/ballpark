import { useState } from 'react'
import { Gem } from 'lucide-react'
import { QUESTION_BY_ID } from '../lib/data'
import { levelFor } from '../lib/scoring'
import { useStore } from '../lib/store'
import { Diamonds } from '../components/bits'

export default function ProfileScreen() {
  const { profile, setName, reset } = useStore()
  const [editing, setEditing] = useState(false)
  const lv = levelFor(profile.xp)
  const attempts = Object.values(profile.attempts)
  const avg = attempts.length ? Math.round(attempts.reduce((s, a) => s + a.score, 0) / attempts.length) : 0
  const inRange = attempts.filter((a) => a.tier === 'perfect').length
  const best = [...attempts].sort((a, b) => b.score - a.score || b.xp - a.xp).slice(0, 5)

  return (
    <div className="screen">
      <div className="top"><h1 className="title">Level and stats</h1><Diamonds n={profile.diamonds} /></div>
      <div className="center">
        <div className="avatar">{(profile.name[0] ?? 'B').toUpperCase()}</div>
        {editing ? (
          <input className="nameInput" style={{ maxWidth: 240 }} autoFocus value={profile.name} maxLength={20} onChange={(e) => setName(e.target.value)} onBlur={() => setEditing(false)} onKeyDown={(e) => e.key === 'Enter' && setEditing(false)} />
        ) : (
          <button className="h3" style={{ fontSize: 20 }} onClick={() => setEditing(true)}>{profile.name} ✎</button>
        )}
        <p style={{ color: 'var(--muted)' }}>Level {lv.level} · {profile.xp} XP</p>
        <div className="xpBar"><i style={{ width: `${Math.min(100, (lv.into / lv.need) * 100)}%` }} /></div>
        <small style={{ color: 'var(--muted)' }}>{lv.need - lv.into} XP to level {lv.level + 1}</small>
      </div>

      <div className="stats">
        <div className="stat"><b>{profile.streak}</b><small>Current streak (days)</small></div>
        <div className="stat"><b>{profile.bestStreak}</b><small>Best streak</small></div>
        <div className="stat"><b>{attempts.length}</b><small>Questions answered</small></div>
        <div className="stat"><b>{avg}</b><small>Average score</small></div>
        <div className="stat"><b>{inRange}</b><small>Inside the range</small></div>
        <div className="stat"><b><Gem size={22} style={{ color: 'var(--diamond)', verticalAlign: -2 }} /> {profile.diamonds}</b><small>Diamonds</small></div>
      </div>

      <div className="sectionHead"><h2>Top estimates</h2></div>
      {best.length === 0 && <p className="empty">Your best answers will line up here.</p>}
      {best.map((a, i) => (
        <div className="row" key={a.qid}>
          <span className="rank">{i + 1}</span>
          <span className="info"><b>{QUESTION_BY_ID.get(a.qid)?.title ?? a.qid}</b><small>{a.xp} XP · {a.day}</small></span>
          <span className={`badge ${a.tier}`}>{a.score}</span>
        </div>
      ))}

      <p className="center" style={{ marginTop: 28 }}>
        <button className="link" onClick={() => { if (confirm('Erase all progress on this device?')) reset() }}>Reset progress</button>
      </p>
    </div>
  )
}
