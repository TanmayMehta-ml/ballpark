import { useState } from 'react'
import { Trophy } from 'lucide-react'
import { WelcomeArt } from '../components/Doodles'
import { useStore } from '../lib/store'

export default function Welcome() {
  const { finishOnboarding } = useStore()
  const [name, setName] = useState('')
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
      <input className="nameInput" placeholder="What should we call you?" value={name} maxLength={20} onChange={(e) => setName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && finishOnboarding(name)} />
      <button className="btn block" onClick={() => finishOnboarding(name)}>Get Started</button>
    </div>
  )
}
