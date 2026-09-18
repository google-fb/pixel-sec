import { useMemo, useState } from 'react'
import { useLevel } from './context'
import { PixelButton } from '../components/ui/PixelButton'
import { cn } from '../lib/cn'

type Verdict = 'phish' | 'safe'

interface Message {
  id: string
  from: string
  address: string
  subject: string
  body: string
  link?: { text: string; real: string }
  isPhish: boolean
  reason: string
}

const MESSAGES: Message[] = [
  {
    id: 'm1',
    from: '帳號安全中心',
    address: 'security@meowmeow-support.co',
    subject: '⚠ 您的帳號將在 24 小時內停用！',
    body: '偵測到異常登入。請「立即」點擊下方連結重新驗證密碼，否則帳號將被永久刪除。',
    link: { text: '立即驗證我的帳號', real: 'http://meowmeow.co-verify.info/login' },
    isPhish: true,
    reason:
      '網域是 co-verify.info（不是官方 meowmeow.com），又用「24 小時停用」製造恐慌逼你點連結——典型釣魚。',
  },
  {
    id: 'm2',
    from: '喵喵社群',
    address: 'no-reply@meowmeow.com',
    subject: '你的每週動態摘要',
    body: '本週有 12 位朋友追蹤了你！打開 App 即可查看。（提醒：我們永遠不會用信件要求你輸入密碼）',
    isPhish: false,
    reason: '寄件網域是正確的官方 meowmeow.com，內容合理，也沒有要你點連結輸入帳密。',
  },
  {
    id: 'm3',
    from: 'MeowMeow 活動小組',
    address: 'event@meowrneow.com',
    subject: '🎉 中獎通知：免費 PIXEL 幣 5000 枚',
    body: '恭喜你被抽中！點此立刻領取限時獎勵，逾期作廢。',
    link: { text: '領取我的獎勵', real: 'http://meowrneow.com/gift' },
    isPhish: true,
    reason:
      '網域 meow-rn-eow 用「rn」假冒「m」（meowmeow）——這叫仿冒網域，加上中獎誘餌，是釣魚。',
  },
  {
    id: 'm4',
    from: '學校資訊組',
    address: 'it@school.edu.tw',
    subject: '校園 Wi-Fi 週六維護通知',
    body: '本週六 02:00–06:00 將進行網路設備維護，期間可能無法連線，造成不便敬請見諒。',
    isPhish: false,
    reason: '.edu.tw 是學校官方網域，內容單純公告，沒有要帳密、也沒有可疑連結。',
  },
  {
    id: 'm5',
    from: 'Pixel Bank 客服',
    address: 'service@pixelbank.com',
    subject: '請確認您的一筆交易',
    body: '您有一筆交易待確認。連結文字看起來正常，但把滑鼠移上去看看「實際網址」！',
    link: { text: 'https://pixelbank.com/verify', real: 'http://pixel-bank-secure.ru/login' },
    isPhish: true,
    reason:
      '連結顯示文字是官方網址，實際卻導向 pixel-bank-secure.ru（.ru）——連結文字與真實網址不符，是釣魚。',
  },
]

export function PhishingLevel() {
  const { solve, react, solved } = useLevel()
  const [choices, setChoices] = useState<Record<string, Verdict>>({})
  const [checked, setChecked] = useState(false)

  const allAnswered = MESSAGES.every((m) => choices[m.id])
  const results = useMemo(
    () =>
      MESSAGES.map((m) => ({
        id: m.id,
        correct: choices[m.id] === (m.isPhish ? 'phish' : 'safe'),
      })),
    [choices],
  )
  const correctCount = results.filter((r) => r.correct).length

  const handleSubmit = () => {
    setChecked(true)
    if (correctCount === MESSAGES.length) {
      solve()
    } else {
      react(
        'wrong',
        `答對 ${correctCount}/${MESSAGES.length}。看看被標紅的那幾封，重點在寄件網域、連結真實網址，還有它想製造的緊急感。`,
      )
    }
  }

  return (
    <div className="space-y-4">
      <p className="text-[13px] leading-relaxed text-paper">
        判斷每一封訊息是<span className="text-danger">釣魚</span>還是
        <span className="text-neon">安全</span>，全部答對就過關。
        重點看：<span className="text-cyan">寄件網域</span>、
        <span className="text-cyan">連結真實網址</span>、有沒有製造
        <span className="text-cyan">緊急感</span>。
      </p>

      <div className="space-y-3">
        {MESSAGES.map((m) => {
          const choice = choices[m.id]
          const res = results.find((r) => r.id === m.id)!
          const showResult = checked
          return (
            <div
              key={m.id}
              className={cn(
                'pixel-frame-sm bg-panel p-3',
                showResult && (res.correct ? 'border-neon' : 'border-danger anim-shake'),
              )}
            >
              <div className="mb-1 flex flex-wrap items-baseline justify-between gap-2">
                <div className="text-[13px] text-paper">
                  {m.from}{' '}
                  <span className="text-[11px] text-gold">&lt;{m.address}&gt;</span>
                </div>
                {showResult && (
                  <span
                    className={cn(
                      'border-2 border-ink px-1.5 py-0.5 text-[10px]',
                      res.correct ? 'bg-neon text-ink' : 'bg-danger text-paper',
                    )}
                  >
                    {res.correct ? '✓ 正確' : '✕ 再看一次'}
                  </span>
                )}
              </div>
              <div className="mb-1 text-[13px] text-cyan">{m.subject}</div>
              <p className="text-[12px] leading-relaxed text-muted">{m.body}</p>
              {m.link && (
                <div className="mt-2 border-2 border-ink bg-base-2 p-2 text-[11px]">
                  <span className="text-cyan underline">{m.link.text}</span>
                  <div className="mt-0.5 text-muted">
                    實際網址：<span className="text-gold">{m.link.real}</span>
                  </div>
                </div>
              )}

              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => setChoices((c) => ({ ...c, [m.id]: 'phish' }))}
                  className={cn(
                    'flex-1 border-4 border-ink px-2 py-1.5 text-[12px] transition-colors',
                    choice === 'phish' ? 'bg-danger text-paper' : 'bg-base-2 text-muted hover:text-danger',
                  )}
                >
                  🎣 釣魚
                </button>
                <button
                  onClick={() => setChoices((c) => ({ ...c, [m.id]: 'safe' }))}
                  className={cn(
                    'flex-1 border-4 border-ink px-2 py-1.5 text-[12px] transition-colors',
                    choice === 'safe' ? 'bg-neon text-ink' : 'bg-base-2 text-muted hover:text-neon',
                  )}
                >
                  ✅ 安全
                </button>
              </div>

              {showResult && (
                <p
                  className={cn(
                    'mt-2 text-[11px] leading-relaxed',
                    res.correct ? 'text-neon' : 'text-gold',
                  )}
                >
                  {m.reason}
                </p>
              )}
            </div>
          )
        })}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <PixelButton
          variant="gold"
          disabled={!allAnswered || solved}
          onClick={handleSubmit}
        >
          {solved ? '全部揪出 ✓' : '提交判斷'}
        </PixelButton>
        {!allAnswered && (
          <span className="text-[11px] text-muted">請先為每一封訊息做出判斷。</span>
        )}
        {checked && !solved && (
          <span className="text-[11px] text-cyan">
            答對 {correctCount}/{MESSAGES.length}，修正後再提交一次。
          </span>
        )}
      </div>
    </div>
  )
}
