import { useEffect } from 'react'
import { LEVELS, LEVEL_ORDER, useGame } from '../store/gameStore'
import { TopBar } from '../components/TopBar'
import { Assistant } from '../components/Assistant'
import { PixelButton } from '../components/ui/PixelButton'
import { PixelPanel } from '../components/ui/PixelPanel'
import { ProgressBar } from '../components/ui/ProgressBar'
import { Stars } from '../components/ui/Stars'
import { accentBg, accentText } from '../lib/accent'
import { cn } from '../lib/cn'

interface MapScreenProps {
  onOpenSettings: () => void
}

export function MapScreen({ onOpenSettings }: MapScreenProps) {
  const progress = useGame((s) => s.progress)
  const isUnlocked = useGame((s) => s.isUnlocked)
  const openLevel = useGame((s) => s.openLevel)
  const backToTitle = useGame((s) => s.backToTitle)
  const finishGame = useGame((s) => s.finishGame)
  const say = useGame((s) => s.say)
  const cleared = useGame((s) => s.clearedCount())
  const allCleared = cleared === LEVEL_ORDER.length

  useEffect(() => {
    say(
      allCleared
        ? '你已經全部通關了！想複習可以重玩任何一關，或看看你的結業徽章。'
        : '選一關開始吧！建議依序挑戰，完成一關就會解鎖下一關。',
      'idle',
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="mx-auto flex min-h-full w-full max-w-3xl flex-col">
      <TopBar onOpenSettings={onOpenSettings} onBack={backToTitle} backLabel="首頁" />

      <div className="flex-1 p-3 sm:p-5">
        <PixelPanel tone="panel2" className="mb-4">
          <Assistant />
        </PixelPanel>

        <div className="mb-4">
          <ProgressBar
            value={cleared / LEVEL_ORDER.length}
            segments={LEVEL_ORDER.length}
            accent="neon"
            label={`訓練進度　${cleared}/${LEVEL_ORDER.length} 關`}
          />
        </div>

        <div className="space-y-0">
          {LEVEL_ORDER.map((id, i) => {
            const meta = LEVELS[id]
            const prog = progress[id]
            const unlocked = isUnlocked(id)
            const completed = prog.completed
            const isLastNode = i === LEVEL_ORDER.length - 1

            return (
              <div key={id}>
                <button
                  disabled={!unlocked}
                  onClick={() => unlocked && openLevel(id)}
                  className={cn(
                    'group flex w-full items-center gap-3 border-4 border-ink p-3 text-left transition-transform',
                    unlocked
                      ? 'bg-panel hover:-translate-y-0.5 hover:brightness-110'
                      : 'cursor-not-allowed bg-base-2 opacity-60',
                    completed && 'border-neon',
                  )}
                >
                  <div
                    className={cn(
                      'flex h-12 w-12 shrink-0 items-center justify-center border-4 border-ink text-xl',
                      unlocked ? accentBg[meta.accent] : 'bg-line/40',
                      unlocked ? 'text-ink' : 'text-muted',
                    )}
                  >
                    {unlocked ? meta.index : '🔒'}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[14px] text-paper">{meta.title}</span>
                      <span
                        className={cn(
                          'border-2 border-ink px-1.5 py-0.5 text-[10px]',
                          unlocked ? cn(accentBg[meta.accent], 'text-ink') : 'bg-line/40 text-muted',
                        )}
                      >
                        {meta.tag}
                      </span>
                    </div>
                    <div className="truncate text-[11px] text-muted">
                      {unlocked ? meta.subtitle : '先完成前一關才能解鎖'}
                    </div>
                  </div>

                  <div className="shrink-0 text-right">
                    {completed ? (
                      <Stars value={prog.stars} size={14} />
                    ) : unlocked ? (
                      <span className={cn('text-[12px]', accentText[meta.accent])}>
                        開始 ▶
                      </span>
                    ) : (
                      <span className="text-[11px] text-muted">鎖定</span>
                    )}
                  </div>
                </button>

                {!isLastNode && (
                  <div className="flex justify-start pl-9" aria-hidden="true">
                    <div
                      className={cn(
                        'my-1 h-4 w-1',
                        completed ? 'bg-neon' : 'bg-line/50',
                      )}
                    />
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {allCleared && (
          <div className="mt-5 text-center">
            <PixelButton variant="gold" size="lg" onClick={finishGame}>
              查看結業徽章 🎓
            </PixelButton>
          </div>
        )}
      </div>
    </div>
  )
}
