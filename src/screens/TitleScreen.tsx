import { useEffect } from 'react'
import { useGame } from '../store/gameStore'
import { TOTAL_MINUTES } from '../data/levels'
import { LEVEL_ORDER } from '../store/gameStore'
import { PixelButton } from '../components/ui/PixelButton'
import { Assistant } from '../components/Assistant'
import { BigShield } from '../components/BigShield'

const TOPICS = ['密碼安全', '釣魚辨識', '加密 / HTTPS', '兩步驟驗證', 'App 權限', 'SQL 注入']

interface TitleScreenProps {
  onOpenSettings: () => void
}

export function TitleScreen({ onOpenSettings }: TitleScreenProps) {
  const startGame = useGame((s) => s.startGame)
  const say = useGame((s) => s.say)
  const cleared = useGame((s) => s.clearedCount())

  useEffect(() => {
    say(
      '哈囉！我是你的資安小助手「位元君」。準備好用大約 20 分鐘，邊玩邊變成資安高手了嗎？',
      'happy',
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="relative flex min-h-full flex-col items-center justify-center overflow-hidden p-4">
      {/* twinkling stars */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {STAR_POSITIONS.map((s, i) => (
          <span
            key={i}
            className="anim-blink absolute bg-paper"
            style={{
              left: `${s.x}%`,
              top: `${s.y}%`,
              width: s.s,
              height: s.s,
              opacity: 0.4,
              animationDelay: `${s.d}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-xl">
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="anim-float">
            <BigShield size={84} />
          </div>
          <h1 className="mt-3 text-3xl leading-tight text-neon sm:text-4xl">
            資安小特工
          </h1>
          <div className="mt-1 inline-block border-4 border-ink bg-cyan px-3 py-1 text-sm text-ink">
            像 素 任 務
          </div>
          <p className="mt-3 text-[13px] text-muted">
            邊玩邊學・網頁 &amp; App 資安　給高中生的像素解謎冒險
          </p>
        </div>

        <div className="mb-5 flex flex-wrap justify-center gap-2">
          {TOPICS.map((t) => (
            <span
              key={t}
              className="border-2 border-ink bg-panel px-2 py-1 text-[11px] text-cyan"
            >
              {t}
            </span>
          ))}
        </div>

        <div className="pixel-frame mb-5 bg-panel-2 p-3">
          <Assistant />
        </div>

        <div className="mb-5 flex justify-center gap-4 text-[12px] text-muted">
          <span>⏱ 約 {TOTAL_MINUTES} 分鐘</span>
          <span>🧩 {LEVEL_ORDER.length} 關</span>
          <span>🎓 高中生友善</span>
        </div>

        <div className="flex flex-col items-center gap-3">
          <PixelButton variant="primary" size="lg" className="w-full max-w-xs" onClick={startGame}>
            {cleared > 0 ? '繼續冒險 ▶' : '開始遊戲 ▶'}
          </PixelButton>
          <PixelButton variant="ghost" size="sm" onClick={onOpenSettings}>
            設定
          </PixelButton>
        </div>
      </div>
    </div>
  )
}

const STAR_POSITIONS = [
  { x: 8, y: 12, s: 3, d: 0 },
  { x: 22, y: 30, s: 2, d: 0.6 },
  { x: 15, y: 70, s: 2, d: 1.2 },
  { x: 35, y: 18, s: 3, d: 0.3 },
  { x: 48, y: 60, s: 2, d: 0.9 },
  { x: 62, y: 22, s: 2, d: 1.5 },
  { x: 78, y: 40, s: 3, d: 0.4 },
  { x: 88, y: 14, s: 2, d: 1.1 },
  { x: 92, y: 66, s: 2, d: 0.7 },
  { x: 70, y: 78, s: 3, d: 1.3 },
  { x: 30, y: 86, s: 2, d: 0.5 },
  { x: 55, y: 88, s: 2, d: 1.0 },
]
