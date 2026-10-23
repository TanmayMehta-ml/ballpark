import { useEffect, useState } from 'react'
import { Bell, ChevronLeft, LogOut, Music, Volume2 } from 'lucide-react'
import type { Nav } from '../App'
import { useSettings } from '../lib/settings'
import { exitApp, isNative, permissionState, requestPermission, sendTest } from '../lib/notify'
import { playSfx } from '../lib/audio'
import { useStore } from '../lib/store'

function Toggle({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button role="switch" aria-checked={on} aria-label={label} className={`switch ${on ? 'on' : ''}`} onClick={() => onChange(!on)} data-sfx="none">
      <i />
    </button>
  )
}

export default function Settings({ nav }: { nav: Nav }) {
  const { settings, update } = useSettings()
  const { profile } = useStore()
  const [perm, setPerm] = useState<'granted' | 'denied' | 'prompt' | 'unsupported'>('unsupported')
  const [note, setNote] = useState('')
  const native = isNative()

  useEffect(() => {
    void permissionState().then(setPerm)
  }, [])

  async function toggleNotifications(v: boolean) {
    setNote('')
    if (v && native) {
      const ok = perm === 'granted' || (await requestPermission())
      setPerm(ok ? 'granted' : 'denied')
      if (!ok) {
        setNote('Notifications are blocked. Turn them on for BallPark in your phone settings.')
        update({ notifications: false })
        return
      }
    }
    update({ notifications: v })
    playSfx('click')
  }

  async function test() {
    if (perm !== 'granted' && !(await requestPermission())) {
      setNote('Allow notifications first.')
      return
    }
    await sendTest(profile.name)
    setNote('Sent. It should arrive in a few seconds.')
  }

  async function quit() {
    await exitApp()
    if (!native) setNote('Browsers do not let a page close itself. You can close this tab.')
  }

  return (
    <div className="screen noNav">
      <button className="back" onClick={nav.close}><ChevronLeft size={16} />Back</button>
      <h1 className="qTitle" style={{ marginTop: 0 }}>Settings</h1>

      <div className="card setCard">
        <div className="setRow">
          <span className="setIcon" style={{ background: 'var(--purple)' }}><Music size={18} /></span>
          <div className="setText"><b>Music</b><small>Soft ambient background loop</small></div>
          <Toggle on={settings.music} onChange={(music) => update({ music })} label="Music" />
        </div>
        <input className="range" type="range" min={0} max={100} value={Math.round(settings.musicVolume * 100)} disabled={!settings.music} aria-label="Music volume" onChange={(e) => update({ musicVolume: Number(e.target.value) / 100 })} />

        <div className="setRow" style={{ marginTop: 18 }}>
          <span className="setIcon" style={{ background: 'var(--green)' }}><Volume2 size={18} /></span>
          <div className="setText"><b>Sound effects</b><small>Taps, hints and results</small></div>
          <Toggle on={settings.sfx} onChange={(sfx) => update({ sfx })} label="Sound effects" />
        </div>
        <input className="range" type="range" min={0} max={100} value={Math.round(settings.sfxVolume * 100)} disabled={!settings.sfx} aria-label="Effects volume" onChange={(e) => update({ sfxVolume: Number(e.target.value) / 100 })} onPointerUp={() => playSfx('hint')} />
      </div>

      <div className="card setCard">
        <div className="setRow">
          <span className="setIcon" style={{ background: 'var(--orange)' }}><Bell size={18} /></span>
          <div className="setText"><b>Daily reminders</b><small>Two nudges a day, around 3 pm and 10 pm</small></div>
          <Toggle on={settings.notifications} onChange={toggleNotifications} label="Daily reminders" />
        </div>
        {!native && <p className="setNote">Reminders are delivered by the Android app. This switch is saved for when you use it there.</p>}
        {native && settings.notifications && <button className="btn small ghost" style={{ marginTop: 12 }} onClick={test}>Send a test notification</button>}
        {native && perm === 'denied' && <p className="setNote">Notifications are blocked in your phone settings.</p>}
        {note && <p className="setNote" role="status">{note}</p>}
      </div>

      <div className="card setCard">
        <button className="setRow exitRow" onClick={quit} data-sfx="none">
          <span className="setIcon" style={{ background: 'var(--ink)' }}><LogOut size={18} /></span>
          <div className="setText"><b>Exit app</b><small>{native ? 'Close BallPark' : 'Close this tab'}</small></div>
        </button>
      </div>
    </div>
  )
}
