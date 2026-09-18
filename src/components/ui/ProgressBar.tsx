import { cn } from '../../lib/cn'
import { accentBg } from '../../lib/accent'
import type { AccentColor } from '../../types'

interface ProgressBarProps {
  value: number
  segments?: number
  accent?: AccentColor
  className?: string
  label?: string
}

export function ProgressBar({
  value,
  segments = 10,
  accent = 'neon',
  className,
  label,
}: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(1, value))
  const filled = Math.round(clamped * segments)
  return (
    <div className={cn('w-full', className)}>
      {label && (
        <div className="mb-1 flex justify-between text-[11px] text-muted">
          <span>{label}</span>
          <span>{Math.round(clamped * 100)}%</span>
        </div>
      )}
      <div className="pixel-inset flex gap-[3px] bg-ink p-[3px]">
        {Array.from({ length: segments }).map((_, i) => (
          <div
            key={i}
            className={cn(
              'h-3 flex-1 transition-colors duration-150',
              i < filled ? accentBg[accent] : 'bg-line/40',
            )}
          />
        ))}
      </div>
    </div>
  )
}
