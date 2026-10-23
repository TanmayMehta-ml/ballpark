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
  it('keeps zeros in whole numbers', () => {
    expect(formatIndian(100)).toBe('100')
    expect(formatIndian(1000 * 1e7)).toBe('1,000 crore')
    expect(formatIndian(100 * 1e7)).toBe('100 crore')
    expect(formatIndian(1e15)).toBe('1,000 lakh crore')
    expect(formatIndian(1e16)).toBe('10,000 lakh crore')
    expect(formatIndian(2e5)).toBe('2 lakh')
    expect(formatIndian(1e7)).toBe('1 crore')
    expect(formatIndian(120)).toBe('120')
    expect(formatIndian(0.5)).toBe('0.5')
  })
})

import { applyStreak, liveStreak } from './daily'
import { suggestModule } from './suggest'
import type { Attempt, Module } from '../types'

describe('streak freeze', () => {
  it('covers missed days from the bank', () => {
    expect(applyStreak(5, '2026-03-01', '2026-03-02', 0)).toEqual({ streak: 6, freezeUsed: 0 })
    expect(applyStreak(5, '2026-03-01', '2026-03-04', 2)).toEqual({ streak: 6, freezeUsed: 2 })
    expect(applyStreak(5, '2026-03-01', '2026-03-04', 1)).toEqual({ streak: 1, freezeUsed: 0 })
  })
  it('shows a broken streak as 0', () => {
    expect(liveStreak(5, '2026-03-01', 0, '2026-03-02')).toBe(5)
    expect(liveStreak(5, '2026-03-01', 0, '2026-03-04')).toBe(0)
    expect(liveStreak(5, '2026-03-01', 2, '2026-03-04')).toBe(5)
  })
})

describe('module suggestion', () => {
  const mods = ['m03-topdown', 'm05-mental-math', 'm06-segmentation', 'm08-triangulation'].map((id) => ({ id, title: id, minutes: 5, blurb: '' }) as Module)
  const question = { category: 'population', difficulty: 'easy', range: { low: 100, high: 400, target: 200 } } as Question
  const at = (answer: number, tier: Attempt['tier']) => ({ answer, tier }) as Attempt
  it('matches the category when the answer is good', () => {
    expect(suggestModule(question, at(200, 'perfect'), mods, {})?.module.id).toBe('m03-topdown')
  })
  it('flags unit slips', () => {
    expect(suggestModule(question, at(400000, 'miss'), mods, {})?.module.id).toBe('m05-mental-math')
  })
  it('moves on when a module is done', () => {
    expect(suggestModule(question, at(200, 'perfect'), mods, { 'm03-topdown': 3 })?.module.id).toBe('m06-segmentation')
  })
})
