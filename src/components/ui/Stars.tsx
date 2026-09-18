import { cn } from '../../lib/cn'

const STAR_CLIP =
  'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)'

interface StarsProps {
  value: number
  max?: number
  size?: number
  className?: string
}

export function Stars({ value, max = 3, size = 16, className }: StarsProps) {
  return (
    <div
      className={cn('inline-flex items-center gap-1', className)}
      aria-label={`${value} / ${max} stars`}
      role="img"
    >
      {Array.from({ length: max }).map((_, i) => (
        <span
          key={i}
          style={{
            width: size,
            height: size,
            clipPath: STAR_CLIP,
            backgroundColor: i < value ? '#ffd34d' : '#3a3a6e',
          }}
          className={i < value ? 'anim-pop' : ''}
        />
      ))}
    </div>
  )
}
