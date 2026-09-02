import { useEffect, useRef, useState } from 'react';
import { MessageSquarePlus, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { FormHeader, SplitFormCard } from '@/components/forms/SplitFormCard';
import type { SectionNavGroup } from '@/components/forms/SplitFormCard';
import { QuestionField } from '@/components/forms/QuestionField';
import { INTAKE_GROUPS, INTAKE_META } from '@/domain/intake';
import { person } from '@/domain/people';
import { useWorkspace } from '@/state/workspaceContext';

export function IntakeView() {
  const { dispatch } = useWorkspace();
  const [activeGroupId, setActiveGroupId] = useState(INTAKE_GROUPS[0].id);
  const [scrollRoot, setScrollRoot] = useState<HTMLDivElement | null>(null);
  const groupRefs = useRef(new Map<string, HTMLElement>());

  /** Scroll-spy: the nav follows whichever group is nearest the top of the pane. */
  useEffect(() => {
    if (!scrollRoot) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveGroupId(visible[0].target.id);
      },
      { root: scrollRoot, rootMargin: '0px 0px -70% 0px', threshold: 0 },
    );
    for (const element of groupRefs.current.values()) observer.observe(element);
    return () => observer.disconnect();
  }, [scrollRoot]);

  const navGroups: SectionNavGroup[] = [
    {
      id: 'intake-form',
      overline: 'Intake form',
      items: INTAKE_GROUPS.map((group) => ({ id: group.id, label: group.navLabel })),
    },
  ];

  const scrollToGroup = (id: string) => {
    setActiveGroupId(id);
    groupRefs.current.get(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <SplitFormCard
      groups={navGroups}
      activeId={activeGroupId}
      onSelect={scrollToGroup}
      bodyRef={setScrollRoot}
      header={
        <FormHeader
          title={INTAKE_META.title}
          subtitle={
            <>
              Last edited:{' '}
              <span className="font-medium text-text-secondary">
                {INTAKE_META.lastEditedAt} by {person(INTAKE_META.lastEditedById).name}
              </span>
            </>
          }
        >
          <div className="flex shrink-0 items-center gap-[8px]">
            <Button
              size="md"
              variant="primary"
              icon={<Pencil className="size-[13px]" strokeWidth={1.9} />}
              onClick={() => dispatch({ type: 'toast/show', message: 'Intake form unlocked for editing.' })}
            >
              Edit form
            </Button>
            <Button
              size="md"
              icon={<MessageSquarePlus className="size-[14px]" strokeWidth={1.8} />}
              onClick={() => dispatch({ type: 'toast/show', message: 'Comment thread opened on the intake form.' })}
            >
              Add comment
            </Button>
          </div>
        </FormHeader>
      }
    >
      <div className="flex flex-col px-[28px] pb-[20px]">
        {INTAKE_GROUPS.map((group, groupIndex) => (
          <section
            key={group.id}
            id={group.id}
            ref={(element) => {
              if (element) groupRefs.current.set(group.id, element);
              else groupRefs.current.delete(group.id);
            }}
            className="scroll-mt-[8px]"
          >
            {group.overline && (
              <div className="flex items-start pb-[6px] pt-[26px]">
                <span className="text-[10px] font-medium tracking-[0.8px] text-text-muted uppercase">
                  {group.overline}
                </span>
              </div>
            )}
            {group.questions.map((question, index) => (
              <QuestionField
                key={question.id}
                question={question}
                answer={question.value ? [question.value] : []}
                readOnly
                className={
                  groupIndex === INTAKE_GROUPS.length - 1 && index === group.questions.length - 1
                    ? undefined
                    : 'border-b border-border-subtle'
                }
                actions={
                  question.kind === 'longtext'
                    ? [
                        {
                          id: 'history',
                          label: 'View answer history',
                          onSelect: () =>
                            dispatch({ type: 'toast/show', message: 'No edits since this was submitted on 24 May.' }),
                        },
                        {
                          id: 'flag',
                          label: 'Flag for clarification',
                          onSelect: () =>
                            dispatch({
                              type: 'toast/show',
                              message: 'Clarification requested from Ben Williams.',
                              tone: 'success',
                            }),
                        },
                      ]
                    : undefined
                }
              />
            ))}
          </section>
        ))}
      </div>
    </SplitFormCard>
  );
}
