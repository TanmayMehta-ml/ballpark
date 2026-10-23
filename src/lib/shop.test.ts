import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { ANIMALS } from '../components/Avatar'
import { BANNER_IDS } from '../components/BannerArt'
import { SHOP } from './shop'

const css = readFileSync(join(__dirname, '..', 'styles.css'), 'utf8')

describe('shop catalogue', () => {
  it('has unique item ids', () => {
    expect(new Set(SHOP.map((i) => i.id)).size).toBe(SHOP.length)
  })

  it('every animal item has matching avatar art, and insects are flagged on both sides', () => {
    for (const item of SHOP.filter((i) => i.kind === 'animal')) {
      const a = ANIMALS.find((x) => x.shop === item.id)
      expect(a, item.id).toBeTruthy()
      expect(!!a?.insect, item.id).toBe(!!item.insect)
    }
    for (const a of ANIMALS.filter((x) => x.shop)) expect(SHOP.some((i) => i.id === a.shop), a.id).toBe(true)
  })

  it('every banner item has an illustrated scene', () => {
    for (const item of SHOP.filter((i) => i.kind === 'banner')) expect(BANNER_IDS, item.id).toContain(item.id.replace('banner-', ''))
    expect(BANNER_IDS).toContain('cream') // the free default
  })

  it('every border item has a style', () => {
    for (const item of SHOP.filter((i) => i.kind === 'border')) expect(css, item.id).toContain(`.frame-${item.id.replace('border-', '')}`)
  })

  it('has the themed banners and plenty of choice', () => {
    for (const k of ['desert', 'forest', 'snow']) expect(BANNER_IDS).toContain(k)
    expect(SHOP.filter((i) => i.kind === 'border').length).toBeGreaterThanOrEqual(12)
    expect(SHOP.filter((i) => i.kind === 'animal' && i.insect).length).toBeGreaterThanOrEqual(5)
  })
})
