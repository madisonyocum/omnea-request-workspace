import { Clock } from 'lucide-react';
import { DotPill } from '@/components/ui/Pill';
import { FormHeader, SplitFormCard } from '@/components/forms/SplitFormCard';
import type { SectionNavGroup } from '@/components/forms/SplitFormCard';
import { QuestionField } from '@/components/forms/QuestionField';
import { SUBMISSION_FORMS } from '@/domain/submissions';
import type { SubmissionForm } from '@/domain/types';
import { useWorkspace } from '@/state/workspaceContext';

const GROUP_ORDER = ['Supplier assessment', 'Engagement'] as const;

export function SubmissionsView() {
  const { state, dispatch } = useWorkspace();
  const form =
    SUBMISSION_FORMS.find((candidate) => candidate.id === state.activeSubmissionId) ?? SUBMISSION_FORMS[0];

  const navGroups: SectionNavGroup[] = GROUP_ORDER.map((group) => ({
    id: group,
    overline: group,
    items: SUBMISSION_FORMS.filter((candidate) => candidate.group === group).map((candidate) => ({
      id: candidate.id,
      label: candidate.name,
      status: {
        label: candidate.status === 'submitted' ? 'Submitted' : 'Pending',
        tone: candidate.status === 'submitted' ? ('complete' as const) : ('pending' as const),
      },
      commentCount: candidate.commentCount,
    })),
  }));

  return (
    <SplitFormCard
      groups={navGroups}
      activeId={form.id}
      onSelect={(submissionId) => dispatch({ type: 'submission/select', submissionId })}
      header={
        <FormHeader title={form.name} subtitle={form.lastEdited ?? `${form.group} · not yet requested`}>
          {form.status === 'submitted' ? (
            <DotPill tone="success">Submitted</DotPill>
          ) : (
            <DotPill tone="muted">Pending</DotPill>
          )}
        </FormHeader>
      }
    >
      <SubmissionBody key={form.id} form={form} />
    </SplitFormCard>
  );
}

function SubmissionBody({ form }: { form: SubmissionForm }) {
  const { dispatch } = useWorkspace();

  return (
    <>
      {form.status === 'pending' ? (
        <PendingState formName={form.name} />
      ) : (
        <div className="flex flex-col px-[28px] pb-[20px] pt-[4px]">
          {form.questions.map((question, index) => (
            <QuestionField
              key={question.id}
              question={question}
              answer={question.value ? [question.value] : []}
              readOnly
              className={index < form.questions.length - 1 ? 'border-b border-border-subtle' : undefined}
              actions={[
                {
                  id: 'comment',
                  label: 'Comment on answer',
                  onSelect: () =>
                    dispatch({ type: 'toast/show', message: 'Comment thread opened on this answer' }),
                },
                {
                  id: 'request',
                  label: 'Request an update',
                  onSelect: () =>
                    dispatch({
                      type: 'toast/show',
                      message: 'Update requested from Peter Kaminsky',
                      tone: 'success',
                    }),
                },
              ]}
            />
          ))}
        </div>
      )}
    </>
  );
}

function PendingState({ formName }: { formName: string }) {
  return (
    <div className="flex flex-col items-center gap-[10px] px-[28px] py-[80px] text-center">
      <span className="flex size-[40px] items-center justify-center rounded-full bg-surface-sunken">
        <Clock className="size-[19px] text-text-muted" strokeWidth={1.7} />
      </span>
      <p className="text-[14px] font-semibold text-text-primary">{formName} has not been sent yet</p>
      <p className="max-w-[380px] text-[12px] leading-[1.55] text-text-muted">
        Engagement forms are issued to Mailchimp automatically once Stage 5 begins. Nothing is required from you
        right now.
      </p>
    </div>
  );
}
