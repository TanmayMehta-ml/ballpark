import { useMemo, useState } from 'react'
import { BadgeMedal } from './BadgeMedal'
import { GROUP_META, computeBadges, type Badge, type BadgeGroup } from '../lib/badges'
import { MODULES, QUESTION_BY_ID } from '../lib/data'
import { useStore } from '../lib/store'
import { useBackHandler } from '../lib/back'

const ORDER: BadgeGroup[] = ['streak', 'month', 'learn', 'skill']

export function BadgesSection() {
  const { profile } = useStore()
  const [open, setOpen] = useState<Badge | null>(null)
  useBackHandler(open !== null, () => setOpen(null))
  const badges = useMemo(
    () => computeBadges(profile, { modulesTotal: MODULES.length, categoryOf: (id) => QUESTION_BY_ID.get(id)?.category }),
    [profile],
  )
  const earned = badges.filter((b) => b.earned).length

  return (
    <>
      <div className="sectionHead"><h2>Badges</h2><span>{earned} of {badges.length} earned</span></div>
      {ORDER.map((g) => (
        <div key={g} className="card badgeGroup">
          <p className="h3" style={{ marginBottom: 2 }}>{GROUP_META[g].title}</p>
          <p className="badgeBlurb">{GROUP_META[g].blurb}</p>
          <div className="badgeGrid">
            {badges.filter((b) => b.group === g).map((b) => (
              <button key={b.id} className="badgeCell" onClick={() => setOpen(b)} aria-label={`${b.name}, ${b.earned ? 'earned' : 'locked'}`}>
                <BadgeMedal badge={b} size={60} />
                <span>{b.group === 'month' ? b.name.replace(' streak', '') : b.name}</span>
              </button>
            ))}
          </div>
        </div>
      ))}

      {open && (
        <div className="sheetWrap" onClick={() => setOpen(null)}>
          <div className="sheet center" onClick={(e) => e.stopPropagation()} role="dialog" aria-label={open.name}>
            <div style={{ display: 'grid', placeItems: 'center', marginBottom: 10 }}><BadgeMedal badge={open} size={96} /></div>
            <h2 style={{ fontSize: 28 }}>{open.name}</h2>
            <p style={{ color: 'var(--muted)', margin: '8px 0 14px', lineHeight: 1.45 }}>{open.how}</p>
            {open.earned ? (
              <p className="earnedTag">Earned</p>
            ) : (
              <>
                <div className="xpBar" style={{ maxWidth: 260, margin: '4px auto 6px' }}><i style={{ width: `${Math.min(100, (open.have / open.need) * 100)}%` }} /></div>
                <small style={{ color: 'var(--muted)' }}>{Math.min(open.have, open.need)} of {open.need}</small>
              </>
            )}
            <button className="btn block" style={{ marginTop: 18 }} onClick={() => setOpen(null)}>Close</button>
          </div>
        </div>
      )}
    </>
  )
}
