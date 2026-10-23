import { useEffect, useState } from 'react'
import { ChevronLeft, Gem, Snowflake } from 'lucide-react'
import type { Nav } from '../App'
import { Avatar, ProfilePic } from '../components/Avatar'
import { Diamonds } from '../components/bits'
import { Flame } from '../components/Flame'
import { BannerArt } from '../components/BannerArt'
import { playSfx } from '../lib/audio'
import { liveStreak } from '../lib/daily'
import { SHOP, type ItemKind, type ShopItem } from '../lib/shop'
import { useStore } from '../lib/store'

type Tab = ItemKind | 'insect'
const TABS: { id: Tab; label: string }[] = [
  { id: 'freeze', label: 'Streak freeze' },
  { id: 'animal', label: 'Animals' },
  { id: 'insect', label: 'Insects' },
  { id: 'border', label: 'Borders' },
  { id: 'banner', label: 'Banners' },
]

const DEFAULT_BORDER: ShopItem = { id: 'border-none', kind: 'border', name: 'No border', price: 0 }
const DEFAULT_BANNER: ShopItem = { id: 'banner-cream', kind: 'banner', name: 'BallPark (default)', price: 0 }

export default function Shop({ nav }: { nav: Nav }) {
  const { profile, buy, updateProfile } = useStore()
  const [tab, setTab] = useState<Tab>('freeze')
  const [toast, setToast] = useState('')

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(''), 2200)
    return () => clearTimeout(t)
  }, [toast])

  const items = [...(tab === 'border' ? [DEFAULT_BORDER] : tab === 'banner' ? [DEFAULT_BANNER] : []), ...SHOP.filter((i) => (tab === 'insect' ? i.kind === 'animal' && i.insect : tab === 'animal' ? i.kind === 'animal' && !i.insect : i.kind === tab))]
  const shown = liveStreak(profile.streak, profile.lastDay, profile.freezeDays)

  function purchase(item: ShopItem) {
    if (buy(item.id)) {
      playSfx('done')
      setToast(item.kind === 'freeze' ? `${item.name} added` : `${item.name} unlocked`)
    }
  }

  function equip(item: ShopItem) {
    const key = item.id.split('-').slice(1).join('-')
    if (item.kind === 'animal') updateProfile({ avatar: key })
    if (item.kind === 'border') updateProfile({ border: key })
    if (item.kind === 'banner') updateProfile({ banner: key })
    setToast(`${item.name} equipped`)
  }

  const isOwned = (i: ShopItem) => i.price === 0 || profile.owned.includes(i.id)
  const isOn = (i: ShopItem) => {
    const key = i.id.split('-').slice(1).join('-')
    return (i.kind === 'animal' && profile.avatar === key) || (i.kind === 'border' && profile.border === key) || (i.kind === 'banner' && profile.banner === key)
  }

  function preview(i: ShopItem) {
    const key = i.id.split('-').slice(1).join('-')
    if (i.kind === 'animal') return <Avatar id={key} size={72} />
    if (i.kind === 'border') return <ProfilePic id={profile.avatar} border={key} size={64} />
    if (i.kind === 'banner') return <div className="bannerPrev"><BannerArt id={key} /></div>
    return <Snowflake size={44} color="#4fb3f0" />
  }

  return (
    <div className="screen noNav" style={{ position: 'relative' }}>
      <button className="back" onClick={nav.close}><ChevronLeft size={16} />Back</button>
      <div className="top" style={{ marginBottom: 12 }}>
        <div><p className="hi">Spend your gems</p><h1 className="title">Shop</h1></div>
        <Diamonds n={profile.diamonds} />
      </div>

      <div className="card" style={{ marginBottom: 14, display: 'flex', alignItems: 'center', gap: 12 }}>
        <ProfilePic id={profile.avatar} border={profile.border} size={48} />
        <div style={{ flex: 1 }}>
          <b>{profile.name}</b>
          <p style={{ color: 'var(--muted)', fontSize: 13, display: 'flex', alignItems: 'center', gap: 4 }}><Flame days={shown} size={16} />{shown}-day streak</p>
        </div>
        <span className="freezeBank"><Snowflake size={14} />{profile.freezeDays} day{profile.freezeDays === 1 ? '' : 's'} frozen</span>
      </div>

      <div className="shopTabs">
        {TABS.map((t) => (
          <button key={t.id} className={`filter ${tab === t.id ? 'on' : ''}`} onClick={() => setTab(t.id)}>{t.label}</button>
        ))}
      </div>

      {tab === 'freeze' && <p style={{ color: 'var(--muted)', fontSize: 13.5, lineHeight: 1.45, marginBottom: 12 }}>A freeze covers days you miss so your streak keeps going. It is used automatically the next time you solve a daily. Freezes stack.</p>}

      <div className="shopGrid">
        {items.map((i) => {
          const owned = isOwned(i) && i.kind !== 'freeze'
          const need = i.price - profile.diamonds
          return (
            <div className="shopCard" key={i.id}>
              <div className="prevBox">{preview(i)}</div>
              <b>{i.name}</b>
              <small>{i.blurb ?? ''}</small>
              {owned ? (
                <button className="btn light small" style={{ border: '1.5px solid var(--line)' }} disabled={isOn(i)} onClick={() => equip(i)}>{isOn(i) ? 'In use' : i.kind === 'animal' ? 'Use' : 'Equip'}</button>
              ) : (
                <button className="btn gem small" disabled={need > 0} onClick={() => purchase(i)} data-sfx="none">
                  <Gem size={15} />{need > 0 ? `${i.price} (need ${need})` : i.price}
                </button>
              )}
            </div>
          )
        })}
      </div>
      {toast && <div className="toast" role="status">{toast}</div>}
    </div>
  )
}
