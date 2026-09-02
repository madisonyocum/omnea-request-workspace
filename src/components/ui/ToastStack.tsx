import { useEffect, useState } from 'react';
import { Check, Info, TriangleAlert } from 'lucide-react';
import { cn } from '@/lib/cn';
import { useWorkspace } from '@/state/workspaceContext';
import type { Toast } from '@/state/workspaceReducer';

const TOAST_DURATION_MS = 4400;
const TOAST_EXIT_MS = 320;

export function ToastStack() {
  const { state } = useWorkspace();

  return (
    <div className="pointer-events-none fixed top-[20px] right-[20px] z-[60] flex flex-col items-end gap-[10px]">
      {state.toasts.map((toast) => (
        <ToastRow key={toast.id} toast={toast} />
      ))}
    </div>
  );
}

function ToastRow({ toast }: { toast: Toast }) {
  const { dispatch } = useWorkspace();
  const [closing, setClosing] = useState(false);

  const close = () => setClosing(true);

  useEffect(() => {
    const timer = window.setTimeout(close, TOAST_DURATION_MS);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!closing) return;
    const timer = window.setTimeout(() => dispatch({ type: 'toast/dismiss', id: toast.id }), TOAST_EXIT_MS);
    return () => window.clearTimeout(timer);
  }, [closing, dispatch, toast.id]);

  const Icon = toast.tone === 'success' ? Check : toast.tone === 'danger' ? TriangleAlert : Info;

  return (
    <div
      role="status"
      className={cn(
        'pointer-events-auto inline-flex max-w-[calc(100vw-40px)] items-center gap-[12px] rounded-lg bg-text-primary px-[18px] py-[14px] shadow-popover',
        closing ? 'animate-toast-out' : 'animate-toast-in',
      )}
    >
      <Icon
        className={cn(
          'size-[16px] shrink-0',
          toast.tone === 'success'
            ? 'text-success-300'
            : toast.tone === 'danger'
              ? 'text-warning-400'
              : 'text-text-disabled',
        )}
        strokeWidth={2.4}
      />
      <span className="whitespace-nowrap text-[13px] font-medium text-white">{toast.message}</span>
      <button
        type="button"
        onClick={close}
        className="ml-[4px] shrink-0 cursor-pointer text-[12px] font-medium whitespace-nowrap text-text-muted hover:text-white"
      >
        Dismiss
      </button>
    </div>
  );
}
