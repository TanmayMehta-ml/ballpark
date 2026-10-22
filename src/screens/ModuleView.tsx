import { useState } from 'react'
import { ChevronLeft } from 'lucide-react'
import type { Nav } from '../App'
import { MODULES } from '../lib/data'
import { useStore } from '../lib/store'

export default function ModuleView({ id, nav }: { id: string; nav: Nav }) {
  const { completeModule, profile } = useStore()
  const m = MODULES.find((x) => x.id === id)
  const [picked, setPicked] = useState<Record<number, number>>({})
  const [saved, setSaved] = useState(false)
  if (!m) return <div className="screen noNav"><button className="back" onClick={nav.close}><ChevronLeft size={16} />Back</button></div>

  const answered = Object.keys(picked).length
  const score = m.quiz.filter((qz, i) => picked[i] === qz.answer).length
  const finished = answered === m.quiz.length

  return (
    <div className="screen noNav">
      <button className="back" onClick={nav.close}><ChevronLeft size={16} />Back</button>
      <span className="pill">Module {m.order}</span><span className={`pill ${m.level}`}>{m.level}</span>
      <h1 className="qTitle" style={{ fontSize: 34 }}>{m.title}</h1>
      <p style={{ color: 'var(--muted)', margin: '8px 0 20px', lineHeight: 1.45 }}>{m.blurb}</p>

      {m.lessons.map((l, i) => (
        <div className="lesson" key={i}><h3>{l.heading}</h3><p>{l.body}</p></div>
      ))}

      {m.example && (
        <div className="card" style={{ margin: '18px 0' }}>
          <p className="h3">Worked example</p>
          <p style={{ fontWeight: 600, marginBottom: 6 }}>{m.example.prompt}</p>
          {m.example.walk.map((w, i) => (
            <div className="step" key={i}><span className="n">{i + 1}</span><p>{w}</p></div>
          ))}
        </div>
      )}

      <div className="sectionHead"><h2>Check yourself</h2><span>{answered}/{m.quiz.length}</span></div>
      {m.quiz.map((qz, qi) => (
        <div key={qi} style={{ marginBottom: 16 }}>
          <p className="h3">{qi + 1}. {qz.q}</p>
          {qz.options.map((o, oi) => {
            const chosen = picked[qi]
            const cls = chosen === undefined ? '' : oi === qz.answer ? 'right' : oi === chosen ? 'wrong' : ''
            return <button key={oi} className={`opt ${cls}`} disabled={chosen !== undefined} onClick={() => setPicked((p) => ({ ...p, [qi]: oi }))}>{o}</button>
          })}
          {picked[qi] !== undefined && <div className="why">{qz.why}</div>}
        </div>
      ))}

      {finished && (
        <div className="card center">
          <h2 style={{ fontSize: 30 }}>{score} / {m.quiz.length} correct</h2>
          <p style={{ color: 'var(--muted)', margin: '8px 0 14px' }}>{profile.learnDone[m.id] === undefined ? 'Finish to earn XP and diamonds.' : 'Already completed. Replaying keeps your best score.'}</p>
          <button className="btn block" onClick={() => { if (!saved) completeModule(m.id, score); setSaved(true); nav.close() }}>Finish module</button>
        </div>
      )}
    </div>
  )
}
