import { useState } from 'react';
import type { ReactNode } from 'react';
import { CornerDownRight, Paperclip } from 'lucide-react';
import { cn } from '@/lib/cn';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Pill';
import { Button } from '@/components/ui/Button';
import { PEOPLE, person } from '@/domain/people';
import type { Comment } from '@/domain/types';
import { useWorkspace } from '@/state/workspaceContext';

export function ActivityCard() {
  const { state, dispatch } = useWorkspace();
  const [openThreads, setOpenThreads] = useState<string[]>([]);
  const resolvedCount = state.comments.filter((comment) => comment.resolved).length;

  const toggleThread = (id: string) =>
    setOpenThreads((current) => (current.includes(id) ? current.filter((v) => v !== id) : [...current, id]));

  return (
    <section className="flex h-full min-h-0 flex-col rounded-lg border border-border-card bg-surface-card shadow-chrome">
      <header className="flex shrink-0 items-center gap-[8px] px-[24px] pt-[16px]">
        <h2 className="text-[16px] font-semibold text-text-primary">Activity</h2>
        <div className="flex-1" />
        <span className="text-[12px] text-text-muted">
          {state.comments.length} comments · {resolvedCount} resolved
        </span>
      </header>

      <div className="shrink-0 px-[24px] pt-[12px]">
        <Composer
          placeholder="Add a comment, or type @ to mention someone"
          onSubmit={(body) => dispatch({ type: 'comment/add', body })}
        />
      </div>

      <div className="scrollbar-slim min-h-0 flex-1 overflow-y-auto px-[24px] pb-[14px] pt-[14px]">
        <div className="flex flex-col gap-[16px]">
          {state.comments.map((comment) => (
            <CommentRow
              key={comment.id}
              comment={comment}
              expanded={openThreads.includes(comment.id)}
              onToggleThread={() => toggleThread(comment.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function CommentRow({
  comment,
  expanded,
  onToggleThread,
}: {
  comment: Comment;
  expanded: boolean;
  onToggleThread: () => void;
}) {
  const { dispatch } = useWorkspace();
  const author = person(comment.authorId);
  const replyAuthors = comment.replies.map((reply) => person(reply.authorId));

  return (
    <article className="group flex gap-[12px]">
      <Avatar person={author} size="xl" />
      <div className="flex min-w-0 flex-1 flex-col gap-[4px]">
        <div className="flex items-center gap-[8px]">
          <span className="text-[13px] font-semibold text-text-primary">{author.name}</span>
          <span className="text-[11px] text-text-muted">{comment.timestamp}</span>
          {comment.resolved && (
            <Badge tone="success" size="sm">
              RESOLVED
            </Badge>
          )}
          <div className="flex-1" />
          <button
            type="button"
            onClick={() => dispatch({ type: 'comment/toggle-resolved', commentId: comment.id })}
            className="cursor-pointer text-[11px] font-medium text-text-muted opacity-0 transition-opacity duration-150 hover:text-brand-700 group-hover:opacity-100"
          >
            {comment.resolved ? 'Reopen' : 'Resolve'}
          </button>
        </div>

        <p className="text-[13px] leading-[1.45] text-text-secondary">{comment.body}</p>

        {comment.replies.length > 0 && (
          <button
            type="button"
            onClick={onToggleThread}
            className="mt-[2px] flex w-fit cursor-pointer items-center gap-[6px]"
          >
            {replyAuthors.map((replyAuthor, index) => (
              <Avatar
                key={`${replyAuthor.id}-${index}`}
                person={replyAuthor}
                size="xs"
                className={index > 0 ? '-ml-[10px] ring-2 ring-surface-card' : undefined}
              />
            ))}
            <span className="text-[12px] font-medium text-brand-700 hover:underline">
              {expanded ? 'Hide replies' : `${comment.replies.length} replies`}
            </span>
          </button>
        )}

        {expanded && (
          <div className="mt-[8px] flex flex-col gap-[12px] border-l-2 border-border-subtle pl-[14px]">
            {comment.replies.map((reply) => {
              const replyAuthor = person(reply.authorId);
              return (
                <div key={reply.id} className="flex gap-[10px]">
                  <Avatar person={replyAuthor} size="md" />
                  <div className="flex min-w-0 flex-1 flex-col gap-[3px]">
                    <div className="flex items-center gap-[8px]">
                      <span className="text-[12px] font-semibold text-text-primary">{replyAuthor.name}</span>
                      <span className="text-[11px] text-text-muted">{reply.timestamp}</span>
                    </div>
                    <p className="text-[12px] leading-[1.45] text-text-secondary">{reply.body}</p>
                  </div>
                </div>
              );
            })}
            <Composer
              compact
              placeholder="Reply to this thread"
              icon={<CornerDownRight className="size-[13px] text-text-muted" strokeWidth={1.8} />}
              onSubmit={(body) => dispatch({ type: 'comment/reply', commentId: comment.id, body })}
            />
          </div>
        )}
      </div>
    </article>
  );
}

function Composer({
  placeholder,
  onSubmit,
  compact = false,
  icon,
}: {
  placeholder: string;
  onSubmit: (body: string) => void;
  compact?: boolean;
  icon?: ReactNode;
}) {
  const [value, setValue] = useState('');
  const [focused, setFocused] = useState(false);
  const canSubmit = value.trim().length > 0;

  const submit = () => {
    if (!canSubmit) return;
    onSubmit(value.trim());
    setValue('');
    setFocused(false);
  };

  return (
    <div className={cn('flex gap-[12px]', compact && 'gap-[10px]')}>
      {compact ? (
        <span className="mt-[9px] flex size-[24px] shrink-0 items-center justify-center">{icon}</span>
      ) : (
        <Avatar person={PEOPLE.me} size="xl" />
      )}
      <div className="flex min-w-0 flex-1 flex-col gap-[8px]">
        <div
          className={cn(
            'flex items-center gap-[8px] rounded-md border bg-surface-subtle px-[14px] py-[10px] transition-colors duration-150',
            focused ? 'border-brand-300 bg-surface-card' : 'border-border-default hover:border-border-strong',
          )}
        >
          <input
            value={value}
            placeholder={placeholder}
            onChange={(event) => setValue(event.target.value)}
            onFocus={() => setFocused(true)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') submit();
              if (event.key === 'Escape') {
                setValue('');
                setFocused(false);
                event.currentTarget.blur();
              }
            }}
            className="min-w-0 flex-1 bg-transparent text-[13px] text-text-primary outline-none placeholder:text-text-muted"
          />
          <Paperclip className="size-[14px] shrink-0 cursor-pointer text-text-muted hover:text-text-secondary" strokeWidth={1.7} />
        </div>
        {(focused || canSubmit) && (
          <div className="animate-fade-in flex items-center gap-[8px]">
            <Button variant="primary" disabled={!canSubmit} onClick={submit}>
              Comment
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setValue('');
                setFocused(false);
              }}
            >
              Cancel
            </Button>
            <span className="ml-[2px] text-[11px] text-text-muted">Enter to post</span>
          </div>
        )}
      </div>
    </div>
  );
}
