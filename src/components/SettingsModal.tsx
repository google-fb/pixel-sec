import { useState } from 'react'
import { useGame } from '../store/gameStore'
import { PixelModal } from './ui/PixelModal'
import { PixelToggle } from './ui/PixelToggle'
import { PixelButton } from './ui/PixelButton'

interface SettingsModalProps {
  open: boolean
  onClose: () => void
}

export function SettingsModal({ open, onClose }: SettingsModalProps) {
  const settings = useGame((s) => s.settings)
  const setHintMode = useGame((s) => s.setHintMode)
  const setSound = useGame((s) => s.setSound)
  const setScanlines = useGame((s) => s.setScanlines)
  const resetProgress = useGame((s) => s.resetProgress)
  const [confirmReset, setConfirmReset] = useState(false)

  return (
    <PixelModal open={open} onClose={onClose} title="設定">
      <div className="divide-y-2 divide-line/40">
        <PixelToggle
          label="提示模式"
          description="開啟後，關卡中會出現「請求提示」按鈕，位元君會一步步給你線索。"
          checked={settings.hintMode}
          onChange={setHintMode}
        />
        <PixelToggle
          label="音效"
          description="按鍵、答對、答錯等復古音效。"
          checked={settings.sound}
          onChange={setSound}
        />
        <PixelToggle
          label="掃描線特效"
          description="復古 CRT 螢幕掃描線濾鏡（會影響效能時可關閉）。"
          checked={settings.scanlines}
          onChange={setScanlines}
        />
      </div>

      <div className="mt-4 border-t-4 border-ink pt-4">
        <p className="mb-2 text-[11px] text-muted">危險區域</p>
        {!confirmReset ? (
          <PixelButton
            variant="ghost"
            size="sm"
            className="w-full"
            onClick={() => setConfirmReset(true)}
          >
            重置遊戲進度
          </PixelButton>
        ) : (
          <div className="pixel-frame-sm bg-base-2 p-3">
            <p className="mb-2 text-[12px] text-danger">
              確定要清除所有關卡進度與星星嗎？此動作無法復原。
            </p>
            <div className="flex gap-2">
              <PixelButton
                variant="danger"
                size="sm"
                className="flex-1"
                onClick={() => {
                  resetProgress()
                  setConfirmReset(false)
                  onClose()
                }}
              >
                確定重置
              </PixelButton>
              <PixelButton
                variant="ghost"
                size="sm"
                className="flex-1"
                onClick={() => setConfirmReset(false)}
              >
                取消
              </PixelButton>
            </div>
          </div>
        )}
      </div>

      <p className="mt-4 text-center text-[10px] leading-relaxed text-muted">
        資安小特工：像素任務 · 邊玩邊學網頁與 App 安全
      </p>
    </PixelModal>
  )
}
