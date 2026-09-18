export type LevelId =
  | 'password'
  | 'phishing'
  | 'cipher'
  | 'twofactor'
  | 'permissions'
  | 'injection'

export type AssistantMood = 'idle' | 'happy' | 'think' | 'alert' | 'sad'

export type AccentColor =
  | 'neon'
  | 'cyan'
  | 'pink'
  | 'gold'
  | 'violet'
  | 'danger'

export interface LevelMeta {
  id: LevelId
  /** Display order, 1-based. */
  index: number
  title: string
  subtitle: string
  /** Short category label shown on the map node. */
  tag: string
  accent: AccentColor
  /** Estimated minutes for pacing (~20 min total). */
  estMinutes: number
  /** 位元君 opening lines that teach the concept. */
  intro: string[]
  /** Progressive hints, revealed one-by-one in hint mode. */
  hints: string[]
  /** Bullet takeaways shown after clearing the level. */
  learn: string[]
  /** A concrete real-world action a student can take. */
  realWorld: string
}

export interface LevelProgress {
  completed: boolean
  /** 1-3 stars based on hints used. */
  stars: number
  hintsUsed: number
}

export type Phase = 'title' | 'map' | 'level' | 'summary'
