import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '../../lib/cn'

interface PixelPanelProps extends HTMLAttributes<HTMLDivElement> {
  tone?: 'panel' | 'panel2' | 'dark' | 'ink'
  children: ReactNode
}

const toneClass = {
  panel: 'bg-panel',
  panel2: 'bg-panel-2',
  dark: 'bg-base-2',
  ink: 'bg-ink',
} as const

export function PixelPanel({
  tone = 'panel',
  className,
  children,
  ...rest
}: PixelPanelProps) {
  return (
    <div
      {...rest}
      className={cn('pixel-frame p-4', toneClass[tone], className)}
    >
      {children}
    </div>
  )
}
