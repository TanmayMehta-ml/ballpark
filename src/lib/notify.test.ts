import { describe, expect, it } from 'vitest'
import { REMINDERS } from './notify'

describe('reminders', () => {
  it('has at least 10 distinct messages', () => {
    expect(REMINDERS.length).toBeGreaterThanOrEqual(10)
    expect(new Set(REMINDERS.map((r) => r.body)).size).toBe(REMINDERS.length)
    for (const r of REMINDERS) {
      expect(r.title.length).toBeGreaterThan(5)
      expect(r.body.length).toBeLessThan(120)
    }
  })
})
