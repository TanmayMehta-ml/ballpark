import type { Profile } from '../types'
import { dateKey, daysInMonth } from './daily'

export type BadgeGroup = 'streak' | 'month' | 'learn' | 'skill'
export type BadgeIcon = 'flame' | 'crown' | 'calendar' | 'book' | 'library' | 'cap' | 'target' | 'crosshair' | 'eye' | 'compass' | 'rocket'

export interface Badge {
  id: string
  group: BadgeGroup
  name: string
  how: string
  icon: BadgeIcon
  /** Short text printed on the medal (month badges) */
  label?: string
  earned: boolean
  have: number
  need: number
}

export const GROUP_META: Record<BadgeGroup, { title: string; blurb: string; color: string }> = {
  streak: { title: 'Streaks', blurb: 'Show up day after day', color: '#e8622d' },
  month: { title: 'Perfect months', blurb: 'Every day of the month solved, and every answer inside the range', color: '#3f7d5c' },
  learn: { title: 'Learning', blurb: 'Finish the Learn modules', color: '#7b66c2' },
  skill: { title: 'Skills', blurb: 'Sharp, hint-free estimating', color: '#6f7fc4' },
}

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

const correct = (tier: string) => tier === 'perfect' || tier === 'good'

/** For each calendar month (0-11), the best year-run: how many days were solved correctly, and whether the month is complete. */
function monthProgress(days: Profile['days']): { done: number; total: number; complete: boolean }[] {
  const years = new Set(Object.keys(days).map((k) => Number(k.slice(0, 4))))
  return MONTHS.map((_, m) => {
    let best = { done: 0, total: 30, complete: false }
    for (const y of years) {
      const total = daysInMonth(y, m)
      let done = 0
      for (let d = 1; d <= total; d++) {
        const rec = days[dateKey(y, m, d)]
        if (rec && correct(rec.tier)) done++
      }
      if (done === total) return { done, total, complete: true }
      if (done >= best.done) best = { done, total, complete: false }
    }
    return best
  })
}

export function computeBadges(profile: Profile, ctx: { modulesTotal: number; categoryOf: (qid: string) => string | undefined }): Badge[] {
  const attempts = Object.values(profile.attempts)
  const bullseyes = attempts.filter((a) => a.tier === 'perfect').length
  const hintFree = attempts.filter((a) => (a.tier === 'perfect' || a.tier === 'good') && a.hintsUsed.length === 0).length
  const categories = new Set(attempts.map((a) => ctx.categoryOf(a.qid)).filter(Boolean)).size
  const modulesDone = Object.keys(profile.learnDone).length
  const best = profile.bestStreak
  const months = monthProgress(profile.days)

  const b = (x: Omit<Badge, 'earned'> & { earned?: boolean }): Badge => ({ ...x, earned: x.earned ?? x.have >= x.need })

  return [
    b({ id: 'streak-7', group: 'streak', name: '7-day streak', how: 'Solve the daily 7 days in a row.', icon: 'flame', label: '7', have: best, need: 7 }),
    b({ id: 'streak-30', group: 'streak', name: '30-day streak', how: 'Solve the daily 30 days in a row.', icon: 'flame', label: '30', have: best, need: 30 }),
    b({ id: 'streak-100', group: 'streak', name: '100-day streak', how: 'Solve the daily 100 days in a row.', icon: 'crown', label: '100', have: best, need: 100 }),

    ...MONTHS.map((name, i) =>
      b({
        id: `month-${i + 1}`,
        group: 'month',
        name: `${name} streak`,
        how: `Solve the daily on every day of ${name}, with every answer inside the acceptable range.`,
        icon: 'calendar',
        label: name.slice(0, 3).toUpperCase(),
        have: months[i].done,
        need: months[i].total,
        earned: months[i].complete,
      }),
    ),

    b({ id: 'learn-1', group: 'learn', name: 'First module', how: 'Finish your first Learn module.', icon: 'book', have: modulesDone, need: 1 }),
    b({ id: 'learn-5', group: 'learn', name: 'Five modules', how: 'Finish 5 Learn modules.', icon: 'library', have: modulesDone, need: 5 }),
    b({ id: 'learn-all', group: 'learn', name: 'Graduate', how: 'Finish every Learn module.', icon: 'cap', have: modulesDone, need: ctx.modulesTotal }),

    b({ id: 'first', group: 'skill', name: 'First estimate', how: 'Answer your first question.', icon: 'rocket', have: attempts.length, need: 1 }),
    b({ id: 'bull-1', group: 'skill', name: 'Bullseye', how: 'Land in the middle third of the range once.', icon: 'target', have: bullseyes, need: 1 }),
    b({ id: 'bull-10', group: 'skill', name: 'Sharpshooter', how: 'Land in the middle third of the range 10 times.', icon: 'crosshair', have: bullseyes, need: 10 }),
    b({ id: 'nohint-5', group: 'skill', name: 'No hints needed', how: 'Get 5 answers inside the range without using any research.', icon: 'eye', have: hintFree, need: 5 }),
    b({ id: 'explorer', group: 'skill', name: 'Explorer', how: 'Answer a question in all 10 categories.', icon: 'compass', have: categories, need: 10 }),
  ]
}
