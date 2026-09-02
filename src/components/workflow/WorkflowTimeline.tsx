import { useState } from 'react';
import { Badge } from '@/components/ui/Pill';
import { WORKFLOW_META } from '@/domain/workflow';
import { useWorkspace } from '@/state/workspaceContext';
import { PhaseRail } from './PhaseRail';
import { ActiveStageCard } from './ActiveStageCard';
import { AlsoRunningCard } from './AlsoRunningCard';

export function WorkflowTimeline() {
  const { state } = useWorkspace();
  const currentStage = state.stages.find((stage) => stage.status === 'current') ?? state.stages[0];

  // The focused step stays put once it's decided, so approving/declining it is
  // visible as a colour change right where you're looking. "Open <next step>"
  // in the approved state is the explicit way to move focus forward.
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const [focusedStageId, setFocusedStageId] = useState(currentStage.id);
  if (currentStage.id !== focusedStageId) {
    setFocusedStageId(currentStage.id);
    setFocusedId(null);
  }

  const leadStep = currentStage.steps.find((step) => step.id === focusedId) ?? currentStage.steps[0];
  const branchSteps = currentStage.steps.filter((step) => step.id !== leadStep.id);

  return (
    <section className="rounded-xl border border-border-subtle bg-surface-card px-[22px] pb-[22px] pt-[18px]">
      <header className="flex h-[24px] items-center gap-[12px]">
        <h2 className="text-[15px] font-medium text-text-primary">Workflow</h2>
        <Badge tone="subtle" size="sm">{WORKFLOW_META.type.toUpperCase()}</Badge>
        <div className="flex-1" />
        <span className="text-[12px] text-text-secondary">{WORKFLOW_META.stageLabel}</span>
        <span className="text-[12px] text-text-disabled">·</span>
        <span className="text-[12px] text-text-tertiary">{WORKFLOW_META.updatedLabel}</span>
      </header>

      <div className="mt-[20px] flex items-start gap-[28px]">
        <PhaseRail stages={state.stages} />
        <div className="flex min-w-0 flex-1 flex-col gap-[12px]">
          <ActiveStageCard stage={currentStage} step={leadStep} onFocusStep={setFocusedId} />
          <AlsoRunningCard steps={branchSteps} />
        </div>
      </div>
    </section>
  );
}
