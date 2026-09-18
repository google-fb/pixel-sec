import { useEffect, type ReactNode } from 'react'
import { cn } from '../../lib/cn'

interface PixelModalProps {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
  className?: string
}

export function PixelModal({
  open,
  onClose,
  title,
  children,
  className,
}: PixelModalProps) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <button
        aria-label="close"
        className="absolute inset-0 cursor-default bg-black/75"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cn(
          'pixel-frame relative z-10 max-h-[88vh] w-full max-w-md overflow-hidden bg-panel',
          className,
        )}
      >
        <div className="flex items-center justify-between border-b-4 border-ink bg-panel-2 px-4 py-2">
          <h2 className="text-sm text-gold">{title}</h2>
          <button
            onClick={onClose}
            aria-label="close"
            className="border-2 border-ink bg-danger px-2 py-0.5 text-xs text-paper hover:brightness-110"
          >
            X
          </button>
        </div>
        <div className="max-h-[76vh] overflow-y-auto p-4">{children}</div>
      </div>
    </div>
  )
}
