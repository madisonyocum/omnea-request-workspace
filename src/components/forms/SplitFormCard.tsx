import { Flag } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

export interface SectionNavItem {
  id: string;
  label: string;
  status?: { label: string; tone: 'active' | 'pending' | 'complete' };
  /** Open issues raised against this section's answers. */
  flagCount?: number;
}

export interface SectionNavGroup {
  id: string;
  overline: string;
  items: SectionNavItem[];
}

const DOT_TONE = {
  active: 'bg-brand-600',
  complete: 'bg-success-500',
  pending: 'bg-text-disabled',
} as const;

/**
 * The two-column form shell shared by My tasks, Intake and Submissions:
 * a 271px section list on the left, the form body on the right.
 */
export function SplitFormCard({
  groups,
  activeId,
  onSelect,
  header,
  children,
  bodyRef,
}: {
  groups: SectionNavGroup[];
  activeId: string;
  onSelect: (id: string) => void;
  /** Pinned above the scroll area so form controls stay reachable. */
  header?: ReactNode;
  children: ReactNode;
  bodyRef?: (element: HTMLDivElement | null) => void;
}) {
  return (
    <div className="flex h-full min-h-0 items-stretch overflow-hidden rounded-lg border border-border-card bg-surface-card">
      <nav
        className="scrollbar-slim flex w-[271px] shrink-0 flex-col overflow-y-auto border-r border-border-default"
        aria-label="Form sections"
      >
        {groups.map((group) => (
          <div key={group.id}>
            <div className="flex items-start px-[18px] pb-[10px] pt-[16px]">
              <span className="text-[10px] font-semibold tracking-[0.8px] text-text-muted uppercase">
                {group.overline}
              </span>
            </div>
            {group.items.map((item) => {
              const active = item.id === activeId;
              return (
                <button
                  key={item.id}
                  type="button"
                  aria-current={active ? 'true' : undefined}
                  onClick={() => onSelect(item.id)}
                  className={cn(
                    'relative flex w-full cursor-pointer items-center gap-[10px] border-b border-border-subtle py-[13px] pl-[18px] pr-[16px] text-left transition-colors duration-150',
                    active ? 'bg-surface-brand-subtle' : 'hover:bg-surface-subtle',
                  )}
                >
                  {active && <span className="absolute inset-y-0 left-0 w-[3px] bg-brand-600" />}
                  <span className="flex min-w-0 flex-1 flex-col gap-[4px]">
                    <span
                      className={cn(
                        'truncate text-[13px] font-semibold',
                        active ? 'text-brand-700' : 'text-text-primary',
                      )}
                    >
                      {item.label}
                    </span>
                    {item.status && (
                      <span className="flex items-center gap-[6px]">
                        <span className={cn('size-[7px] shrink-0 rounded-full', DOT_TONE[item.status.tone])} />
                        <span
                          className={cn(
                            'text-[11px]',
                            item.status.tone === 'pending' ? 'text-text-muted' : 'text-text-tertiary',
                          )}
                        >
                          {item.status.label}
                        </span>
                      </span>
                    )}
                  </span>
                  {item.flagCount !== undefined && item.flagCount > 0 && (
                    <span
                      title={`${item.flagCount} open ${item.flagCount === 1 ? 'flag' : 'flags'}`}
                      className="flex shrink-0 items-center gap-[3px] rounded-xs bg-warning-100 px-[5px] py-[3px]"
                    >
                      <Flag className="size-[10px] text-warning-700" strokeWidth={2} />
                      <span className="text-[9px] font-semibold text-warning-700">{item.flagCount}</span>
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        {header}
        <div ref={bodyRef} className="scrollbar-slim min-h-0 flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}

/** Shared header band for a form body: title, meta line and trailing controls. */
export function FormHeader({
  title,
  subtitle,
  children,
  bordered = true,
}: {
  title: string;
  subtitle?: ReactNode;
  children?: ReactNode;
  bordered?: boolean;
}) {
  return (
    <header
      className={cn(
        'flex items-center gap-[12px] pb-[18px] pl-[28px] pr-[24px] pt-[22px]',
        bordered && 'border-b border-border-subtle',
      )}
    >
      <div className="flex min-w-0 flex-1 flex-col gap-[4px]">
        <h2 className="truncate text-[16px] font-semibold text-text-primary">{title}</h2>
        {subtitle && <div className="truncate text-[11px] text-text-muted">{subtitle}</div>}
      </div>
      {children}
    </header>
  );
}
