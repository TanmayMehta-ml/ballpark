import { Briefcase, Bus, Cog, GraduationCap, HeartPulse, Play, Smartphone, Store, ShoppingBag, Users, Zap } from 'lucide-react'
import type { Category } from '../types'
import type { Nav } from '../App'
import { CATEGORIES, CATEGORY_META, DEV_MODE, MODULES, QUESTIONS } from '../lib/data'
import { dailyIndex, liveStreak } from '../lib/daily'
import { useStore } from '../lib/store'
import { TIER_COPY } from '../lib/scoring'
import type { Tier } from '../types'
import { Check } from 'lucide-react'
import { todayKey } from '../lib/daily'
import { Diamonds, useCountdown } from '../components/bits'
import { HeroArt, WideArt } from '../components/Doodles'
import { ProfilePic } from '../components/Avatar'
import { Flame, flameStage } from '../components/Flame'

const ICONS: Record<Category, typeof Users> = {
  population: Users, consumer: ShoppingBag, retail: Store, transport: Bus, tech: Smartphone,
  health: HeartPulse, education: GraduationCap, energy: Zap, services: Briefcase, operations: Cog,
}
const WIDE = [['var(--purple)', 'bulb'], ['var(--green)', 'chart'], ['var(--orange)', 'target']] as const

export default function Home({ nav }: { nav: Nav }) {
  const { profile } = useStore()
  const countdown = useCountdown()
  const daily = QUESTIONS.length ? QUESTIONS[dailyIndex(QUESTIONS.length)] : null
  const todayRec = profile.days[todayKey()]
  const completed = !!todayRec && todayRec.tier !== 'freeze'
  const streakGoal = 7
  const streak = liveStreak(profile.streak, profile.lastDay, profile.freezeDays)
  const streakShown = Math.min(streak, streakGoal)
  const solved = (c: Category) => QUESTIONS.filter((q) => q.category === c && profile.attempts[q.id]).length
  const total = (c: Category) => QUESTIONS.filter((q) => q.category === c).length
  const nextMods = MODULES.filter((m) => profile.learnDone[m.id] === undefined).slice(0, 2)

  return (
    <div className="screen">
      <div className="top" style={{ marginBottom: 6, alignItems: 'center' }}>
        <p className="hi" style={{ marginBottom: 0 }}>Hi, {profile.name} {DEV_MODE && <span className="devTag">DEV</span>}</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 'none' }}>
          <button className="chip streakChip" onClick={() => nav.open({ kind: 'streak' })} aria-label={`${streak}-day streak, ${flameStage(streak).name}`}><Flame days={streak} size={22} />{streak}</button>
          <Diamonds n={profile.diamonds} onClick={() => nav.open({ kind: 'shop' })} />
          <button onClick={() => nav.go('profile')} aria-label="Profile"><ProfilePic id={profile.avatar} border={profile.border} size={44} /></button>
        </div>
      </div>
      <h1 className="title" style={{ marginBottom: 18 }}>Ready to estimate?</h1>

      <div className={`hero ${completed ? 'complete' : ''}`}>
        <h3>
          Daily Challenge
          {completed && <span className="doneTag"><Check size={13} strokeWidth={3} />Completed</span>}
        </h3>
        <p>
          {completed
            ? `${TIER_COPY[todayRec!.tier as Tier].title.replace(/!$/, '')}, ${todayRec!.score}/100. Next question in `
            : 'One guesstimate a day. Research smart, estimate, and keep your streak alive.'}
          {completed && <span className="countdown">{countdown}</span>}
        </p>
        <div className="progress"><i style={{ width: `${(streakShown / streakGoal) * 100}%` }} /></div>
        <div className="progressLabel">{streak}-day streak · goal {streakGoal}{profile.freezeDays > 0 ? ` · ${profile.freezeDays} frozen` : ''}</div>
        <div className="heroBtns">
          {completed && (
            <button className="btn" onClick={() => todayRec?.qid && nav.open({ kind: 'play', qid: todayRec.qid, daily: true, review: true })}>
              View solution
            </button>
          )}
          {(!completed || DEV_MODE) && (
            <button className={`btn ${completed ? 'ghost light' : ''}`} disabled={!daily} onClick={() => daily && nav.open({ kind: 'play', qid: daily.id, daily: true, review: false })}>
              <Play size={16} fill={completed ? '#fff' : '#fff'} /> {completed ? 'Replay (dev)' : 'Play Now'}
            </button>
          )}
        </div>
        <HeroArt />
      </div>

      <div className="sectionHead"><h2>Categories</h2><button className="link" onClick={() => { nav.setPastCat('all'); nav.go('past') }}>See all</button></div>
      <div className="tiles">
        {CATEGORIES.map((c) => {
          const Icon = ICONS[c]
          return (
            <button key={c} className="tile" style={{ background: CATEGORY_META[c].color }} onClick={() => { nav.setPastCat(c); nav.go('past') }}>
              <Icon size={26} strokeWidth={1.6} />
              <span><b>{CATEGORY_META[c].label}</b><small>{solved(c)} / {total(c)} solved</small></span>
            </button>
          )
        })}
      </div>

      <div className="sectionHead"><h2>Learn the craft</h2><button className="link" onClick={() => nav.go('learn')}>See all</button></div>
      {nextMods.length === 0 && <p className="empty">All learning modules complete. Nicely done.</p>}
      {nextMods.map((m, i) => (
        <button key={m.id} className="wide" style={{ background: WIDE[i % 3][0] }} onClick={() => nav.open({ kind: 'module', id: m.id })}>
          <h3>{m.title}</h3>
          <p>{m.blurb}</p>
          <span className="meta">{m.minutes} min · {m.level}</span>
          <WideArt kind={WIDE[i % 3][1]} />
          <span className="play"><Play size={20} fill="#111" /></span>
        </button>
      ))}
    </div>
  )
}
