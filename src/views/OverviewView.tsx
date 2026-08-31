import { ActionCard } from '@/components/overview/ActionCard';
import { ActivityCard } from '@/components/overview/ActivityCard';
import { WorkflowTimeline } from '@/components/workflow/WorkflowTimeline';
import { useWorkspace } from '@/state/workspaceContext';
import { findStep } from '@/state/workspaceReducer';

export function OverviewView() {
  const { state, dispatch } = useWorkspace();

  /** Artefact chips either deep-link to their tab or open the step drawer. */
  const handleArtefact = (stepId: string) => {
    const step = findStep(state.stages, stepId);
    const target = step?.artefact?.target;
    if (target) dispatch({ type: 'tab/select', tab: target });
    else dispatch({ type: 'step/select', stepId });
  };

  return (
    <div className="flex h-full min-h-0 flex-col gap-[14px]">
      <div className="shrink-0">
        <WorkflowTimeline onArtefact={handleArtefact} />
      </div>
      <div className="flex min-h-0 flex-1 items-stretch gap-[14px]">
        <div className="min-h-0 min-w-0 flex-1">
          <ActivityCard />
        </div>
        <ActionCard />
      </div>
    </div>
  );
}
