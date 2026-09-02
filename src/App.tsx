import { useState } from 'react';
import { AppRail } from '@/components/chrome/AppRail';
import { RequestHeader } from '@/components/chrome/RequestHeader';
import { StatStrip } from '@/components/chrome/StatStrip';
import { TabBar } from '@/components/chrome/TabBar';
import { OnboardingModal } from '@/components/onboarding/OnboardingModal';
import { ToastStack } from '@/components/ui/ToastStack';
import { StepDrawer } from '@/components/workflow/StepDrawer';
import { DocumentsView } from '@/views/DocumentsView';
import { IntakeView } from '@/views/IntakeView';
import { OverviewView } from '@/views/OverviewView';
import { SubmissionsView } from '@/views/SubmissionsView';
import { TasksView } from '@/views/TasksView';
import { WorkspaceProvider } from '@/state/WorkspaceProvider';
import { useWorkspace } from '@/state/workspaceContext';

export default function App() {
  return (
    <WorkspaceProvider>
      <RequestWorkspace />
    </WorkspaceProvider>
  );
}

/**
 * Viewport-locked shell: the rail, request chrome and tab bar never move.
 * Everything below the tab bar fills the remaining height and scrolls inside
 * its own panes rather than moving the page.
 */
function RequestWorkspace() {
  const { dispatch } = useWorkspace();
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [showRoleHint, setShowRoleHint] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-surface-canvas">
      {showOnboarding && (
        <OnboardingModal
          onClose={() => {
            setShowOnboarding(false);
            setShowRoleHint(true);
          }}
        />
      )}
      <AppRail />

      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <div className="z-30 shrink-0 border-b border-border-default bg-surface-card">
          <RequestHeader showRoleHint={showRoleHint} onDismissRoleHint={() => setShowRoleHint(false)} />
          <StatStrip />
          <TabBar />
        </div>

        <main className="min-h-0 min-w-0 flex-1 overflow-hidden px-[24px] py-[14px]">
          <div className="h-full min-h-0">
            <ActiveView />
          </div>
        </main>
      </div>

      <StepDrawer onOpenTab={(tab) => dispatch({ type: 'tab/select', tab })} />
      <ToastStack />
    </div>
  );
}

function ActiveView() {
  const { state } = useWorkspace();

  switch (state.activeTab) {
    case 'overview':
      return <OverviewView />;
    case 'tasks':
      return <TasksView />;
    case 'intake':
      return <IntakeView />;
    case 'submissions':
      return <SubmissionsView />;
    case 'documents':
      return <DocumentsView />;
    default:
      return null;
  }
}
