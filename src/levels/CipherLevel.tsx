import { useMemo, useState } from 'react'
import { useLevel } from './context'
import { PixelButton } from '../components/ui/PixelButton'
import { cn } from '../lib/cn'

const CIPHER = 'YMJ XJHWJY KQFL NX SJTSKTC'
const ANSWER = 'NEONFOX'
const ALPHA = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

function rot(text: string, shift: number): string {
  const s = ((shift % 26) + 26) % 26
  return text.replace(/[a-z]/gi, (ch) => {
    const base = ch <= 'Z' ? 65 : 97
    return String.fromCharCode(((ch.charCodeAt(0) - base + s) % 26) + base)
  })
}

export function CipherLevel() {
  const { solve, react, solved } = useLevel()
  const [d, setD] = useState(0)
  const [guess, setGuess] = useState('')

  const decoded = useMemo(() => rot(CIPHER, -d), [d])
  const looksReadable = decoded.includes('THE') && decoded.includes('IS')

  const submit = () => {
    if (guess.trim().toUpperCase() === ANSWER) {
      solve()
    } else {
      react(
        'wrong',
        '還不對喔。先轉動位移讓訊息變成通順的英文，再把「通關密語」那個單字填進來。',
      )
    }
  }

  return (
    <div className="space-y-4">
      <p className="text-[13px] leading-relaxed text-paper">
        我們攔截到一段被<span className="text-cyan">凱撒密碼</span>加密的訊息。
        轉動下方的「位移」把它解回原文，找出訊息裡的
        <span className="text-neon">通關密語</span>並輸入。
      </p>

      {/* ciphertext */}
      <div className="pixel-frame-sm bg-base-2 p-3">
        <div className="mb-1 text-[11px] text-muted">攔截到的密文</div>
        <div className="break-all font-pixel text-lg tracking-widest text-gold">
          {CIPHER}
        </div>
      </div>

      {/* shift control */}
      <div className="pixel-frame-sm bg-base-2 p-3">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[12px] text-muted">往回位移</span>
          <span className="text-lg text-cyan">{d}</span>
        </div>
        <div className="flex items-center gap-2">
          <PixelButton
            variant="ghost"
            size="sm"
            onClick={() => setD((v) => (v + 25) % 26)}
            aria-label="位移減一"
          >
            ◀
          </PixelButton>
          <input
            type="range"
            min={0}
            max={25}
            value={d}
            onChange={(e) => setD(Number(e.target.value))}
            className="h-3 flex-1 accent-cyan"
            aria-label="凱撒位移"
          />
          <PixelButton
            variant="ghost"
            size="sm"
            onClick={() => setD((v) => (v + 1) % 26)}
            aria-label="位移加一"
          >
            ▶
          </PixelButton>
        </div>

        {/* substitution wheel */}
        <div className="mt-3 overflow-x-auto">
          <div className="flex min-w-max gap-[3px] text-center">
            {ALPHA.map((c, i) => {
              const dec = rot(c, -d)
              return (
                <div key={i} className="flex flex-col items-center">
                  <span className="w-5 border-2 border-ink bg-panel text-[10px] text-gold">
                    {c}
                  </span>
                  <span className="text-[9px] text-muted">↓</span>
                  <span className="w-5 border-2 border-ink bg-panel-2 text-[10px] text-neon">
                    {dec}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* decoded */}
      <div
        className={cn(
          'pixel-frame-sm p-3 transition-colors',
          looksReadable ? 'border-neon bg-panel-2' : 'bg-base-2',
        )}
      >
        <div className="mb-1 text-[11px] text-muted">解密結果</div>
        <div
          className={cn(
            'break-all font-pixel text-lg tracking-widest',
            looksReadable ? 'text-neon' : 'text-paper',
          )}
        >
          {decoded}
        </div>
        {looksReadable && (
          <div className="mt-1 text-[11px] text-neon">看起來通順了！通關密語是哪個字？</div>
        )}
      </div>

      {/* answer */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <input
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && submit()}
          placeholder="輸入通關密語（英文）"
          spellCheck={false}
          autoComplete="off"
          className="w-full border-4 border-ink bg-panel px-3 py-2 text-sm uppercase text-paper outline-none placeholder:text-muted/60 focus:border-cyan sm:w-56"
        />
        <PixelButton variant="primary" disabled={solved} onClick={submit}>
          {solved ? '解密成功 ✓' : '確認解密'}
        </PixelButton>
      </div>

      <div className="pixel-frame-sm bg-panel p-3 text-[11px] leading-relaxed text-muted">
        <span className="text-cyan">🔒 冷知識：</span>{' '}
        凱撒密碼只有 25 種可能，電腦一瞬間就能破。真實網路用的是 HTTPS（TLS）這類現代加密，
        看到網址列的 <span className="text-neon">https://</span> 和鎖頭，代表你和網站之間的內容被加密保護。
      </div>
    </div>
  )
}
