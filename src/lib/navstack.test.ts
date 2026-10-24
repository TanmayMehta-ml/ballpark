import { describe, expect, it } from 'vitest'
import { ROOT, canGoBack, goTab, openOverlay, popStack, top } from './navstack'

describe('back navigation stack', () => {
  it('starts at home with nowhere to go back to', () => {
    expect(top(ROOT)).toEqual({ tab: 'home', overlay: null })
    expect(canGoBack(ROOT)).toBe(false)
  })

  it('goes back through pages and tabs in order, then stays at home', () => {
    let s = goTab(ROOT, 'past')
    s = goTab(s, 'learn')
    s = openOverlay(s, { kind: 'module', id: 'm01-basics' })
    expect(top(s)).toEqual({ tab: 'learn', overlay: { kind: 'module', id: 'm01-basics' } })

    s = popStack(s)
    expect(top(s)).toEqual({ tab: 'learn', overlay: null })
    s = popStack(s)
    expect(top(s).tab).toBe('past')
    s = popStack(s)
    expect(top(s)).toEqual({ tab: 'home', overlay: null })
    expect(canGoBack(s)).toBe(false)

    // pressing Back again does not leave home
    expect(popStack(s)).toBe(s)
  })

  it('returns to the screen you came from after a page opened from a page', () => {
    let s = openOverlay(ROOT, { kind: 'play', qid: 'a', daily: true, review: false })
    s = openOverlay(s, { kind: 'module', id: 'm03-topdown' })
    s = popStack(s)
    expect(top(s).overlay).toEqual({ kind: 'play', qid: 'a', daily: true, review: false })
    s = popStack(s)
    expect(top(s)).toEqual({ tab: 'home', overlay: null })
  })

  it('tapping Home resets the history, tapping the current tab does nothing', () => {
    let s = goTab(ROOT, 'learn')
    s = openOverlay(s, { kind: 'cheat' })
    expect(goTab(s, 'home')).toBe(ROOT)
    s = popStack(s)
    expect(goTab(s, 'learn')).toBe(s)
    expect(goTab(ROOT, 'home')).toBe(ROOT)
  })

  it('opening a tab from inside a page lands on the tab and Back returns to the page', () => {
    let s = openOverlay(ROOT, { kind: 'shop' })
    s = goTab(s, 'profile')
    expect(top(s)).toEqual({ tab: 'profile', overlay: null })
    s = popStack(s)
    expect(top(s).overlay).toEqual({ kind: 'shop' })
  })

  it('caps the history but keeps the home root', () => {
    let s = ROOT
    for (let i = 0; i < 80; i++) s = openOverlay(s, { kind: i % 2 ? 'shop' : 'settings' })
    expect(s.length).toBeLessThanOrEqual(30)
    expect(s[0]).toEqual({ tab: 'home', overlay: null })
    while (canGoBack(s)) s = popStack(s)
    expect(top(s)).toEqual({ tab: 'home', overlay: null })
  })
})
