import { ActivityCard } from '@/components/overview/ActivityCard';
import { WorkflowTimeline } from '@/components/workflow/WorkflowTimeline';

export function OverviewView() {
  return (
    <div className="scrollbar-slim flex h-full min-h-0 flex-col gap-[14px] overflow-y-auto pb-[2px] pr-[2px]">
      <WorkflowTimeline />
      <ActivityCard />
    </div>
  );
}
