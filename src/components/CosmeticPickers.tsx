import { BannerArt } from './BannerArt'
import { ProfilePic } from './Avatar'
import { SHOP } from '../lib/shop'

/** Borders the player can wear: the free "none" plus anything bought. */
export function BorderPicker({ value, avatar, owned, onChange }: { value: string; avatar: string; owned: string[]; onChange: (id: string) => void }) {
  const options = [
    { id: 'none', name: 'None' },
    ...SHOP.filter((i) => i.kind === 'border' && owned.includes(i.id)).map((i) => ({ id: i.id.replace('border-', ''), name: i.name })),
  ]
  return (
    <div className="pickRow" role="radiogroup" aria-label="Choose your border">
      {options.map((o) => (
        <button key={o.id} role="radio" aria-checked={value === o.id} className={`pickOpt ${value === o.id ? 'on' : ''}`} onClick={() => onChange(o.id)}>
          <span className="pickPrev"><ProfilePic id={avatar} border={o.id} size={44} /></span>
          <span>{o.name}</span>
        </button>
      ))}
    </div>
  )
}

/** Banners the player can use: the free default plus anything bought. */
export function BannerPicker({ value, owned, onChange }: { value: string; owned: string[]; onChange: (id: string) => void }) {
  const options = [
    { id: 'cream', name: 'BallPark' },
    ...SHOP.filter((i) => i.kind === 'banner' && owned.includes(i.id)).map((i) => ({ id: i.id.replace('banner-', ''), name: i.name })),
  ]
  return (
    <div className="pickRow" role="radiogroup" aria-label="Choose your banner">
      {options.map((o) => (
        <button key={o.id} role="radio" aria-checked={value === o.id} className={`pickOpt wide ${value === o.id ? 'on' : ''}`} onClick={() => onChange(o.id)}>
          <span className="pickBanner"><BannerArt id={o.id} /></span>
          <span>{o.name}</span>
        </button>
      ))}
    </div>
  )
}
