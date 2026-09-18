import { createContext, useContext } from 'react'
import type { AssistantMood, LevelMeta } from '../types'
import type { SfxApi } from '../lib/sfx'

export interface LevelApi {
  meta: LevelMeta
  solved: boolean
  solve: () => void
  say: (text: string, mood?: AssistantMood) => void
  react: (kind: 'correct' | 'wrong', text: string) => void
  hintMode: boolean
  requestHint: () => void
  revealedHints: string[]
  hintsUsed: number
  allHintsShown: boolean
  sfx: SfxApi
}

export const LevelContext = createContext<LevelApi | null>(null)

export function useLevel(): LevelApi {
  const ctx = useContext(LevelContext)
  if (!ctx) throw new Error('useLevel must be used inside LevelScreen')
  return ctx
}
