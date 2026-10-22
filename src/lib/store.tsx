import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { Attempt, Profile, Question } from '../types'
import { diamondsFor, scoreAnswer, xpFor } from './scoring'
import { nextStreak, todayKey } from './daily'

const KEY = 'ballpark.profile.v1'

const EMPTY: Profile = {
  name: '',
  onboarded: false,
  xp: 0,
  diamonds: 0,
  streak: 0,
  bestStreak: 0,
  lastDay: null,
  attempts: {},
  learnDone: {},
  bookmarks: [],
}

function load(): Profile {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return { ...EMPTY, ...JSON.parse(raw) }
  } catch {
    /* storage blocked: start fresh */
  }
  return EMPTY
}

interface Store {
  profile: Profile
  setName(name: string): void
  finishOnboarding(name: string): void
  submit(q: Question, answer: number, hintsUsed: number[], daily: boolean): Attempt
  completeModule(id: string, score: number): void
  toggleBookmark(qid: string): void
  reset(): void
  /** True once today's daily question has been answered. */
  dailyDone: boolean
}

const Ctx = createContext<Store | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile>(load)

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(profile))
    } catch {
      /* ignore */
    }
  }, [profile])

  const submit = useCallback((q: Question, answer: number, hintsUsed: number[], daily: boolean): Attempt => {
    const today = todayKey()
    const res = scoreAnswer(q, answer)
    const xp = xpFor(q, res.score, hintsUsed.length)
    const attempt: Attempt = { qid: q.id, answer, score: res.score, tier: res.tier, hintsUsed, day: today, xp }
    setProfile((p) => {
      const streak = daily ? nextStreak(p.streak, p.lastDay, today) : p.streak
      return {
        ...p,
        xp: p.xp + xp,
        diamonds: p.diamonds + diamondsFor(res.score, streak),
        streak,
        bestStreak: Math.max(p.bestStreak, streak),
        lastDay: daily ? today : p.lastDay,
        attempts: { ...p.attempts, [q.id]: attempt },
      }
    })
    return attempt
  }, [])

  const store = useMemo<Store>(
    () => ({
      profile,
      setName: (name) => setProfile((p) => ({ ...p, name })),
      finishOnboarding: (name) => setProfile((p) => ({ ...p, name: name.trim() || 'Friend', onboarded: true })),
      submit,
      completeModule: (id, score) =>
        setProfile((p) => {
          const prev = p.learnDone[id]
          const first = prev === undefined
          return {
            ...p,
            xp: p.xp + (first ? 10 + score * 2 : 0),
            diamonds: p.diamonds + (first ? score : 0),
            learnDone: { ...p.learnDone, [id]: Math.max(prev ?? 0, score) },
          }
        }),
      toggleBookmark: (qid) =>
        setProfile((p) => ({
          ...p,
          bookmarks: p.bookmarks.includes(qid) ? p.bookmarks.filter((x) => x !== qid) : [...p.bookmarks, qid],
        })),
      reset: () => setProfile(EMPTY),
      dailyDone: profile.lastDay === todayKey(),
    }),
    [profile, submit],
  )

  return <Ctx.Provider value={store}>{children}</Ctx.Provider>
}

export function useStore(): Store {
  const s = useContext(Ctx)
  if (!s) throw new Error('StoreProvider missing')
  return s
}
