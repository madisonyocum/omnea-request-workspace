import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  title: string;
  description?: string;
  onClose: () => void;
  footer?: ReactNode;
  children?: ReactNode;
  width?: number;
}

export function Modal({ title, description, onClose, footer, children, width = 440 }: ModalProps) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      <button
        type="button"
        aria-label="Close dialog"
        onClick={onClose}
        className="animate-fade-in absolute inset-0 cursor-default bg-text-primary/25"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        style={{ width }}
        className="animate-slide-up relative overflow-hidden rounded-lg border border-border-default bg-surface-card shadow-popover"
      >
        <div className="flex items-start gap-[12px] px-[22px] pb-[14px] pt-[20px]">
          <div className="flex min-w-0 flex-1 flex-col gap-[5px]">
            <h2 className="text-[16px] font-medium text-text-primary">{title}</h2>
            {description && <p className="text-[12px] leading-[1.5] text-text-muted">{description}</p>}
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="-mr-[4px] -mt-[2px] flex size-[26px] shrink-0 cursor-pointer items-center justify-center rounded-sm text-text-muted transition-colors duration-120 hover:bg-surface-sunken hover:text-text-secondary"
          >
            <X className="size-[15px]" strokeWidth={2} />
          </button>
        </div>
        {children && <div className="px-[22px] pb-[4px]">{children}</div>}
        {footer && (
          <div className="mt-[14px] flex items-center justify-end gap-[8px] border-t border-border-subtle bg-surface-subtle px-[22px] py-[14px]">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
