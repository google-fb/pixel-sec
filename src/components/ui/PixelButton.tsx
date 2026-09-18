import type { ButtonHTMLAttributes } from 'react'
import { cn } from '../../lib/cn'
import { useSfx } from '../../lib/sfx'

type Variant =
  | 'primary'
  | 'accent'
  | 'gold'
  | 'violet'
  | 'danger'
  | 'ghost'
  | 'dark'

type Size = 'sm' | 'md' | 'lg'

interface PixelButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  sound?: 'click' | 'select' | null
}

const variantClass: Record<Variant, string> = {
  primary: 'bg-neon text-ink',
  accent: 'bg-cyan text-ink',
  gold: 'bg-gold text-ink',
  violet: 'bg-violet text-ink',
  danger: 'bg-danger text-paper',
  ghost: 'bg-panel-2 text-paper',
  dark: 'bg-base-2 text-paper',
}

const sizeClass: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-[11px]',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-6 py-3 text-base',
}

export function PixelButton({
  variant = 'primary',
  size = 'md',
  sound = 'click',
  className,
  onClick,
  children,
  ...rest
}: PixelButtonProps) {
  const sfx = useSfx()
  return (
    <button
      {...rest}
      onClick={(e) => {
        if (sound) sfx[sound]()
        onClick?.(e)
      }}
      className={cn(
        'relative inline-flex select-none items-center justify-center gap-2',
        'border-4 border-ink font-pixel leading-none',
        'shadow-[0_5px_0_0_#000] transition-[transform,box-shadow,filter] duration-75',
        'hover:brightness-110 active:translate-y-[5px] active:shadow-[0_0_0_0_#000]',
        'disabled:cursor-not-allowed disabled:opacity-40 disabled:active:translate-y-0 disabled:active:shadow-[0_5px_0_0_#000]',
        variantClass[variant],
        sizeClass[size],
        className,
      )}
    >
      {children}
    </button>
  )
}
