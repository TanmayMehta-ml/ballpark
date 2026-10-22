import { describe, expect, it } from 'vitest'
import { scoreAnswer, levelFor } from './scoring'
import { daysBetween, nextStreak, dailyIndex } from './daily'
import { formatIndian } from './format'
import type { Question } from '../types'

const q = { range: { low: 100, high: 400, target: 200 }, difficulty: 'medium' } as Question

describe('scoring', () => {
  it('tiers by log distance', () => {
    expect(scoreAnswer(q, 250).tier).toBe('perfect')
    expect(scoreAnswer(q, 60).tier).toBe('close')
    expect(scoreAnswer(q, 700).tier).toBe('close')
    expect(scoreAnswer(q, 3000).tier).toBe('near')
    expect(scoreAnswer(q, 15).tier).toBe('near')
    expect(scoreAnswer(q, 5).tier).toBe('miss')
    expect(scoreAnswer(q, 0).tier).toBe('miss')
  })
  it('levels', () => {
    expect(levelFor(0).level).toBe(1)
    expect(levelFor(100).level).toBe(3)
  })
})

describe('daily', () => {
  it('counts days across month ends', () => {
    expect(daysBetween('2026-01-31', '2026-02-01')).toBe(1)
  })
  it('streak rules', () => {
    expect(nextStreak(0, null, '2026-03-02')).toBe(1)
    expect(nextStreak(3, '2026-03-01', '2026-03-02')).toBe(4)
    expect(nextStreak(3, '2026-03-02', '2026-03-02')).toBe(3)
    expect(nextStreak(3, '2026-02-27', '2026-03-02')).toBe(1)
  })
  it('wraps the question index', () => {
    expect(dailyIndex(200, '2026-01-01')).toBe(0)
    expect(dailyIndex(200, '2026-01-02')).toBe(1)
    expect(dailyIndex(5, '2026-01-06')).toBe(0)
  })
})

describe('format', () => {
  it('formats Indian units', () => {
    expect(formatIndian(200000000)).toBe('20 crore')
    expect(formatIndian(250000)).toBe('2.5 lakh')
    expect(formatIndian(1.5e12)).toBe('1.5 lakh crore')
  })
})
