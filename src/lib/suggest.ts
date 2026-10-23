import type { Attempt, Module, Question } from '../types'

const BY_CATEGORY: Record<Question['category'], string[]> = {
  population: ['m03-topdown', 'm06-segmentation'],
  consumer: ['m09-rate-models', 'm06-segmentation'],
  retail: ['m06-segmentation', 'm09-rate-models'],
  transport: ['m07-supply-demand', 'm04-bottomup'],
  tech: ['m09-rate-models', 'm03-topdown'],
  health: ['m06-segmentation', 'm07-supply-demand'],
  education: ['m03-topdown', 'm06-segmentation'],
  energy: ['m04-bottomup', 'm05-mental-math'],
  services: ['m04-bottomup', 'm07-supply-demand'],
  operations: ['m04-bottomup', 'm07-supply-demand'],
}

const WHY: Record<string, string> = {
  'm03-topdown': 'This question starts from a big population and narrows it down. Top-down estimation is exactly that skill.',
  'm04-bottomup': 'Building this one up from a single unit and scaling is the cleanest route. Practise the bottom-up method.',
  'm05-mental-math': 'Your number was far off, which is often a zero or unit slip. Sharpen lakh and crore mental maths.',
  'm06-segmentation': 'Splitting this into clean, non-overlapping groups makes it much easier to size. Work on segmentation and MECE.',
  'm07-supply-demand': 'This one can be sized from the demand or the supply side. Learn when each approach fits.',
  'm08-triangulation': 'Cross-checking with a second route would have caught the gap. Learn triangulation and sanity checks.',
  'm09-rate-models': 'This is a users x frequency x price problem. Master penetration, frequency and price models.',
  'm10-hard-cases': 'You handled a tough one. Try the hard mixed cases and presenting under pressure.',
}

/** Pick a module that fits the question just played and how the answer went. */
export function suggestModule(q: Question, attempt: Attempt, modules: Module[], done: Record<string, number>): { module: Module; reason: string; revisit: boolean } | null {
  const answerFactor = attempt.answer > q.range.high ? attempt.answer / q.range.high : q.range.low / attempt.answer
  const ordered: string[] = []
  if (attempt.tier !== 'perfect' && answerFactor >= 50) ordered.push('m05-mental-math')
  else if (attempt.tier === 'miss' || attempt.tier === 'near') ordered.push('m08-triangulation')
  if (attempt.tier === 'perfect' && q.difficulty === 'hard') ordered.push('m10-hard-cases')
  ordered.push(...BY_CATEGORY[q.category])
  const candidates = ordered.map((id) => modules.find((m) => m.id === id)).filter((m): m is Module => !!m)
  if (!candidates.length) return null
  const fresh = candidates.find((m) => done[m.id] === undefined)
  const pick = fresh ?? candidates[0]
  return { module: pick, reason: WHY[pick.id] ?? pick.blurb, revisit: !fresh }
}
