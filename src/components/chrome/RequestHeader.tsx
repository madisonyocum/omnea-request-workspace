import { useState } from 'react';
import {
  Archive,
  ChevronDown,
  Copy,
  Download,
  Eye,
  EyeOff,
  MoreHorizontal,
  Settings,
  Share2,
} from 'lucide-react';
import { Avatar, AvatarStack } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Pill';
import { Button, IconButton } from '@/components/ui/Button';
import { Menu } from '@/components/ui/Menu';
import { Modal } from '@/components/ui/Modal';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { RoleSwitchHint } from '@/components/onboarding/RoleSwitchHint';
import { WATCHER_IDS, person } from '@/domain/people';
import { REQUEST, ROLE_LABEL, roleViewerId } from '@/domain/workflow';
import type { UserRole } from '@/domain/types';
import { useWorkspace } from '@/state/workspaceContext';
import { cn } from '@/lib/cn';

const ROLE_OPTIONS: { value: UserRole; label: string }[] = [
  { value: 'requester', label: 'Requester' },
  { value: 'approver', label: 'Approver' },
  { value: 'admin', label: 'Admin' },
];

export function RequestHeader({
  showRoleHint,
  onDismissRoleHint,
}: {
  showRoleHint: boolean;
  onDismissRoleHint: () => void;
}) {
  const { state, dispatch } = useWorkspace();
  const [shareOpen, setShareOpen] = useState(false);
  const watchers = WATCHER_IDS.map(person);
  const viewer = person(roleViewerId(state.role, state.stages));

  return (
    <div className="flex items-center gap-[10px] bg-surface-card px-[24px] pt-[12px] pb-[16px]">
      <div className="-mt-[5px] flex size-[36px] shrink-0 items-center justify-center rounded-md border border-border-mark bg-accent-yellow text-[16px] font-bold text-text-primary">
        {REQUEST.logoInitial}
      </div>

      <div className="flex min-w-0 flex-col gap-[5px]">
        <div className="mt-[3px] flex items-center gap-[8px]">
          <h1 className="text-[16px] font-medium leading-[1.15] text-text-primary">{REQUEST.supplier}</h1>
          <span className="text-[12px] font-medium whitespace-nowrap text-text-muted">{REQUEST.reference}</span>
          <Badge tone="danger" size="sm">{REQUEST.riskBadge}</Badge>
        </div>
        <p className="mb-[6px] truncate text-[12px] leading-[1.3] text-text-tertiary">{REQUEST.subtitle}</p>
      </div>

      <div className="flex-1" />

      <AvatarStack people={watchers} />

      <div className="relative mr-[4px]">
        <SegmentedControl
          value={state.role}
          options={ROLE_OPTIONS}
          onChange={(role) => {
            dispatch({ type: 'role/select', role });
            onDismissRoleHint();
          }}
        />
        {showRoleHint && <RoleSwitchHint onClose={onDismissRoleHint} />}
      </div>

      <Button
        onClick={() => dispatch({ type: 'following/toggle' })}
        aria-pressed={state.following}
        className={cn(
          state.following && 'border-brand-300 bg-surface-brand-subtle text-brand-700 hover:bg-surface-brand-subtle',
        )}
        icon={
          state.following ? (
            <Eye className="size-[16px]" strokeWidth={1.8} />
          ) : (
            <EyeOff className="size-[16px]" strokeWidth={1.8} />
          )
        }
      >
        {state.following ? 'Following' : 'Follow'}
      </Button>

      <Button onClick={() => setShareOpen(true)} icon={<Share2 className="size-[16px]" strokeWidth={1.8} />}>
        Share
      </Button>

      <Menu
        width={210}
        items={[
          {
            id: 'duplicate',
            label: 'Duplicate request',
            icon: <Copy className="size-[13px]" strokeWidth={1.8} />,
            onSelect: () => dispatch({ type: 'toast/show', message: 'Draft copy of OM-49 created in your drafts, ready to edit and send.' }),
          },
          {
            id: 'export',
            label: 'Export audit trail',
            icon: <Download className="size-[13px]" strokeWidth={1.8} />,
            onSelect: () => dispatch({ type: 'toast/show', message: "Audit trail export queued - download link coming by email." }),
          },
          {
            id: 'workflow',
            label: 'Workflow settings',
            icon: <Settings className="size-[13px]" strokeWidth={1.8} />,
            onSelect: () => dispatch({ type: 'toast/show', message: "Only workflow admins can edit this request's settings." }),
          },
          {
            id: 'archive',
            label: 'Archive request',
            icon: <Archive className="size-[13px]" strokeWidth={1.8} />,
            tone: 'danger',
            onSelect: () => dispatch({ type: 'toast/show', message: 'Archiving this request needs approver sign-off before it can be put away.', tone: 'danger' }),
          },
        ]}
      >
        {({ open, toggle }) => (
          <IconButton
            label="More actions"
            onClick={toggle}
            className={cn(open && 'bg-surface-sunken text-text-secondary')}
          >
            <MoreHorizontal className="size-[16px]" strokeWidth={2} />
          </IconButton>
        )}
      </Menu>

      <Menu
        width={190}
        header={
          <div className="flex flex-col gap-[2px]">
            <span className="text-[12px] font-medium text-text-primary">{viewer.name}</span>
            <span className="text-[11px] text-text-muted">Viewing as {ROLE_LABEL[state.role].toLowerCase()}</span>
          </div>
        }
        items={[
          { id: 'profile', label: 'Profile settings' },
          { id: 'notifications', label: 'Notification preferences' },
          { id: 'signout', label: 'Sign out', tone: 'danger' },
        ]}
      >
        {({ open, toggle }) => (
          <button
            type="button"
            onClick={toggle}
            className={cn(
              'flex cursor-pointer items-center gap-[8px] rounded-sm py-[4px] pl-[4px] pr-[6px] transition-colors duration-120 hover:bg-surface-subtle',
              open && 'bg-surface-subtle',
            )}
          >
            <Avatar person={viewer} size="lg" />
            <span className="text-[12px] font-medium text-text-secondary">{ROLE_LABEL[state.role]}</span>
            <ChevronDown
              className={cn('size-[12px] text-text-muted transition-transform duration-150', open && 'rotate-180')}
              strokeWidth={2.2}
            />
          </button>
        )}
      </Menu>

      {shareOpen && <ShareModal onClose={() => setShareOpen(false)} />}
    </div>
  );
}

