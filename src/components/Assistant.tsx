import { useEffect, useRef, useState } from 'react'
import { useGame } from '../store/gameStore'
import { cn } from '../lib/cn'
import { AssistantSprite } from './AssistantSprite'

function useTypewriter(text: string, resetKey: number, speed = 26) {
  const [shown, setShown] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    setShown('')
    setDone(false)
    if (!text) {
      setDone(true)
      return
    }
    let i = 0
    const id = window.setInterval(() => {
      i += 1
      setShown(text.slice(0, i))
      if (i >= text.length) {
        window.clearInterval(id)
        setDone(true)
      }
    }, speed)
    return () => window.clearInterval(id)
  }, [text, resetKey, speed])

  return { shown, done, reveal: () => setShown(text) }
}

interface AssistantProps {
  scale?: number
  className?: string
  name?: string
  minHeight?: number
}

export function Assistant({
  scale = 1,
  className,
  name = '位元君',
  minHeight = 96,
}: AssistantProps) {
  const { text, mood, key } = useGame((s) => s.assistant)
  const { shown, done, reveal } = useTypewriter(text, key)
  const prevKey = useRef(key)

  useEffect(() => {
    prevKey.current = key
  }, [key])

  return (
    <div className={cn('flex items-start gap-3', className)}>
      <AssistantSprite mood={mood} scale={scale} />
      <div className="relative flex-1">
        {/* bubble tail */}
        <div
          className="absolute -left-2 top-6 h-4 w-4 rotate-45 border-b-4 border-l-4 border-ink bg-panel-2"
          aria-hidden="true"
        />
        <button
          type="button"
          onClick={reveal}
          className="pixel-frame-sm block w-full cursor-text bg-panel-2 px-3 py-2 text-left"
          style={{ minHeight }}
          aria-live="polite"
        >
          <div className="mb-1 flex items-center gap-2 text-[11px] text-cyan">
            <span className="inline-block h-2 w-2 bg-neon anim-blink" />
            {name}
          </div>
          <p className="whitespace-pre-wrap text-[13px] leading-relaxed text-paper">
            {shown}
            {!done && <span className="anim-blink text-neon">▌</span>}
          </p>
        </button>
      </div>
    </div>
  )
}
