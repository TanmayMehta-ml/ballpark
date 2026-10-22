import { useState } from 'react'
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

export type Tab = 'home' | 'past' | 'learn' | 'profile'
export type Overlay =
  | null
  | { kind: 'play'; qid: string; daily: boolean; review: boolean }
  | { kind: 'module'; id: string }
  | { kind: 'cheat' }

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
  const { profile } = useStore()
  const [tab, setTab] = useState<Tab>('home')
  const [overlay, setOverlay] = useState<Overlay>(null)
  const [pastCat, setPastCat] = useState<Category | 'all'>('all')

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
      </div>
    )
  }

  return (
    <div className="shell">
      {tab === 'home' && <Home nav={nav} />}
      {tab === 'past' && <Past nav={nav} />}
      {tab === 'learn' && <Learn nav={nav} />}
      {tab === 'profile' && <ProfileScreen />}
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
