import { useMemo } from 'react'
import { useGame } from '../store/gameStore'

let ctx: AudioContext | null = null

function audio(): AudioContext | null {
  if (typeof window === 'undefined') return null
  try {
    if (!ctx) {
      const Ctor =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext
      ctx = new Ctor()
    }
    if (ctx.state === 'suspended') void ctx.resume()
    return ctx
  } catch {
    return null
  }
}

function tone(
  freq: number,
  dur: number,
  type: OscillatorType = 'square',
  gain = 0.05,
  delay = 0,
) {
  const ac = audio()
  if (!ac) return
  const t0 = ac.currentTime + delay
  const osc = ac.createOscillator()
  const g = ac.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, t0)
  g.gain.setValueAtTime(0, t0)
  g.gain.linearRampToValueAtTime(gain, t0 + 0.01)
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur)
  osc.connect(g).connect(ac.destination)
  osc.start(t0)
  osc.stop(t0 + dur + 0.02)
}

export const Sfx = {
  click: () => tone(420, 0.06, 'square', 0.04),
  select: () => tone(620, 0.07, 'square', 0.045),
  correct: () => {
    tone(660, 0.09, 'square', 0.05)
    tone(880, 0.12, 'square', 0.05, 0.09)
  },
  wrong: () => {
    tone(200, 0.16, 'sawtooth', 0.05)
    tone(150, 0.18, 'sawtooth', 0.05, 0.08)
  },
  hint: () => tone(520, 0.09, 'triangle', 0.05),
  win: () => {
    const notes = [523, 659, 784, 1047]
    notes.forEach((n, i) => tone(n, 0.14, 'square', 0.05, i * 0.11))
  },
}

export type SfxApi = { [K in keyof typeof Sfx]: () => void }

export function useSfx(): SfxApi {
  const enabled = useGame((s) => s.settings.sound)
  return useMemo(() => {
    const wrap = (fn: () => void) => () => {
      if (!enabled) return
      try {
        fn()
      } catch {
        /* ignore audio errors */
      }
    }
    return {
      click: wrap(Sfx.click),
      select: wrap(Sfx.select),
      correct: wrap(Sfx.correct),
      wrong: wrap(Sfx.wrong),
      hint: wrap(Sfx.hint),
      win: wrap(Sfx.win),
    }
  }, [enabled])
}
