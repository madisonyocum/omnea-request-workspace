import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { X } from 'lucide-react';

interface DrawerProps {
  title: string;
  subtitle?: ReactNode;
  eyebrow?: string;
  onClose: () => void;
  footer?: ReactNode;
  children: ReactNode;
}

/** Right-hand detail panel used for workflow steps and artefact previews. */
export function Drawer({ title, subtitle, eyebrow, onClose, footer, children }: DrawerProps) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        type="button"
        aria-label="Close panel"
        onClick={onClose}
        className="animate-fade-in absolute inset-0 cursor-default bg-text-primary/20"
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="animate-drawer-in relative flex h-full w-[420px] flex-col border-l border-border-default bg-surface-card shadow-popover"
      >
        <header className="flex items-start gap-[12px] border-b border-border-subtle px-[22px] pb-[16px] pt-[20px]">
          <div className="flex min-w-0 flex-1 flex-col gap-[6px]">
            {eyebrow && (
              <span className="text-[10px] font-medium tracking-[0.8px] text-text-muted uppercase">
                {eyebrow}
              </span>
            )}
            <h2 className="text-[16px] font-medium text-text-primary">{title}</h2>
            {subtitle}
          </div>
          <button
            type="button"
            aria-label="Close panel"
            onClick={onClose}
            className="-mr-[4px] flex size-[26px] shrink-0 cursor-pointer items-center justify-center rounded-sm text-text-muted transition-colors duration-120 hover:bg-surface-sunken hover:text-text-secondary"
          >
            <X className="size-[15px]" strokeWidth={2} />
          </button>
        </header>
        <div className="scrollbar-slim flex-1 overflow-y-auto px-[22px] py-[18px]">{children}</div>
        {footer && (
          <footer className="flex items-center gap-[8px] border-t border-border-subtle bg-surface-subtle px-[22px] py-[14px]">
            {footer}
          </footer>
        )}
      </aside>
    </div>
  );
}
