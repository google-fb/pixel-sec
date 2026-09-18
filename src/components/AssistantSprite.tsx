import { cn } from '../lib/cn'
import type { AssistantMood } from '../types'

interface FaceSpec {
  glow: string
  bulb: string
  eye: { w: number; h: number }
  mouth: { w: number; h: number }
  blinkBulb?: boolean
}

const FACE: Record<AssistantMood, FaceSpec> = {
  idle: { glow: '#52ffb8', bulb: '#4dd0ff', eye: { w: 8, h: 12 }, mouth: { w: 14, h: 3 } },
  happy: { glow: '#52ffb8', bulb: '#52ffb8', eye: { w: 10, h: 5 }, mouth: { w: 18, h: 4 } },
  think: { glow: '#ffd34d', bulb: '#ffd34d', eye: { w: 8, h: 8 }, mouth: { w: 8, h: 3 } },
  alert: { glow: '#ff5566', bulb: '#ff5566', eye: { w: 10, h: 12 }, mouth: { w: 9, h: 9 }, blinkBulb: true },
  sad: { glow: '#4dd0ff', bulb: '#7a7ab0', eye: { w: 8, h: 6 }, mouth: { w: 12, h: 3 } },
}

interface AssistantSpriteProps {
  mood?: AssistantMood
  scale?: number
  float?: boolean
  className?: string
}

const BASE_W = 72
const BASE_H = 104

export function AssistantSprite({
  mood = 'idle',
  scale = 1,
  float = true,
  className,
}: AssistantSpriteProps) {
  const f = FACE[mood]
  return (
    <div
      className={cn('relative shrink-0', float && 'anim-float', className)}
      style={{ width: BASE_W * scale, height: BASE_H * scale }}
      aria-hidden="true"
    >
      <div
        className="absolute left-0 top-0"
        style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}
      >
        <div className="flex flex-col items-center" style={{ width: BASE_W }}>
          {/* antenna */}
          <div className="flex flex-col items-center">
            <div
              className={cn('border-2 border-ink', f.blinkBulb && 'anim-blink')}
              style={{ width: 10, height: 10, backgroundColor: f.bulb }}
            />
            <div style={{ width: 4, height: 12, backgroundColor: '#4b4a86' }} />
          </div>

          {/* head */}
          <div
            className="relative border-4 border-ink"
            style={{ width: 64, height: 50, backgroundColor: '#4dd0ff' }}
          >
            {/* side bolts */}
            <div
              className="absolute border-2 border-ink"
              style={{ left: -8, top: 12, width: 8, height: 12, backgroundColor: '#ffd34d' }}
            />
            <div
              className="absolute border-2 border-ink"
              style={{ right: -8, top: 12, width: 8, height: 12, backgroundColor: '#ffd34d' }}
            />
            {/* screen */}
            <div
              className="absolute flex flex-col items-center justify-center gap-1 border-2 border-ink"
              style={{ inset: 6, backgroundColor: '#06131c' }}
            >
              <div className="flex items-end justify-center" style={{ gap: 8 }}>
                <span style={{ width: f.eye.w, height: f.eye.h, backgroundColor: f.glow, boxShadow: `0 0 6px ${f.glow}` }} />
                <span style={{ width: f.eye.w, height: f.eye.h, backgroundColor: f.glow, boxShadow: `0 0 6px ${f.glow}` }} />
              </div>
              <span style={{ width: f.mouth.w, height: f.mouth.h, backgroundColor: f.glow, opacity: 0.85 }} />
            </div>
          </div>

          {/* body */}
          <div
            className="relative border-4 border-ink"
            style={{ width: 54, height: 26, marginTop: -2, backgroundColor: '#2f8fbf' }}
          >
            <div
              className="absolute border-2 border-ink"
              style={{ left: -8, top: 2, width: 8, height: 18, backgroundColor: '#4dd0ff' }}
            />
            <div
              className="absolute border-2 border-ink"
              style={{ right: -8, top: 2, width: 8, height: 18, backgroundColor: '#4dd0ff' }}
            />
            <div
              className="absolute border-2 border-ink anim-pulse"
              style={{
                left: '50%',
                top: '50%',
                width: 12,
                height: 12,
                transform: 'translate(-50%,-50%)',
                backgroundColor: f.bulb,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
