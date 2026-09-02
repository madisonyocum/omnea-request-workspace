import { AlertTriangle, ChevronRight, MoreHorizontal, Paperclip } from 'lucide-react';
import { cn } from '@/lib/cn';
import { Button } from '@/components/ui/Button';
import { DotPill } from '@/components/ui/Pill';
import { Menu } from '@/components/ui/Menu';
import { PEOPLE, person } from '@/domain/people';
import { ROLE_ACCENT, ROLE_ACTIVE_CARD, ROLE_VIEWER_ID } from '@/domain/workflow';
import type { WorkflowStage, WorkflowStep } from '@/domain/types';
import { useWorkspace } from '@/state/workspaceContext';

const REASSIGN_CANDIDATES = ['devon', 'curtis', 'anna', 'john'];

export function ActiveStageCard({ stage, step }: { stage: WorkflowStage; step: WorkflowStep }) {
  const { state, dispatch } = useWorkspace();
  const content = ROLE_ACTIVE_CARD[state.role];
  const meta = person(content.meta.personId);
  const files = step.detail.attachments;
  const visibleFiles = files.slice(0, 2);
  const moreFiles = files.length - visibleFiles.length;

  const isComplete = step.status === 'complete';
  const isDeclined = step.status === 'declined';

  const runAction = (kind: (typeof content.actions)[number]['kind']) => {
    switch (kind) {
      case 'remind':
        dispatch({ type: 'step/remind', stepId: step.id });
        return;
      case 'approve':
      case 'override':
        dispatch({ type: 'step/decide', stepId: step.id, decision: kind });
        return;
      case 'decline':
        dispatch({ type: 'step/decide', stepId: step.id, decision: 'decline' });
        return;
      case 'reopen':
        dispatch({ type: 'step/reopen', stepId: step.id });
        return;
    }
  };

  const actions =
    isComplete
      ? []
      : isDeclined && state.role === 'approver'
        ? [{ label: 'Reopen for decision', variant: 'secondary' as const, kind: 'reopen' as const }]
        : content.actions;

  const pillTone = isComplete ? 'success' : isDeclined ? 'danger' : 'warning';
  const pillLabel = isComplete ? 'Approved' : isDeclined ? 'Declined' : content.duePill;
  const railTone = isComplete ? 'bg-success-500' : isDeclined ? 'bg-danger-500' : ROLE_ACCENT[state.role].rail;
  const actorName = person(ROLE_VIEWER_ID[state.role]).name;
  const body = isComplete
    ? `${actorName} approved this step.`
    : isDeclined
      ? `${actorName} declined this step. Reopen it if this needs another look.`
      : content.body;

  return (
    <div className="flex w-full overflow-hidden rounded-[14px] border border-border-default bg-surface-card">
      <div className={cn('w-[4px] shrink-0', railTone)} />
      <div className="flex flex-1 flex-col gap-[16px] px-[22px] py-[20px]">
        <div className="flex flex-col gap-[8px]">
          <div className="flex items-center gap-[12px]">
            <h3 className="text-[15px] font-medium text-text-primary">{step.name}</h3>
            <DotPill tone={pillTone}>{pillLabel}</DotPill>
            <span className="flex-1" />
            <span className="text-[10px] font-medium tracking-[0.8px] text-text-tertiary">
              {content.contextLabel}
            </span>
          </div>
          <p className="text-[13px] text-text-secondary">{body}</p>
        </div>

        <div className="flex items-center gap-[10px]">
          <span className="flex size-[24px] shrink-0 items-center justify-center rounded-full bg-warning-500">
            <span className="text-[9px] font-bold text-white">{meta.initials}</span>
          </span>
          <span className="text-[12px] font-medium text-text-primary">{meta.name}</span>
          <span className="text-[12px] text-text-disabled">·</span>
          <span className="text-[9px] font-medium text-text-tertiary">{content.meta.caption}</span>
          <span className="flex-1" />
          {visibleFiles.length > 0 && (
            <div className="flex items-center gap-[8px]">
              {visibleFiles.map((file) => (
                <span
                  key={file.name}
                  className="inline-flex items-center gap-[7px] rounded-[8px] border border-border-default bg-surface-card py-[6px] pl-[9px] pr-[11px]"
                >
                  <Paperclip className="size-[13px] shrink-0 text-text-tertiary" strokeWidth={1.6} />
                  <span className="text-[9px] font-medium text-text-secondary">{file.name}</span>
                </span>
              ))}
              {moreFiles > 0 && (
                <span className="rounded-[8px] bg-surface-subtle px-[9px] py-[6px] text-[9px] font-medium text-text-tertiary">
                  +{moreFiles}
                </span>
              )}
            </div>
          )}
        </div>

        {stage.blocker && (
          <div className="flex w-[45%] shrink-0 items-center gap-[9px] self-start rounded-[10px] bg-danger-100 py-[10px] pl-[12px] pr-[14px]">
            <AlertTriangle className="size-[14px] shrink-0 text-danger-700" strokeWidth={2} />
            <span className="min-w-0 flex-1 text-[12px] font-medium text-danger-700">{stage.blocker.message}</span>
            <button
              type="button"
              onClick={() => dispatch({ type: 'toast/show', message: 'Opening open risks' })}
              className="shrink-0 cursor-pointer text-[12px] font-medium whitespace-nowrap text-danger-700 hover:underline"
            >
              {stage.blocker.linkLabel}
            </button>
          </div>
        )}

        {content.policyBanner && (
          <div className="flex w-[45%] shrink-0 items-center gap-[9px] self-start rounded-[10px] bg-surface-subtle py-[10px] pl-[12px] pr-[14px]">
            <span className="min-w-0 flex-1 text-[12px] font-medium text-text-secondary">
              {content.policyBanner.message}
            </span>
            <button
              type="button"
              onClick={() => dispatch({ type: 'toast/show', message: 'Opening rule editor' })}
              className="shrink-0 cursor-pointer text-[12px] font-medium whitespace-nowrap text-text-secondary hover:underline"
            >
              {content.policyBanner.linkLabel}
            </button>
          </div>
        )}

        <div className="flex w-full items-center gap-[10px]">
          {actions.map((action) =>
            action.kind === 'reassign' ? (
              <Menu
                key={action.kind}
                align="start"
                width={190}
                items={REASSIGN_CANDIDATES.map((id) => ({
                  id,
                  label: PEOPLE[id].name,
                  onSelect: () => dispatch({ type: 'step/reassign', stepId: step.id, assigneeId: id }),
                }))}
              >
                {({ toggle }) => (
                  <Button size="md" variant={action.variant === 'dark' ? 'dark' : 'secondary'} onClick={toggle}>
                    {action.label}
                  </Button>
                )}
              </Menu>
            ) : (
              <Button
                key={action.kind}
                size="md"
                variant={action.variant === 'dark' ? 'dark' : 'secondary'}
                onClick={() => runAction(action.kind)}
              >
                {action.label}
              </Button>
            ),
          )}

          <Menu
            align="start"
            width={170}
            items={[
              { id: 'copy', label: 'Copy link to step', onSelect: () => dispatch({ type: 'toast/show', message: 'Link copied' }) },
              { id: 'escalate', label: 'Escalate', onSelect: () => dispatch({ type: 'toast/show', message: 'Escalated to workflow admins' }) },
            ]}
          >
            {({ open, toggle }) => (
              <button
                type="button"
                onClick={toggle}
                className={cn(
                  'flex size-[38px] shrink-0 cursor-pointer items-center justify-center rounded-[9px] border border-border-default text-text-tertiary transition-colors duration-120 hover:bg-surface-subtle',
                  open && 'bg-surface-subtle',
                )}
              >
                <MoreHorizontal className="size-[15px]" strokeWidth={2} />
              </button>
            )}
          </Menu>

          <span className="flex-1" />

          <button
            type="button"
            onClick={() => dispatch({ type: 'step/select', stepId: step.id })}
            className="flex cursor-pointer items-center gap-[5px] text-[12px] font-medium text-brand-700 hover:underline"
          >
            {content.linkLabel}
            <ChevronRight className="size-[12px]" strokeWidth={2} />
          </button>
        </div>
      </div>
    </div>
  );
}
