import type { ReactNode } from 'react';
import { BellRing, ExternalLink, Paperclip, UserPlus } from 'lucide-react';
import { Drawer } from '@/components/ui/Drawer';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { DotPill } from '@/components/ui/Pill';
import { Menu } from '@/components/ui/Menu';
import { PEOPLE, person } from '@/domain/people';
import type { StepStatus, TabId, WorkflowStage, WorkflowStep } from '@/domain/types';
import { useWorkspace } from '@/state/workspaceContext';
import { findStageForStep, findStep } from '@/state/workspaceReducer';

const STATUS_LABEL: Record<StepStatus, { label: string; tone: 'success' | 'warning' | 'danger' | 'neutral' }> = {
  complete: { label: 'Complete', tone: 'success' },
  active: { label: 'In progress', tone: 'warning' },
  overdue: { label: 'Overdue', tone: 'danger' },
  declined: { label: 'Declined', tone: 'danger' },
  waiting: { label: 'Waiting on earlier stage', tone: 'neutral' },
  upcoming: { label: 'Not started', tone: 'neutral' },
};

const REASSIGN_CANDIDATES = ['devon', 'curtis', 'anna', 'john'];

export function StepDrawer({ onOpenTab }: { onOpenTab: (tab: TabId) => void }) {
  const { state, dispatch } = useWorkspace();
  if (!state.selectedStepId) return null;

  const step = findStep(state.stages, state.selectedStepId);
  const stage = findStageForStep(state.stages, state.selectedStepId);
  if (!step || !stage) return null;

  return <StepDrawerBody step={step} stage={stage} onOpenTab={onOpenTab} onClose={() => dispatch({ type: 'step/close' })} />;
}

interface StepDrawerBodyProps {
  step: WorkflowStep;
  stage: WorkflowStage;
  onOpenTab: (tab: TabId) => void;
  onClose: () => void;
}

function StepDrawerBody({ step, stage, onOpenTab, onClose }: StepDrawerBodyProps) {
  const { dispatch } = useWorkspace();
  const assignee = person(step.assigneeId);
  const status = STATUS_LABEL[step.status];
  const actions = step.actions ?? [];

  return (
    <Drawer
      title={step.name}
      eyebrow={`${stage.label} · ${stage.steps.length > 1 ? 'parallel step' : 'single step'}`}
      onClose={onClose}
      subtitle={
        <div className="flex items-center gap-[8px] pt-[2px]">
          <DotPill tone={status.tone}>{status.label}</DotPill>
          <span className="text-[11px] text-text-muted">{step.detail.slaLabel}</span>
        </div>
      }
      footer={
        <>
          {actions.includes('remind') && (
            <Button
              size="md"
              icon={<BellRing className="size-[14px]" strokeWidth={1.8} />}
              onClick={() => dispatch({ type: 'step/remind', stepId: step.id })}
            >
              Send reminder
            </Button>
          )}
          {actions.includes('reassign') && (
            <Menu
              align="start"
              width={190}
              items={REASSIGN_CANDIDATES.map((id) => ({
                id,
                label: PEOPLE[id].name,
                onSelect: () => dispatch({ type: 'step/reassign', stepId: step.id, assigneeId: id }),
              }))}
            >
              {({ toggle }) => (
                <Button size="md" icon={<UserPlus className="size-[14px]" strokeWidth={1.8} />} onClick={toggle}>
                  Reassign
                </Button>
              )}
            </Menu>
          )}
          <div className="flex-1" />
          {step.artefact?.target ? (
            <Button
              size="md"
              variant="primary"
              icon={<ExternalLink className="size-[14px]" strokeWidth={2} />}
              onClick={() => {
                onOpenTab(step.artefact!.target!);
                onClose();
              }}
            >
              Open {step.artefact.label.toLowerCase()}
            </Button>
          ) : (
            <Button size="md" variant="primary" onClick={onClose}>
              Done
            </Button>
          )}
        </>
      }
    >
      <div className="flex flex-col gap-[20px]">
        <Field label="Assignee">
          <div className="flex items-center gap-[9px]">
            <Avatar person={assignee} size="md" />
            <div className="flex flex-col">
              <span className="text-[13px] font-semibold text-text-primary">{assignee.name}</span>
              <span className="text-[11px] text-text-muted">{assignee.jobTitle}</span>
            </div>
          </div>
        </Field>

        <Field label="What happens here">
          <p className="text-[13px] leading-[1.55] text-text-secondary">{step.detail.summary}</p>
        </Field>

        <Field label="History">
          {step.detail.history.length === 0 ? (
            <p className="text-[12px] text-text-muted">Nothing has happened on this step yet.</p>
          ) : (
            <ol className="flex flex-col">
              {step.detail.history.map((event, index) => (
                <li key={`${event.at}-${event.label}`} className="flex gap-[10px]">
                  <div className="relative flex w-[8px] shrink-0 justify-center">
                    {index < step.detail.history.length - 1 && (
                      <span className="absolute top-[10px] h-full w-[1.5px] bg-border-default" />
                    )}
                    <span className="relative mt-[5px] size-[7px] shrink-0 rounded-full bg-border-strong" />
                  </div>
                  <div className="flex flex-col gap-[2px] pb-[14px]">
                    <span className="text-[12px] font-medium text-text-secondary">{event.label}</span>
                    <span className="text-[11px] text-text-muted">
                      {event.at}
                      {event.actor && ` · ${event.actor}`}
                    </span>
                  </div>
                </li>
              ))}
            </ol>
          )}
        </Field>

        {step.detail.attachments.length > 0 && (
          <Field label="Attachments">
            <div className="flex flex-col gap-[6px]">
              {step.detail.attachments.map((file) => (
                <button
                  key={file.name}
                  type="button"
                  onClick={() => dispatch({ type: 'toast/show', message: `Opening ${file.name}` })}
                  className="flex cursor-pointer items-center gap-[8px] rounded-sm border border-border-default bg-surface-subtle px-[10px] py-[8px] text-left transition-colors duration-120 hover:border-border-strong hover:bg-surface-sunken"
                >
                  <Paperclip className="size-[13px] shrink-0 text-text-tertiary" strokeWidth={1.7} />
                  <span className="min-w-0 flex-1 truncate text-[12px] font-medium text-text-secondary">
                    {file.name}
                  </span>
                  <span className="shrink-0 text-[11px] text-text-muted">{file.size}</span>
                </button>
              ))}
            </div>
          </Field>
        )}
      </div>
    </Drawer>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-[8px]">
      <span className="text-[10px] font-semibold tracking-[0.8px] text-text-muted uppercase">{label}</span>
      {children}
    </div>
  );
}
