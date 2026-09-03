import { useState } from 'react';
import { AI_HINTS, fillHint } from '@/domain/aiHints';
import { person } from '@/domain/people';
import type { WorkflowStage } from '@/domain/types';
import { useWorkspace } from '@/state/workspaceContext';

/** Exact path from the Figma export of `icon/sparkle` (12×12). */
function Sparkle() {
  return (
    <svg viewBox="0 0 12 12" className="size-[12px] shrink-0" aria-hidden="true">
      <path
        d="M6 0C6.54 3.72 8.28 5.46 12 6C8.28 6.54 6.54 8.28 6 12C5.46 8.28 3.72 6.54 0 6C3.72 5.46 5.46 3.72 6 0Z"
        fill="var(--color-accent-violet)"
      />
    </svg>
  );
}

/**
 * Contextual AI suggestion sitting beneath the phase rail. Copy comes from the
 * role × phase table, and the names in it resolve against the phase's own open
 * step, so browsing the rail rewrites the hint as well as the timeline.
 */
export function AiHint({ stage }: { stage: WorkflowStage }) {
  const { state, dispatch } = useWorkspace();
  const [expanded, setExpanded] = useState(false);

  const copy = AI_HINTS[state.role][stage.id];
  if (!copy) return null;

  // The step this phase is actually sitting on, falling back to its lead line.
  const openStep = stage.steps.find((step) => step.status !== 'complete') ?? stage.steps[0];
  const tokens = { step: openStep.name, owner: person(openStep.assigneeId).name };

  const runCta = () => {
    if (copy.cta.kind === 'remind') dispatch({ type: 'step/remind', stepId: openStep.id });
    if (copy.cta.kind === 'tab') dispatch({ type: 'tab/select', tab: copy.cta.tab });
    setExpanded(false);
  };

  return (
    <div className="mt-[18px] flex w-full flex-col gap-[6px] overflow-clip rounded-sm border border-border-default bg-surface-canvas p-[10px]">
      <div className="flex items-center gap-[5px]">
        <Sparkle />
        <span className="text-[11px] font-medium tracking-[0.4px] text-brand-700">OMNEA AI</span>
      </div>

      <p className="text-[12px] leading-[16px] text-text-secondary">
        {expanded ? fillHint(copy.detail, tokens) : fillHint(copy.hint, tokens)}
      </p>

      {expanded ? (
        <div className="flex items-center gap-[12px]">
          <button
            type="button"
            onClick={runCta}
            className="cursor-pointer text-[12px] font-medium text-brand-700 transition-colors duration-120 hover:text-brand-600"
          >
            {fillHint(copy.cta.label, tokens)}
          </button>
          <button
            type="button"
            onClick={() => setExpanded(false)}
            className="cursor-pointer text-[12px] font-medium text-text-muted transition-colors duration-120 hover:text-text-secondary"
          >
            Not now
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="w-fit cursor-pointer text-[12px] font-medium text-brand-700 transition-colors duration-120 hover:text-brand-600"
        >
          {copy.action}
        </button>
      )}
    </div>
  );
}
