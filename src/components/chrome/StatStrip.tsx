import { Fragment } from 'react';
import { cn } from '@/lib/cn';
import { Avatar } from '@/components/ui/Avatar';
import { PEOPLE } from '@/domain/people';
import type { StatItem } from '@/domain/types';
import { statStrip } from '@/state/selectors';
import { useWorkspace } from '@/state/workspaceContext';

/**
 * Stats sit left-aligned in a tight row rather than stretching, so the strip
 * reads as one group on wide screens instead of drifting apart.
 */
export function StatStrip() {
  const { state } = useWorkspace();
  const stats = statStrip(state);

  return (
    <div className="flex h-[66px] items-center bg-surface-card px-[24px] pb-[12px]">
      {stats.map((stat, index) => (
        <Fragment key={stat.id}>
          {index > 0 && (
            <>
              <span className="w-[22px] shrink-0" />
              <span className="h-[36px] w-px shrink-0 bg-border-subtle" />
              <span className="w-[22px] shrink-0" />
            </>
          )}
          <Stat stat={stat} />
        </Fragment>
      ))}
      <span className="flex-1" />
    </div>
  );
}

function Stat({ stat }: { stat: StatItem }) {
  const owner = stat.personId ? PEOPLE[stat.personId] : undefined;

  return (
    <div className="flex min-w-0 shrink-0 flex-col gap-[4px] pr-[6px]">
      <span className="text-[10px] font-semibold tracking-[0.8px] text-text-muted uppercase">{stat.label}</span>
      <div className="flex items-center gap-[8px]">
        {owner && <Avatar person={owner} size="sm" />}
        <span
          className={cn(
            'truncate text-[15px] font-semibold leading-[1.2]',
            stat.tone === 'danger' ? 'text-danger-700' : 'text-text-primary',
          )}
        >
          {stat.value}
        </span>
        {stat.meter && <StageMeter {...stat.meter} />}
      </div>
      <p className="truncate text-[11px] leading-[1.2] text-text-muted">{stat.caption}</p>
    </div>
  );
}

function StageMeter({ total, complete, running }: { total: number; complete: number; running: number }) {
  return (
    <span className="flex shrink-0 items-center gap-[2.5px]" aria-hidden>
      {Array.from({ length: total }, (_, index) => (
        <span
          key={index}
          className={cn(
            'h-[4px] w-[10px] rounded-[2px] transition-colors duration-200',
            index < complete
              ? 'bg-success-500'
              : index < complete + running
                ? 'bg-success-300'
                : 'bg-neutral-200',
          )}
        />
      ))}
    </span>
  );
}
