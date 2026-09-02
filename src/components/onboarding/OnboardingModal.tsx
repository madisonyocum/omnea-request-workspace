import { useEffect } from 'react';
import { GitBranch, ShieldCheck, Users } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const POINTS = [
  {
    Icon: Users,
    title: 'Switch roles',
    body: 'Jump between Requester, Approver, and Admin up top.',
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
        aria-label="Welcome to the Request Prototype"
        className="animate-slide-up relative flex w-fit max-w-[calc(100vw-48px)] flex-col items-center overflow-hidden rounded-xl border border-border-default bg-surface-card text-center shadow-popover"
      >
        <div className="flex flex-col items-center gap-[10px] px-[56px] pb-[36px] pt-[56px]">
          <h2 className="text-[21px] font-medium text-text-primary">Welcome to the Request Prototype</h2>
          <p className="max-w-[420px] text-[13px] leading-[1.55] text-text-tertiary">
            This walks through a single procurement request, Mailchimp&nbsp;OM&#8209;49, as it moves through
            Omnea's approval workflow.
          </p>
        </div>

        <div className="grid grid-cols-[repeat(3,200px)] gap-[14px] px-[32px] pb-[16px]">
          {POINTS.map(({ Icon, title, body }) => (
            <div key={title} className="flex min-w-0 flex-col items-center gap-[10px]">
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

        <div className="mt-[12px] w-full px-[48px] pb-[48px]">
          <Button size="md" variant="primary" className="mx-auto w-[220px]" onClick={onClose}>
            Explore Prototype
          </Button>
        </div>
      </div>
    </div>
  );
}
