/**
 * All sound is synthesised with the Web Audio API, so there are no audio files to license or download.
 * Music: a slow, generative ambient loop (soft pad chords, a few sparse bell notes, a gentle echo).
 * Effects: short, soft blips for clicks, hints, submitting and results.
 */

export type Sfx = 'click' | 'hint' | 'pick' | 'submit' | 'win' | 'near' | 'miss' | 'done'

let ctx: AudioContext | null = null
let master: GainNode
let musicBus: GainNode
let sfxBus: GainNode
let musicOn = false
let sfxOn = true
let timer: ReturnType<typeof setInterval> | null = null
let nextChordAt = 0
let chordIndex = 0
let nextNoteAt = 0

const hz = (midi: number) => 440 * Math.pow(2, (midi - 69) / 12)
// Cmaj7 -> Am7 -> Fmaj7 -> G6, low and warm
const CHORDS = [
  [48, 52, 55, 59],
  [45, 48, 52, 55],
  [41, 45, 48, 52],
  [43, 47, 50, 52],
]
const BELLS = [72, 74, 76, 79, 81, 84] // C major pentatonic
const CHORD_LEN = 9

function ensure(): AudioContext | null {
  if (ctx) return ctx
  const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  if (!AC) return null
  ctx = new AC()
  master = ctx.createGain()
  master.gain.value = 0.9
  master.connect(ctx.destination)

  musicBus = ctx.createGain()
  musicBus.gain.value = 0
  // soft echo for space
  const delay = ctx.createDelay(1.5)
  delay.delayTime.value = 0.42
  const fb = ctx.createGain()
  fb.gain.value = 0.42
  const damp = ctx.createBiquadFilter()
  damp.type = 'lowpass'
  damp.frequency.value = 1800
  const wet = ctx.createGain()
  wet.gain.value = 0.38
  musicBus.connect(master)
  musicBus.connect(delay)
  delay.connect(damp)
  damp.connect(fb)
  fb.connect(delay)
  damp.connect(wet)
  wet.connect(master)

  sfxBus = ctx.createGain()
  sfxBus.gain.value = 0.7
  sfxBus.connect(master)
  return ctx
}

function pad(c: AudioContext, midi: number, at: number, len: number) {
  const g = c.createGain()
  const lp = c.createBiquadFilter()
  lp.type = 'lowpass'
  lp.frequency.value = 900
  g.gain.setValueAtTime(0, at)
  g.gain.linearRampToValueAtTime(0.1, at + 3)
  g.gain.setValueAtTime(0.1, at + len - 2.5)
  g.gain.linearRampToValueAtTime(0, at + len + 1.5)
  g.connect(lp)
  lp.connect(musicBus)
  for (const detune of [-6, 6]) {
    const o = c.createOscillator()
    o.type = 'triangle'
    o.frequency.value = hz(midi)
    o.detune.value = detune
    o.connect(g)
    o.start(at)
    o.stop(at + len + 1.6)
  }
}

function bell(c: AudioContext, midi: number, at: number) {
  const g = c.createGain()
  g.gain.setValueAtTime(0, at)
  g.gain.linearRampToValueAtTime(0.07, at + 0.02)
  g.gain.exponentialRampToValueAtTime(0.0001, at + 3.2)
  g.connect(musicBus)
  const o = c.createOscillator()
  o.type = 'sine'
  o.frequency.value = hz(midi)
  o.connect(g)
  o.start(at)
  o.stop(at + 3.3)
  const o2 = c.createOscillator() // soft overtone
  const g2 = c.createGain()
  g2.gain.value = 0.25
  o2.type = 'sine'
  o2.frequency.value = hz(midi) * 2
  o2.connect(g2)
  g2.connect(g)
  o2.start(at)
  o2.stop(at + 3.3)
}

function tick() {
  if (!ctx || !musicOn) return
  const lookahead = ctx.currentTime + 6
  while (nextChordAt < lookahead) {
    const chord = CHORDS[chordIndex % CHORDS.length]
    for (const n of chord) pad(ctx, n, nextChordAt, CHORD_LEN)
    chordIndex++
    nextChordAt += CHORD_LEN
  }
  while (nextNoteAt < lookahead) {
    bell(ctx, BELLS[Math.floor(Math.random() * BELLS.length)], nextNoteAt)
    nextNoteAt += 2.2 + Math.random() * 3.5
  }
}

function startMusic() {
  const c = ensure()
  if (!c || timer) return
  void c.resume()
  nextChordAt = c.currentTime + 0.2
  nextNoteAt = c.currentTime + 2
  tick()
  timer = setInterval(tick, 1000)
}

function stopMusic() {
  if (timer) clearInterval(timer)
  timer = null
}

let cfg = { music: true, musicVolume: 0.5, sfx: true, sfxVolume: 0.7 }

function apply() {
  if (!ctx) return
  const t = ctx.currentTime
  musicBus.gain.cancelScheduledValues(t)
  musicBus.gain.setTargetAtTime(cfg.music ? cfg.musicVolume * 0.9 : 0, t, 0.4)
  sfxBus.gain.setTargetAtTime(cfg.sfxVolume, t, 0.05)
  if (cfg.music) startMusic()
  else stopMusic()
}

/** Call from any user gesture (browsers block audio until then). */
export function unlockAudio() {
  const c = ensure()
  if (!c) return
  if (c.state === 'suspended') void c.resume()
  apply()
}

export function configureAudio(opts: typeof cfg) {
  cfg = opts
  sfxOn = opts.sfx
  musicOn = opts.music
  apply()
}

export function suspendAudio(hidden: boolean) {
  if (!ctx) return
  if (hidden) void ctx.suspend()
  else if (ctx.state === 'suspended') void ctx.resume()
}

function blip(freq: number, at: number, len: number, type: OscillatorType = 'sine', vol = 0.25, slideTo?: number) {
  if (!ctx) return
  const o = ctx.createOscillator()
  const g = ctx.createGain()
  o.type = type
  o.frequency.setValueAtTime(freq, at)
  if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, at + len)
  g.gain.setValueAtTime(0, at)
  g.gain.linearRampToValueAtTime(vol, at + 0.008)
  g.gain.exponentialRampToValueAtTime(0.0001, at + len)
  o.connect(g)
  g.connect(sfxBus)
  o.start(at)
  o.stop(at + len + 0.02)
}

export function playSfx(name: Sfx) {
  if (!sfxOn) return
  const c = ensure()
  if (!c) return
  if (c.state === 'suspended') void c.resume()
  const t = c.currentTime
  switch (name) {
    case 'click':
      blip(880, t, 0.07, 'triangle', 0.18, 620)
      break
    case 'pick':
      blip(520, t, 0.09, 'sine', 0.2)
      break
    case 'hint':
      blip(660, t, 0.14, 'sine', 0.22)
      blip(990, t + 0.09, 0.22, 'sine', 0.2)
      break
    case 'submit':
      blip(200, t, 0.16, 'sine', 0.3, 120)
      blip(784, t + 0.08, 0.3, 'triangle', 0.16)
      break
    case 'win':
      ;[72, 76, 79, 84].forEach((m, i) => blip(hz(m), t + i * 0.1, 0.55, 'sine', 0.22))
      break
    case 'near':
      blip(hz(72), t, 0.35, 'sine', 0.22)
      blip(hz(76), t + 0.14, 0.45, 'sine', 0.2)
      break
    case 'miss':
      blip(330, t, 0.4, 'triangle', 0.2, 260)
      break
    case 'done':
      ;[67, 72, 76].forEach((m, i) => blip(hz(m), t + i * 0.08, 0.45, 'triangle', 0.18))
      break
  }
}
