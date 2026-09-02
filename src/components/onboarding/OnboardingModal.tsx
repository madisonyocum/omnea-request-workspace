import { useEffect } from 'react';
import { GitBranch, ShieldCheck, Users } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const POINTS = [
  {
    Icon: Users,
    title: 'Switch roles',
    body: 'See the same request through Requester, Approver, and Admin eyes.',
  },
  {
    Icon: GitBranch,
    title: 'Browse every phase',
    body: 'Click any phase in the rail to preview it, live.',
  },
  {
    Icon: ShieldCheck,
    title: 'Take real actions',
    body: 'Approve, decline, or override. Nothing here is just a toast.',
  },
];

export function OnboardingModal({ onClose }: { onClose: () => void }) {
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
        aria-label="Welcome to the prototype"
        className="animate-slide-up relative flex w-[600px] flex-col items-center overflow-hidden rounded-xl border border-border-default bg-surface-card text-center shadow-popover"
      >
        <div className="flex flex-col items-center gap-[18px] px-[48px] pb-[32px] pt-[48px]">
          <div className="flex size-[56px] shrink-0 items-center justify-center rounded-[16px] bg-text-primary text-[26px] font-bold text-white">
            O
          </div>
          <div className="flex flex-col items-center gap-[8px]">
            <h2 className="text-[21px] font-medium text-text-primary">Welcome to the prototype</h2>
            <p className="max-w-[420px] text-[13px] leading-[1.55] text-text-tertiary">
              This walks through a single procurement request, Mailchimp OM-49, as it moves through Omnea's
              approval workflow.
            </p>
          </div>
        </div>

        <div className="grid w-full grid-cols-3 gap-[16px] px-[40px] pb-[12px]">
          {POINTS.map(({ Icon, title, body }) => (
            <div key={title} className="flex flex-col items-center gap-[10px]">
              <span className="flex size-[38px] shrink-0 items-center justify-center rounded-full bg-surface-brand-subtle text-brand-600">
                <Icon className="size-[18px]" strokeWidth={1.8} />
              </span>
              <div className="flex flex-col items-center gap-[4px]">
                <span className="text-[13px] font-medium text-text-primary">{title}</span>
                <p className="text-[11px] leading-[1.5] text-text-tertiary">{body}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-[28px] w-full border-t border-border-subtle bg-surface-subtle px-[40px] py-[18px]">
          <Button size="md" variant="primary" className="w-full" onClick={onClose}>
            Explore the prototype
          </Button>
        </div>
      </div>
    </div>
  );
}
