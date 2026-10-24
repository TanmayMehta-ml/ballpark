import { useCallback, useEffect, useRef, useState } from 'react'
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
import StreakScreen from './screens/StreakScreen'
import { useSettings } from './lib/settings'
import { configureAudio, playSfx, suspendAudio, unlockAudio, type Sfx } from './lib/audio'
import { cancelAll, isNative, scheduleReminders } from './lib/notify'
import { ROOT, canGoBack, goTab, openOverlay, popStack, top, type Entry } from './lib/navstack'
import { runModalBack } from './lib/back'
import { QuitDialog } from './components/QuitDialog'

export type Tab = 'home' | 'past' | 'learn' | 'profile'
export type Overlay =
  | null
  | { kind: 'play'; qid: string; daily: boolean; review: boolean }
  | { kind: 'module'; id: string }
  | { kind: 'cheat' }
  | { kind: 'settings' }
  | { kind: 'shop' }
  | { kind: 'streak' }

export interface Nav {
  tab: Tab
  go(tab: Tab): void
  open(o: Overlay): void
  close(): void
  pastCat: Category | 'all' | 'starred'
  setPastCat(c: Category | 'all' | 'starred'): void
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
  // Back history: always starts at Home, and Back never goes below it
  const [stack, setStack] = useState<Entry[]>(ROOT)
  const [quitOpen, setQuitOpen] = useState(false)
  const { tab, overlay } = top(stack)
  const [pastCat, setPastCat] = useState<Category | 'all' | 'starred'>('all')

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

  // Back button (Android) and browser Back: close a sheet, else go back a screen, else ask to quit from Home.
  const stackRef = useRef(stack)
  stackRef.current = stack
  const goBack = useCallback(() => {
    if (runModalBack()) return
    if (canGoBack(stackRef.current)) setStack((s) => popStack(s))
    else setQuitOpen(true)
  }, [])
  const goBackRef = useRef(goBack)
  goBackRef.current = goBack

  useEffect(() => {
    if (isNative()) {
      let handle: { remove: () => Promise<void> } | undefined
      let cancelled = false
      void import('@capacitor/app').then(({ App: CapApp }) =>
        CapApp.addListener('backButton', () => goBackRef.current()).then((h) => {
          if (cancelled) void h.remove()
          else handle = h
        }),
      )
      return () => {
        cancelled = true
        void handle?.remove()
      }
    }
    // Browser: keep one extra history entry so the Back button comes to us instead of leaving the page
    history.pushState({ bp: 1 }, '')
    const onPop = () => {
      history.pushState({ bp: 1 }, '')
      goBackRef.current()
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  // Reminders: two a day (about 3 pm and 10 pm) for the next two weeks; skip today's once solved.
  useEffect(() => {
    if (!profile.onboarded) return
    if (settings.notifications) void scheduleReminders({ name: profile.name, solvedToday: dailyDone })
    else void cancelAll()
  }, [profile.onboarded, profile.name, settings.notifications, dailyDone])

  if (!profile.onboarded) return <div className="shell"><Welcome />{quitOpen && <QuitDialog onClose={() => setQuitOpen(false)} />}</div>

  const nav: Nav = {
    tab,
    go: (t) => setStack((s) => goTab(s, t)),
    open: (o) => setStack((s) => openOverlay(s, o)),
    close: () => setStack((s) => popStack(s)),
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
        {overlay.kind === 'streak' && <StreakScreen nav={nav} />}
        {quitOpen && <QuitDialog onClose={() => setQuitOpen(false)} />}
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
      {quitOpen && <QuitDialog onClose={() => setQuitOpen(false)} />}
    </div>
  )
}
