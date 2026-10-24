import { useEffect, useRef } from 'react'

/** Open sheets and dialogs register here so Back closes them before it leaves a screen. */
const handlers: Array<() => void> = []

export function pushBackHandler(fn: () => void): () => void {
  handlers.push(fn)
  return () => {
    const i = handlers.lastIndexOf(fn)
    if (i >= 0) handlers.splice(i, 1)
  }
}

/** Runs the most recent open sheet's close. Returns true if one handled the press. */
export function runModalBack(): boolean {
  const h = handlers[handlers.length - 1]
  if (!h) return false
  h()
  return true
}

/** While `active`, the device Back button calls `close` instead of leaving the screen. */
export function useBackHandler(active: boolean, close: () => void) {
  const ref = useRef(close)
  ref.current = close
  useEffect(() => {
    if (!active) return
    return pushBackHandler(() => ref.current())
  }, [active])
}
