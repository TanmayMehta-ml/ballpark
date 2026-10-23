import { useState } from 'react'
import { Gem, Pencil, Settings as Cog } from 'lucide-react'
import type { Gender } from '../types'
import type { Nav } from '../App'
import { QUESTION_BY_ID } from '../lib/data'
import { levelFor } from '../lib/scoring'
import { liveStreak } from '../lib/daily'
import { useStore } from '../lib/store'
import { Diamonds } from '../components/bits'
import { AvatarPicker, ProfilePic } from '../components/Avatar'
import { GENDERS } from './Welcome'

export default function ProfileScreen({ nav }: { nav: Nav }) {
  const { profile, updateProfile, reset } = useStore()
  const [editing, setEditing] = useState(false)
  const lv = levelFor(profile.xp)
  const attempts = Object.values(profile.attempts)
  const avg = attempts.length ? Math.round(attempts.reduce((s, a) => s + a.score, 0) / attempts.length) : 0
  const inRange = attempts.filter((a) => a.tier === 'perfect').length
  const best = [...attempts].sort((a, b) => b.score - a.score || b.xp - a.xp).slice(0, 5)
  const genderLabel = GENDERS.find((g) => g.id === profile.gender)?.label
  const details = [profile.age ? `${profile.age} yrs` : '', genderLabel && profile.gender !== 'private' ? genderLabel : '', profile.college].filter(Boolean).join(' · ')

  return (
    <div className="screen">
      <div className="top"><h1 className="title">Level and stats</h1><div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><Diamonds n={profile.diamonds} onClick={() => nav.open({ kind: 'shop' })} /><button className="iconBtn" aria-label="Settings" onClick={() => nav.open({ kind: 'settings' })}><Cog size={20} /></button></div></div>
      <div className="center">
        <div className={`profBanner bn-${profile.banner}`}>
          <button className="pic avatarBtn" onClick={() => setEditing(true)} aria-label="Edit profile">
            <ProfilePic id={profile.avatar} border={profile.border} size={92} />
            <span className="editDot"><Pencil size={14} /></span>
          </button>
        </div>
        <h2 style={{ fontFamily: 'var(--body)', fontWeight: 700, fontSize: 22, marginTop: 8 }}>{profile.name}</h2>
        {details && <p style={{ color: 'var(--muted)', fontSize: 14, marginTop: 2 }}>{details}</p>}
        <p style={{ color: 'var(--muted)', marginTop: 6 }}>Level {lv.level} · {profile.xp} XP</p>
        <div className="xpBar"><i style={{ width: `${Math.min(100, (lv.into / lv.need) * 100)}%` }} /></div>
        <small style={{ color: 'var(--muted)' }}>{lv.need - lv.into} XP to level {lv.level + 1}</small>
        <div style={{ marginTop: 14 }}><button className="btn small ghost" onClick={() => setEditing(true)}>Edit profile</button></div>
      </div>

      {editing && (
        <div className="sheetWrap" onClick={() => setEditing(false)}>
          <div className="sheet" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="Edit profile">
            <h2 style={{ fontSize: 28, marginBottom: 12 }}>Your profile</h2>
            <span className="fieldLabel">Animal</span>
            <AvatarPicker value={profile.avatar} owned={profile.owned} onChange={(avatar) => updateProfile({ avatar })} />
            <button className="link" style={{ display: 'block', margin: '4px 0 0' }} onClick={() => { setEditing(false); nav.open({ kind: 'shop' }) }}>More animals, borders and banners in the shop</button>
            <label className="fieldLabel" htmlFor="pn">Name</label>
            <input id="pn" className="nameInput" value={profile.name} maxLength={20} onChange={(e) => updateProfile({ name: e.target.value })} />
            <label className="fieldLabel" htmlFor="pa">Age</label>
            <input id="pa" className="nameInput" inputMode="numeric" maxLength={2} value={profile.age ?? ''} onChange={(e) => { const v = e.target.value.replace(/\D/g, ''); updateProfile({ age: v ? parseInt(v, 10) : null }) }} />
            <label className="fieldLabel" htmlFor="pc">College</label>
            <input id="pc" className="nameInput" placeholder="Where do you study or work?" value={profile.college} maxLength={60} onChange={(e) => updateProfile({ college: e.target.value })} />
            <span className="fieldLabel">Gender</span>
            <div className="chipRow">
              {GENDERS.map((g) => (
                <button key={g.id} className={`mult ${profile.gender === g.id ? 'on' : ''}`} onClick={() => updateProfile({ gender: g.id as Gender })}>{g.label}</button>
              ))}
            </div>
            <button className="btn block" style={{ marginTop: 18 }} onClick={() => { if (!profile.name.trim()) updateProfile({ name: 'Friend' }); setEditing(false) }}>Save</button>
          </div>
        </div>
      )}

      <div className="stats">
        <div className="stat"><b>{liveStreak(profile.streak, profile.lastDay, profile.freezeDays)}</b><small>Current streak (days)</small></div>
        <div className="stat"><b>{profile.bestStreak}</b><small>Best streak</small></div>
        <div className="stat"><b>{attempts.length}</b><small>Questions answered</small></div>
        <div className="stat"><b>{avg}</b><small>Average score</small></div>
        <div className="stat"><b>{inRange}</b><small>Inside the range</small></div>
        <div className="stat"><b><Gem size={22} style={{ color: 'var(--diamond)', verticalAlign: -2 }} /> {profile.diamonds}</b><small>Gems</small></div>
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
