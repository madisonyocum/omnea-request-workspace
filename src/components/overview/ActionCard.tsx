import { Check, Paperclip } from 'lucide-react';
import { cn } from '@/lib/cn';
import { Button } from '@/components/ui/Button';
import { DotPill } from '@/components/ui/Pill';
import { useWorkspace } from '@/state/workspaceContext';

export function ActionCard() {
  return (
    <div className="flex h-full min-h-0 w-[304px] shrink-0">
      <PendingActionCard />
    </div>
  );
}

function PendingActionCard() {
  const { state, dispatch } = useWorkspace();
  const action = state.pendingAction;

  return (
    <section className="flex h-full min-h-0 w-full flex-col overflow-hidden rounded-lg border border-border-card bg-surface-card">
      <div className="flex shrink-0 flex-col items-start gap-[6px] px-[16px] pt-[14px]">
        <DotPill tone="warning">{action.duePill}</DotPill>
        <h2 className="text-[15px] font-semibold leading-[1.3] text-text-primary">{action.title}</h2>
        <p className="text-[12px] text-text-muted">{action.subtitle}</p>
        <div className="mt-[6px] h-px w-full bg-border-subtle" />
      </div>

      <div className="scrollbar-slim flex min-h-0 flex-1 flex-col gap-[12px] overflow-y-auto px-[16px] pb-[14px] pt-[12px]">
        <div className="flex flex-col gap-[8px]">
          {action.checklist.map((item) => (
            <div key={item.id} className="flex items-start gap-[8px]">
              {item.state === 'done' ? (
                <span className="mt-[1px] flex size-[16px] shrink-0 items-center justify-center rounded-full bg-success-500">
                  <Check className="size-[9px] text-white" strokeWidth={3.4} />
                </span>
              ) : (
                <span className="mt-[1px] size-[16px] shrink-0 rounded-full border-2 border-warning-400 bg-surface-card" />
              )}
              <span
                className={cn(
                  'flex-1 text-[12px] font-medium leading-[1.35]',
                  item.state === 'done' ? 'text-text-secondary' : 'text-warning-600',
                )}
              >
                {item.label}
              </span>
            </div>
          ))}
        </div>

        <div className="h-px w-full bg-border-subtle" />

        <div className="flex flex-col gap-[8px]">
          {action.attachments.map((file) => (
            <button
              key={file}
              type="button"
              onClick={() => dispatch({ type: 'toast/show', message: `Opening ${file}` })}
              className="group flex cursor-pointer items-center gap-[7px] text-left"
            >
              <Paperclip className="size-[14px] shrink-0 text-text-tertiary" strokeWidth={1.7} />
              <span className="text-[12px] font-medium text-text-secondary group-hover:text-brand-700 group-hover:underline">
                {file}
              </span>
            </button>
          ))}
        </div>

        <Button
          size="md"
          variant="primary"
          className="mt-auto w-full shrink-0"
          onClick={() => dispatch({ type: 'step/remind', stepId: action.stepId })}
        >
          Send reminder
        </Button>
      </div>
    </section>
  );
}
