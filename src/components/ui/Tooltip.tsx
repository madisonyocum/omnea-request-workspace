import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

type Side = 'top' | 'right' | 'bottom';

const POSITION: Record<Side, string> = {
  top: 'bottom-full left-1/2 -translate-x-1/2 mb-[8px]',
  right: 'left-full top-1/2 -translate-y-1/2 ml-[10px]',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-[8px]',
};

/** Hover/focus tooltip. Delay is handled with a CSS transition to keep it cheap. */
export function Tooltip({
  label,
  side = 'top',
  children,
  className,
}: {
  label: ReactNode;
  side?: Side;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span className={cn('group/tt relative inline-flex', className)}>
      {children}
      <span
        role="tooltip"
        className={cn(
          'pointer-events-none absolute z-50 rounded-[7px] bg-text-primary px-[8px] py-[5px] text-[11px] font-medium whitespace-nowrap text-white opacity-0 shadow-popover transition-opacity duration-150 group-hover/tt:opacity-100 group-focus-visible/tt:opacity-100',
          POSITION[side],
        )}
      >
        {label}
      </span>
    </span>
  );
}
