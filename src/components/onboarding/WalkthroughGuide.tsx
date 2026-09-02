import { useEffect, useRef, useState } from 'react';
import { ArrowRight, X } from 'lucide-react';
import { cn } from '@/lib/cn';
import { Button } from '@/components/ui/Button';
import { ROLE_ACCENT, ROLE_LABEL } from '@/domain/workflow';
import type { UserRole } from '@/domain/types';
import { useWorkspace } from '@/state/workspaceContext';

interface TourStep {
  role: UserRole;
  title: string;
  body: string;
  /** Manual steps show a "Next" button; others wait for the real action and advance on their own. */
  advance: 'manual' | 'auto';
  nextLabel?: string;
}

const STEPS: TourStep[] = [
  {
    role: 'requester',
    title: "You're the requester",
    body: 'Alex is waiting on Martha Nelson for manager approval. This is all a requester can do here: nudge, or hand it to someone else.',
    advance: 'manual',
    nextLabel: 'Next: become the approver',
  },
  {
    role: 'approver',
    title: "Now you're the approver",
    body: 'Martha has one decision to make. Click Approve request (or Decline) in the card above to move the tour forward.',
    advance: 'auto',
  },
  {
    role: 'admin',
    title: "Finally, you're the admin",
    body: 'Admins see every line at once and can override, reassign, or audit any of them. Try Override & advance on Budget approval, or just finish up.',
    advance: 'manual',
    nextLabel: 'Finish tour',
  },
];

export function WalkthroughGuide({ active, onExit }: { active: boolean; onExit: () => void }) {
  const { state, dispatch } = useWorkspace();
  const [stepIndex, setStepIndex] = useState(0);
  const [wasActive, setWasActive] = useState(active);

  if (active !== wasActive) {
    setWasActive(active);
    if (active) {
      setStepIndex(0);
      dispatch({ type: 'role/select', role: STEPS[0].role });
    }
  }

  const managerApproval = state.stages.find((stage) => stage.id === 'stage-3')?.steps[0];
  const managerStatusRef = useRef(managerApproval?.status);

  useEffect(() => {
    const prev = managerStatusRef.current;
    managerStatusRef.current = managerApproval?.status;
    if (!active || stepIndex !== 1 || !managerApproval) return;
    const decided = managerApproval.status === 'complete' || managerApproval.status === 'declined';
    if (decided && prev !== managerApproval.status) {
      dispatch({ type: 'role/select', role: STEPS[2].role });
      setStepIndex(2);
    }
  }, [active, stepIndex, managerApproval, dispatch]);

  if (!active) return null;

  const step = STEPS[stepIndex];
  const accent = ROLE_ACCENT[step.role];

  const handleNext = () => {
    if (stepIndex === STEPS.length - 1) {
      onExit();
      return;
    }
    const next = stepIndex + 1;
    dispatch({ type: 'role/select', role: STEPS[next].role });
    setStepIndex(next);
  };

  return (
    <div className="animate-slide-up fixed bottom-[20px] right-[20px] z-50 flex w-[340px] flex-col gap-[14px] rounded-[14px] border border-border-default bg-surface-card p-[18px] shadow-popover">
      <div className="flex items-start gap-[10px]">
        <span className={cn('mt-[3px] flex size-[8px] shrink-0 rounded-full', accent.dot)} />
        <div className="flex min-w-0 flex-1 flex-col gap-[2px]">
          <span className="text-[10px] font-medium tracking-[0.8px] text-text-tertiary uppercase">
            Step {stepIndex + 1} of {STEPS.length} · {ROLE_LABEL[step.role]}
          </span>
          <h3 className="text-[13px] font-medium text-text-primary">{step.title}</h3>
        </div>
        <button
          type="button"
          aria-label="Skip tour"
          onClick={onExit}
          className="-mr-[2px] -mt-[2px] flex size-[22px] shrink-0 cursor-pointer items-center justify-center rounded-sm text-text-muted transition-colors duration-120 hover:bg-surface-sunken hover:text-text-secondary"
        >
          <X className="size-[13px]" strokeWidth={2} />
        </button>
      </div>

      <p className="text-[12px] leading-[1.5] text-text-secondary">{step.body}</p>

      <div className="flex items-center gap-[8px]">
        {step.advance === 'manual' ? (
          <Button size="sm" variant="primary" className="flex-1" icon={<ArrowRight className="size-[13px]" strokeWidth={2} />} onClick={handleNext}>
            {step.nextLabel}
          </Button>
        ) : (
          <span className="flex-1 text-[11px] italic text-text-muted">Waiting for your decision above…</span>
        )}
        <button
          type="button"
          onClick={onExit}
          className="cursor-pointer text-[11px] font-medium text-text-muted hover:text-text-secondary"
        >
          Skip tour
        </button>
      </div>
    </div>
  );
}
