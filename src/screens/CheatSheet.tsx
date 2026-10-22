import { useState } from 'react'
import { ChevronLeft } from 'lucide-react'
import type { Nav } from '../App'
import { CHEATSHEET } from '../lib/data'

export default function CheatSheet({ nav }: { nav: Nav }) {
  const [q, setQ] = useState('')
  const needle = q.trim().toLowerCase()
  const groups = CHEATSHEET.map((g) => ({
    ...g,
    items: needle ? g.items.filter((i) => `${i.label} ${i.value} ${i.tip ?? ''}`.toLowerCase().includes(needle)) : g.items,
  })).filter((g) => g.items.length > 0)

  return (
    <div className="screen noNav">
      <button className="back" onClick={nav.close}><ChevronLeft size={16} />Back</button>
      <h1 className="qTitle">Cheat sheet</h1>
      <p style={{ color: 'var(--muted)', margin: '8px 0 16px', lineHeight: 1.45 }}>Approximate India reference numbers. Round them, then use them as anchors.</p>
      <input className="search" placeholder="Search: households, bus, acre, kWh..." value={q} onChange={(e) => setQ(e.target.value)} />
      {groups.length === 0 && <p className="empty">No match. Try a simpler word.</p>}
      {groups.map((g) => (
        <div key={g.title} style={{ marginBottom: 16 }}>
          <div className="sectionHead" style={{ margin: '14px 0 4px' }}><h2 style={{ fontSize: 22 }}>{g.title}</h2></div>
          <p style={{ color: 'var(--muted)', fontSize: 12.5, marginBottom: 6 }}>{g.note}</p>
          <div className="card">
            {g.items.map((i) => (
              <div className="cheatItem" key={i.label}>
                <span>{i.label}{i.tip && <small>{i.tip}</small>}</span>
                <b>{i.value}</b>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
