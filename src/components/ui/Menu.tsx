import { useLayoutEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/cn';
import { useOnClickOutside } from '@/lib/useOnClickOutside';

export interface MenuItem {
  id: string;
  label: string;
  icon?: ReactNode;
  tone?: 'default' | 'danger';
  disabled?: boolean;
  onSelect?: () => void;
}

interface MenuProps {
  items: MenuItem[];
  align?: 'start' | 'end';
  /** Rendered as the trigger. Receives the open state so it can show an active style. */
  children: (props: { open: boolean; toggle: () => void }) => ReactNode;
  width?: number;
  header?: ReactNode;
}

export function Menu({ items, align = 'end', children, width = 200, header }: MenuProps) {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  useOnClickOutside([containerRef, menuRef], () => setOpen(false), open);

  useLayoutEffect(() => {
    if (!open || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setCoords({
      top: rect.bottom + 6,
      left: align === 'end' ? rect.right - width : rect.left,
    });
  }, [open, align, width]);

  return (
    <div ref={containerRef} className="relative inline-flex">
      {children({ open, toggle: () => setOpen((v) => !v) })}
      {open &&
        createPortal(
          <div
            ref={menuRef}
            role="menu"
            style={{ width, top: coords.top, left: coords.left }}
            className="animate-pop-in fixed z-40 origin-top overflow-hidden rounded-md border border-border-default bg-surface-card py-[4px] shadow-popover"
          >
            {header && (
              <div className="border-b border-border-subtle px-[12px] pb-[8px] pt-[6px]">{header}</div>
            )}
            {items.map((item) => (
              <button
                key={item.id}
                type="button"
                role="menuitem"
                disabled={item.disabled}
                onClick={() => {
                  setOpen(false);
                  item.onSelect?.();
                }}
                className={cn(
                  'flex w-full items-center gap-[9px] px-[12px] py-[7px] text-left text-[12px] font-medium transition-colors duration-120',
                  item.disabled
                    ? 'cursor-not-allowed text-text-disabled'
                    : item.tone === 'danger'
                      ? 'cursor-pointer text-danger-700 hover:bg-danger-100/60'
                      : 'cursor-pointer text-text-secondary hover:bg-surface-subtle',
                )}
              >
                {item.icon && <span className="flex size-[14px] items-center justify-center">{item.icon}</span>}
                {item.label}
              </button>
            ))}
          </div>,
          document.body,
        )}
    </div>
  );
}
