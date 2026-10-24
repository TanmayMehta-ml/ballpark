import { useState } from 'react'
import { useBackHandler } from '../lib/back'
import { exitApp, isNative } from '../lib/notify'

/** "Do you want to quit?" shown when Back is pressed on the home screen. */
export function QuitDialog({ onClose }: { onClose: () => void }) {
  const [note, setNote] = useState('')
  useBackHandler(true, onClose)

  async function quit() {
    await exitApp()
    // Browsers do not let a page close itself, so say so instead of doing nothing
    if (!isNative()) setNote('Browsers do not let a page close itself. You can close this tab.')
  }

  return (
    <div className="dialogWrap" onClick={onClose}>
      <div className="dialog" role="alertdialog" aria-labelledby="quit-title" onClick={(e) => e.stopPropagation()}>
        <h2 id="quit-title">Quit BallPark?</h2>
        <p>{note || 'Your progress is saved. Do you want to quit?'}</p>
        <div className="dialogBtns">
          <button className="btn ghost" onClick={onClose} data-sfx="click">No</button>
          <button className="btn" onClick={quit} data-sfx="none">Yes</button>
        </div>
      </div>
    </div>
  )
}
