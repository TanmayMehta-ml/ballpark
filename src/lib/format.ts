export const MULTIPLIERS = [
  { key: '1', label: 'Ones', factor: 1 },
  { key: 'k', label: 'Thousand', factor: 1e3 },
  { key: 'l', label: 'Lakh', factor: 1e5 },
  { key: 'c', label: 'Crore', factor: 1e7 },
  { key: 'lc', label: 'Lakh crore', factor: 1e12 },
] as const

/** Indian-style short form: 2.5 lakh, 1.2 crore, 3.4 lakh crore. Whole numbers keep their zeros. */
export function formatIndian(n: number): string {
  if (!isFinite(n)) return '-'
  const abs = Math.abs(n)
  const trim = (x: number) => {
    const a = Math.abs(x)
    // 3 significant figures at most; only strip zeros after a decimal point
    const fixed = a >= 100 ? Math.round(x).toString() : a >= 10 ? x.toFixed(1) : x.toFixed(2)
    const clean = fixed.includes('.') ? fixed.replace(/0+$/, '').replace(/\.$/, '') : fixed
    const num = Number(clean)
    return num >= 1000 ? num.toLocaleString('en-IN') : clean
  }
  if (abs >= 1e12) return `${trim(n / 1e12)} lakh crore`
  if (abs >= 1e7) return `${trim(n / 1e7)} crore`
  if (abs >= 1e5) return `${trim(n / 1e5)} lakh`
  if (abs >= 1e3) return `${trim(n / 1e3)} thousand`
  return trim(n) || '0'
}

export function withUnit(n: number, unit: string): string {
  const v = formatIndian(n)
  return unit === '₹' ? `₹${v}` : `${v} ${unit}`
}

/** Pick the multiplier that makes `n` read naturally. */
export function bestMultiplier(n: number) {
  for (let i = MULTIPLIERS.length - 1; i >= 0; i--) if (n >= MULTIPLIERS[i].factor) return MULTIPLIERS[i]
  return MULTIPLIERS[0]
}
