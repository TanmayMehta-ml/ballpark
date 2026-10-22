import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const dir = join(import.meta.dirname, '..', 'src', 'data', 'questions')
const CATS = ['population', 'consumer', 'retail', 'transport', 'tech', 'health', 'education', 'energy', 'services', 'operations']
const DIFFS = ['easy', 'medium', 'hard']

const errors: string[] = []
const warns: string[] = []
const ids = new Set<string>()
const titles = new Set<string>()
let count = 0
const byDiff: Record<string, number> = {}
const byCat: Record<string, number> = {}

/** Pull numbers like "1.4 crore", "35 lakh", "₹2,000" out of free text, in base units. */
function numbersIn(text: string): number[] {
  const out: number[] = []
  const re = /(\d[\d,]*\.?\d*)\s*(lakh crore|crore|lakh|thousand|million|billion|k)?/gi
  let m: RegExpExecArray | null
  while ((m = re.exec(text))) {
    let n = parseFloat(m[1].replace(/,/g, ''))
    const u = (m[2] ?? '').toLowerCase()
    n *= u === 'lakh crore' ? 1e12 : u === 'crore' ? 1e7 : u === 'lakh' ? 1e5 : u === 'thousand' || u === 'k' ? 1e3 : u === 'million' ? 1e6 : u === 'billion' ? 1e9 : 1
    if (isFinite(n)) out.push(n)
  }
  return out
}

for (const f of readdirSync(dir).filter((x) => x.endsWith('.json')).sort()) {
  let list: any[]
  try {
    list = JSON.parse(readFileSync(join(dir, f), 'utf8'))
  } catch (e) {
    errors.push(`${f}: invalid JSON (${(e as Error).message})`)
    continue
  }
  for (const q of list) {
    count++
    const where = `${f} ${q.id ?? '?'}`
    const need = (c: boolean, msg: string) => c || errors.push(`${where}: ${msg}`)
    need(typeof q.id === 'string' && /^[a-z]+-\d{3}$/.test(q.id), 'id must look like category-001')
    need(!ids.has(q.id), 'duplicate id')
    ids.add(q.id)
    need(!titles.has(q.title), 'duplicate title')
    titles.add(q.title)
    need(CATS.includes(q.category), `bad category ${q.category}`)
    need(typeof q.id === 'string' && q.id.startsWith(q.category + '-'), 'id prefix must equal category')
    need(DIFFS.includes(q.difficulty), `bad difficulty ${q.difficulty}`)
    need(typeof q.prompt === 'string' && q.prompt.length > 20, 'prompt too short')
    need(typeof q.unit === 'string' && q.unit.length > 0, 'unit missing')
    byDiff[q.difficulty] = (byDiff[q.difficulty] ?? 0) + 1
    byCat[q.category] = (byCat[q.category] ?? 0) + 1
    const r = q.range
    need(r && r.low > 0 && r.low < r.target && r.target < r.high, 'range needs 0 < low < target < high')
    if (r) {
      need(r.high / r.low <= 12, `range too wide (${(r.high / r.low).toFixed(1)}x), keep under 12x`)
      need(r.high / r.low >= 2, 'range too narrow, keep at least 2x')
    }
    need(Array.isArray(q.hints) && q.hints.length === 15, `needs exactly 15 hints, has ${q.hints?.length}`)
    const labels = new Set<string>()
    for (const h of q.hints ?? []) {
      need(h.label && h.value, 'hint needs label and value')
      need(!labels.has(h.label), `duplicate hint label ${h.label}`)
      labels.add(h.label)
      if (r) for (const n of numbersIn(`${h.value}`)) if (n >= r.low * 0.9 && n <= r.high * 1.1 && n > 1000) warns.push(`${where}: hint "${h.label}" has a number (${n}) inside the answer range`)
    }
    need(Array.isArray(q.steps) && q.steps.length >= 4, 'needs at least 4 steps')
    const last = q.steps?.[q.steps.length - 1]
    if (last && r) need(typeof last.value === 'number' && Math.abs(last.value - r.target) / r.target <= 0.03, `last step value ${last.value} must be within 3% of target ${r.target}`)
    for (const s of q.steps ?? []) need(s.title && s.explain, 'step needs title and explain')
    need(Array.isArray(q.assumptions) && q.assumptions.length >= 2, 'needs 2+ assumptions')
    need(typeof q.sanityCheck === 'string' && q.sanityCheck.length > 15, 'sanityCheck missing')
  }
}

console.log(`Questions: ${count}`)
console.log('By difficulty:', byDiff)
console.log('By category:', byCat)
warns.forEach((w) => console.log('WARN', w))
if (errors.length) {
  errors.forEach((e) => console.error('ERROR', e))
  process.exit(1)
}
console.log('OK')
