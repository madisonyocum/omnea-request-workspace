import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/cn';

type Variant = 'primary' | 'secondary' | 'ghost';
type Size = 'sm' | 'md';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
  children?: ReactNode;
}

const BASE =
  'inline-flex shrink-0 items-center justify-center gap-[6px] whitespace-nowrap transition-colors duration-120 disabled:cursor-not-allowed disabled:opacity-55';

const SIZES: Record<Size, string> = {
  sm: 'rounded-sm px-[12px] py-[7px] text-[12px] font-medium',
  md: 'rounded-md px-[20px] py-[10px] text-[13px] font-semibold',
};

const VARIANTS: Record<Variant, string> = {
  primary:
    'bg-brand-600 text-white shadow-brand hover:bg-brand-700 active:bg-brand-700 disabled:hover:bg-brand-600',
  secondary:
    'border border-border-strong bg-surface-card text-text-secondary hover:bg-surface-subtle active:bg-surface-sunken',
  ghost: 'text-text-tertiary hover:bg-surface-sunken hover:text-text-secondary',
};

export function Button({ variant = 'secondary', size = 'sm', icon, children, className, ...rest }: ButtonProps) {
  return (
    <button type="button" className={cn(BASE, SIZES[size], VARIANTS[variant], className)} {...rest}>
      {icon}
      {children}
    </button>
  );
}

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  children: ReactNode;
}

export function IconButton({ label, children, className, ...rest }: IconButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-sm border border-border-strong bg-surface-card px-[12px] py-[7px] text-text-tertiary transition-colors duration-120 hover:bg-surface-subtle hover:text-text-secondary',
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
