import { cn } from '@/lib/cn';

export interface SegmentedControlOption<T extends string> {
  value: T;
  label: string;
}

export function SegmentedControl<T extends string>({
  value,
  options,
  onChange,
  className,
}: {
  value: T;
  options: SegmentedControlOption<T>[];
  onChange: (value: T) => void;
  className?: string;
}) {
  return (
    <div
      role="tablist"
      className={cn('flex shrink-0 items-center gap-[2px] rounded-md bg-surface-sunken p-[3px]', className)}
    >
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(option.value)}
            className={cn(
              'cursor-pointer whitespace-nowrap rounded-[7px] px-[10px] py-[5px] text-[12px] font-medium transition-colors duration-120',
              active
                ? 'bg-surface-card text-text-primary shadow-[0_1px_2px_rgba(16,24,40,0.06)]'
                : 'text-text-tertiary hover:text-text-secondary',
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
