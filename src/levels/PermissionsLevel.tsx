import { useMemo, useState } from 'react'
import { useLevel } from './context'
import { PixelButton } from '../components/ui/PixelButton'
import { cn } from '../lib/cn'

type Decision = 'allow' | 'deny'

interface Perm {
  id: string
  name: string
  desc: string
  needed: boolean
}

const PERMS: Perm[] = [
  { id: 'flash', name: '相機 / 閃光燈', desc: '控制手機 LED 燈——這正是手電筒的核心功能', needed: true },
  { id: 'location', name: '精確位置 (GPS)', desc: '隨時取得你的所在座標', needed: false },
  { id: 'contacts', name: '通訊錄', desc: '讀取你所有聯絡人資料', needed: false },
  { id: 'mic', name: '麥克風', desc: '隨時錄音', needed: false },
  { id: 'sms', name: '讀取簡訊', desc: '查看你收到的所有簡訊', needed: false },
  { id: 'photos', name: '相片與媒體', desc: '讀取整個相簿', needed: false },
  { id: 'calls', name: '通話紀錄', desc: '查看你的來電與撥出紀錄', needed: false },
]

export function PermissionsLevel() {
  const { solve, react, solved } = useLevel()
  const [choices, setChoices] = useState<Record<string, Decision>>({})
  const [checked, setChecked] = useState(false)

  const allAnswered = PERMS.every((p) => choices[p.id])
  const results = useMemo(
    () =>
      PERMS.map((p) => ({
        id: p.id,
        correct: (choices[p.id] === 'allow') === p.needed,
      })),
    [choices],
  )
  const correctCount = results.filter((r) => r.correct).length

  const submit = () => {
    setChecked(true)
    if (correctCount === PERMS.length) {
      solve()
    } else {
      react(
        'wrong',
        `過關還差一點（${correctCount}/${PERMS.length}）。想想：手電筒的核心功能是什麼？跟功能無關的權限就該拒絕。`,
      )
    }
  }

  return (
    <div className="space-y-4">
      {/* fake app header */}
      <div className="pixel-frame-sm flex items-center gap-3 bg-panel p-3">
        <div className="flex h-12 w-12 items-center justify-center border-4 border-ink bg-gold text-2xl">
          🔦
        </div>
        <div>
          <div className="text-[14px] text-paper">像素手電筒</div>
          <div className="text-[11px] text-muted">開發者：PixelTools · 免費 · 要求以下權限</div>
        </div>
      </div>

      <p className="text-[13px] leading-relaxed text-paper">
        根據<span className="text-pink">最小權限原則</span>
        ，只放行功能「真正需要」的權限，其他一律拒絕。為每一項做出決定後提交。
      </p>

      <div className="space-y-2">
        {PERMS.map((p) => {
          const choice = choices[p.id]
          const res = results.find((r) => r.id === p.id)!
          return (
            <div
              key={p.id}
              className={cn(
                'pixel-frame-sm bg-base-2 p-3',
                checked && (res.correct ? 'border-neon' : 'border-danger'),
              )}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <div className="text-[13px] text-paper">{p.name}</div>
                  <div className="text-[11px] leading-snug text-muted">{p.desc}</div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setChoices((c) => ({ ...c, [p.id]: 'allow' }))}
                    className={cn(
                      'border-4 border-ink px-3 py-1 text-[12px]',
                      choice === 'allow' ? 'bg-neon text-ink' : 'bg-panel text-muted hover:text-neon',
                    )}
                  >
                    允許
                  </button>
                  <button
                    onClick={() => setChoices((c) => ({ ...c, [p.id]: 'deny' }))}
                    className={cn(
                      'border-4 border-ink px-3 py-1 text-[12px]',
                      choice === 'deny' ? 'bg-danger text-paper' : 'bg-panel text-muted hover:text-danger',
                    )}
                  >
                    拒絕
                  </button>
                </div>
              </div>
              {checked && !res.correct && (
                <p className="mt-2 text-[11px] text-gold">
                  {p.needed
                    ? '這是手電筒的核心功能，應該「允許」。'
                    : '手電筒用不到這個權限，應該「拒絕」——過度索取是隱私警訊。'}
                </p>
              )}
            </div>
          )
        })}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <PixelButton variant="primary" disabled={!allAnswered || solved} onClick={submit}>
          {solved ? '稽核完成 ✓' : '完成安裝設定'}
        </PixelButton>
        {!allAnswered && (
          <span className="text-[11px] text-muted">請為每一項權限做出決定。</span>
        )}
      </div>
    </div>
  )
}
