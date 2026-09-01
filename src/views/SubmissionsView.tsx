import { useState } from 'react';
import { Clock } from 'lucide-react';
import { DotPill } from '@/components/ui/Pill';
import { FormHeader, SplitFormCard } from '@/components/forms/SplitFormCard';
import type { SectionNavGroup } from '@/components/forms/SplitFormCard';
import { QuestionField } from '@/components/forms/QuestionField';
import { AnswerFlags, FlagSummary, RaiseFlagModal } from '@/components/forms/AnswerFlags';
import { flagAnchorId } from '@/lib/flagAnchor';
import { SUBMISSION_FORMS } from '@/domain/submissions';
import type { AnswerFlag, SubmissionForm } from '@/domain/types';
import { formFlags, openFlags } from '@/state/selectors';
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
      flagCount: openFlags(state, 'submission', candidate.id).length,
    })),
  }));

  const open = openFlags(state, 'submission', form.id);
  const raised = formFlags(state, 'submission', form.id);

  return (
    <SplitFormCard
      groups={navGroups}
      activeId={form.id}
      onSelect={(submissionId) => dispatch({ type: 'submission/select', submissionId })}
      header={
        <FormHeader title={form.name} subtitle={form.lastEdited ?? `${form.group} · not yet requested`}>
          {open.length > 0 && (
            <DotPill tone="warning">
              {open.length} {open.length === 1 ? 'flag' : 'flags'} open
            </DotPill>
          )}
          {open.length === 0 && raised.length > 0 && <DotPill tone="success">All flags resolved</DotPill>}
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
  const { state, dispatch } = useWorkspace();
  const [flagging, setFlagging] = useState<string | null>(null);

  const flags = formFlags(state, 'submission', form.id);
  const open = flags.filter((flag) => !flag.resolved);
  const flagsFor = (questionId: string) => flags.filter((flag) => flag.questionId === questionId);
  const questionLabel = (questionId: string) =>
    /* Strip the "1. " prefix — the summary reads better without it. */
    (form.questions.find((question) => question.id === questionId)?.label ?? questionId).replace(/^\d+\.\s*/, '');

  if (form.status === 'pending') return <PendingState formName={form.name} />;

  return (
    <div className="flex flex-col px-[28px] pb-[20px] pt-[4px]">
      {open.length > 0 && (
        <div className="pb-[6px] pt-[14px]">
          <FlagSummary
            flags={open}
            questionLabel={questionLabel}
            note={`${form.name} cannot be signed off until Mailchimp updates these answers.`}
            onRequestUpdates={() =>
              dispatch({
                type: 'toast/show',
                message: `Update requested from Peter Kaminsky on ${open.length} flagged ${open.length === 1 ? 'answer' : 'answers'}`,
                tone: 'success',
              })
            }
          />
        </div>
      )}

      {form.questions.map((question, index) => {
        const questionFlags = flagsFor(question.id);
        return (
          <div key={question.id} id={flagAnchorId(question.id)}>
            <QuestionField
              question={question}
              answer={question.value ? [question.value] : []}
              readOnly
              className={index < form.questions.length - 1 ? 'border-b border-border-subtle' : undefined}
              footer={
                <AnswerFlags
                  flags={questionFlags}
                  onResolve={(flagId) => dispatch({ type: 'flag/resolve', scope: 'submission', formId: form.id, flagId })}
                  onReopen={(flagId) => dispatch({ type: 'flag/reopen', scope: 'submission', formId: form.id, flagId })}
                />
              }
              actions={[
                {
                  id: 'flag',
                  label: 'Flag this answer',
                  onSelect: () => setFlagging(question.id),
                },
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
          </div>
        );
      })}

      {flagging && (
        <RaiseFlagModal
          questionLabel={questionLabel(flagging)}
          onClose={() => setFlagging(null)}
          onSubmit={(reason, severity: AnswerFlag['severity']) =>
            dispatch({
              type: 'flag/raise',
              scope: 'submission',
              formId: form.id,
              questionId: flagging,
              reason,
              severity,
            })
          }
        />
      )}
    </div>
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
