import { useState } from 'react';
import { Check, Flag } from 'lucide-react';
import { cn } from '@/lib/cn';
import { flagAnchorId } from '@/lib/flagAnchor';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Pill';
import { Modal } from '@/components/ui/Modal';
import { Avatar } from '@/components/ui/Avatar';
import { person } from '@/domain/people';
import type { AnswerFlag } from '@/domain/types';

/**
 * The issues raised against one answer, rendered under it. Open flags read as a
 * warning callout; resolved ones stay on the record in a muted state.
 */
export function AnswerFlags({
  flags,
  onResolve,
  onReopen,
}: {
  flags: AnswerFlag[];
  onResolve: (flagId: string) => void;
  onReopen: (flagId: string) => void;
}) {
  if (flags.length === 0) return null;

  return (
    <div className="flex flex-col gap-[8px]">
      {flags.map((flag) => {
        const author = person(flag.raisedById);
        return (
          <div
            key={flag.id}
            className={cn(
              'flex flex-col gap-[8px] rounded-sm border px-[14px] py-[11px]',
              flag.resolved
                ? 'border-border-default bg-surface-subtle'
                : 'border-warning-400/40 bg-warning-50',
            )}
          >
            <div className="flex items-center gap-[8px]">
              {flag.resolved ? (
                <span className="flex size-[16px] shrink-0 items-center justify-center rounded-full bg-success-500">
                  <Check className="size-[9px] text-white" strokeWidth={3.4} />
                </span>
              ) : (
                <Flag className="size-[13px] shrink-0 text-warning-600" strokeWidth={2.2} />
              )}
              <Badge tone={flag.resolved ? 'muted' : flag.severity === 'blocker' ? 'danger' : 'warning'} size="sm">
                {flag.resolved ? 'RESOLVED' : flag.severity === 'blocker' ? 'BLOCKER' : 'QUERY'}
              </Badge>
              <span className="min-w-0 flex-1 truncate text-[11px] text-text-muted">
                {flag.resolved ? flag.resolution : `${author.name} · ${flag.raisedAt}`}
              </span>
              <Button
                className="-my-[3px]"
                onClick={() => (flag.resolved ? onReopen(flag.id) : onResolve(flag.id))}
              >
                {flag.resolved ? 'Reopen' : 'Resolve'}
              </Button>
            </div>
            <p
              className={cn(
                'text-[12px] leading-[1.45]',
                flag.resolved ? 'text-text-muted line-through' : 'text-warning-700',
              )}
            >
              {flag.reason}
            </p>
          </div>
        );
      })}
    </div>
  );
}

/**
 * Form-level summary of everything still open, pinned above the answers so a
 * reviewer sees the issues without scrolling the whole questionnaire.
 */
export function FlagSummary({
  flags,
  questionLabel,
  note,
  actionLabel = 'Request updates',
  onRequestUpdates,
  onJump,
}: {
  flags: AnswerFlag[];
  questionLabel: (questionId: string) => string;
  /** One line on what the flags block, written for the form being shown. */
  note: string;
  actionLabel?: string;
  onRequestUpdates: () => void;
  /** Lets a collapsed form open the section holding the answer before scrolling. */
  onJump?: (questionId: string) => void;
}) {
  if (flags.length === 0) return null;
  const blockers = flags.filter((flag) => flag.severity === 'blocker').length;

  return (
    <div className="flex flex-col gap-[10px] rounded-sm border border-warning-400/40 bg-warning-50 px-[16px] py-[13px]">
      <div className="flex items-center gap-[10px]">
        <Flag className="size-[14px] shrink-0 text-warning-600" strokeWidth={2.2} />
        <div className="flex min-w-0 flex-1 flex-col gap-[2px]">
          <p className="text-[13px] font-medium text-warning-700">
            {flags.length} {flags.length === 1 ? 'flag' : 'flags'} open on this form
            {blockers > 0 && ` · ${blockers} blocking`}
          </p>
          <p className="text-[11px] text-warning-600">{note}</p>
        </div>
        <Button onClick={onRequestUpdates}>{actionLabel}</Button>
      </div>

      <ul className="flex flex-col gap-[1px]">
        {flags.map((flag) => (
          <li key={flag.id}>
            <button
              type="button"
              onClick={() => {
                onJump?.(flag.questionId);
                /* Wait a frame so a section opened by onJump is laid out first. */
                requestAnimationFrame(() =>
                  document
                    .getElementById(flagAnchorId(flag.questionId))
                    ?.scrollIntoView({ behavior: 'smooth', block: 'center' }),
                );
              }}
              className="group flex w-full cursor-pointer items-start gap-[8px] rounded-xs px-[6px] py-[5px] text-left transition-colors duration-120 hover:bg-warning-100"
            >
              <Avatar person={person(flag.raisedById)} size="sm" />
              <span className="min-w-0 flex-1 text-[11px] leading-[1.45] text-text-secondary">
                <span className="font-medium text-text-primary group-hover:underline">
                  {questionLabel(flag.questionId)}
                </span>{' '}
                — {flag.reason}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Raises a new flag against one answer. */
export function RaiseFlagModal({
  questionLabel,
  onClose,
  onSubmit,
}: {
  questionLabel: string;
  onClose: () => void;
  onSubmit: (reason: string, severity: AnswerFlag['severity']) => void;
}) {
  const [reason, setReason] = useState('');
  const [severity, setSeverity] = useState<AnswerFlag['severity']>('query');
  const canSubmit = reason.trim().length > 3;

  return (
    <Modal
      title="Flag this answer"
      description={questionLabel}
      onClose={onClose}
      footer={
        <>
          <Button size="md" onClick={onClose}>
            Cancel
          </Button>
          <Button
            size="md"
            variant="primary"
            disabled={!canSubmit}
            onClick={() => {
              onSubmit(reason.trim(), severity);
              onClose();
            }}
          >
            Raise flag
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-[12px] pb-[6px]">
        <div className="flex flex-col gap-[8px]">
          <span className="text-[12px] font-medium text-text-primary">Severity</span>
          <div className="flex gap-[8px]">
            {(['query', 'blocker'] as const).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setSeverity(option)}
                className={cn(
                  'flex-1 cursor-pointer rounded-sm border px-[12px] py-[9px] text-[12px] font-medium capitalize transition-colors duration-120',
                  severity === option
                    ? 'border-brand-300 bg-surface-brand-subtle text-brand-700'
                    : 'border-border-default bg-surface-subtle text-text-secondary hover:bg-surface-sunken',
                )}
              >
                {option === 'query' ? 'Query' : 'Blocker'}
              </button>
            ))}
          </div>
        </div>

        <label className="flex flex-col gap-[8px]">
          <span className="text-[12px] font-medium text-text-primary">What needs to change</span>
          <textarea
            autoFocus
            rows={4}
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            placeholder="e.g. SOC 2 report is out of date — send the current period report"
            className="resize-none rounded-sm border border-border-default bg-surface-subtle px-[14px] py-[11px] text-[13px] leading-[1.5] text-text-primary outline-none transition-colors duration-150 placeholder:text-text-muted focus:border-brand-300 focus:bg-surface-card"
          />
          <span className="text-[11px] text-text-muted">Sent to Peter Kaminsky with the answer attached.</span>
        </label>
      </div>
    </Modal>
  );
}
