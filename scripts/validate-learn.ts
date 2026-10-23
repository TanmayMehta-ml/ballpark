import { readFileSync } from 'node:fs'
import { join } from 'node:path'

interface QuizItem { q: string; options: string[]; answer: number; why: string }
interface Mod { id: string; quiz: QuizItem[] }

const mods: Mod[] = JSON.parse(readFileSync(join(import.meta.dirname, '..', 'src', 'data', 'learn', 'modules.json'), 'utf8'))
const errors: string[] = []
let items = 0
let longest = 0
const pos = [0, 0, 0, 0]

for (const m of mods) {
  let modLongest = 0
  const modPos = new Set<number>()
  for (const [i, q] of m.quiz.entries()) {
    const where = `${m.id} Q${i + 1}`
    items++
    if (q.options.length !== 4) errors.push(`${where}: needs 4 options`)
    if (!(q.answer >= 0 && q.answer < q.options.length)) errors.push(`${where}: answer index out of range`)
    const lens = q.options.map((o) => o.length)
    const max = Math.max(...lens)
    const min = Math.min(...lens)
    if (max / min > 2) errors.push(`${where}: option lengths too uneven (${min} to ${max} chars)`)
    if (lens[q.answer] === max) {
      longest++
      modLongest++
    }
    pos[q.answer]++
    modPos.add(q.answer)
    if (new Set(q.options).size !== q.options.length) errors.push(`${where}: duplicate options`)
  }
  if (modLongest > Math.ceil(m.quiz.length / 2)) errors.push(`${m.id}: correct answer is the longest in ${modLongest}/${m.quiz.length} items`)
  if (modPos.size < 2) errors.push(`${m.id}: correct answers all sit in the same position`)
}

if (longest / items > 0.35) errors.push(`correct answer is the longest option in ${longest}/${items} items (limit 35%)`)
for (const [i, n] of pos.entries()) if (n / items < 0.15) errors.push(`answer position ${i} is used only ${n}/${items} times (min 15%)`)

console.log(`Quiz items: ${items}, correct is longest: ${longest}, positions: ${pos.join('/')}`)
if (errors.length) {
  errors.forEach((e) => console.error('ERROR', e))
  process.exit(1)
}
console.log('Quizzes OK')
