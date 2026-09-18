import type { AccentColor } from '../types'

export const accentText: Record<AccentColor, string> = {
  neon: 'text-neon',
  cyan: 'text-cyan',
  pink: 'text-pink',
  gold: 'text-gold',
  violet: 'text-violet',
  danger: 'text-danger',
}

export const accentBg: Record<AccentColor, string> = {
  neon: 'bg-neon',
  cyan: 'bg-cyan',
  pink: 'bg-pink',
  gold: 'bg-gold',
  violet: 'bg-violet',
  danger: 'bg-danger',
}

export const accentBorder: Record<AccentColor, string> = {
  neon: 'border-neon',
  cyan: 'border-cyan',
  pink: 'border-pink',
  gold: 'border-gold',
  violet: 'border-violet',
  danger: 'border-danger',
}

export const accentHex: Record<AccentColor, string> = {
  neon: '#52ffb8',
  cyan: '#4dd0ff',
  pink: '#ff5c9e',
  gold: '#ffd34d',
  violet: '#b18bff',
  danger: '#ff5566',
}
