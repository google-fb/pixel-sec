import { useEffect } from 'react'
import { LEVELS, LEVEL_ORDER, useGame } from '../store/gameStore'
import { TopBar } from '../components/TopBar'
import { PixelButton } from '../components/ui/PixelButton'
import { PixelPanel } from '../components/ui/PixelPanel'
import { Stars } from '../components/ui/Stars'
import { AssistantSprite } from '../components/AssistantSprite'
import { BigShield } from '../components/BigShield'
import { useSfx } from '../lib/sfx'

interface SummaryScreenProps {
  onOpenSettings: () => void
}

function rankFor(stars: number, max: number): { title: string; desc: string } {
  const ratio = stars / max
  if (ratio >= 0.9) return { title: '資安大師特工', desc: '幾乎零失誤，實力堅強！' }
  if (ratio >= 0.66) return { title: '資深特工', desc: '表現優秀，觀念紮實。' }
  if (ratio >= 0.4) return { title: '合格特工', desc: '基礎穩固，繼續練習！' }
  return { title: '見習特工', desc: '完成訓練，複習能更上一層！' }
}

export function SummaryScreen({ onOpenSettings }: SummaryScreenProps) {
  const progress = useGame((s) => s.progress)
  const goToMap = useGame((s) => s.goToMap)
  const backToTitle = useGame((s) => s.backToTitle)
  const say = useGame((s) => s.say)
  const totalStars = useGame((s) => s.totalStars())
  const maxStars = LEVEL_ORDER.length * 3
  const rank = rankFor(totalStars, maxStars)
  const sfx = useSfx()

  useEffect(() => {
    sfx.win()
    say('恭喜結業！你已經掌握六大資安主題，把它們帶回真實世界用起來吧！', 'happy')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="mx-auto flex min-h-full w-full max-w-3xl flex-col">
      <TopBar onOpenSettings={onOpenSettings} onBack={goToMap} backLabel="地圖" />

      <div className="flex-1 p-3 sm:p-5">
        {/* certificate */}
        <PixelPanel tone="panel" className="anim-pop mb-4 text-center">
          <div className="mb-2 flex items-center justify-center gap-3">
            <BigShield size={48} />
            <AssistantSprite mood="happy" scale={0.7} float={false} />
          </div>
          <p className="text-[13px] text-cyan">— 像素資安局 結業認證 —</p>
          <h1 className="mt-1 text-2xl text-neon">訓練完成！</h1>
          <div className="mt-3 inline-block border-4 border-ink bg-gold px-4 py-2">
            <div className="text-[11px] text-ink/70">授予稱號</div>
            <div className="text-lg text-ink">{rank.title}</div>
          </div>
          <p className="mt-2 text-[12px] text-muted">{rank.desc}</p>

          <div className="mt-4 flex flex-col items-center gap-1">
            <Stars value={Math.round(totalStars / LEVEL_ORDER.length)} size={22} />
            <div className="text-[12px] text-gold">
              總星星　{totalStars} / {maxStars}
            </div>
          </div>
        </PixelPanel>

        {/* takeaway checklist */}
        <PixelPanel tone="panel2" className="mb-4">
          <h2 className="mb-3 flex items-center gap-2 text-[14px] text-cyan">
            <span className="inline-block h-3 w-3 bg-cyan" />
            帶回家的資安行動清單
          </h2>
          <ul className="space-y-2">
            {LEVEL_ORDER.map((id) => {
              const meta = LEVELS[id]
              const done = progress[id]?.completed
              return (
                <li key={id} className="flex gap-2 text-[12px] leading-relaxed">
                  <span
                    className={
                      done ? 'text-neon' : 'text-muted'
                    }
                  >
                    {done ? '☑' : '☐'}
                  </span>
                  <span>
                    <span className="text-paper">{meta.title}：</span>
                    <span className="text-muted">{meta.realWorld}</span>
                  </span>
                </li>
              )
            })}
          </ul>
        </PixelPanel>

        <div className="flex flex-col justify-center gap-2 sm:flex-row">
          <PixelButton variant="primary" onClick={goToMap}>
            回地圖複習
          </PixelButton>
          <PixelButton variant="ghost" onClick={backToTitle}>
            回首頁
          </PixelButton>
        </div>

        <p className="mt-4 text-center text-[10px] leading-relaxed text-muted">
          資安是一種習慣，不是一次考試。把清單上的行動落實在生活裡，你就是自己的資安特工。
        </p>
      </div>
    </div>
  )
}
