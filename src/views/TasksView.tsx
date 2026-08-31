import { useRef, useState } from 'react';
import { Check, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/cn';
import { Button } from '@/components/ui/Button';
import { DotPill } from '@/components/ui/Pill';
import { FormHeader, SplitFormCard } from '@/components/forms/SplitFormCard';
import type { SectionNavGroup } from '@/components/forms/SplitFormCard';
import { QuestionField } from '@/components/forms/QuestionField';
import { TASK_FORMS } from '@/domain/tasks';
import type { QuestionnaireSection, TaskForm } from '@/domain/types';
import { taskProgress } from '@/state/selectors';
import type { SectionProgress, TaskProgress } from '@/state/selectors';
import { useWorkspace } from '@/state/workspaceContext';

export function TasksView() {
  const { state, dispatch } = useWorkspace();
  const form = TASK_FORMS.find((candidate) => candidate.id === state.activeTaskId) ?? TASK_FORMS[0];
  const progress = taskProgress(form, state.taskAnswers);

  const navGroups: SectionNavGroup[] = [
    {
      id: 'my-tasks',
      overline: 'My tasks',
      items: TASK_FORMS.map((task) => {
        const taskDone = taskProgress(task, state.taskAnswers);
        const complete = taskDone.answered === taskDone.total;
        return {
          id: task.id,
          label: task.name,
          status: {
            label: complete ? 'Ready to submit' : 'Required',
            tone: complete ? ('complete' as const) : ('active' as const),
          },
          commentCount: task.commentCount,
        };
      }),
    },
  ];

  return <TaskFormShell key={form.id} form={form} progress={progress} navGroups={navGroups} onSelectTask={(taskId) => dispatch({ type: 'task/select', taskId })} />;
}

function TaskFormShell({
  form,
  progress,
  navGroups,
  onSelectTask,
}: {
  form: TaskForm;
  progress: TaskProgress;
  navGroups: SectionNavGroup[];
  onSelectTask: (taskId: string) => void;
}) {
  const { state, dispatch } = useWorkspace();
  const sectionRefs = useRef(new Map<string, HTMLElement>());
  /** The first part-answered section opens by default, mirroring the design. */
  const [openSectionId, setOpenSectionId] = useState<string | null>(() => {
    const partial = form.sections.find((section) => {
      const sectionProgress = progress.sections[section.id];
      return sectionProgress.answered > 0 && sectionProgress.answered < sectionProgress.total;
    });
    return (partial ?? form.sections[0]).id;
  });

  const openIndex = form.sections.findIndex((section) => section.id === openSectionId);
  const nextSection = openIndex >= 0 ? form.sections[openIndex + 1] : form.sections[0];
  const flaggedTotal = Object.values(progress.sections).reduce((total, section) => total + section.flagged, 0);

  return (
    <SplitFormCard
      groups={navGroups}
      activeId={form.id}
      onSelect={onSelectTask}
      header={
        <div className="shrink-0">
          <FormHeader title={form.name} subtitle={form.lastEdited} bordered={false}>
            <DotPill tone="warning">
              {form.dueLabel}
              {flaggedTotal > 0 && ` · ${flaggedTotal} flagged`}
            </DotPill>
            <Button
              size="md"
              onClick={() => {
                dispatch({ type: 'toast/show', message: `${form.name} draft saved`, tone: 'success' });
                dispatch({ type: 'tab/select', tab: 'overview' });
              }}
            >
              Save &amp; close
            </Button>
            <Button
              size="md"
              variant="primary"
              onClick={() => {
                if (nextSection) {
                  setOpenSectionId(nextSection.id);
                  sectionRefs.current.get(nextSection.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                } else
                  dispatch({
                    type: 'toast/show',
                    message: `${form.name} submitted for review`,
                    tone: 'success',
                  });
              }}
            >
              {nextSection ? 'Next section' : 'Submit task'}
            </Button>
          </FormHeader>
          <div className="border-b border-border-subtle px-[28px] pb-[15px]">
            <p className="text-[12px] font-medium text-text-tertiary">
              {progress.answered} of {progress.total} answered
            </p>
          </div>
        </div>
      }
    >
      {form.sections.map((section) => (
        <SectionRow
          key={section.id}
          section={section}
          progress={progress.sections[section.id]}
          open={openSectionId === section.id}
          onToggle={() => setOpenSectionId((current) => (current === section.id ? null : section.id))}
          answers={state.taskAnswers}
          onAnswer={(questionId, optionId, multiple) =>
            dispatch({ type: 'task/answer', questionId, optionId, multiple })
          }
          registerRef={(element) => {
            if (element) sectionRefs.current.set(section.id, element);
            else sectionRefs.current.delete(section.id);
          }}
        />
      ))}
    </SplitFormCard>
  );
}

function SectionRow({
  section,
  progress,
  open,
  onToggle,
  answers,
  onAnswer,
  registerRef,
}: {
  section: QuestionnaireSection;
  progress: SectionProgress;
  open: boolean;
  onToggle: () => void;
  answers: Record<string, string[]>;
  onAnswer: (questionId: string, optionId: string, multiple: boolean) => void;
  registerRef: (element: HTMLElement | null) => void;
}) {
  return (
    <section ref={registerRef} className="scroll-mt-[4px] border-b border-border-subtle">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className={cn(
          'flex w-full cursor-pointer items-center gap-[12px] px-[28px] py-[16px] text-left transition-colors duration-150',
          open ? 'bg-surface-subtle' : 'hover:bg-surface-subtle/70',
        )}
      >
        <ChevronRight
          className={cn(
            'size-[16px] shrink-0 text-text-tertiary transition-transform duration-200',
            open && 'rotate-90',
          )}
          strokeWidth={1.8}
        />
        <SectionMarker progress={progress} />
        <span className={cn('min-w-0 flex-1 text-[13px] font-semibold', open ? 'text-text-primary' : 'text-text-secondary')}>
          {section.title}
        </span>
        <span className={cn('shrink-0 text-[12px]', progress.flagged > 0 ? 'text-warning-600' : 'text-text-muted')}>
          {progress.answered} of {progress.total}
          {progress.flagged > 0 && ` · ${progress.flagged} flagged`}
        </span>
      </button>

      {open && (
        <div className="animate-fade-in flex flex-col pb-[12px] pl-[72px] pr-[28px] pt-[4px]">
          {section.questions.map((question, index) => (
            <QuestionField
              key={question.id}
              question={question}
              answer={answers[question.id] ?? []}
              onSelect={(optionId) => onAnswer(question.id, optionId, question.kind === 'checkbox')}
              className={index < section.questions.length - 1 ? 'border-b border-border-subtle' : undefined}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function SectionMarker({ progress }: { progress: SectionProgress }) {
  if (progress.flagged > 0) {
    return (
      <span className="flex size-[18px] shrink-0 items-center justify-center rounded-full bg-warning-100 text-[9px] font-bold text-warning-700">
        !
      </span>
    );
  }
  if (progress.answered === progress.total) {
    return (
      <span className="flex size-[18px] shrink-0 items-center justify-center rounded-full bg-success-500">
        <Check className="size-[10px] text-white" strokeWidth={3.4} />
      </span>
    );
  }
  if (progress.answered > 0) {
    return <span className="size-[18px] shrink-0 rounded-full border-[5px] border-brand-600 bg-surface-card" />;
  }
  return <span className="size-[18px] shrink-0 rounded-full border-[1.4px] border-border-strong bg-surface-card" />;
}
