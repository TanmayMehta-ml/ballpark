import { useEffect, useMemo, useState } from 'react'
import { ChevronLeft, Gem, Lock, Star } from 'lucide-react'
import type { Attempt, Question } from '../types'
import type { Nav } from '../App'
import { CATEGORY_META, DEV_MODE, MODULES, QUESTION_BY_ID } from '../lib/data'
import { suggestModule } from '../lib/suggest'
import { MULTIPLIERS, formatIndian, withUnit } from '../lib/format'
import { diamondsFor, TIER_COPY } from '../lib/scoring'
import { useStore } from '../lib/store'
import { playSfx } from '../lib/audio'

const MAX_HINTS = 3

interface Props { qid: string; daily: boolean; review: boolean; nav: Nav }

export default function Play({ qid, daily, review, nav }: Props) {
  const { profile, submit, toggleBookmark } = useStore()
  const q = QUESTION_BY_ID.get(qid)
  const existing = profile.attempts[qid]
  const [done, setDone] = useState<Attempt | null>(review ? existing ?? null : null)
  if (!q) return <div className="screen noNav"><button className="back" onClick={nav.close}><ChevronLeft size={16} />Back</button><p className="empty">Question not found.</p></div>

  if (done) return <Result q={q} attempt={done} nav={nav} bookmarked={profile.bookmarks.includes(q.id)} onBookmark={() => toggleBookmark(q.id)} streak={profile.streak} daily={daily} />
  return <Ask q={q} nav={nav} onSubmit={(answer, hints) => setDone(submit(q, answer, hints, daily))} />
}

function Ask({ q, nav, onSubmit }: { q: Question; nav: Nav; onSubmit: (answer: number, hints: number[]) => void }) {
  const [opened, setOpened] = useState<number[]>([])
  const [text, setText] = useState('')
  const [mult, setMult] = useState<(typeof MULTIPLIERS)[number]>(MULTIPLIERS[0])
  const [filter, setFilter] = useState('')
  const value = parseFloat(text)
  const answer = value * mult.factor
  const valid = isFinite(answer) && answer > 0
  const left = MAX_HINTS - opened.length
  const hints = useMemo(() => q.hints.map((h, i) => ({ ...h, i })).filter((h) => h.label.toLowerCase().includes(filter.toLowerCase())), [q, filter])

  return (
    <div className="screen noNav">
      <button className="back" onClick={nav.close}><ChevronLeft size={16} />Back</button>
      <div>
        <span className="pill">{CATEGORY_META[q.category].label}</span>
        <span className={`pill ${q.difficulty}`}>{q.difficulty}</span>
      </div>
      <h1 className="qTitle">{q.title}</h1>
      <p className="prompt">{q.prompt}</p>

      <div className="research card" style={{ marginTop: 18 }}>
        <h3>
          Research team
          <span className="slots" aria-label={`${left} requests left`}>{[0, 1, 2].map((i) => <i key={i} className={i < opened.length ? 'used' : ''} />)}<em>{left} left</em></span>
        </h3>
        <small>Ask for up to {MAX_HINTS} data points. Each one is a clue, not the answer, so choose what you would really need first.</small>
        <input className="search" placeholder="Filter the request list" value={filter} onChange={(e) => setFilter(e.target.value)} aria-label="Filter research requests" />
        {opened.length > 0 && (
          <div className="hintGrid" style={{ marginBottom: 10 }}>
            {opened.map((i) => (
              <div key={i} className="hintBtn open"><b>{q.hints[i].label}</b><span>{q.hints[i].value}</span></div>
            ))}
          </div>
        )}
        <div className="hintGrid hintScroll" tabIndex={0} aria-label="Available research requests">
          {hints.filter((h) => !opened.includes(h.i)).map((h) => (
            <button key={h.i} className="hintBtn" data-sfx="hint" disabled={left === 0} onClick={() => setOpened((o) => [...o, h.i])}>
              {left === 0 && <Lock size={11} style={{ marginRight: 4 }} />}{h.label}
            </button>
          ))}
        </div>
      </div>

      <div className="card answerCard">
        <p className="h3">Your estimate</p>
        <div className="answerRow">
          <input className="numInput" inputMode="decimal" placeholder="0" value={text} onChange={(e) => setText(e.target.value.replace(/[^0-9.]/g, ''))} aria-label="Your estimate" />
          <span className="unitTag">{q.unit === '₹' ? 'rupees' : q.unit}</span>
        </div>
        <div className="mults">
          {MULTIPLIERS.map((m) => (
            <button key={m.key} className={`mult ${m.key === mult.key ? 'on' : ''}`} onClick={() => setMult(m)}>{m.label}</button>
          ))}
        </div>
        <p className="preview">{valid ? <>You are saying <b>{withUnit(answer, q.unit)}</b></> : 'Pick a multiplier to enter lakh or crore quickly.'}</p>
        <button className="btn block" data-sfx="submit" disabled={!valid} onClick={() => onSubmit(answer, opened)}>Submit estimate</button>
      </div>
    </div>
  )
}

