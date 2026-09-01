import { ArrowRight, Bell, Check, Clock, FileText, X } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/cn';
import { Avatar } from '@/components/ui/Avatar';
import { StatusPill } from '@/components/ui/Pill';
import { person } from '@/domain/people';
import type { StepMetaIcon, WorkflowStep } from '@/domain/types';
import { StepDot } from './StepDot';
import { ArtefactChip } from './ArtefactChip';

const META_ICONS: Record<StepMetaIcon, LucideIcon> = {
  doc: FileText,
  bell: Bell,
  clock: Clock,
  arrow: ArrowRight,
  check: Check,
  x: X,
};

interface StepBodyProps {
  step: WorkflowStep;
  selected: boolean;
  onSelect: () => void;
  onArtefact: () => void;
}

/**
 * The text block of a step. The hover/selected highlight is painted by an
 * absolutely positioned layer so it can bleed past the text without changing
 * the column layout the spine depends on.
 */
export function StepBody({ step, selected, onSelect, onArtefact }: StepBodyProps) {
  const assignee = person(step.assigneeId);
  const MetaIcon = step.meta ? META_ICONS[step.meta.icon] : null;
  const overdue = step.status === 'overdue' || step.status === 'declined';

  return (
    <div className="group relative w-full">
      <span
        aria-hidden
        className={cn(
          'pointer-events-none absolute -inset-x-[8px] -inset-y-[6px] rounded-md transition-colors duration-150',
          selected ? 'bg-surface-brand-subtle' : 'group-hover:bg-surface-subtle',
        )}
      />
      <button
        type="button"
        onClick={onSelect}
        aria-pressed={selected}
        className="relative flex w-full cursor-pointer flex-col items-start gap-[4px] text-left"
      >
        <span className="w-full text-[12px] font-medium text-text-secondary">{step.name}</span>

        <span className="flex items-center gap-[7px]">
          <Avatar person={assignee} size="sm" />
          <span className="text-[12px] font-semibold text-text-primary">{assignee.name}</span>
        </span>

        {(step.caption || step.pill) && (
          <span className="flex w-full items-center gap-[6px]">
            {step.caption && (
              <span className={cn('text-[11px]', overdue ? 'text-danger-700' : 'text-text-muted')}>
                {step.caption}
              </span>
            )}
            {step.pill && <StatusPill tone={step.pill.tone}>{step.pill.label}</StatusPill>}
          </span>
        )}

        {step.meta && MetaIcon && (
          <span className="flex w-full items-center gap-[5px]">
            <MetaIcon
              className={cn(
                'size-[13px] shrink-0',
                step.meta.icon === 'check'
                  ? 'text-success-500'
                  : step.meta.icon === 'x'
                    ? 'text-danger-500'
                    : step.meta.tone === 'warning'
                      ? 'text-warning-500'
                      : 'text-text-tertiary',
              )}
              strokeWidth={1.6}
            />
            <span
              className={cn(
                'min-w-0 flex-1 truncate text-[11px]',
                step.meta.tone === 'warning' ? 'text-warning-600' : 'text-text-tertiary',
              )}
            >
              {step.meta.label}
            </span>
          </span>
        )}
      </button>

      {step.artefact && (
        <div className="relative mt-[4px] flex">
          <ArtefactChip label={step.artefact.label} onClick={onArtefact} className="max-w-full" />
        </div>
      )}
    </div>
  );
}

interface BranchStepProps extends StepBodyProps {
  isLast: boolean;
}

/** A parallel step rendered beside its dot, joined by the vertical branch line. */
export function BranchStep({ isLast, ...bodyProps }: BranchStepProps) {
  return (
    <div className="flex w-full">
      <div className="relative w-[18px] shrink-0">
        <span className="absolute left-[8px] top-0 z-0 h-[9px] w-[2px] bg-neutral-200" />
        {!isLast && <span className="absolute -bottom-[12px] left-[8px] top-[9px] z-0 w-[2px] bg-neutral-200" />}
        <StepDot status={bodyProps.step.status} selected={bodyProps.selected} />
      </div>
      <div className="min-w-0 flex-1 pl-[10px]">
        <StepBody {...bodyProps} />
      </div>
    </div>
  );
}
