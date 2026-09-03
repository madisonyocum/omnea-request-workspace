import { Ban, Check, X } from 'lucide-react';
import { cn } from '@/lib/cn';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { person } from '@/domain/people';
import { ROLE_ALSO_RUNNING } from '@/domain/workflow';
import type { WorkflowStep } from '@/domain/types';
import { useWorkspace } from '@/state/workspaceContext';

export function AlsoRunningCard({
  steps,
  onFocusStep,
}: {
  steps: WorkflowStep[];
  onFocusStep: (stepId: string) => void;
}) {
  const { state } = useWorkspace();
  const content = ROLE_ALSO_RUNNING[state.role];


  if (steps.length === 0) return null;

  return (
    <div className="flex w-full flex-col overflow-hidden rounded-[14px] border border-border-default bg-surface-card">
      <div className="flex items-center gap-[9px] px-[22px] pb-[12px] pt-[14px]">
        <span className="text-[10px] font-medium tracking-[0.8px] text-text-tertiary">{content.heading}</span>
        <span className="flex-1" />
        <span className="text-[9px] font-medium text-text-tertiary">{steps.length} stages</span>
      </div>

      {steps.map((step, index) => {
        const assignee = person(step.assigneeId);
        const isComplete = step.status === 'complete';
        const isDeclined = step.status === 'declined';
        const isCancelled = step.status === 'cancelled';
        const resolved = isComplete || isDeclined || isCancelled;
        return (
          <div
            key={step.id}
            role="button"
            tabIndex={0}
            aria-label={`Open ${step.name}`}
            onClick={() => onFocusStep(step.id)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                onFocusStep(step.id);
              }
            }}
            // Each line lands a beat after the one above it, so the card builds
            // downwards rather than appearing all at once.
            style={{ animationDelay: `${60 + index * 45}ms` }}
            className={cn(
              // The hover fill fades both ways rather than snapping on and off.
              'animate-swap-in flex cursor-pointer flex-col gap-[7px] border-t border-border-subtle bg-surface-subtle/0 px-[22px] pb-[14px] pt-[13px] transition-[background-color,transform] duration-300 ease-out hover:bg-surface-subtle/100 active:scale-[0.995]',
              resolved && 'opacity-70',
            )}
          >
            <div className="flex items-center gap-[12px]">
              {isComplete ? (
                <span className="flex size-[16px] shrink-0 items-center justify-center rounded-full bg-success-500">
                  <Check className="size-[9px] text-white" strokeWidth={3.4} />
                </span>
              ) : isDeclined ? (
                <span className="flex size-[16px] shrink-0 items-center justify-center rounded-full bg-danger-500">
                  <X className="size-[9px] text-white" strokeWidth={3.4} />
                </span>
              ) : isCancelled ? (
                <span className="flex size-[16px] shrink-0 items-center justify-center rounded-full bg-border-strong">
                  <Ban className="size-[9px] text-white" strokeWidth={3} />
                </span>
              ) : (
                <span
                  className={cn(
                    'size-[8px] shrink-0 rounded-full',
                    step.lineStatus?.tone === 'danger' ? 'bg-danger-500' : 'bg-text-disabled',
                  )}
                />
              )}
              <span className="text-[12px] font-medium text-text-primary">{step.name}</span>
              <Avatar person={assignee} size="sm" />
              <span className="text-[12px] font-medium text-text-secondary">{assignee.name}</span>
              <span className="flex-1" />
              {resolved ? (
                <span
                  className={cn(
                    'text-[9px] font-medium',
                    isComplete ? 'text-success-700' : isDeclined ? 'text-danger-600' : 'text-text-tertiary',
                  )}
                >
                  {isComplete ? 'Approved' : isDeclined ? 'Declined' : 'Cancelled'}
                </span>
              ) : (
                step.lineStatus && (
                  <span
                    className={cn(
                      'text-[9px] font-medium',
                      step.lineStatus.tone === 'danger' ? 'text-danger-600' : 'text-text-tertiary',
                    )}
                  >
                    {step.lineStatus.label}
                  </span>
                )
              )}
              <Button
                size="sm"
                onClick={(event) => {
                  event.stopPropagation();
                  onFocusStep(step.id);
                }}
              >
                {resolved || content.viewOnly ? 'View' : step.actions?.includes('reassign') ? 'Reassign' : 'Nudge'}
              </Button>
            </div>
            {!resolved && step.lineMeta && (
              <p className="pl-[20px] text-[10px] text-text-tertiary">{step.lineMeta}</p>
            )}
          </div>
        );
      })}
    </div>
  );
}
