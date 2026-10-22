import { Check, ChevronRight, Table2 } from 'lucide-react'
import type { Nav } from '../App'
import { CHEATSHEET, MODULES } from '../lib/data'
import { useStore } from '../lib/store'

export default function Learn({ nav }: { nav: Nav }) {
  const { profile } = useStore()
  const done = MODULES.filter((m) => profile.learnDone[m.id] !== undefined).length
  return (
    <div className="screen">
      <div className="top"><div><p className="hi">{done} of {MODULES.length} modules complete</p><h1 className="title">Learn skills</h1></div></div>

      <button className="wide" style={{ background: 'var(--ink)' }} onClick={() => nav.open({ kind: 'cheat' })}>
        <h3>India data cheat sheet</h3>
        <p>Population, households, sizes, weights, rates and how to read them.</p>
        <span className="meta"><Table2 size={16} /> {CHEATSHEET.length} reference groups</span>
        <span className="play"><ChevronRight /></span>
      </button>

      <div className="sectionHead"><h2>10 modules, easy to hard</h2></div>
      {MODULES.map((m) => {
        const score = profile.learnDone[m.id]
        return (
          <button key={m.id} className="row" onClick={() => nav.open({ kind: 'module', id: m.id })}>
            <span className="rank">{m.order}</span>
            <span className="info"><b>{m.title}</b><small style={{ textTransform: 'capitalize' }}>{m.level} · {m.minutes} min · {m.quiz.length} quiz questions</small></span>
            <span className={`badge ${score === undefined ? 'none' : 'perfect'}`}>{score === undefined ? <ChevronRight size={18} /> : <Check size={20} />}</span>
          </button>
        )
      })}
    </div>
  )
}
