import { Check } from 'lucide-react';
import { cn } from '@/lib/cn';
import type { WorkflowStage } from '@/domain/types';

export function PhaseRail({ stages }: { stages: WorkflowStage[] }) {
  return (
    <div className="flex w-[224px] shrink-0 flex-col">
      {stages.map((stage) => {
        const complete = stage.steps.filter((step) => step.status === 'complete').length;
        return (
          <div
            key={stage.id}
            className={cn(
              'flex items-center gap-[10px] rounded-[10px] px-[12px] py-[11px]',
              stage.status === 'current' && 'bg-surface-brand-tint',
            )}
          >
            {stage.status === 'complete' ? (
              <Check className="size-[14px] shrink-0 text-success-500" strokeWidth={2.4} />
            ) : (
              <span
                className={cn(
                  'size-[8px] shrink-0 rounded-full',
                  stage.status === 'current' ? 'bg-brand-600' : 'bg-text-disabled',
                )}
              />
            )}
            <span
              className={cn(
                'text-[12px] font-medium',
                stage.status === 'current' ? 'text-text-primary' : 'text-text-secondary',
              )}
            >
              {stage.label}
            </span>
            <span className="flex-1" />
            <span
              className={cn(
                'text-[9px] font-medium',
                stage.status === 'current' ? 'text-brand-700' : 'text-text-tertiary',
              )}
            >
              {complete} of {stage.steps.length}
            </span>
          </div>
        );
      })}
    </div>
  );
}
