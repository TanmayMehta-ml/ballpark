import { useEffect, useState } from 'react'
import { BookOpen, History, Home as HomeIcon, User } from 'lucide-react'
import type { Category } from './types'
import { useStore } from './lib/store'
import Welcome from './screens/Welcome'
import Home from './screens/Home'
import Play from './screens/Play'
import Past from './screens/Past'
import Learn from './screens/Learn'
import ModuleView from './screens/ModuleView'
import CheatSheet from './screens/CheatSheet'
import ProfileScreen from './screens/ProfileScreen'
import Settings from './screens/Settings'
import Shop from './screens/Shop'
import { useSettings } from './lib/settings'
import { configureAudio, playSfx, suspendAudio, unlockAudio, type Sfx } from './lib/audio'
import { cancelAll, scheduleReminders } from './lib/notify'

export type Tab = 'home' | 'past' | 'learn' | 'profile'
export type Overlay =
  | null
  | { kind: 'play'; qid: string; daily: boolean; review: boolean }
  | { kind: 'module'; id: string }
  | { kind: 'cheat' }
  | { kind: 'settings' }
  | { kind: 'shop' }

export interface Nav {
  tab: Tab
  go(tab: Tab): void
  open(o: Overlay): void
  close(): void
  pastCat: Category | 'all'
  setPastCat(c: Category | 'all'): void
}

const TABS: { id: Tab; label: string; Icon: typeof HomeIcon }[] = [
  { id: 'home', label: 'Home', Icon: HomeIcon },
  { id: 'past', label: 'Past', Icon: History },
  { id: 'learn', label: 'Learn', Icon: BookOpen },
  { id: 'profile', label: 'Me', Icon: User },
]

export default function App() {
  const { profile, dailyDone } = useStore()
  const { settings } = useSettings()
  const [tab, setTab] = useState<Tab>('home')
  const [overlay, setOverlay] = useState<Overlay>(null)
  const [pastCat, setPastCat] = useState<Category | 'all'>('all')

  // Audio: apply settings, unlock on first gesture, play a soft click on every button.
  useEffect(() => {
    configureAudio({ music: settings.music, musicVolume: settings.musicVolume, sfx: settings.sfx, sfxVolume: settings.sfxVolume })
  }, [settings.music, settings.musicVolume, settings.sfx, settings.sfxVolume])

  useEffect(() => {
    const onDown = () => unlockAudio()
    const onClick = (e: MouseEvent) => {
      const el = (e.target as HTMLElement).closest('button')
      if (!el || (el as HTMLButtonElement).disabled) return
      const name = el.closest<HTMLElement>('[data-sfx]')?.dataset.sfx ?? 'click'
      if (name !== 'none') playSfx(name as Sfx)
    }
    const onVis = () => suspendAudio(document.hidden)
    document.addEventListener('pointerdown', onDown, { once: true })
    document.addEventListener('click', onClick, true)
    document.addEventListener('visibilitychange', onVis)
    return () => {
      document.removeEventListener('pointerdown', onDown)
      document.removeEventListener('click', onClick, true)
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [])

  // Reminders: two a day (about 3 pm and 10 pm) for the next two weeks; skip today's once solved.
  useEffect(() => {
    if (!profile.onboarded) return
    if (settings.notifications) void scheduleReminders({ name: profile.name, solvedToday: dailyDone })
    else void cancelAll()
  }, [profile.onboarded, profile.name, settings.notifications, dailyDone])

  if (!profile.onboarded) return <div className="shell"><Welcome /></div>

  const nav: Nav = {
    tab,
    go: (t) => { setOverlay(null); setTab(t) },
    open: setOverlay,
    close: () => setOverlay(null),
    pastCat,
    setPastCat,
  }

  if (overlay) {
    return (
      <div className="shell">
        {overlay.kind === 'play' && <Play key={overlay.qid} {...overlay} nav={nav} />}
        {overlay.kind === 'module' && <ModuleView id={overlay.id} nav={nav} />}
        {overlay.kind === 'cheat' && <CheatSheet nav={nav} />}
        {overlay.kind === 'settings' && <Settings nav={nav} />}
        {overlay.kind === 'shop' && <Shop nav={nav} />}
      </div>
    )
  }

  return (
    <div className="shell">
      {tab === 'home' && <Home nav={nav} />}
      {tab === 'past' && <Past nav={nav} />}
      {tab === 'learn' && <Learn nav={nav} />}
      {tab === 'profile' && <ProfileScreen nav={nav} />}
      <nav className="nav" aria-label="Main">
        {TABS.map(({ id, label, Icon }) => (
          <button key={id} className={`navBtn ${tab === id ? 'on' : ''}`} onClick={() => nav.go(id)} aria-label={label} aria-current={tab === id ? 'page' : undefined}>
            <span className="ic"><Icon size={22} /></span>
            {tab === id && <span>{label}</span>}
          </button>
        ))}
      </nav>
    </div>
  )
}
