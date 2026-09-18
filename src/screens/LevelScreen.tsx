import { useEffect, useMemo, useState } from 'react'
import { LEVELS, useGame } from '../store/gameStore'
import { useSfx } from '../lib/sfx'
import { LevelContext, type LevelApi } from '../levels/context'
import { levelRegistry } from '../levels'
import { TopBar } from '../components/TopBar'
import { Assistant } from '../components/Assistant'
import { PixelButton } from '../components/ui/PixelButton'
import { PixelPanel } from '../components/ui/PixelPanel'
import { Stars } from '../components/ui/Stars'
import { accentBg, accentText } from '../lib/accent'
import { cn } from '../lib/cn'

interface LevelScreenProps {
  onOpenSettings: () => void
}

export function LevelScreen({ onOpenSettings }: LevelScreenProps) {
  const levelId = useGame((s) => s.currentLevelId)!
  const meta = LEVELS[levelId]
  const say = useGame((s) => s.say)
  const hintMode = useGame((s) => s.settings.hintMode)
  const completeLevel = useGame((s) => s.completeLevel)
  const openLevel = useGame((s) => s.openLevel)
  const goToMap = useGame((s) => s.goToMap)
  const finishGame = useGame((s) => s.finishGame)
  const nextLevelId = useGame((s) => s.nextLevelId)
  const levelStars = useGame((s) => s.progress[levelId]?.stars ?? 0)
  const sfx = useSfx()

  const [solved, setSolved] = useState(false)
  const [revealedHints, setRevealedHints] = useState<string[]>([])
  const [briefing, setBriefing] = useState(0)
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    setSolved(false)
    setRevealedHints([])
    setBriefing(0)
    setShowSuccess(false)
    say(meta.intro[0], 'idle')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [levelId])

  const api: LevelApi = useMemo(
    () => ({
      meta,
      solved,
      solve: () => {
        if (solved) return
        setSolved(true)
        sfx.win()
        completeLevel(levelId, revealedHints.length)
        say('太棒了，關卡完成！你成功守住了這一關！', 'happy')
        setShowSuccess(true)
      },
      say,
      react: (kind, text) => {
        if (kind === 'correct') {
          sfx.correct()
          say(text, 'happy')
        } else {
          sfx.wrong()
          say(text, 'alert')
        }
      },
      hintMode,
      requestHint: () => {
        if (revealedHints.length >= meta.hints.length) return
        const nextHint = meta.hints[revealedHints.length]
        setRevealedHints((prev) =>
          prev.length >= meta.hints.length ? prev : [...prev, meta.hints[prev.length]],
        )
        sfx.hint()
        say('提示：' + nextHint, 'think')
      },
      revealedHints,
      hintsUsed: revealedHints.length,
      allHintsShown: revealedHints.length >= meta.hints.length,
      sfx,
    }),
    [meta, solved, say, hintMode, revealedHints, levelId, completeLevel, sfx],
  )

  const Puzzle = levelRegistry[levelId]
  const isLast = nextLevelId(levelId) === null

  const handleNext = () => {
    const nid = nextLevelId(levelId)
    if (nid) openLevel(nid)
    else finishGame()
  }

  return (
    <LevelContext.Provider value={api}>
      <div className="mx-auto flex min-h-full w-full max-w-5xl flex-col">
        <TopBar onOpenSettings={onOpenSettings} onBack={goToMap} backLabel="地圖" />

        <div className="flex-1 p-3 sm:p-5">
          {/* header */}
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <div
              className={cn(
                'flex h-10 w-10 items-center justify-center border-4 border-ink text-lg text-ink',
                accentBg[meta.accent],
              )}
            >
              {meta.index}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg text-paper">{meta.title}</h1>
                <span
                  className={cn(
                    'border-2 border-ink px-1.5 py-0.5 text-[10px] text-ink',
                    accentBg[meta.accent],
                  )}
                >
                  {meta.tag}
                </span>
              </div>
              <p className="text-[12px] text-muted">{meta.subtitle}</p>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-[1fr_340px]">
            {/* puzzle */}
            <div className="order-2 lg:order-1">
              <PixelPanel tone="dark" className="relative overflow-hidden">
                <Puzzle />
              </PixelPanel>
            </div>

            {/* side: assistant + briefing + hints */}
            <aside className="order-1 flex flex-col gap-3 lg:order-2">
              <PixelPanel tone="panel2">
                <Assistant />
                <div className="mt-3 flex items-center justify-between border-t-2 border-line/40 pt-2 text-[11px] text-muted">
                  <span>
                    任務簡報 {briefing + 1}/{meta.intro.length}
                  </span>
                  <div className="flex gap-1">
                    <PixelButton
                      size="sm"
                      variant="ghost"
                      disabled={briefing === 0}
                      onClick={() => {
                        const i = briefing - 1
                        setBriefing(i)
                        say(meta.intro[i], 'idle')
                      }}
                    >
                      ◀
                    </PixelButton>
                    <PixelButton
                      size="sm"
                      variant="ghost"
                      disabled={briefing >= meta.intro.length - 1}
                      onClick={() => {
                        const i = briefing + 1
                        setBriefing(i)
                        say(meta.intro[i], i === meta.intro.length - 1 ? 'happy' : 'idle')
                      }}
                    >
                      ▶
                    </PixelButton>
                  </div>
                </div>
              </PixelPanel>

              <PixelPanel tone="panel">
                <h2 className="mb-2 flex items-center gap-2 text-[12px] text-gold">
                  <span className="inline-block h-2 w-2 bg-gold" />
                  提示區
                </h2>
                {hintMode ? (
                  <>
                    <PixelButton
                      variant="gold"
                      size="sm"
                      className="w-full"
                      disabled={api.allHintsShown}
                      onClick={api.requestHint}
                    >
                      {api.allHintsShown
                        ? '沒有更多提示了'
                        : `請求提示（剩 ${meta.hints.length - revealedHints.length}）`}
                    </PixelButton>
                    {revealedHints.length > 0 && (
                      <ul className="mt-3 space-y-2">
                        {revealedHints.map((h, i) => (
                          <li
                            key={i}
                            className="pixel-frame-sm bg-base-2 p-2 text-[12px] leading-relaxed text-paper"
                          >
                            <span className="text-gold">#{i + 1}</span> {h}
                          </li>
                        ))}
                      </ul>
                    )}
                    <p className="mt-2 text-[10px] text-muted">
                      用越少提示，得到的星星越多。
                    </p>
                  </>
                ) : (
                  <div className="text-[12px] leading-relaxed text-muted">
                    <p>提示模式已關閉，位元君不會主動給線索。</p>
                    <button
                      onClick={onOpenSettings}
                      className="mt-2 text-cyan underline underline-offset-2 hover:text-neon"
                    >
                      前往設定開啟提示模式 →
                    </button>
                  </div>
                )}
              </PixelPanel>
            </aside>
          </div>
        </div>
      </div>

      {/* success overlay */}
      {showSuccess && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/75 p-4">
          <PixelPanel className="anim-pop w-full max-w-lg" tone="panel">
            <div className="mb-3 text-center">
              <p className={cn('text-sm', accentText[meta.accent])}>關卡完成</p>
              <h2 className="text-2xl text-neon">{meta.title}</h2>
              <div className="mt-2 flex justify-center">
                <Stars value={levelStars} size={26} />
              </div>
            </div>

            <div className="pixel-frame-sm mb-3 bg-base-2 p-3">
              <h3 className="mb-2 text-[12px] text-cyan">你學到了：</h3>
              <ul className="space-y-1.5">
                {meta.learn.map((l, i) => (
                  <li key={i} className="flex gap-2 text-[12px] leading-relaxed text-paper">
                    <span className="text-neon">▸</span>
                    <span>{l}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pixel-frame-sm mb-4 bg-panel-2 p-3">
              <h3 className="mb-1 text-[12px] text-gold">🎯 實戰小任務</h3>
              <p className="text-[12px] leading-relaxed text-paper">{meta.realWorld}</p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <PixelButton
                variant={isLast ? 'gold' : 'primary'}
                className="flex-1"
                onClick={handleNext}
              >
                {isLast ? '完成訓練，領取徽章' : '前往下一關 ▶'}
              </PixelButton>
              <PixelButton variant="ghost" onClick={goToMap}>
                回地圖
              </PixelButton>
            </div>
          </PixelPanel>
        </div>
      )}
    </LevelContext.Provider>
  )
}
