import { useState } from 'react';
import { BellRing, Check, Paperclip } from 'lucide-react';
import { cn } from '@/lib/cn';
import { Button } from '@/components/ui/Button';
import { DotPill } from '@/components/ui/Pill';
import { Modal } from '@/components/ui/Modal';
import { Avatar } from '@/components/ui/Avatar';
import { person } from '@/domain/people';
import { useWorkspace } from '@/state/workspaceContext';
import { runningSteps } from '@/state/selectors';

export function ActionCard() {
  const { state } = useWorkspace();
  return (
    <div className="flex h-full min-h-0 w-[304px] shrink-0">
      {state.pendingAction ? <PendingActionCard /> : <ActionCompleteCard />}
    </div>
  );
}

function PendingActionCard() {
  const { state, dispatch } = useWorkspace();
  const [declineOpen, setDeclineOpen] = useState(false);
  const action = state.pendingAction!;

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

        <div className="mt-auto flex shrink-0 flex-col gap-[8px]">
          <div className="flex items-start gap-[8px]">
            <Button size="md" className="flex-1" onClick={() => dispatch({ type: 'action/approve' })}>
              Approve
            </Button>
            <Button size="md" className="flex-1" onClick={() => setDeclineOpen(true)}>
              Decline
            </Button>
          </div>
          <Button
            size="md"
            variant="primary"
            className="w-full"
            onClick={() => dispatch({ type: 'step/remind', stepId: action.stepId })}
          >
            Send reminder
          </Button>
        </div>
      </div>

      {declineOpen && <DeclineModal onClose={() => setDeclineOpen(false)} />}
    </section>
  );
}

/** Shown once the signed-in user has actioned their approval. */
function ActionCompleteCard() {
  const { state, dispatch } = useWorkspace();
  const outcome = state.actionOutcome;
  const blocking = runningSteps(state.stages);
  const nextStep = blocking[0];

  return (
    <section className="flex h-full min-h-0 w-full flex-col overflow-hidden rounded-lg border border-border-card bg-surface-card">
      <div className="flex shrink-0 flex-col items-start gap-[6px] px-[16px] pt-[14px]">
        {outcome === 'declined' ? (
          <DotPill tone="danger">Declined</DotPill>
        ) : (
          <DotPill tone="success">{outcome === 'approved' ? 'Approved by you' : 'Nothing waiting on you'}</DotPill>
        )}
        <h2 className="text-[15px] font-semibold leading-[1.3] text-text-primary">
          {outcome === 'declined'
            ? 'Budget approval returned to the requester'
            : outcome === 'approved'
              ? 'You approved the budget for FY26'
              : 'No action needed from you'}
        </h2>
        <p className="text-[12px] text-text-muted">
          {outcome ? 'Recorded 6 Jun, 12:34 · added to the audit trail' : 'You will be notified if that changes.'}
        </p>
        <div className="mt-[6px] h-px w-full bg-border-subtle" />
      </div>

      <div className="scrollbar-slim flex min-h-0 flex-1 flex-col gap-[12px] overflow-y-auto px-[16px] pb-[14px] pt-[12px]">
        <span className="text-[10px] font-semibold tracking-[0.8px] text-text-muted uppercase">Next up</span>
        {nextStep ? (
          <>
            <div className="flex items-center gap-[9px]">
              <Avatar person={person(nextStep.assigneeId)} size="md" />
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-[12px] font-semibold text-text-primary">{nextStep.name}</span>
                <span className="truncate text-[11px] text-text-muted">
                  {person(nextStep.assigneeId).name} · {nextStep.caption ?? 'in progress'}
                </span>
              </div>
            </div>
            <Button
              size="md"
              className="w-full shrink-0"
              icon={<BellRing className="size-[14px]" strokeWidth={1.8} />}
              onClick={() => dispatch({ type: 'step/remind', stepId: nextStep.id })}
            >
              Send reminder
            </Button>
          </>
        ) : (
          <>
            <p className="text-[12px] leading-[1.45] text-text-secondary">
              Stage 3 is clear. Security, legal and finance review start automatically.
            </p>
            <Button
              size="md"
              className="w-full shrink-0"
              onClick={() => dispatch({ type: 'tab/select', tab: 'submissions' })}
            >
              Review submissions
            </Button>
          </>
        )}
      </div>
    </section>
  );
}

function DeclineModal({ onClose }: { onClose: () => void }) {
  const { dispatch } = useWorkspace();
  const [reason, setReason] = useState('');
  const canSubmit = reason.trim().length > 3;

  return (
    <Modal
      title="Decline budget approval"
      description="The request returns to Ben Williams with your reason. Stage 3 stays open."
      onClose={onClose}
      footer={
        <>
          <Button size="md" onClick={onClose}>
            Cancel
          </Button>
          <Button
            size="md"
            variant="primary"
            disabled={!canSubmit}
            onClick={() => {
              dispatch({ type: 'action/decline', reason: reason.trim() });
              onClose();
            }}
          >
            Decline and return
          </Button>
        </>
      }
    >
      <label className="flex flex-col gap-[8px] pb-[6px]">
        <span className="text-[12px] font-semibold text-text-primary">Reason for declining</span>
        <textarea
          autoFocus
          rows={4}
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          placeholder="e.g. Spend exceeds the remaining FY26 marketing envelope"
          className="resize-none rounded-sm border border-border-default bg-surface-subtle px-[14px] py-[11px] text-[13px] leading-[1.5] text-text-primary outline-none transition-colors duration-150 placeholder:text-text-muted focus:border-brand-300 focus:bg-surface-card"
        />
        <span className="text-[11px] text-text-muted">Shared with the requester and posted to the activity feed.</span>
      </label>
    </Modal>
  );
}
