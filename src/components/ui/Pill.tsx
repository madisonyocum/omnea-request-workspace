import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

export type PillTone = 'neutral' | 'muted' | 'subtle' | 'brand' | 'success' | 'warning' | 'danger';

const TONES: Record<PillTone, string> = {
  neutral: 'bg-surface-sunken text-text-secondary',
  muted: 'bg-surface-sunken text-text-tertiary',
  subtle: 'bg-surface-subtle text-text-secondary',
  brand: 'bg-surface-sunken text-brand-600',
  success: 'bg-success-50 text-success-700',
  warning: 'bg-warning-100 text-warning-700',
  danger: 'bg-danger-100 text-danger-700',
};

/** Uppercase badge — "HIGH RISK", "NEW PURCHASE", "RESOLVED". */
export function Badge({
  tone = 'neutral',
  size = 'md',
  children,
  className,
}: {
  tone?: PillTone;
  size?: 'md' | 'sm';
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center rounded-[6px] font-medium whitespace-nowrap',
        size === 'md' ? 'px-[8px] py-[2.5px] text-[10px] tracking-[0.5px]' : 'px-[7px] py-[2px] text-[9px]',
        TONES[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

/** Small 10px pill used inside the timeline — "3d in stage", "2d overdue". */
export function StatusPill({
  tone = 'neutral',
  children,
}: {
  tone?: PillTone;
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center rounded-[5px] px-[6px] py-[2px] text-[10px] font-medium tracking-[0.5px] whitespace-nowrap',
        TONES[tone],
      )}
    >
      {children}
    </span>
  );
}

/** Rounded 12px pill with a leading dot — "Due in 2 days", "Submitted". */
export function DotPill({
  tone = 'neutral',
  dot = true,
  children,
}: {
  tone?: PillTone;
  dot?: boolean;
  children: ReactNode;
}) {
  const dotColour =
    tone === 'success'
      ? 'bg-success-500'
      : tone === 'warning'
        ? 'bg-warning-500'
        : tone === 'danger'
          ? 'bg-danger-500'
          : 'bg-text-muted';

  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center gap-[6px] rounded-full pl-[9px] pr-[10px] py-[4px] text-[12px] font-medium whitespace-nowrap',
        TONES[tone],
      )}
    >
      {dot && <span className={cn('size-[5px] shrink-0 rounded-full', dotColour)} />}
      {children}
    </span>
  );
}

/** Table cell tag — "SOC2", "Contract". */
export function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex shrink-0 items-center rounded-xs bg-surface-sunken px-[9px] py-[3px] text-[12px] font-medium text-text-tertiary whitespace-nowrap">
      {children}
    </span>
  );
}

/** Count chip beside a tab label. */
export function CountChip({ children, active }: { children: ReactNode; active?: boolean }) {
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center rounded-[6px] px-[6px] py-px text-[10px] font-medium tracking-[0.5px]',
        active ? 'bg-surface-sunken text-text-primary' : 'bg-surface-sunken text-text-tertiary',
      )}
    >
      {children}
    </span>
  );
}
