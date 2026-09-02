import { useEffect } from 'react';
import type { RefObject } from 'react';

/**
 * Closes transient surfaces (menus, popovers) on outside pointer-down or Escape.
 * Accepts one ref or several — a portaled dropdown lives outside its trigger's
 * DOM subtree, so its own ref has to be included too or every click inside it
 * would register as "outside" and close it before the click can register.
 */
export function useOnClickOutside(
  refs: RefObject<HTMLElement | null> | RefObject<HTMLElement | null>[],
  onDismiss: () => void,
  enabled = true,
) {
  const refList = Array.isArray(refs) ? refs : [refs];

  useEffect(() => {
    if (!enabled) return;

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      const inside = refList.some((ref) => ref.current && ref.current.contains(target));
      if (!inside) onDismiss();
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onDismiss();
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onDismiss, enabled, ...refList]);
}
