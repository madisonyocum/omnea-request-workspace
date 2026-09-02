import { GitBranch, ShieldCheck, Users } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';

const POINTS = [
  {
    Icon: Users,
    title: 'Switch roles',
    body: 'Use the Requester / Approver / Admin switch, top right, to see how the same request looks to each person involved.',
  },
  {
    Icon: GitBranch,
    title: 'Browse every phase',
    body: 'Click any phase in the workflow rail to preview it — Approvals and Reviews are fully interactive.',
  },
  {
    Icon: ShieldCheck,
    title: 'Take real actions',
    body: 'Approve, decline, reassign, or override a step and the whole card updates live, not just a toast.',
  },
];

export function OnboardingModal({ onClose }: { onClose: () => void }) {
  return (
    <Modal
      title="Welcome to the prototype"
      description="This walks through a single procurement request — Mailchimp, OM-49 — as it moves through Omnea's approval workflow."
      onClose={onClose}
      width={420}
      footer={
        <Button size="md" variant="primary" className="w-full" onClick={onClose}>
          Explore the prototype
        </Button>
      }
    >
      <div className="flex flex-col gap-[16px] pb-[6px] pt-[4px]">
        {POINTS.map(({ Icon, title, body }) => (
          <div key={title} className="flex items-start gap-[12px]">
            <span className="flex size-[30px] shrink-0 items-center justify-center rounded-md bg-surface-brand-subtle text-brand-600">
              <Icon className="size-[15px]" strokeWidth={1.8} />
            </span>
            <div className="flex flex-col gap-[2px] pt-[2px]">
              <span className="text-[13px] font-medium text-text-primary">{title}</span>
              <p className="text-[12px] leading-[1.45] text-text-muted">{body}</p>
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
}
