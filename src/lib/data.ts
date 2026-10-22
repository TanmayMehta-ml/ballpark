import type { Category, CheatGroup, Module, Question } from '../types'

export const DEV_MODE = import.meta.env.VITE_DEV_MODE === 'true'

const qFiles = import.meta.glob<Question[]>('../data/questions/*.json', { eager: true, import: 'default' })

/** Interleave categories (and difficulty within them) so the daily order feels varied. */
function buildBank(): Question[] {
  const byCat = new Map<Category, Question[]>()
  for (const file of Object.keys(qFiles).sort()) {
    for (const q of qFiles[file]) {
      const list = byCat.get(q.category) ?? []
      list.push(q)
      byCat.set(q.category, list)
    }
  }
  const order = { easy: 0, medium: 1, hard: 2 }
  const lists = [...byCat.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([, l]) => l.sort((a, b) => a.id.localeCompare(b.id)))
  // Within each category, cycle easy -> medium -> hard for a gentle ramp
  const ramped = lists.map((l) => {
    const buckets = [[], [], []] as Question[][]
    for (const q of l) buckets[order[q.difficulty]].push(q)
    const out: Question[] = []
    while (buckets.some((b) => b.length)) for (const b of buckets) if (b.length) out.push(b.shift()!)
    return out
  })
  const bank: Question[] = []
  for (let i = 0; ramped.some((l) => i < l.length); i++) for (const l of ramped) if (i < l.length) bank.push(l[i])
  return bank
}

export const QUESTIONS: Question[] = buildBank()
export const QUESTION_BY_ID = new Map(QUESTIONS.map((q) => [q.id, q]))

const modFiles = import.meta.glob<Module[]>('../data/learn/modules.json', { eager: true, import: 'default' })
export const MODULES: Module[] = (Object.values(modFiles)[0] ?? []).slice().sort((a, b) => a.order - b.order)

const cheatFiles = import.meta.glob<CheatGroup[]>('../data/cheatsheet.json', { eager: true, import: 'default' })
export const CHEATSHEET: CheatGroup[] = Object.values(cheatFiles)[0] ?? []

export const CATEGORY_META: Record<Category, { label: string; color: string }> = {
  population: { label: 'Population', color: 'var(--green)' },
  consumer: { label: 'Consumer', color: 'var(--yellow)' },
  retail: { label: 'Retail', color: 'var(--orange)' },
  transport: { label: 'Transport', color: 'var(--blue)' },
  tech: { label: 'Tech', color: 'var(--purple)' },
  health: { label: 'Health', color: 'var(--orange)' },
  education: { label: 'Education', color: 'var(--green)' },
  energy: { label: 'Energy', color: 'var(--yellow)' },
  services: { label: 'Services', color: 'var(--blue)' },
  operations: { label: 'Operations', color: 'var(--purple)' },
}

export const CATEGORIES = Object.keys(CATEGORY_META) as Category[]
