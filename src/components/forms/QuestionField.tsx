import type { ReactNode } from 'react';
import { ChevronDown, MoreVertical } from 'lucide-react';
import { cn } from '@/lib/cn';
import { CheckboxChoice, RadioChoice } from '@/components/ui/Choice';
import { Menu } from '@/components/ui/Menu';
import type { Question } from '@/domain/types';

interface QuestionFieldProps {
  question: Question;
  /** Selected option ids. Read-only forms pass the baked-in answer. */
  answer: string[];
  readOnly?: boolean;
  onSelect?: (optionId: string) => void;
  /** Renders the row-level "…" menu shown on some fields in the design. */
  actions?: { id: string; label: string; onSelect?: () => void }[];
  /** Rendered under the answer — used for flags raised against it. */
  footer?: ReactNode;
  className?: string;
}

export function QuestionField({
  question,
  answer,
  readOnly = false,
  onSelect,
  actions,
  footer,
  className,
}: QuestionFieldProps) {
  return (
    <div className={cn('flex flex-col gap-[12px] py-[18px]', className)}>
      <div className="flex items-start gap-[8px]">
        <p className="min-w-0 flex-1 text-[13px] font-semibold leading-[1.35] text-text-primary">
          {question.label}
          {question.required && <span className="text-danger-500"> *</span>}
        </p>
        {actions && actions.length > 0 && (
          <Menu items={actions} width={190}>
            {({ open, toggle }) => (
              <button
                type="button"
                aria-label="Field actions"
                onClick={toggle}
                className={cn(
                  'flex size-[20px] shrink-0 cursor-pointer items-center justify-center rounded-xs text-text-muted transition-colors duration-120 hover:bg-surface-sunken hover:text-text-secondary',
                  open && 'bg-surface-sunken text-text-secondary',
                )}
              >
                <MoreVertical className="size-[14px]" strokeWidth={2} />
              </button>
            )}
          </Menu>
        )}
      </div>

      <QuestionControl question={question} answer={answer} readOnly={readOnly} onSelect={onSelect} />

      {footer}
    </div>
  );
}

function QuestionControl({
  question,
  answer,
  readOnly,
  onSelect,
}: {
  question: Question;
  answer: string[];
  readOnly: boolean;
  onSelect?: (optionId: string) => void;
}) {
  switch (question.kind) {
    case 'radio':
      return (
        <div role="radiogroup" className="flex flex-col gap-[10px]">
          {question.options?.map((option) => (
            <RadioChoice
              key={option.id}
              label={option.label}
              checked={answer.includes(option.id)}
              readOnly={readOnly}
              onSelect={() => onSelect?.(option.id)}
            />
          ))}
        </div>
      );

    case 'checkbox':
      return (
        <div className="flex flex-col gap-[10px]">
          {question.options?.map((option) => (
            <CheckboxChoice
              key={option.id}
              label={option.label}
              checked={answer.includes(option.id)}
              readOnly={readOnly}
              onSelect={() => onSelect?.(option.id)}
            />
          ))}
        </div>
      );

    case 'chips':
      return (
        <div
          className={cn(
            'flex gap-[12px]',
            question.layout === 'column' ? 'flex-col items-start' : 'flex-wrap items-start',
          )}
        >
          {question.options?.map((option) => (
            <span
              key={option.id}
              className="rounded-sm border border-border-default bg-surface-subtle px-[12px] py-[9px] text-[13px] font-medium text-text-primary"
            >
              {option.label}
            </span>
          ))}
        </div>
      );

    case 'select':
      return (
        <div className="flex items-center gap-[8px] rounded-sm border border-border-default bg-surface-subtle px-[14px] py-[11px]">
          <span className="min-w-0 flex-1 truncate text-[13px] text-text-secondary">{question.value}</span>
          <ChevronDown className="size-[12px] shrink-0 text-text-muted" strokeWidth={2} />
        </div>
      );

    case 'longtext':
    case 'text':
      if (question.fields) {
        return <FieldGroup fields={question.fields} />;
      }
      return <ReadOnlyValue value={question.value ?? ''} />;

    default:
      return null;
  }
}

function FieldGroup({ fields }: { fields: NonNullable<Question['fields']> }) {
  const rows: NonNullable<Question['fields']>[] = [];
  for (const field of fields) {
    const last = rows[rows.length - 1];
    if (field.halfWidth && last?.length === 1 && last[0].halfWidth) last.push(field);
    else rows.push([field]);
  }

  return (
    <div className="flex flex-col gap-[12px]">
      {rows.map((row, index) => (
        <div key={index} className={cn('flex gap-[16px]', row.length === 1 && 'flex-col')}>
          {row.map((field) => (
            <label key={field.label} className="flex min-w-0 flex-1 flex-col gap-[6px]">
              <span className="text-[11px] text-text-muted">{field.label}</span>
              <ReadOnlyValue value={field.value} />
            </label>
          ))}
        </div>
      ))}
    </div>
  );
}

function ReadOnlyValue({ value }: { value: string }) {
  return (
    <div className="min-h-[41px] w-full rounded-sm border border-border-default bg-surface-subtle px-[14px] py-[11px]">
      {value ? (
        <p className="whitespace-pre-line text-[13px] leading-[1.45] text-text-secondary">{value}</p>
      ) : (
        <p className="text-[13px] text-text-muted">Not provided</p>
      )}
    </div>
  );
}
