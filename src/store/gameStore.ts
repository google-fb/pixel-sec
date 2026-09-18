import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { LEVEL_ORDER, LEVELS } from '../data/levels'
import type { AssistantMood, LevelId, LevelProgress, Phase } from '../types'

interface Settings {
  hintMode: boolean
  sound: boolean
  scanlines: boolean
}

interface AssistantState {
  text: string
  mood: AssistantMood
  key: number
}

function starsForHints(hintsUsed: number): number {
  if (hintsUsed <= 0) return 3
  if (hintsUsed <= 2) return 2
  return 1
}

function emptyProgress(): Record<LevelId, LevelProgress> {
  return LEVEL_ORDER.reduce(
    (acc, id) => {
      acc[id] = { completed: false, stars: 0, hintsUsed: 0 }
      return acc
    },
    {} as Record<LevelId, LevelProgress>,
  )
}

interface GameState {
  phase: Phase
  currentLevelId: LevelId | null
  settings: Settings
  progress: Record<LevelId, LevelProgress>
  assistant: AssistantState
  startGame: () => void
  goToMap: () => void
  openLevel: (id: LevelId) => void
  completeLevel: (id: LevelId, hintsUsed: number) => void
  finishGame: () => void
  backToTitle: () => void
  resetProgress: () => void
  setHintMode: (v: boolean) => void
  setSound: (v: boolean) => void
  setScanlines: (v: boolean) => void
  say: (text: string, mood?: AssistantMood) => void
  isUnlocked: (id: LevelId) => boolean
  nextLevelId: (id: LevelId) => LevelId | null
  clearedCount: () => number
  totalStars: () => number
}

export const useGame = create<GameState>()(
  persist(
    (set, get) => ({
      phase: 'title',
      currentLevelId: null,
      settings: { hintMode: true, sound: true, scanlines: true },
      progress: emptyProgress(),
      assistant: { text: '', mood: 'idle', key: 0 },
      startGame: () => set({ phase: 'map' }),
      goToMap: () => set({ phase: 'map', currentLevelId: null }),
      openLevel: (id) => set({ phase: 'level', currentLevelId: id }),
      completeLevel: (id, hintsUsed) =>
        set((state) => {
          const stars = starsForHints(hintsUsed)
          const prev = state.progress[id]
          const next: LevelProgress = {
            completed: true,
            stars: Math.max(prev?.stars ?? 0, stars),
            hintsUsed:
              prev?.completed && prev.hintsUsed < hintsUsed
                ? prev.hintsUsed
                : hintsUsed,
          }
          return { progress: { ...state.progress, [id]: next } }
        }),
      finishGame: () => set({ phase: 'summary', currentLevelId: null }),
      backToTitle: () => set({ phase: 'title', currentLevelId: null }),
      resetProgress: () =>
        set({
          progress: emptyProgress(),
          phase: 'title',
          currentLevelId: null,
        }),
      setHintMode: (v) =>
        set((s) => ({ settings: { ...s.settings, hintMode: v } })),
      setSound: (v) => set((s) => ({ settings: { ...s.settings, sound: v } })),
      setScanlines: (v) =>
        set((s) => ({ settings: { ...s.settings, scanlines: v } })),
      say: (text, mood = 'idle') =>
        set((s) => ({ assistant: { text, mood, key: s.assistant.key + 1 } })),
      isUnlocked: (id) => {
        const idx = LEVEL_ORDER.indexOf(id)
        if (idx <= 0) return true
        const prevId = LEVEL_ORDER[idx - 1]
        return get().progress[prevId]?.completed ?? false
      },
      nextLevelId: (id) => {
        const idx = LEVEL_ORDER.indexOf(id)
        if (idx < 0 || idx >= LEVEL_ORDER.length - 1) return null
        return LEVEL_ORDER[idx + 1]
      },
      clearedCount: () =>
        LEVEL_ORDER.filter((id) => get().progress[id]?.completed).length,
      totalStars: () =>
        LEVEL_ORDER.reduce((sum, id) => sum + (get().progress[id]?.stars ?? 0), 0),
    }),
    {
      name: 'pixel-cyber-agent-v1',
      partialize: (state) => ({
        settings: state.settings,
        progress: state.progress,
      }),
    },
  ),
)

export { LEVELS, LEVEL_ORDER }
