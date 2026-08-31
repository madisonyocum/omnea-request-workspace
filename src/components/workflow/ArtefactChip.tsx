import { FileText } from 'lucide-react';
import { cn } from '@/lib/cn';

export function ArtefactChip({
  label,
  onClick,
  className,
}: {
  label: string;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={(event) => {
        event.stopPropagation();
        onClick?.();
      }}
      className={cn(
        'inline-flex cursor-pointer items-center gap-[6px] rounded-[7px] border border-border-default bg-surface-card py-[4px] pl-[7px] pr-[9px] text-[11px] text-text-secondary transition-colors duration-120 hover:border-border-strong hover:bg-surface-subtle',
        className,
      )}
    >
      <FileText className="size-[13px] shrink-0 text-text-tertiary" strokeWidth={1.5} />
      <span className="truncate">{label}</span>
    </button>
  );
}
