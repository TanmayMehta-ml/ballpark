import { Star } from 'lucide-react'
import type { Category } from '../types'
import type { Nav } from '../App'
import { CATEGORIES, CATEGORY_META, DEV_MODE, QUESTIONS } from '../lib/data'
import { useStore } from '../lib/store'

export default function Past({ nav }: { nav: Nav }) {
  const { profile } = useStore()
  const cat = nav.pastCat
  const attempted = QUESTIONS.filter((q) => profile.attempts[q.id]).sort((a, b) => profile.attempts[b.id].day.localeCompare(profile.attempts[a.id].day))
  const starred = QUESTIONS.filter((q) => profile.bookmarks.includes(q.id))
  const base = cat === 'starred' ? starred : DEV_MODE ? QUESTIONS : attempted
  const list = base.filter((q) => cat === 'all' || cat === 'starred' || q.category === cat)

  return (
    <div className="screen">
      <div className="top"><div><p className="hi">{DEV_MODE ? <><span className="devTag">DEV</span> all questions unlocked</> : `${attempted.length} answered · ${starred.length} starred`}</p><h1 className="title">{cat === 'starred' ? 'Starred' : DEV_MODE ? 'All questions' : 'Past questions'}</h1></div></div>
      <div className="filters">
        <button className={`filter ${cat === 'all' ? 'on' : ''}`} onClick={() => nav.setPastCat('all')}>All</button>
        <button className={`filter ${cat === 'starred' ? 'on' : ''}`} onClick={() => nav.setPastCat('starred')} aria-label={`Starred questions, ${starred.length}`}>
          <Star size={13} fill={cat === 'starred' ? '#f2b84b' : 'none'} color={cat === 'starred' ? '#f2b84b' : 'currentColor'} style={{ verticalAlign: -2, marginRight: 5 }} />Starred ({starred.length})
        </button>
        {CATEGORIES.map((c: Category) => (
          <button key={c} className={`filter ${cat === c ? 'on' : ''}`} onClick={() => nav.setPastCat(c)}>{CATEGORY_META[c].label}</button>
        ))}
      </div>
      {list.length === 0 && (
        <p className="empty">
          {cat === 'starred'
            ? 'No starred questions yet. Tap the star at the top of any solution to save it here for later.'
            : "Nothing here yet. Answer today's challenge and it will show up here with the full solution."}
        </p>
      )}
      {list.map((q, i) => {
        const a = profile.attempts[q.id]
        const isStar = profile.bookmarks.includes(q.id)
        return (
          <button key={q.id} className="row" onClick={() => nav.open({ kind: 'play', qid: q.id, daily: false, review: !!a && !DEV_MODE })}>
            <span className="rank">{i + 1}</span>
            <span className="info"><b>{q.title}</b><small>{CATEGORY_META[q.category].label} · {q.difficulty}{a ? ` · ${a.day}` : ''}</small></span>
            {isStar && <Star size={16} fill="#f2b84b" color="#f2b84b" aria-label="Starred" />}
            <span className={`badge ${a ? a.tier : 'none'}`}>{a ? a.score : '-'}</span>
          </button>
        )
      })}
    </div>
  )
}
