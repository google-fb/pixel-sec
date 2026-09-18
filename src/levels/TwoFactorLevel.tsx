import { useEffect, useRef, useState } from 'react'
import { useLevel } from './context'
import { PixelButton } from '../components/ui/PixelButton'
import { ProgressBar } from '../components/ui/ProgressBar'
import { cn } from '../lib/cn'

const PERIOD = 30

function genCode(): string {
  return Math.floor(Math.random() * 1_000_000)
    .toString()
    .padStart(6, '0')
}

type Method = 'app' | 'sms' | null

export function TwoFactorLevel() {
  const { solve, react, say, solved } = useLevel()
  const [enabled, setEnabled] = useState(false)
  const [method, setMethod] = useState<Method>(null)
  const [code, setCode] = useState('------')
  const [prevCode, setPrevCode] = useState<string | null>(null)
  const [timeLeft, setTimeLeft] = useState(PERIOD)
  const [input, setInput] = useState('')

  // keep the latest code readable inside timers without re-subscribing
  const codeRef = useRef(code)
  useEffect(() => {
    codeRef.current = code
  }, [code])

  // single ticking interval — only counts down
  useEffect(() => {
    if (!enabled || !method) return
    setCode(genCode())
    setPrevCode(null)
    setTimeLeft(PERIOD)
    const id = window.setInterval(() => {
      setTimeLeft((t) => Math.max(0, t - 1))
    }, 1000)
    return () => window.clearInterval(id)
  }, [enabled, method])

  // rotate the code when the countdown reaches 0 (keeps the previous one valid briefly)
  useEffect(() => {
    if (!enabled || !method || timeLeft > 0 || solved) return
    setPrevCode(codeRef.current)
    setCode(genCode())
    setTimeLeft(PERIOD)
  }, [timeLeft, enabled, method, solved])

  const submit = () => {
    if (input === code || (prevCode !== null && input === prevCode)) {
      solve()
    } else {
      react('wrong', '動態碼錯誤！用下方的「填入目前的碼」按鈕，或看清楚驗證器現在顯示的 6 位數。')
      setInput('')
    }
  }

  return (
    <div className="space-y-4">
      <p className="text-[13px] leading-relaxed text-paper">
        駭客偷到了某帳號的密碼！幫這個帳號開啟
        <span className="text-violet">兩步驟驗證 (2FA)</span>
        ，讓「只有密碼」再也不夠登入。
      </p>

      {/* Step 1: enable 2FA */}
      <div className="pixel-frame-sm bg-base-2 p-3">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[13px] text-paper">帳號安全設定</span>
          <span
            className={cn(
              'border-2 border-ink px-1.5 py-0.5 text-[10px]',
              enabled ? 'bg-neon text-ink' : 'bg-danger text-paper',
            )}
          >
            2FA：{enabled ? '已開啟' : '未開啟'}
          </span>
        </div>
        {!enabled ? (
          <PixelButton
            variant="violet"
            className="w-full"
            onClick={() => {
              setEnabled(true)
              react('correct', '2FA 已開啟！現在登入除了密碼，還需要第二道動態碼。')
            }}
          >
            啟用兩步驟驗證
          </PixelButton>
        ) : (
          <p className="text-[12px] leading-relaxed text-neon">
            ✓ 已開啟。駭客只有密碼，缺少第二道碼，被擋在門外了！
          </p>
        )}
      </div>

      {/* Step 2: choose method */}
      {enabled && (
        <div className="pixel-frame-sm bg-base-2 p-3">
          <div className="mb-2 text-[12px] text-muted">選擇第二道驗證方式</div>
          <div className="grid gap-2 sm:grid-cols-2">
            <button
              onClick={() => {
                setMethod('app')
                say('好選擇！驗證器 App（TOTP）每 30 秒換一組碼，最安全。', 'happy')
              }}
              className={cn(
                'border-4 border-ink p-2 text-left text-[12px] transition-colors',
                method === 'app' ? 'bg-violet text-ink' : 'bg-panel text-paper hover:border-violet',
              )}
            >
              <div className="font-bold">📱 驗證器 App</div>
              <div className="text-[10px] opacity-80">推薦 · 最安全</div>
            </button>
            <button
              onClick={() => {
                setMethod('sms')
                say('簡訊也算 2FA，但可能被 SIM 卡盜用攻擊，安全性較低。這關我們仍可繼續。', 'think')
              }}
              className={cn(
                'border-4 border-ink p-2 text-left text-[12px] transition-colors',
                method === 'sms' ? 'bg-gold text-ink' : 'bg-panel text-paper hover:border-gold',
              )}
            >
              <div className="font-bold">✉ 簡訊 OTP</div>
              <div className="text-[10px] opacity-80">方便，但較不安全</div>
            </button>
          </div>
        </div>
      )}

      {/* Step 3: authenticator + login */}
      {enabled && method && (
        <div className="grid gap-3 sm:grid-cols-2">
          {/* authenticator widget */}
          <div className="pixel-frame-sm bg-panel-2 p-3">
            <div className="mb-1 text-[11px] text-muted">
              {method === 'app' ? '驗證器 App' : '簡訊'}目前顯示的動態碼
            </div>
            <div className="mb-2 text-center font-pixel text-4xl tracking-[0.35em] text-neon tabular-nums">
              {code}
            </div>
            <ProgressBar value={timeLeft / PERIOD} accent="violet" segments={15} />
            <div className="mt-1 text-center text-[10px] text-muted">
              {timeLeft} 秒後更新（每 30 秒換一組）
            </div>
          </div>

          {/* login prompt */}
          <div className="pixel-frame-sm bg-base-2 p-3">
            <div className="mb-2 text-[12px] text-paper">輸入動態驗證碼登入</div>
            <input
              inputMode="numeric"
              value={input}
              maxLength={6}
              onChange={(e) => setInput(e.target.value.replace(/\D/g, ''))}
              onKeyDown={(e) => e.key === 'Enter' && submit()}
              placeholder="6 位數"
              className="mb-2 w-full border-4 border-ink bg-panel px-3 py-2 text-center text-lg tracking-[0.3em] text-paper outline-none placeholder:text-muted/50 focus:border-violet"
            />
            <div className="flex gap-2">
              <PixelButton
                variant="ghost"
                size="sm"
                sound="select"
                className="shrink-0"
                onClick={() => setInput(code)}
              >
                填入目前的碼
              </PixelButton>
              <PixelButton
                variant="primary"
                className="flex-1"
                disabled={input.length !== 6 || solved}
                onClick={submit}
              >
                {solved ? '登入成功 ✓' : '驗證並登入'}
              </PixelButton>
            </div>
            <p className="mt-2 text-[10px] leading-relaxed text-muted">
              提示：真實的驗證器 App 也是這樣——碼每 30 秒更新，登入時輸入當下顯示的那一組。
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
