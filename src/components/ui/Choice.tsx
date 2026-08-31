import { Check } from 'lucide-react';
import { cn } from '@/lib/cn';

interface ChoiceProps {
  label: string;
  checked: boolean;
  /** Read-only choices keep the visual treatment but drop the affordance. */
  readOnly?: boolean;
  onSelect?: () => void;
}

/**
 * Radio and checkbox rows share one layout: a 16px control plus a 13px label
 * that dims when unselected — matching the questionnaire in the design.
 */
export function RadioChoice({ label, checked, readOnly, onSelect }: ChoiceProps) {
  const Element = readOnly ? 'div' : 'button';
  return (
    <Element
      {...(readOnly ? {} : { type: 'button' as const, onClick: onSelect, role: 'radio', 'aria-checked': checked })}
      className={cn(
        'group flex items-center gap-[9px] text-left',
        !readOnly && 'cursor-pointer',
      )}
    >
      <span
        className={cn(
          'relative size-[16px] shrink-0 rounded-full border bg-surface-card transition-colors duration-120',
          checked
            ? 'border-[5px] border-brand-600'
            : cn(
                'border-[1.4px] border-border-strong',
                !readOnly && 'group-hover:border-brand-300',
              ),
        )}
      />
      <span
        className={cn(
          'text-[13px] transition-colors duration-120',
          checked ? 'text-text-primary' : 'text-text-muted',
          !readOnly && !checked && 'group-hover:text-text-secondary',
        )}
      >
        {label}
      </span>
    </Element>
  );
}

export function CheckboxChoice({ label, checked, readOnly, onSelect }: ChoiceProps) {
  const Element = readOnly ? 'div' : 'button';
  return (
    <Element
      {...(readOnly
        ? {}
        : { type: 'button' as const, onClick: onSelect, role: 'checkbox', 'aria-checked': checked })}
      className={cn('group flex items-center gap-[9px] text-left', !readOnly && 'cursor-pointer')}
    >
      <span
        className={cn(
          'flex size-[16px] shrink-0 items-center justify-center rounded-xs border transition-colors duration-120',
          checked
            ? 'border-brand-600 bg-brand-600'
            : cn(
                'border-[1.4px] border-border-strong bg-surface-card',
                !readOnly && 'group-hover:border-brand-300',
              ),
        )}
      >
        {checked && <Check className="size-[10px] text-white" strokeWidth={3.2} />}
      </span>
      <span
        className={cn(
          'text-[13px] transition-colors duration-120',
          checked ? 'text-text-primary' : 'text-text-muted',
          !readOnly && !checked && 'group-hover:text-text-secondary',
        )}
      >
        {label}
      </span>
    </Element>
  );
}

/** 18px square checkbox used in the documents table. */
export function TableCheckbox({
  checked,
  label,
  onToggle,
}: {
  checked: boolean;
  label: string;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={label}
      onClick={onToggle}
      className={cn(
        'flex size-[18px] shrink-0 cursor-pointer items-center justify-center rounded-xs border transition-colors duration-120',
        checked
          ? 'border-success-500 bg-success-500'
          : 'border-[1.4px] border-border-strong bg-surface-card hover:border-success-300',
      )}
    >
      {checked && <Check className="size-[11px] text-white" strokeWidth={3.2} />}
    </button>
  );
}
