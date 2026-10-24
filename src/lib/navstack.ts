import type { Overlay, Tab } from '../App'

/** One screen in the back history: a tab, optionally with a full-screen page on top of it. */
export interface Entry {
  tab: Tab
  overlay: Overlay
}

export const ROOT: Entry[] = [{ tab: 'home', overlay: null }]
const MAX = 30

export const top = (stack: Entry[]): Entry => stack[stack.length - 1]

/** Keep the home root and the most recent screens. */
function cap(stack: Entry[]): Entry[] {
  return stack.length <= MAX ? stack : [stack[0], ...stack.slice(stack.length - (MAX - 1))]
}

/** Open a full-screen page on top of whatever is showing. */
export function openOverlay(stack: Entry[], o: Overlay): Entry[] {
  if (!o) return stack
  return cap([...stack, { tab: top(stack).tab, overlay: o }])
}

/** Switch tab. Home resets the history; other tabs are pushed so Back returns to where you were. */
export function goTab(stack: Entry[], tab: Tab): Entry[] {
  const cur = top(stack)
  if (tab === 'home') return stack.length === 1 && !cur.overlay && cur.tab === 'home' ? stack : ROOT
  if (cur.tab === tab && !cur.overlay) return stack
  return cap([...stack, { tab, overlay: null }])
}

/** One step back. The stack never gets emptier than the home root. */
export function popStack(stack: Entry[]): Entry[] {
  return stack.length > 1 ? stack.slice(0, -1) : stack
}

/** True when Back has somewhere to go; false at the home root, where Back asks to quit. */
export const canGoBack = (stack: Entry[]): boolean => stack.length > 1
