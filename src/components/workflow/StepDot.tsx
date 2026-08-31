import { Check, X } from 'lucide-react';
import { cn } from '@/lib/cn';
import type { StepStatus } from '@/domain/types';

/**
 * 18px status marker that sits on the workflow spine.
 * Complete/declined are filled with a glyph; in-flight steps are rings.
 */
export function StepDot({ status, selected }: { status: StepStatus; selected?: boolean }) {
  const ring = status === 'active' ? 'border-brand-600' : status === 'overdue' ? 'border-danger-500' : null;

  return (
    <span
      className={cn(
        'relative z-10 flex size-[18px] shrink-0 items-center justify-center rounded-full transition-shadow duration-150',
        status === 'complete' && 'bg-success-500',
        status === 'declined' && 'bg-danger-500',
        ring && cn('border-[2.4px] bg-surface-card', ring),
        (status === 'waiting' || status === 'upcoming') && 'border-[1.5px] border-border-strong bg-surface-card',
        selected && 'ring-[3px] ring-brand-600/25',
      )}
    >
      {status === 'complete' && <Check className="size-[10px] text-white" strokeWidth={3.4} />}
      {status === 'declined' && <X className="size-[10px] text-white" strokeWidth={3.4} />}
      {ring && (
        <span
          className={cn('size-[6px] rounded-full', status === 'active' ? 'bg-brand-600' : 'bg-danger-500')}
        />
      )}
    </span>
  );
}
