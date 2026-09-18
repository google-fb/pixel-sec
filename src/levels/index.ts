import type { ComponentType } from 'react'
import type { LevelId } from '../types'
import { PasswordLevel } from './PasswordLevel'
import { PhishingLevel } from './PhishingLevel'
import { CipherLevel } from './CipherLevel'
import { TwoFactorLevel } from './TwoFactorLevel'
import { PermissionsLevel } from './PermissionsLevel'
import { InjectionLevel } from './InjectionLevel'

export const levelRegistry: Record<LevelId, ComponentType> = {
  password: PasswordLevel,
  phishing: PhishingLevel,
  cipher: CipherLevel,
  twofactor: TwoFactorLevel,
  permissions: PermissionsLevel,
  injection: InjectionLevel,
}
