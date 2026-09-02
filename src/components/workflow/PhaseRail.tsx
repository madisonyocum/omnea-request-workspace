import { Check } from 'lucide-react';
import { cn } from '@/lib/cn';
import type { WorkflowStage } from '@/domain/types';
import { ROLE_ACCENT } from '@/domain/workflow';
import { useWorkspace } from '@/state/workspaceContext';

export function PhaseRail({ stages }: { stages: WorkflowStage[] }) {
  const { state } = useWorkspace();
  const accent = ROLE_ACCENT[state.role];

  return (
    <div className="flex w-[320px] shrink-0 flex-col gap-[4px]">
      {stages.map((stage) => {
        const complete = stage.steps.filter((step) => step.status === 'complete').length;
        return (
          <div
            key={stage.id}
            className={cn(
              'flex items-center gap-[12px] rounded-[12px] px-[16px] py-[14px]',
              stage.status === 'current' && accent.tint,
            )}
          >
            {stage.status === 'complete' ? (
              <Check className="size-[16px] shrink-0 text-success-500" strokeWidth={2.4} />
            ) : (
              <span
                className={cn(
                  'size-[9px] shrink-0 rounded-full',
                  stage.status === 'current' ? accent.dot : 'bg-text-disabled',
                )}
              />
            )}
            <span
              className={cn(
                'text-[14px] font-medium',
                stage.status === 'current' ? 'text-text-primary' : 'text-text-secondary',
              )}
            >
              {stage.label}
            </span>
            <span className="flex-1" />
            <span
              className={cn(
                'text-[10px] font-medium',
                stage.status === 'current' ? accent.text : 'text-text-tertiary',
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
