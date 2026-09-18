import { useEffect, useMemo, useState } from 'react'
import { useLevel } from './context'
import { PixelButton } from '../components/ui/PixelButton'
import { cn } from '../lib/cn'

interface Option {
  id: string
  text: string
  correct: boolean
  why: string
}

const OPTIONS: Option[] = [
  {
    id: 'param',
    text: '使用參數化查詢 (Prepared Statement)，把「資料」和「指令」分開',
    correct: true,
    why: '正解！資料庫會把使用者輸入只當成「資料」，永遠不會被當成 SQL 指令執行。',
  },
  {
    id: 'frontend',
    text: '只在前端用 JavaScript 檢查輸入就好',
    correct: false,
    why: '前端檢查可被輕易繞過（攻擊者直接打後端 API），後端一定要再驗證。',
  },
  {
    id: 'hideerr',
    text: '把資料庫的錯誤訊息藏起來，就安全了',
    correct: false,
    why: '隱藏錯誤只是讓攻擊者比較難除錯，漏洞本身還在，隨時會被打穿。',
  },
  {
    id: 'shortpw',
    text: '限制密碼長度最多 4 位數',
    correct: false,
    why: '跟注入完全無關，而且超短密碼更容易被暴力破解，只會更糟。',
  },
]

function isBypass(u: string, p: string): boolean {
  const s = `${u} ${p}`.toLowerCase()
  if (/'\s*or\s*'?\s*1\s*'?\s*=\s*'?\s*1/.test(s)) return true
  if (/'\s*or\s*1\s*=\s*1/.test(s)) return true
  if (/'\s*or\s*'[^']*'\s*=\s*'[^']*'/.test(s)) return true
  if (/'\s*or\s*true/.test(s)) return true
  if (/--/.test(s) && s.includes("'")) return true
  return false
}

export function InjectionLevel() {
  const { solve, react, say, solved } = useLevel()
  const [u, setU] = useState('')
  const [p, setP] = useState('')
  const [sawBypass, setSawBypass] = useState(false)
  const [selected, setSelected] = useState<string | null>(null)

  const bypass = useMemo(() => isBypass(u, p), [u, p])
  const query = `SELECT * FROM users\nWHERE name='${u}' AND pass='${p}';`

  useEffect(() => {
    if (bypass && !sawBypass) {
      setSawBypass(true)
      say('看到了嗎？輸入被當成程式碼執行，不用正確密碼就登入了！這就是 SQL Injection。', 'alert')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bypass])

  const pick = (opt: Option) => {
    setSelected(opt.id)
    if (opt.correct) {
      solve()
    } else {
      react('wrong', opt.why)
    }
  }

  return (
    <div className="space-y-4">
      <p className="text-[13px] leading-relaxed text-paper">
        這個登入頁把使用者輸入<span className="text-danger">直接拼接</span>進 SQL 查詢。
        先當一次駭客，試著<span className="text-gold">不用正確密碼就登入</span>，再選出正確的修補方式。
      </p>

      {/* vulnerable login */}
      <div className="pixel-frame-sm bg-base-2 p-3">
        <div className="mb-2 text-[12px] text-cyan">喵喵社群 · 後台登入（有漏洞版）</div>
        <div className="grid gap-2 sm:grid-cols-2">
          <input
            value={u}
            onChange={(e) => setU(e.target.value)}
            placeholder="帳號"
            spellCheck={false}
            autoComplete="off"
            className="w-full border-4 border-ink bg-panel px-3 py-2 text-sm text-paper outline-none placeholder:text-muted/60 focus:border-danger"
          />
          <input
            value={p}
            onChange={(e) => setP(e.target.value)}
            placeholder="密碼"
            spellCheck={false}
            autoComplete="off"
            className="w-full border-4 border-ink bg-panel px-3 py-2 text-sm text-paper outline-none placeholder:text-muted/60 focus:border-danger"
          />
        </div>

        <div className="mt-2 flex flex-wrap gap-2">
          <PixelButton
            variant="ghost"
            size="sm"
            onClick={() => {
              setU("' OR '1'='1")
              setP('anything')
            }}
          >
            自動填入攻擊字串
          </PixelButton>
          <PixelButton
            variant="ghost"
            size="sm"
            sound={null}
            onClick={() => {
              setU('')
              setP('')
            }}
          >
            清空
          </PixelButton>
        </div>

        <div className="mt-3">
          <div className="mb-1 text-[11px] text-muted">後端實際執行的 SQL：</div>
          <pre
            className={cn(
              'whitespace-pre-wrap break-all border-2 border-ink p-2 text-[12px] leading-relaxed',
              bypass ? 'bg-danger/20 text-danger' : 'bg-panel text-neon',
            )}
          >
            {query}
          </pre>
        </div>

        <div
          className={cn(
            'mt-2 border-4 border-ink p-2 text-center text-[13px]',
            bypass ? 'bg-danger text-paper anim-shake' : 'bg-panel text-muted',
          )}
        >
          {bypass
            ? '⚠ 登入被繞過！攻擊者沒有正確密碼也登入成功了。'
            : '登入狀態：等待輸入…（試試上面的攻擊字串）'}
        </div>
      </div>

      {/* fix */}
      {sawBypass ? (
        <div className="pixel-frame-sm bg-panel p-3">
          <h3 className="mb-2 text-[13px] text-neon">該怎麼從根本修補這個漏洞？</h3>
          <div className="space-y-2">
            {OPTIONS.map((opt) => {
              const isSel = selected === opt.id
              const showState = isSel
              return (
                <button
                  key={opt.id}
                  onClick={() => pick(opt)}
                  disabled={solved}
                  className={cn(
                    'block w-full border-4 border-ink p-2 text-left text-[12px] leading-relaxed transition-colors',
                    showState && opt.correct && 'bg-neon text-ink',
                    showState && !opt.correct && 'bg-danger/30 text-paper',
                    !showState && 'bg-base-2 text-paper hover:border-neon',
                  )}
                >
                  {opt.text}
                  {showState && (
                    <span className="mt-1 block text-[11px] opacity-90">
                      {opt.correct ? '✓ ' : '✕ '}
                      {opt.why}
                    </span>
                  )}
                </button>
              )
            })}
          </div>

          {solved && (
            <div className="mt-3">
              <div className="mb-1 text-[11px] text-muted">修好後的安全寫法：</div>
              <pre className="whitespace-pre-wrap break-all border-2 border-ink bg-panel-2 p-2 text-[12px] leading-relaxed text-neon">
                {'SELECT * FROM users\nWHERE name = ? AND pass = ?;\n-- 參數用 [帳號, 密碼] 分開傳入'}
              </pre>
            </div>
          )}
        </div>
      ) : (
        <p className="text-center text-[12px] text-gold">
          先觸發一次上面的攻擊，解鎖修補題 ↑
        </p>
      )}
    </div>
  )
}
