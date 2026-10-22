/** First day of the daily challenge cycle. Day N shows question N of the ordered bank. */
export const LAUNCH_DAY = '2026-01-01'

export function todayKey(d = new Date()): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function dayNumber(key: string): number {
  const [y, m, d] = key.split('-').map(Number)
  return Math.floor(Date.UTC(y, m - 1, d) / 86400000)
}

export function daysBetween(a: string, b: string): number {
  return dayNumber(b) - dayNumber(a)
}

export function dailyIndex(count: number, key = todayKey()): number {
  const n = daysBetween(LAUNCH_DAY, key)
  return ((n % count) + count) % count
}

export function msUntilTomorrow(now = new Date()): number {
  const next = new Date(now)
  next.setHours(24, 0, 0, 0)
  return next.getTime() - now.getTime()
}

export function nextStreak(prevStreak: number, lastDay: string | null, today: string): number {
  if (!lastDay) return 1
  const gap = daysBetween(lastDay, today)
  if (gap === 0) return prevStreak
  if (gap === 1) return prevStreak + 1
  return 1
}
