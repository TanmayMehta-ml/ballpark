import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

export interface Settings {
  music: boolean
  musicVolume: number // 0..1
  sfx: boolean
  sfxVolume: number // 0..1
  notifications: boolean
}

const KEY = 'ballpark.settings.v1'
const DEFAULTS: Settings = { music: true, musicVolume: 0.5, sfx: true, sfxVolume: 0.7, notifications: true }

function load(): Settings {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return { ...DEFAULTS, ...JSON.parse(raw) }
  } catch {
    /* storage blocked */
  }
  return DEFAULTS
}

interface Ctx {
  settings: Settings
  update(patch: Partial<Settings>): void
}
const SettingsCtx = createContext<Ctx | null>(null)

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(load)
  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(settings))
    } catch {
      /* ignore */
    }
  }, [settings])
  const value = useMemo<Ctx>(() => ({ settings, update: (patch) => setSettings((s) => ({ ...s, ...patch })) }), [settings])
  return <SettingsCtx.Provider value={value}>{children}</SettingsCtx.Provider>
}

export function useSettings(): Ctx {
  const c = useContext(SettingsCtx)
  if (!c) throw new Error('SettingsProvider missing')
  return c
}
