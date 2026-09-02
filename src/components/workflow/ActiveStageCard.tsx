import { AlertTriangle, Bell, Check, ChevronRight, MoreHorizontal, Paperclip } from 'lucide-react';
import { cn } from '@/lib/cn';
import { Button } from '@/components/ui/Button';
import { DotPill } from '@/components/ui/Pill';
import { Menu } from '@/components/ui/Menu';
import { PEOPLE, person } from '@/domain/people';
import {
  genericActiveCardContent,
  genericApprovedContent,
  ROLE_ACCENT,
  ROLE_ACTIVE_CARD,
  ROLE_APPROVED_CARD,
  roleViewerId,
} from '@/domain/workflow';
import type { WorkflowStage, WorkflowStep } from '@/domain/types';
import { useWorkspace } from '@/state/workspaceContext';

const REASSIGN_CANDIDATES = ['devon', 'curtis', 'anna', 'john'];

export function ActiveStageCard({
  stage,
  step,
  onFocusStep,
}: {
  stage: WorkflowStage;
  step: WorkflowStep;
  onFocusStep: (stepId: string) => void;
}) {
  const { state, dispatch } = useWorkspace();
  const content = ROLE_ACTIVE_CARD[stage.id]?.[state.role] ?? genericActiveCardContent(step, stage);
  const files = step.detail.attachments;
  const visibleFiles = files.slice(0, 2);
  const moreFiles = files.length - visibleFiles.length;

  const isComplete = step.status === 'complete';
  const isDeclined = step.status === 'declined';
  const isPreview = stage.status !== 'current' && !isComplete && !isDeclined;
  const nextStep = stage.steps.find((candidate) => candidate.id !== step.id && candidate.status !== 'complete');

  const runAction = (kind: 'remind' | 'reassign' | 'approve' | 'decline' | 'override' | 'reopen') => {
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

  if (isComplete) {
    const approved = ROLE_APPROVED_CARD[stage.id]?.[state.role] ?? genericApprovedContent(step);
    const approvedAt = step.detail.history[step.detail.history.length - 1]?.at ?? 'just now';
    const format = (template: string) =>
      template
        .replaceAll('{next}', nextStep?.name ?? 'the next step')
        .replaceAll('{nextAssignee}', nextStep ? person(nextStep.assigneeId).name : 'the team')
        .replaceAll('{nextCritical}', nextStep?.status === 'overdue' ? ' — overdue' : '')
        .replaceAll('{time}', approvedAt);

    const assignee = person(step.assigneeId);
    const viewerIsAssignee = roleViewerId(state.role, state.stages) === step.assigneeId;
    const escalation =
      approved.escalation && nextStep?.status === 'overdue' ? { ...approved.escalation, message: format(approved.escalation.message) } : undefined;

    return (
      <div className="flex w-full flex-1 rounded-[14px] border border-border-default bg-surface-card">
        <div className="w-[4px] shrink-0 rounded-l-[14px] bg-success-500" />
        <div className="flex flex-1 flex-col gap-[16px] px-[22px] py-[20px]">
          <div className="flex flex-col gap-[8px]">
            <div className="flex items-center gap-[12px]">
              <h3 className="text-[15px] font-medium text-text-primary">{step.name}</h3>
              <DotPill tone="success">Approved</DotPill>
              <span className="flex-1" />
              <span className="text-[10px] font-medium tracking-[0.8px] text-text-tertiary">{content.contextLabel}</span>
            </div>
            <p className="text-[13px] text-text-secondary">{format(approved.body)}</p>
          </div>

          <div className="flex items-center gap-[10px]">
            <span className="flex size-[24px] shrink-0 items-center justify-center rounded-full bg-success-500">
              <Check className="size-[11px] text-white" strokeWidth={3} />
            </span>
            <span className="text-[12px] font-medium text-text-primary">{viewerIsAssignee ? 'You' : assignee.name}</span>
            <span className="text-[12px] text-text-disabled">·</span>
            <span className="text-[9px] font-medium text-text-tertiary">
              Approved {approvedAt} · {approved.metaCaption}
            </span>
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

          <div className="flex w-full items-center gap-[9px] rounded-[10px] bg-success-50 py-[10px] pl-[12px] pr-[14px]">
            <Check className="size-[14px] shrink-0 text-success-700" strokeWidth={2.4} />
            <span className="min-w-0 flex-1 text-[12px] font-medium text-success-700">{format(approved.banner.message)}</span>
            <button
              type="button"
              onClick={() => dispatch({ type: 'step/select', stepId: step.id })}
              className="shrink-0 cursor-pointer text-[12px] font-medium whitespace-nowrap text-success-700 hover:underline"
            >
              {approved.banner.linkLabel}
            </button>
          </div>

          {escalation && (
            <div className="flex w-full items-center gap-[9px] rounded-[10px] bg-danger-100 py-[10px] pl-[12px] pr-[14px]">
              <AlertTriangle className="size-[14px] shrink-0 text-danger-700" strokeWidth={2} />
              <span className="min-w-0 flex-1 text-[12px] font-medium text-danger-700">{escalation.message}</span>
              <button
                type="button"
                onClick={() => nextStep && onFocusStep(nextStep.id)}
                className="shrink-0 cursor-pointer text-[12px] font-medium whitespace-nowrap text-danger-700 hover:underline"
              >
                {escalation.linkLabel}
              </button>
            </div>
          )}

          <div className="flex w-full items-center gap-[10px]">
            {approved.primaryKind === 'open-next' && nextStep && (
              <Button size="md" variant="dark" onClick={() => onFocusStep(nextStep.id)}>
                {format(approved.primaryLabel ?? 'Open next step')}
              </Button>
            )}
            {approved.primaryKind === 'back-to-queue' && (
              <Button size="md" variant="dark" onClick={() => dispatch({ type: 'tab/select', tab: 'tasks' })}>
                {approved.primaryLabel}
              </Button>
            )}
            <Button size="md" variant="secondary" onClick={() => dispatch({ type: 'step/select', stepId: step.id })}>
              {approved.secondaryLabel}
            </Button>
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

  const meta = person(content.meta.personId);
  const actions =
    isDeclined && state.role === 'approver'
      ? [{ label: 'Reopen for decision', variant: 'secondary' as const, kind: 'reopen' as const }]
      : isPreview
        ? []
        : content.actions;
  const pillTone = isDeclined ? 'danger' : isPreview ? 'muted' : 'warning';
  const pillLabel = isDeclined ? 'Declined' : content.duePill;
  const railTone = isDeclined ? 'bg-danger-500' : isPreview ? 'bg-border-strong' : ROLE_ACCENT[state.role].rail;
  const actorName = person(roleViewerId(state.role, state.stages)).name;
  const body = isDeclined ? `${actorName} declined this step. Reopen it if this needs another look.` : content.body;

  return (
    <div className="flex w-full flex-1 rounded-[14px] border border-border-default bg-surface-card">
      <div className={cn('w-[4px] shrink-0 rounded-l-[14px]', railTone)} />
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
          <span
            className={cn(
              'flex size-[24px] shrink-0 items-center justify-center rounded-full',
              isPreview ? 'bg-text-disabled' : 'bg-warning-500',
            )}
          >
            <span className="text-[9px] font-bold text-white">{meta.initials}</span>
          </span>
          <span className="text-[12px] font-medium text-text-primary">{meta.name}</span>
          <span className="text-[12px] text-text-disabled">·</span>
          <span className="text-[9px] font-medium text-text-tertiary">{content.meta.caption}</span>
          {step.meta?.icon === 'bell' && (
            <span className="inline-flex items-center gap-[5px] rounded-[7px] bg-warning-50 py-[4px] pl-[7px] pr-[9px]">
              <Bell className="size-[11px] shrink-0 text-warning-600" strokeWidth={1.8} />
              <span className="text-[9px] font-medium text-warning-700">{step.meta.label}</span>
            </span>
          )}
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
          <div className="flex w-full items-center gap-[9px] rounded-[10px] bg-danger-100 py-[10px] pl-[12px] pr-[14px]">
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
          <div className="flex w-full items-center gap-[9px] rounded-[10px] bg-surface-subtle py-[10px] pl-[12px] pr-[14px]">
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
