import { useState } from 'react'
import { ChevronLeft, Trophy } from 'lucide-react'
import type { Gender } from '../types'
import { WelcomeArt } from '../components/Doodles'
import { AvatarPicker } from '../components/Avatar'
import { useStore } from '../lib/store'

export const GENDERS: { id: Gender; label: string }[] = [
  { id: 'male', label: 'Male' },
  { id: 'female', label: 'Female' },
  { id: 'other', label: 'Other' },
  { id: 'private', label: 'Prefer not to say' },
]

/** Shown only on first launch: intro, then name, age and gender. */
export default function Welcome() {
  const { finishOnboarding } = useStore()
  const [step, setStep] = useState<'intro' | 'about'>('intro')
  const [name, setName] = useState('')
  const [age, setAge] = useState('')
  const [gender, setGender] = useState<Gender | ''>('')
  const [avatar, setAvatar] = useState('fox')

  if (step === 'intro') {
    return (
      <div className="welcome">
        <div className="logo">
          <h1>BallPark</h1>
          <Trophy size={44} color="#f2b84b" fill="#f2b84b" />
        </div>
        <p className="sub">Think. Estimate. Win.</p>
        <div className="art"><WelcomeArt /></div>
        <h2>Get in the right ballpark</h2>
        <p className="copy">One guesstimate a day, the way consulting interviews ask them. Pick your research, build your number, and see how close you land.</p>
        <button className="btn block" onClick={() => setStep('about')}>Get Started</button>
      </div>
    )
  }

  const ageNum = parseInt(age, 10)
  const ageOk = ageNum >= 10 && ageNum <= 99
  const ok = name.trim().length > 0 && ageOk && gender !== ''

  return (
    <div className="welcome">
      <button className="back" onClick={() => setStep('intro')}><ChevronLeft size={16} />Back</button>
      <h1 className="qTitle" style={{ marginTop: 0 }}>Tell us about you</h1>
      <p className="copy" style={{ textAlign: 'left', margin: '8px 0 16px' }}>Stays on this device. It just personalises your profile.</p>

      <label className="fieldLabel" htmlFor="nm">Name</label>
      <input id="nm" className="nameInput" placeholder="What should we call you?" value={name} maxLength={20} onChange={(e) => setName(e.target.value)} />

      <label className="fieldLabel" htmlFor="ag">Age</label>
      <input id="ag" className="nameInput" inputMode="numeric" placeholder="Your age" value={age} maxLength={2} onChange={(e) => setAge(e.target.value.replace(/\D/g, ''))} />

      <span className="fieldLabel">Gender</span>
      <div className="chipRow">
        {GENDERS.map((g) => (
          <button key={g.id} className={`mult ${gender === g.id ? 'on' : ''}`} onClick={() => setGender(g.id)}>{g.label}</button>
        ))}
      </div>

      <span className="fieldLabel" style={{ marginTop: 16 }}>Pick your animal</span>
      <AvatarPicker value={avatar} onChange={setAvatar} />

      <button className="btn block" style={{ marginTop: 18 }} disabled={!ok} onClick={() => finishOnboarding({ name, age: ageNum, gender, avatar })}>Start playing</button>
      {!ageOk && age !== '' && <p className="empty" style={{ padding: '8px 0' }}>Enter an age between 10 and 99.</p>}
    </div>
  )
}
