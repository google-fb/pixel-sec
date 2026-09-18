import { useEffect, useMemo, useRef, useState } from 'react'
import { useLevel } from './context'
import { evaluatePassword } from '../lib/passwords'
import { ProgressBar } from '../components/ui/ProgressBar'
import { PixelButton } from '../components/ui/PixelButton'
import { accentText } from '../lib/accent'
import { cn } from '../lib/cn'

const WEAK_EXAMPLES = ['123456', 'password', 'qwerty', 'meowmeow2024', 'Aa123456']

function Check({ ok, children }: { ok: boolean; children: React.ReactNode }) {
  return (
    <li className="flex items-center gap-2 text-[12px]">
      <span
        className={cn(
          'flex h-4 w-4 shrink-0 items-center justify-center border-2 border-ink text-[10px]',
          ok ? 'bg-neon text-ink' : 'bg-base-2 text-muted',
        )}
      >
        {ok ? '✓' : '✕'}
      </span>
      <span className={ok ? 'text-paper' : 'text-muted'}>{children}</span>
    </li>
  )
}

export function PasswordLevel() {
  const { solve, react, solved } = useLevel()
  const [pw, setPw] = useState('')
  const [show, setShow] = useState(true)
  const wasStrong = useRef(false)

  const evaluation = useMemo(() => evaluatePassword(pw), [pw])
  const { checks } = evaluation

  useEffect(() => {
    if (evaluation.strong && !wasStrong.current) {
      wasStrong.current = true
      react(
        'correct',
        `這組密碼夠強了！熵值約 ${evaluation.entropyBits} bits，暴力破解要「${evaluation.crackText}」。按下設定就完成囉。`,
      )
    } else if (!evaluation.strong) {
      wasStrong.current = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [evaluation.strong])

  return (
    <div className="space-y-4">
      <p className="text-[13px] leading-relaxed text-paper">
        幫「喵喵社群」的管理員帳號設定一組<span className="text-neon">夠強的密碼</span>
        。試著讓下面每一項都打勾，並觀察「預估破解時間」怎麼變化。
      </p>

      <div className="pixel-frame-sm bg-base-2 p-3">
        <label className="mb-1 block text-[11px] text-muted">輸入密碼</label>
        <div className="flex gap-2">
          <input
            type={show ? 'text' : 'password'}
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            placeholder="在這裡輸入…"
            autoComplete="off"
            spellCheck={false}
            className="w-full border-4 border-ink bg-panel px-3 py-2 text-sm text-paper outline-none placeholder:text-muted/60 focus:border-cyan"
          />
          <PixelButton
            variant="ghost"
            size="sm"
            sound={null}
            onClick={() => setShow((s) => !s)}
            aria-label={show ? '隱藏密碼' : '顯示密碼'}
          >
            {show ? '隱藏' : '顯示'}
          </PixelButton>
        </div>

        <div className="mt-3">
          <div className="mb-1 flex items-center justify-between text-[12px]">
            <span className="text-muted">強度</span>
            <span className={cn('font-bold', accentText[evaluation.labelColor])}>
              {pw ? evaluation.label : '—'}
            </span>
          </div>
          <ProgressBar value={evaluation.strength} accent={evaluation.labelColor} segments={12} />
          <div className="mt-2 flex flex-wrap justify-between gap-x-4 text-[11px] text-muted">
            <span>
              亂度：<span className="text-cyan">{evaluation.entropyBits} bits</span>
            </span>
            <span>
              預估暴力破解：
              <span className={accentText[evaluation.labelColor]}>
                {pw ? evaluation.crackText : '—'}
              </span>
            </span>
          </div>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="pixel-frame-sm bg-base-2 p-3">
          <h3 className="mb-2 text-[12px] text-cyan">達標條件</h3>
          <ul className="space-y-1.5">
            <Check ok={checks.len12}>長度至少 12 個字元</Check>
            <Check ok={evaluation.classes >= 3}>
              混用 3 種以上：大小寫 / 數字 / 符號
            </Check>
            <Check ok={checks.notCommon}>不是常見密碼或 App 名稱</Check>
            <Check ok={checks.notSequential}>沒有 1234、abcd 這類連續字</Check>
          </ul>
        </div>

        <div className="pixel-frame-sm bg-base-2 p-3">
          <h3 className="mb-2 text-[12px] text-gold">試試看：這些有多弱？</h3>
          <p className="mb-2 text-[11px] text-muted">
            點一下填入常見密碼，看看破解時間。
          </p>
          <div className="flex flex-wrap gap-2">
            {WEAK_EXAMPLES.map((ex) => (
              <button
                key={ex}
                onClick={() => setPw(ex)}
                className="border-2 border-ink bg-panel px-2 py-1 text-[11px] text-paper hover:border-danger hover:text-danger"
              >
                {ex}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <PixelButton
          variant="primary"
          disabled={!evaluation.strong || solved}
          onClick={() => {
            if (evaluation.strong) solve()
            else react('wrong', '這組還不夠強，先讓上面的條件全部打勾吧。')
          }}
        >
          {solved ? '已設定 ✓' : '設定這組密碼'}
        </PixelButton>
        {!evaluation.strong && pw.length > 0 && (
          <span className="text-[11px] text-muted">還差一點，看看哪一項還沒打勾。</span>
        )}
      </div>
    </div>
  )
}
