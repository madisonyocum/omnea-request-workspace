import { Briefcase, ChartColumn, Inbox, LayoutGrid, Repeat, ScrollText, SlidersHorizontal } from 'lucide-react';
import { cn } from '@/lib/cn';
import { Tooltip } from '@/components/ui/Tooltip';
import { useWorkspace } from '@/state/workspaceContext';

const RAIL_ITEMS = [
  { id: 'home', label: 'Home', Icon: LayoutGrid },
  { id: 'inbox', label: 'Requests', Icon: Inbox },
  { id: 'suppliers', label: 'Suppliers', Icon: Briefcase },
  { id: 'insights', label: 'Insights', Icon: ChartColumn },
  { id: 'contracts', label: 'Contracts', Icon: ScrollText },
  { id: 'workflows', label: 'Workflows', Icon: Repeat },
  { id: 'settings', label: 'Settings', Icon: SlidersHorizontal },
];

export function AppRail() {
  const { state, dispatch } = useWorkspace();

  return (
    <nav
      aria-label="Product navigation"
      className="flex w-[56px] shrink-0 flex-col items-center gap-[8px] border-r border-border-default bg-surface-card px-[12px] pb-[16px] pt-[12px]"
    >
      <div className="flex size-[32px] shrink-0 items-center justify-center rounded-[9px] bg-text-primary text-[18px] font-bold leading-none text-white">
        O
      </div>
      <div className="h-[16px] shrink-0" />
      {RAIL_ITEMS.map(({ id, label, Icon }) => {
        const active = state.railNavId === id;
        return (
          <Tooltip key={id} label={label} side="right">
            <button
              type="button"
              aria-label={label}
              aria-current={active ? 'page' : undefined}
              onClick={() => dispatch({ type: 'rail/select', id })}
              className={cn(
                'flex size-[36px] cursor-pointer items-center justify-center rounded-md transition-colors duration-150',
                active
                  ? 'bg-surface-rail-active text-white'
                  : 'text-text-tertiary hover:bg-surface-sunken hover:text-text-secondary',
              )}
            >
              <Icon className="size-[18px]" strokeWidth={1.7} />
            </button>
          </Tooltip>
        );
      })}
    </nav>
  );
}