function ShareModal({ onClose }: { onClose: () => void }) {
  const { dispatch } = useWorkspace();
  const [copied, setCopied] = useState(false);
  const watchers = WATCHER_IDS.map(person);

  return (
    <Modal
      title="Share request OM-49"
      description="Anyone with access to Acme's Omnea workspace can open this request."
      onClose={onClose}
      footer={
        <>
          <Button size="md" onClick={onClose}>
            Close
          </Button>
          <Button
            size="md"
            variant="primary"
            onClick={() => {
              dispatch({ type: 'toast/show', message: "Invite sent - they'll get access once they accept.", tone: 'success' });
              onClose();
            }}
          >
            Send invite
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-[14px] pb-[6px]">
        <div className="flex items-center gap-[8px]">
          <div className="flex-1 truncate rounded-sm border border-border-default bg-surface-subtle px-[12px] py-[9px] text-[12px] text-text-secondary">
            app.omnea.com/requests/OM-49
          </div>
          <Button
            onClick={() => {
              setCopied(true);
              dispatch({ type: 'toast/show', message: 'Link copied - paste it anywhere to invite someone.', tone: 'success' });
            }}
          >
            {copied ? 'Copied' : 'Copy link'}
          </Button>
        </div>

        <div className="flex flex-col gap-[8px]">
          <span className="text-[10px] font-medium tracking-[0.8px] text-text-muted uppercase">
            People with access
          </span>
          {watchers.map((watcher) => (
            <div key={watcher.id} className="flex items-center gap-[10px]">
              <Avatar person={watcher} size="md" />
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-[12px] font-medium text-text-primary">{watcher.name}</span>
                <span className="truncate text-[11px] text-text-muted">{watcher.jobTitle}</span>
              </div>
              <span className="text-[11px] text-text-muted">Can comment</span>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
}
