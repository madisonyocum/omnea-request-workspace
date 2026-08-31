import { FileText, Files, House, Send, SquareCheckBig } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/cn';
import { CountChip } from '@/components/ui/Pill';
import type { TabId } from '@/domain/types';
import { tabCounts } from '@/state/selectors';
import { useWorkspace } from '@/state/workspaceContext';

interface TabDefinition {
  id: TabId;
  label: string;
  Icon: LucideIcon;
}

const TABS: TabDefinition[] = [
  { id: 'overview', label: 'Overview', Icon: House },
  { id: 'tasks', label: 'My tasks', Icon: SquareCheckBig },
  { id: 'intake', label: 'Intake', Icon: FileText },
  { id: 'submissions', label: 'Submissions', Icon: Send },
  { id: 'documents', label: 'Documents', Icon: Files },
];

export function TabBar() {
  const { state, dispatch } = useWorkspace();
  const counts = tabCounts(state);

  const countFor = (id: TabId): number | undefined =>
    id === 'tasks' ? counts.tasks : id === 'submissions' ? counts.submissions : id === 'documents' ? counts.documents : undefined;

  return (
    <div role="tablist" className="flex h-[42px] items-center gap-[22px] bg-surface-card px-[24px]">
      {TABS.map(({ id, label, Icon }) => {
        const active = state.activeTab === id;
        const count = countFor(id);
        return (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => dispatch({ type: 'tab/select', tab: id })}
            className={cn(
              'group relative flex h-full cursor-pointer items-center gap-[6px] text-[13px] transition-colors duration-150',
              active ? 'font-semibold text-brand-600' : 'font-medium text-text-tertiary hover:text-text-secondary',
            )}
          >
            <Icon className="size-[16px]" strokeWidth={1.8} />
            {label}
            {count !== undefined && count > 0 && <CountChip active={active}>{count}</CountChip>}
            <span
              className={cn(
                'absolute inset-x-0 bottom-0 h-[2.5px] rounded-[2px] transition-all duration-200',
                active ? 'bg-brand-600 opacity-100' : 'bg-border-strong opacity-0 group-hover:opacity-100',
              )}
            />
          </button>
        );
      })}
    </div>
  );
}
