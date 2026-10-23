import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { Attempt, Gender, Profile, Question } from '../types'
import { diamondsFor, scoreAnswer, xpFor } from './scoring'
import { applyStreak, todayKey } from './daily'
import { ITEM_BY_ID } from './shop'

const KEY = 'ballpark.profile.v1'

const EMPTY: Profile = {
  name: '',
  avatar: 'fox',
  age: null,
  college: '',
  gender: '',
  onboarded: false,
  owned: [],
  border: 'none',
  banner: 'cream',
  freezeDays: 0,
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
  updateProfile(patch: Partial<Pick<Profile, 'name' | 'avatar' | 'age' | 'college' | 'gender' | 'border' | 'banner'>>): void
  /** Spend diamonds on a shop item. Returns false if it cannot be bought. */
  buy(itemId: string): boolean
  finishOnboarding(d: { name: string; age: number | null; gender: Gender | ''; avatar: string }): void
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
      const st = daily ? applyStreak(p.streak, p.lastDay, today, p.freezeDays) : { streak: p.streak, freezeUsed: 0 }
      const streak = st.streak
      return {
        ...p,
        freezeDays: p.freezeDays - st.freezeUsed,
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
      updateProfile: (patch) => setProfile((p) => ({ ...p, ...patch })),
      buy: (itemId) => {
        const item = ITEM_BY_ID.get(itemId)
        if (!item || profile.diamonds < item.price) return false
        if (item.kind !== 'freeze' && profile.owned.includes(item.id)) return false
        setProfile((p) => ({
          ...p,
          diamonds: p.diamonds - item.price,
          owned: item.kind === 'freeze' ? p.owned : [...p.owned, item.id],
          freezeDays: item.kind === 'freeze' ? p.freezeDays + (item.days ?? 0) : p.freezeDays,
        }))
        return true
      },
      finishOnboarding: (d) => setProfile((p) => ({ ...p, ...d, name: d.name.trim() || 'Friend', onboarded: true })),
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
