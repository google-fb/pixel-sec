import type { AccentColor } from '../types'

const COMMON = new Set([
  'password', 'passw0rd', 'p@ssw0rd', '123456', '12345678', '123456789',
  '1234567890', 'qwerty', 'qwertyuiop', 'abc123', '111111', '000000',
  'iloveyou', 'admin', 'welcome', 'monkey', 'dragon', 'letmein', 'football',
  'princess', '123123', '666666', '888888', 'love', 'password1', 'meowmeow',
  'qazwsx', 'asdfgh', 'asdfghjkl', 'zxcvbn', '7777777', '1q2w3e4r', '1qaz2wsx',
])

const COMMON_TOKENS = [
  'password', '123456', 'qwerty', 'iloveyou', 'admin', 'meowmeow', 'welcome',
]

function isCommon(pw: string): boolean {
  const p = pw.toLowerCase()
  if (COMMON.has(p)) return true
  return COMMON_TOKENS.some((t) => p.includes(t))
}

function hasSequence(pw: string): boolean {
  const p = pw.toLowerCase()
  const rows = [
    'abcdefghijklmnopqrstuvwxyz',
    '0123456789',
    'qwertyuiop',
    'asdfghjkl',
    'zxcvbnm',
  ]
  for (const s of rows) {
    for (let i = 0; i + 4 <= s.length; i++) {
      const sub = s.slice(i, i + 4)
      const rev = sub.split('').reverse().join('')
      if (p.includes(sub) || p.includes(rev)) return true
    }
  }
  return /(.)\1{3,}/.test(pw)
}

export interface PasswordChecks {
  len12: boolean
  lower: boolean
  upper: boolean
  digit: boolean
  symbol: boolean
  notCommon: boolean
  notSequential: boolean
}

export interface PasswordEval {
  entropyBits: number
  crackText: string
  label: string
  labelColor: AccentColor
  strength: number
  classes: number
  checks: PasswordChecks
  strong: boolean
}

function humanize(seconds: number): string {
  const units: Array<[string, number]> = [
    ['世紀', 3155760000],
    ['年', 31557600],
    ['天', 86400],
    ['小時', 3600],
    ['分鐘', 60],
    ['秒', 1],
  ]
  for (const [name, secs] of units) {
    if (seconds >= secs) {
      const v = Math.floor(seconds / secs)
      return `約 ${v.toLocaleString('en-US')} ${name}`
    }
  }
  return '瞬間'
}

function crackTime(entropy: number): string {
  if (entropy <= 0) return '瞬間'
  // Offline attacker ~ 1e10 guesses/sec, expected half the keyspace.
  const log10Seconds = entropy * Math.log10(2) - Math.log10(2) - 10
  if (log10Seconds < 0) return '瞬間（不到 1 秒就破解）'
  const log10Years = log10Seconds - Math.log10(31557600)
  if (log10Years > 6) return '數百萬年以上（幾乎無法暴力破解）'
  return humanize(Math.pow(10, log10Seconds))
}

export function evaluatePassword(pw: string): PasswordEval {
  const checks: PasswordChecks = {
    len12: pw.length >= 12,
    lower: /[a-z]/.test(pw),
    upper: /[A-Z]/.test(pw),
    digit: /[0-9]/.test(pw),
    symbol: /[^A-Za-z0-9]/.test(pw),
    notCommon: pw.length > 0 && !isCommon(pw),
    notSequential: pw.length > 0 && !hasSequence(pw),
  }

  let pool = 0
  if (checks.lower) pool += 26
  if (checks.upper) pool += 26
  if (checks.digit) pool += 10
  if (checks.symbol) pool += 32

  const classes = [checks.lower, checks.upper, checks.digit, checks.symbol].filter(
    Boolean,
  ).length

  let entropyBits = pw.length > 0 && pool > 0 ? pw.length * Math.log2(pool) : 0
  // penalise obviously weak passwords so the meter is honest
  if (!checks.notCommon) entropyBits = Math.min(entropyBits, 12)
  if (!checks.notSequential) entropyBits = Math.min(entropyBits, 22)
  entropyBits = Math.round(entropyBits)

  let label = '非常弱'
  let labelColor: AccentColor = 'danger'
  if (entropyBits >= 80) {
    label = '非常強'
    labelColor = 'neon'
  } else if (entropyBits >= 60) {
    label = '強'
    labelColor = 'neon'
  } else if (entropyBits >= 40) {
    label = '普通'
    labelColor = 'gold'
  } else if (entropyBits >= 28) {
    label = '弱'
    labelColor = 'danger'
  }

  const strong =
    checks.len12 &&
    classes >= 3 &&
    checks.notCommon &&
    checks.notSequential &&
    entropyBits >= 60

  return {
    entropyBits,
    crackText: crackTime(entropyBits),
    label,
    labelColor,
    strength: Math.max(0, Math.min(1, entropyBits / 90)),
    classes,
    checks,
    strong,
  }
}
