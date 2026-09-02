import { Check } from 'lucide-react';
import { cn } from '@/lib/cn';
import type { WorkflowStage } from '@/domain/types';
import { ROLE_ACCENT } from '@/domain/workflow';
import { useWorkspace } from '@/state/workspaceContext';

export function PhaseRail({
  stages,
  viewedStageId,
  onSelect,
}: {
  stages: WorkflowStage[];
  viewedStageId: string;
  onSelect: (stageId: string) => void;
}) {
  const { state } = useWorkspace();
  const accent = ROLE_ACCENT[state.role];

  return (
    <div className="flex w-[320px] shrink-0 flex-col gap-[3px]">
      {stages.map((stage) => {
        const complete = stage.steps.filter((step) => step.status === 'complete').length;
        const viewed = stage.id === viewedStageId;
        return (
          <button
            key={stage.id}
            type="button"
            onClick={() => onSelect(stage.id)}
            className={cn(
              'flex cursor-pointer items-center gap-[12px] rounded-[10px] px-[16px] py-[9px] text-left transition-colors duration-120',
              viewed ? 'bg-surface-brand-tint' : 'hover:bg-surface-sunken',
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
              className={cn('text-[14px] font-medium', viewed ? 'text-text-primary' : 'text-text-secondary')}
            >
              {stage.label}
            </span>
            <span className="flex-1" />
            <span className={cn('text-[10px] font-medium', viewed ? 'text-brand-700' : 'text-text-tertiary')}>
              {complete} of {stage.steps.length}
            </span>
          </button>
        );
      })}
    </div>
  );
}
