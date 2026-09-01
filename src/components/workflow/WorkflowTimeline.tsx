import { cn } from '@/lib/cn';
import { Badge } from '@/components/ui/Pill';
import type { WorkflowStage } from '@/domain/types';
import { WORKFLOW_META } from '@/domain/workflow';
import { useWorkspace } from '@/state/workspaceContext';
import { StepDot } from './StepDot';
import { BranchStep, StepBody } from './TimelineStep';

export function WorkflowTimeline({ onArtefact }: { onArtefact: (stepId: string) => void }) {
  const { state, dispatch } = useWorkspace();
  const completedStages = state.stages.filter((stage) => stage.status === 'complete').length;

  return (
    <section className="rounded-xl border border-border-subtle bg-surface-card px-[20px] pb-[14px] pt-[18px]">
      <header className="flex h-[24px] items-center gap-[10px]">
        <h2 className="text-[16px] font-semibold text-text-primary">Workflow</h2>
        <Badge tone="subtle">{WORKFLOW_META.type.toUpperCase()}</Badge>
        <div className="flex-1" />
        <span className="text-[11px] text-text-secondary">
          Stage {completedStages + 1} of {state.stages.length}
        </span>
        <span className="size-[3px] shrink-0 rounded-full bg-text-disabled" />
        <span className="text-[11px] text-text-muted">{WORKFLOW_META.updatedLabel}</span>
      </header>

      <div className="scrollbar-slim mt-[14px] flex overflow-x-auto pb-[8px]">
        {state.stages.map((stage, index) => {
          const nextStage = state.stages[index + 1];
          return (
            <TimelineStage
              key={stage.id}
              stage={stage}
              // The spine is green up to the stage the request has reached.
              railTone={nextStage && nextStage.status !== 'upcoming' ? 'complete' : 'neutral'}
              selectedStepId={state.selectedStepId}
              onSelectStep={(stepId) => dispatch({ type: 'step/select', stepId })}
              onArtefact={onArtefact}
            />
          );
        })}
      </div>
    </section>
  );
}

interface TimelineStageProps {
  stage: WorkflowStage;
  railTone: 'complete' | 'neutral';
  selectedStepId: string | null;
  onSelectStep: (stepId: string) => void;
  onArtefact: (stepId: string) => void;
}

function TimelineStage({ stage, railTone, selectedStepId, onSelectStep, onArtefact }: TimelineStageProps) {
  const [leadStep, ...branchSteps] = stage.steps;
  const branching = branchSteps.length > 0;

  return (
    <div className="relative flex-1 basis-0 pr-[18px] min-w-[196px]">
      {/* Horizontal spine — starts at the lead dot and runs into the next stage. */}
      <span
        aria-hidden
        className={cn(
          'absolute left-[18px] right-0 top-[36px] h-[2px] rounded-[1px]',
          railTone === 'complete' ? 'bg-success-500' : 'bg-neutral-200',
        )}
      />

      <div className="flex h-[16px] items-center gap-[6px]">
        <span className="text-[10px] font-semibold tracking-[0.8px] text-text-tertiary uppercase">
          {stage.label}
        </span>
        {branching && (
          <span className="rounded-[4px] bg-surface-sunken px-[5px] py-[2px] text-[10px] font-semibold tracking-[0.5px] text-brand-600">
            {stage.steps.length} in parallel
          </span>
        )}
      </div>

      <div className="h-[10px]" />

      <div className="relative">
        {/* Lead step: the dot sits on the spine and its content sits underneath.
            Its branch line runs from the dot centre to the next dot. */}
        <div className="relative">
          {branching && (
            <span aria-hidden className="absolute -bottom-[12px] left-[8px] top-[9px] z-0 w-[2px] bg-neutral-200" />
          )}
          <div className="relative h-[18px]">
            <StepDot status={leadStep.status} selected={selectedStepId === leadStep.id} />
          </div>
          <div className="h-[12px]" />
          <div className={cn('relative', branching && 'pl-[28px]')}>
            <StepBody
              step={leadStep}
              selected={selectedStepId === leadStep.id}
              onSelect={() => onSelectStep(leadStep.id)}
              onArtefact={() => onArtefact(leadStep.id)}
            />
          </div>
        </div>

        {branchSteps.map((step, index) => (
          <div key={step.id}>
            <div className="h-[12px]" />
            <BranchStep
              step={step}
              isLast={index === branchSteps.length - 1}
              selected={selectedStepId === step.id}
              onSelect={() => onSelectStep(step.id)}
              onArtefact={() => onArtefact(step.id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
