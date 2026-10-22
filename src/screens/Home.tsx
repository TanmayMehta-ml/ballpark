import { Briefcase, Bus, Cog, GraduationCap, HeartPulse, Play, Smartphone, Store, ShoppingBag, Users, Zap } from 'lucide-react'
import type { Category } from '../types'
import type { Nav } from '../App'
import { CATEGORIES, CATEGORY_META, DEV_MODE, MODULES, QUESTIONS } from '../lib/data'
import { dailyIndex } from '../lib/daily'
import { useStore } from '../lib/store'
import { Diamonds, useCountdown } from '../components/bits'
import { HeroArt, WideArt } from '../components/Doodles'

const ICONS: Record<Category, typeof Users> = {
  population: Users, consumer: ShoppingBag, retail: Store, transport: Bus, tech: Smartphone,
  health: HeartPulse, education: GraduationCap, energy: Zap, services: Briefcase, operations: Cog,
}
const WIDE = [['var(--purple)', 'bulb'], ['var(--green)', 'chart'], ['var(--orange)', 'target']] as const

export default function Home({ nav }: { nav: Nav }) {
  const { profile, dailyDone } = useStore()
  const countdown = useCountdown()
  const daily = QUESTIONS.length ? QUESTIONS[dailyIndex(QUESTIONS.length)] : null
  const locked = dailyDone && !DEV_MODE
  const streakGoal = 7
  const streakShown = Math.min(profile.streak, streakGoal)
  const solved = (c: Category) => QUESTIONS.filter((q) => q.category === c && profile.attempts[q.id]).length
  const total = (c: Category) => QUESTIONS.filter((q) => q.category === c).length
  const nextMods = MODULES.filter((m) => profile.learnDone[m.id] === undefined).slice(0, 2)

  return (
    <div className="screen">
      <div className="top">
        <div>
          <p className="hi">Hi, {profile.name} {DEV_MODE && <span className="devTag">DEV</span>}</p>
          <h1 className="title">Ready to estimate?</h1>
        </div>
        <Diamonds n={profile.diamonds} />
      </div>

      <div className="hero">
        <h3>Daily Challenge</h3>
        <p>{locked ? 'Done for today. Your streak is safe. A fresh question unlocks at midnight.' : 'One guesstimate a day. Research smart, estimate, and keep your streak alive.'}</p>
        <div className="progress"><i style={{ width: `${(streakShown / streakGoal) * 100}%` }} /></div>
        <div className="progressLabel">{profile.streak}-day streak · goal {streakGoal}</div>
        {locked ? (
          <button className="btn" onClick={() => daily && nav.open({ kind: 'play', qid: daily.id, daily: true, review: true })}>
            Next in <span className="countdown">{countdown}</span>
          </button>
        ) : (
          <button className="btn" disabled={!daily} onClick={() => daily && nav.open({ kind: 'play', qid: daily.id, daily: true, review: false })}>
            <Play size={16} fill="#fff" /> Play Now
          </button>
        )}
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
