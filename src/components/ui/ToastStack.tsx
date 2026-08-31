import { useEffect } from 'react';
import { Check, Info, TriangleAlert } from 'lucide-react';
import { cn } from '@/lib/cn';
import { useWorkspace } from '@/state/workspaceContext';
import type { Toast } from '@/state/workspaceReducer';

const TOAST_DURATION_MS = 3400;

export function ToastStack() {
  const { state } = useWorkspace();

  return (
    <div className="pointer-events-none fixed bottom-[20px] left-1/2 z-[60] flex -translate-x-1/2 flex-col items-center gap-[8px]">
      {state.toasts.map((toast) => (
        <ToastRow key={toast.id} toast={toast} />
      ))}
    </div>
  );
}

function ToastRow({ toast }: { toast: Toast }) {
  const { dispatch } = useWorkspace();

  useEffect(() => {
    const timer = window.setTimeout(() => dispatch({ type: 'toast/dismiss', id: toast.id }), TOAST_DURATION_MS);
    return () => window.clearTimeout(timer);
  }, [dispatch, toast.id]);

  const Icon = toast.tone === 'success' ? Check : toast.tone === 'danger' ? TriangleAlert : Info;

  return (
    <div
      role="status"
      className="animate-slide-up pointer-events-auto flex items-center gap-[9px] rounded-md bg-text-primary px-[14px] py-[10px] shadow-popover"
    >
      <Icon
        className={cn(
          'size-[14px] shrink-0',
          toast.tone === 'success'
            ? 'text-success-300'
            : toast.tone === 'danger'
              ? 'text-warning-400'
              : 'text-text-disabled',
        )}
        strokeWidth={2.4}
      />
      <span className="text-[12px] font-medium text-white">{toast.message}</span>
      <button
        type="button"
        onClick={() => dispatch({ type: 'toast/dismiss', id: toast.id })}
        className="ml-[4px] cursor-pointer text-[11px] font-medium text-text-muted hover:text-white"
      >
        Dismiss
      </button>
    </div>
  );
}
