import { Capacitor } from '@capacitor/core'
import { LocalNotifications } from '@capacitor/local-notifications'

export interface Reminder {
  title: string
  body: string
}

/** Twelve reminders. {name} is replaced with the player's name. Two are picked at random each day. */
export const REMINDERS: Reminder[] = [
  { title: "Today's question is waiting", body: "{name}, can you solve today's guesstimate? One number, a few minutes." },
  { title: 'Time for a quick estimate', body: 'Your daily BallPark challenge is live. How close can you land?' },
  { title: 'Keep the streak alive', body: "Solve today's question and keep your streak going, {name}." },
  { title: 'Think like a consultant', body: "Break it down, pick your research, make the call. Today's case is ready." },
  { title: 'Three clues, one number', body: 'Your research team is on standby. Which data will you ask for today?' },
  { title: 'Can you beat yesterday?', body: "A fresh guesstimate just for you. Get inside the range and earn diamonds." },
  { title: 'Sharpen your estimate', body: 'Five minutes of Fermi practice now beats an hour of cramming later.' },
  { title: 'Last call for today', body: "Today's question closes at midnight. Give it a go, {name}." },
  { title: 'Wind down with a number', body: "One calm estimate before bed. Today's question is still open." },
  { title: "Don't lose your streak", body: "Today's daily is unsolved. It only takes a few minutes." },
  { title: 'Round it, split it, solve it', body: "Top-down or bottom-up? Pick your approach and tackle today's question." },
  { title: 'Ready when you are', body: "{name}, today's guesstimate won't solve itself. Let's get in the ballpark." },
]

const DAYS_AHEAD = 14
const SLOTS = [
  { hour: 15, id: 1 },
  { hour: 22, id: 2 },
]

export const isNative = () => Capacitor.isNativePlatform()

function pickTwo(): Reminder[] {
  const a = Math.floor(Math.random() * REMINDERS.length)
  let b = Math.floor(Math.random() * (REMINDERS.length - 1))
  if (b >= a) b++
  return [REMINDERS[a], REMINDERS[b]]
}

/** About 3 pm / 10 pm, with up to 20 minutes either side so it feels less robotic. */
function around(day: Date, hour: number): Date {
  const d = new Date(day)
  d.setHours(hour, 0, 0, 0)
  d.setMinutes(Math.floor(Math.random() * 41) - 20)
  return d
}

export async function permissionState(): Promise<'granted' | 'denied' | 'prompt' | 'unsupported'> {
  if (!isNative()) return 'unsupported'
  try {
    const r = await LocalNotifications.checkPermissions()
    return r.display === 'granted' ? 'granted' : r.display === 'denied' ? 'denied' : 'prompt'
  } catch {
    return 'unsupported'
  }
}

export async function requestPermission(): Promise<boolean> {
  if (!isNative()) return false
  try {
    const r = await LocalNotifications.requestPermissions()
    return r.display === 'granted'
  } catch {
    return false
  }
}

export async function cancelAll() {
  if (!isNative()) return
  try {
    const { notifications } = await LocalNotifications.getPending()
    if (notifications.length) await LocalNotifications.cancel({ notifications: notifications.map((n) => ({ id: n.id })) })
  } catch {
    /* ignore */
  }
}

/**
 * Replace everything pending with the next two weeks of reminders (2 a day, random text).
 * Today's slots are skipped once today's daily question has been solved.
 */
export async function scheduleReminders(opts: { name: string; solvedToday: boolean }) {
  if (!isNative()) return
  await cancelAll()
  const now = Date.now()
  const notifications: { id: number; title: string; body: string; schedule: { at: Date; allowWhileIdle: boolean } }[] = []
  for (let offset = 0; offset < DAYS_AHEAD; offset++) {
    if (offset === 0 && opts.solvedToday) continue
    const day = new Date()
    day.setDate(day.getDate() + offset)
    const texts = pickTwo()
    SLOTS.forEach((slot, i) => {
      const at = around(day, slot.hour)
      if (at.getTime() <= now + 60_000) return
      const t = texts[i]
      notifications.push({
        id: offset * 10 + slot.id,
        title: t.title,
        body: t.body.replace('{name}', opts.name || 'Friend'),
        schedule: { at, allowWhileIdle: true },
      })
    })
  }
  if (notifications.length) {
    try {
      await LocalNotifications.schedule({ notifications })
    } catch {
      /* permission revoked or scheduling failed: nothing to do */
    }
  }
}

export async function sendTest(name: string) {
  if (!isNative()) return
  const t = REMINDERS[Math.floor(Math.random() * REMINDERS.length)]
  await LocalNotifications.schedule({
    notifications: [{ id: 9999, title: t.title, body: t.body.replace('{name}', name || 'Friend'), schedule: { at: new Date(Date.now() + 3000) } }],
  })
}

export async function exitApp() {
  if (isNative()) {
    const { App } = await import('@capacitor/app')
    await App.exitApp()
  } else {
    window.close()
  }
}
