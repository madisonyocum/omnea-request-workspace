import { useState } from 'react';
import { Badge } from '@/components/ui/Pill';
import { WORKFLOW_META } from '@/domain/workflow';
import { useWorkspace } from '@/state/workspaceContext';
import { AiHint } from './AiHint';
import { PhaseRail } from './PhaseRail';
import { ActiveStageCard } from './ActiveStageCard';
import { AlsoRunningCard } from './AlsoRunningCard';

export function WorkflowTimeline() {
  const { state } = useWorkspace();
  const currentStage = state.stages.find((stage) => stage.status === 'current') ?? state.stages[0];

  // Every phase in the rail is browsable. The view follows the live phase by
  // default, but once you click another one it stays put until you pick it
  // back up — unless the phase you were following itself just completed and
  // advanced, in which case it follows along.
  const [viewedStageId, setViewedStageId] = useState(currentStage.id);
  const [trackedCurrentId, setTrackedCurrentId] = useState(currentStage.id);
  if (currentStage.id !== trackedCurrentId) {
    if (viewedStageId === trackedCurrentId) setViewedStageId(currentStage.id);
    setTrackedCurrentId(currentStage.id);
  }
  const viewedStage = state.stages.find((stage) => stage.id === viewedStageId) ?? currentStage;

  // The focused step stays put once it's decided, so approving/declining it is
  // visible as a colour change right where you're looking. "Open <next step>"
  // in the approved state is the explicit way to move focus forward.
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const [focusedStageId, setFocusedStageId] = useState(viewedStage.id);
  if (viewedStage.id !== focusedStageId) {
    setFocusedStageId(viewedStage.id);
    setFocusedId(null);
  }

  const leadStep = viewedStage.steps.find((step) => step.id === focusedId) ?? viewedStage.steps[0];
  const branchSteps = viewedStage.steps.filter((step) => step.id !== leadStep.id);

  const currentIndex = state.stages.findIndex((stage) => stage.id === currentStage.id);
  const phaseLabel = `Phase ${currentIndex + 1} of ${state.stages.length} · ${currentStage.label}`;

  return (
    <section className="rounded-xl border border-border-subtle bg-surface-card px-[22px] pb-[22px] pt-[18px]">
      <header className="flex h-[24px] items-center gap-[12px]">
        <h2 className="text-[15px] font-medium text-text-primary">Workflow</h2>
        <Badge tone="subtle" size="sm">{WORKFLOW_META.type.toUpperCase()}</Badge>
        <span className="text-[12px] text-text-secondary">{phaseLabel}</span>
        <div className="flex-1" />
        <span className="text-[12px] text-text-tertiary">{WORKFLOW_META.updatedLabel}</span>
      </header>

      <div className="mt-[20px] flex items-stretch gap-[28px]">
        <div className="flex w-[320px] shrink-0 flex-col">
          <PhaseRail stages={state.stages} viewedStageId={viewedStage.id} onSelect={setViewedStageId} />
          <AiHint stage={viewedStage} />
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-[12px]">
          <ActiveStageCard stage={viewedStage} step={leadStep} onFocusStep={setFocusedId} />
          <AlsoRunningCard steps={branchSteps} onFocusStep={setFocusedId} />
        </div>
      </div>
    </section>
  );
}
