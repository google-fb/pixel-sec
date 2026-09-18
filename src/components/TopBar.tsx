import { LEVEL_ORDER, useGame } from '../store/gameStore'
import { cn } from '../lib/cn'
import { PixelButton } from './ui/PixelButton'

function MiniShield() {
  return (
    <svg width="22" height="22" viewBox="0 0 12 12" shapeRendering="crispEdges" aria-hidden="true">
      <g fill="#4dd0ff">
        <rect x="2" y="0" width="8" height="1" />
        <rect x="1" y="1" width="10" height="1" />
        <rect x="0" y="2" width="12" height="4" />
        <rect x="1" y="6" width="10" height="2" />
        <rect x="2" y="8" width="8" height="1" />
        <rect x="3" y="9" width="6" height="1" />
        <rect x="4" y="10" width="4" height="1" />
        <rect x="5" y="11" width="2" height="1" />
      </g>
      <g fill="#08081a">
        <rect x="5" y="3" width="2" height="2" />
        <rect x="5" y="5" width="2" height="3" />
      </g>
    </svg>
  )
}

interface TopBarProps {
  onOpenSettings: () => void
  onBack?: () => void
  backLabel?: string
  className?: string
}

export function TopBar({
  onOpenSettings,
  onBack,
  backLabel = '返回',
  className,
}: TopBarProps) {
  const cleared = useGame((s) => s.clearedCount())
  const stars = useGame((s) => s.totalStars())

  return (
    <header
      className={cn(
        'flex items-center justify-between gap-3 border-b-4 border-ink bg-panel/80 px-3 py-2 backdrop-blur',
        className,
      )}
    >
      <div className="flex items-center gap-2">
        {onBack && (
          <PixelButton variant="ghost" size="sm" onClick={onBack}>
            ◀ {backLabel}
          </PixelButton>
        )}
        <div className="flex items-center gap-2">
          <MiniShield />
          <span className="hidden text-[12px] text-cyan sm:inline">
            資安小特工
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden items-center gap-1 text-[11px] text-muted sm:flex">
          <span className="text-neon">關卡</span>
          <span className="text-paper">
            {cleared}/{LEVEL_ORDER.length}
          </span>
        </div>
        <div className="flex items-center gap-1 border-2 border-ink bg-base-2 px-2 py-1 text-[11px]">
          <span
            className="inline-block h-3 w-3"
            style={{
              clipPath:
                'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
              backgroundColor: '#ffd34d',
            }}
          />
          <span className="text-gold">{stars}</span>
        </div>
        <PixelButton variant="ghost" size="sm" onClick={onOpenSettings}>
          設定
        </PixelButton>
      </div>
    </header>
  )
}
