import { cn } from '../../lib/cn'
import { useSfx } from '../../lib/sfx'

interface PixelToggleProps {
  checked: boolean
  onChange: (v: boolean) => void
  label: string
  description?: string
}

export function PixelToggle({
  checked,
  onChange,
  label,
  description,
}: PixelToggleProps) {
  const sfx = useSfx()
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4 py-2">
      <span className="flex-1">
        <span className="block text-[13px] text-paper">{label}</span>
        {description && (
          <span className="mt-0.5 block text-[11px] leading-snug text-muted">
            {description}
          </span>
        )}
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => {
          sfx.select()
          onChange(!checked)
        }}
        className={cn(
          'relative h-8 w-16 shrink-0 border-4 border-ink transition-colors',
          checked ? 'bg-neon' : 'bg-line/50',
        )}
      >
        <span
          className={cn(
            'absolute top-0 h-6 w-6 border-2 border-ink bg-paper transition-[left] duration-100',
            checked ? 'left-8' : 'left-0',
          )}
        />
        <span
          className={cn(
            'absolute top-1.5 text-[9px] font-bold',
            checked ? 'left-1.5 text-ink' : 'right-1.5 text-paper',
          )}
        >
          {checked ? 'ON' : 'OFF'}
        </span>
      </button>
    </label>
  )
}
