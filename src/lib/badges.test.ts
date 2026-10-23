import { describe, expect, it } from 'vitest'
import { computeBadges } from './badges'
import { addDays, dateKey, daysInMonth } from './daily'
import type { Profile } from '../types'

const base = {
  attempts: {},
  days: {},
  learnDone: {},
  bestStreak: 0,
} as unknown as Profile
const ctx = { modulesTotal: 10, categoryOf: () => 'retail' }
const get = (p: Profile, id: string) => computeBadges(p, ctx).find((b) => b.id === id)!

describe('dates', () => {
  it('adds days across month ends', () => {
    expect(addDays('2026-01-31', 1)).toBe('2026-02-01')
    expect(addDays('2026-03-01', -1)).toBe('2026-02-28')
    expect(daysInMonth(2028, 1)).toBe(29)
  })
})

describe('badges', () => {
  it('streak badges use the best streak', () => {
    expect(get({ ...base, bestStreak: 6 }, 'streak-7').earned).toBe(false)
    expect(get({ ...base, bestStreak: 7 }, 'streak-7').earned).toBe(true)
    expect(get({ ...base, bestStreak: 30 }, 'streak-30').earned).toBe(true)
  })

  it('a month badge needs 80% of the days solved inside the range', () => {
    const days: Profile['days'] = {}
    // January has 31 days, so 25 are needed
    for (let d = 1; d <= 24; d++) days[dateKey(2026, 0, d)] = { tier: d % 2 ? 'perfect' : 'good', score: 80 }
    const short = get({ ...base, days }, 'month-1')
    expect(short.earned).toBe(false)
    expect(short.have).toBe(24)
    expect(short.need).toBe(25)
    days[dateKey(2026, 0, 25)] = { tier: 'perfect', score: 100 }
    expect(get({ ...base, days }, 'month-1').earned).toBe(true)
  })

  it('close answers do not count but freeze days do', () => {
    const days: Profile['days'] = {}
    // February 2026 has 28 days, so 23 are needed
    for (let d = 1; d <= 22; d++) days[dateKey(2026, 1, d)] = { tier: d <= 5 ? 'close' : 'perfect', score: 100 }
    expect(get({ ...base, days }, 'month-2').earned).toBe(false)
    for (let d = 1; d <= 5; d++) days[dateKey(2026, 1, d)] = { tier: 'freeze', score: 0 }
    days[dateKey(2026, 1, 23)] = { tier: 'good', score: 70 }
    expect(get({ ...base, days }, 'month-2').earned).toBe(true)
  })

  it('learning badges count modules', () => {
    const done = (n: number) => Object.fromEntries(Array.from({ length: n }, (_, i) => [`m${i}`, 3]))
    expect(get({ ...base, learnDone: done(1) }, 'learn-1').earned).toBe(true)
    expect(get({ ...base, learnDone: done(4) }, 'learn-5').earned).toBe(false)
    expect(get({ ...base, learnDone: done(5) }, 'learn-5').earned).toBe(true)
    expect(get({ ...base, learnDone: done(10) }, 'learn-all').earned).toBe(true)
  })

  it('has unique ids and 12 month badges', () => {
    const all = computeBadges(base, ctx)
    expect(new Set(all.map((b) => b.id)).size).toBe(all.length)
    expect(all.filter((b) => b.group === 'month')).toHaveLength(12)
  })
})
