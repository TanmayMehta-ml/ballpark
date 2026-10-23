export type Difficulty = 'easy' | 'medium' | 'hard'

export type Category =
  | 'population'
  | 'consumer'
  | 'retail'
  | 'transport'
  | 'tech'
  | 'health'
  | 'education'
  | 'energy'
  | 'services'
  | 'operations'

export interface Hint {
  /** What the research team can look up, e.g. "Households in Bangalore" */
  label: string
  /** The data they return, as display text, e.g. "~35 lakh" */
  value: string
}

export interface Step {
  title: string
  explain: string
  /** Numeric result of this step, in base units. The last step must equal range.target. */
  value?: number
  /** Human readable calculation, e.g. "1.4 crore x 35% = 49 lakh" */
  calc?: string
}

export interface Question {
  id: string
  title: string
  category: Category
  difficulty: Difficulty
  prompt: string
  /** What the answer counts, e.g. "people", "₹", "cats per year" */
  unit: string
  range: { low: number; high: number; target: number }
  /** About 15 research options. The player can unlock only 3. */
  hints: Hint[]
  steps: Step[]
  assumptions: string[]
  sanityCheck: string
}

export interface Attempt {
  qid: string
  answer: number
  score: number // 0-100
  tier: Tier
  hintsUsed: number[] // indexes into question.hints
  day: string // YYYY-MM-DD local
  xp: number
}

export type Tier = 'perfect' | 'good' | 'close' | 'near' | 'miss'

export interface DayRec {
  tier: Tier | 'freeze'
  score: number
  qid?: string
}

export type Gender = 'male' | 'female' | 'other' | 'private'

export interface Profile {
  name: string
  avatar: string
  age: number | null
  college: string
  gender: Gender | ''
  onboarded: boolean
  owned: string[] // shop item ids
  border: string
  banner: string
  freezeDays: number
  xp: number
  diamonds: number
  streak: number
  bestStreak: number
  lastDay: string | null
  attempts: Record<string, Attempt>
  /** One entry per day the daily was solved (or covered by a streak freeze), keyed YYYY-MM-DD */
  days: Record<string, DayRec>
  learnDone: Record<string, number> // module id -> best quiz score
  bookmarks: string[]
}

export interface QuizItem {
  q: string
  options: string[]
  answer: number
  why: string
}

export interface Lesson {
  heading: string
  body: string
}

export interface Module {
  id: string
  order: number
  title: string
  level: 'easy' | 'medium' | 'hard'
  blurb: string
  minutes: number
  lessons: Lesson[]
  example?: { prompt: string; walk: string[] }
  quiz: QuizItem[]
}

export interface CheatGroup {
  title: string
  note: string
  items: { label: string; value: string; tip?: string }[]
}
