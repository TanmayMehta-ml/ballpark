import type { Question, Tier } from '../types'

export interface ScoreResult {
  tier: Tier
  score: number
  /** How many times the answer is outside the nearest range bound (1 = inside) */
  factor: number
}

/** The acceptable range split into three equal parts on a log scale. Returns the two cut points. */
export function rangeZones(q: Pick<Question, 'range'>): [number, number] {
  const { low, high } = q.range
  const step = Math.pow(high / low, 1 / 3)
  return [low * step, low * step * step]
}

export const SCORE = { core: 100, edge: 70, close: 40, near: 15 }

/**
 * Inside the range the score depends on which third you land in: the middle third is full marks,
 * the outer thirds are 70. Outside it falls off by how many times you miss by (within 2x, within 10x, miss).
 */
export function scoreAnswer(q: Question, answer: number): ScoreResult {
  const { low, high } = q.range
  if (!(answer > 0)) return { tier: 'miss', score: 0, factor: Infinity }
  if (answer >= low && answer <= high) {
    const [a, b] = rangeZones(q)
    return answer >= a && answer <= b ? { tier: 'perfect', score: SCORE.core, factor: 1 } : { tier: 'good', score: SCORE.edge, factor: 1 }
  }
  const factor = answer < low ? low / answer : answer / high
  if (factor <= 2) return { tier: 'close', score: SCORE.close, factor }
  if (factor <= 10) return { tier: 'near', score: SCORE.near, factor }
  return { tier: 'miss', score: 0, factor }
}

const DIFF_XP = { easy: 10, medium: 15, hard: 25 }

/** XP earned: score share of the difficulty value, plus a bonus for fewer hints used. */
export function xpFor(q: Question, score: number, hintsUsed: number): number {
  const base = Math.round((DIFF_XP[q.difficulty] * score) / 100)
  const noHintBonus = score > 0 ? (3 - hintsUsed) * 2 : 0
  return base + noHintBonus
}

export function diamondsFor(score: number, streak: number): number {
  return Math.round(score / 10) + (score >= 70 ? Math.min(streak, 7) : 0)
}

export const LEVELS = [0, 40, 100, 200, 350, 550, 800, 1100, 1500, 2000]
export function levelFor(xp: number): { level: number; into: number; need: number } {
  let level = 1
  for (let i = 1; i < LEVELS.length; i++) if (xp >= LEVELS[i]) level = i + 1
  const start = LEVELS[level - 1]
  const next = LEVELS[level] ?? start + 600
  return { level, into: xp - start, need: next - start }
}

export const TIER_COPY: Record<Tier, { title: string; line: string }> = {
  perfect: { title: 'Bullseye!', line: 'Right in the heart of the acceptable range. Full marks.' },
  good: { title: 'In the ballpark', line: 'Inside the acceptable range, but toward the edge. Aim for the dark middle for full marks.' },
  close: { title: 'So close', line: 'Within 2x of the range. A tweak to one assumption would get you in.' },
  near: { title: 'In the neighbourhood', line: 'Within 10x. Check which step is the biggest lever.' },
  miss: { title: 'Off the mark', line: 'More than 10x away. Review the steps and try the next one.' },
}