function Result({ q, attempt, nav, bookmarked, onBookmark, streak, daily }: { q: Question; attempt: Attempt; nav: Nav; bookmarked: boolean; onBookmark: () => void; streak: number; daily: boolean }) {
  const copy = TIER_COPY[attempt.tier]
  const { profile } = useStore()
  const suggestion = suggestModule(q, attempt, MODULES, profile.learnDone)
  useEffect(() => {
    const t = setTimeout(() => playSfx(attempt.tier === 'perfect' ? 'win' : attempt.tier === 'miss' ? 'miss' : 'near'), 250)
    return () => clearTimeout(t)
  }, [attempt.tier])
  return (
    <div className="screen noNav">
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <button className="back" onClick={nav.close}><ChevronLeft size={16} />Done</button>
        <button className="back" onClick={onBookmark} aria-label="Bookmark"><Star size={18} fill={bookmarked ? '#f2b84b' : 'none'} color={bookmarked ? '#f2b84b' : 'currentColor'} /></button>
      </div>
      <div className={`banner ${attempt.tier}`}>
        <h2>{copy.title}</h2>
        <p>{copy.line}</p>
        <div className="rewards">
          <span>{attempt.score} / 100</span>
          <span>+{attempt.xp} XP</span>
          <span><Gem size={12} style={{ verticalAlign: -1 }} /> +{diamondsFor(attempt.score, streak)}</span>
          {daily && <span>{streak}-day streak</span>}
        </div>
      </div>

      {suggestion && (
        <div className="suggest">
          <small>{suggestion.revisit ? 'Revisit this module' : 'Suggested for you'}</small>
          <h3>{suggestion.module.title}</h3>
          <p>{suggestion.reason}</p>
          <button className="btn light small" onClick={() => nav.open({ kind: 'module', id: suggestion.module.id })}>Open module · {suggestion.module.minutes} min</button>
        </div>
      )}

      <h1 className="qTitle" style={{ fontSize: 28 }}>{q.title}</h1>
      <p style={{ margin: '6px 0 0', color: 'var(--muted)', lineHeight: 1.4 }}>{q.prompt}</p>
      <RangeScale q={q} answer={attempt.answer} />
      <div className="card">
        <p className="h3">Acceptable range</p>
        <p>{withUnit(q.range.low, q.unit)} to {withUnit(q.range.high, q.unit)}</p>
        <p style={{ color: 'var(--muted)', marginTop: 4, fontSize: 14 }}>Model answer: about {withUnit(q.range.target, q.unit)}. You said {withUnit(attempt.answer, q.unit)}.</p>
        {attempt.hintsUsed.length > 0 && (
          <p style={{ color: 'var(--muted)', marginTop: 8, fontSize: 13 }}>Research used: {attempt.hintsUsed.map((i) => q.hints[i]?.label).filter(Boolean).join(' · ')}</p>
        )}
      </div>

      <div className="sectionHead"><h2>Step by step</h2></div>
      <div className="card">
        {q.steps.map((s, i) => (
          <div className="step" key={i}>
            <span className="n">{i + 1}</span>
            <div>
              <b>{s.title}</b>
              <p>{s.explain}</p>
              {s.calc && <code>{s.calc}</code>}
            </div>
          </div>
        ))}
      </div>

      <div className="sectionHead"><h2>Assumptions</h2></div>
      <div className="card"><ul className="plain" style={{ marginTop: 0 }}>{q.assumptions.map((a, i) => <li key={i}>{a}</li>)}</ul></div>
      <div className="sectionHead"><h2>Sanity check</h2></div>
      <div className="card"><p style={{ lineHeight: 1.5, fontSize: 14.5 }}>{q.sanityCheck}</p></div>

      <div className="sectionHead"><h2>All research options</h2><span>{q.hints.length} available</span></div>
      <div className="card">
        {q.hints.map((h, i) => (
          <div key={i} className="cheatItem"><span>{h.label}</span><b style={{ fontWeight: attempt.hintsUsed.includes(i) ? 700 : 400 }}>{h.value}</b></div>
        ))}
      </div>
      <div style={{ marginTop: 20 }}><button className="btn block" onClick={nav.close}>Continue</button></div>
      {DEV_MODE && <p className="empty"><span className="devTag">DEV</span> Dev build: replaying is allowed.</p>}
    </div>
  )
}

function RangeScale({ q, answer }: { q: Question; answer: number }) {
  const lo = Math.log10(Math.min(answer, q.range.low) / 3)
  const hi = Math.log10(Math.max(answer, q.range.high) * 3)
  const pos = (n: number) => `${((Math.log10(n) - lo) / (hi - lo)) * 100}%`
  const a = ((Math.log10(answer) - lo) / (hi - lo)) * 100
  return (
    <div className="card" style={{ marginTop: 14 }}>
      <div className="scale" aria-hidden>
        <div className="axis" />
        <div className="band" style={{ left: pos(q.range.low), width: `calc(${pos(q.range.high)} - ${pos(q.range.low)})` }} />
        <div className={`you ${a > 60 ? 'flip' : ''}`} style={{ left: pos(answer) }}><em>You</em></div>
      </div>
      <div className="scaleLabels"><span>{formatIndian(Math.pow(10, lo))}</span><span>log scale</span><span>{formatIndian(Math.pow(10, hi))}</span></div>
    </div>
  )
}
