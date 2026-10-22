import type { Category } from '../types'
import type { Nav } from '../App'
import { CATEGORIES, CATEGORY_META, DEV_MODE, QUESTIONS } from '../lib/data'
import { useStore } from '../lib/store'

export default function Past({ nav }: { nav: Nav }) {
  const { profile } = useStore()
  const cat = nav.pastCat
  const attempted = QUESTIONS.filter((q) => profile.attempts[q.id]).sort((a, b) => profile.attempts[b.id].day.localeCompare(profile.attempts[a.id].day))
  const base = DEV_MODE ? QUESTIONS : attempted
  const list = base.filter((q) => cat === 'all' || q.category === cat)

  return (
    <div className="screen">
      <div className="top"><div><p className="hi">{DEV_MODE ? <><span className="devTag">DEV</span> all questions unlocked</> : `${attempted.length} answered so far`}</p><h1 className="title">{DEV_MODE ? 'All questions' : 'Past questions'}</h1></div></div>
      <div className="filters">
        {(['all', ...CATEGORIES] as (Category | 'all')[]).map((c) => (
          <button key={c} className={`filter ${cat === c ? 'on' : ''}`} onClick={() => nav.setPastCat(c)}>{c === 'all' ? 'All' : CATEGORY_META[c].label}</button>
        ))}
      </div>
      {list.length === 0 && <p className="empty">Nothing here yet. Answer today's challenge and it will show up here with the full solution.</p>}
      {list.map((q, i) => {
        const a = profile.attempts[q.id]
        return (
          <button key={q.id} className="row" onClick={() => nav.open({ kind: 'play', qid: q.id, daily: false, review: !!a && !DEV_MODE })}>
            <span className="rank">{i + 1}</span>
            <span className="info"><b>{q.title}</b><small>{CATEGORY_META[q.category].label} · {q.difficulty}{a ? ` · ${a.day}` : ''}</small></span>
            <span className={`badge ${a ? a.tier : 'none'}`}>{a ? a.score : '-'}</span>
          </button>
        )
      })}
    </div>
  )
}
