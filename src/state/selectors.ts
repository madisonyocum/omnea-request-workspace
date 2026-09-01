import type {
  AnswerMap,
  DocumentRow,
  AnswerFlag,
  StatItem,
  TaskForm,
  WorkflowStage,
  WorkflowStep,
} from '@/domain/types';
import { STAT_STRIP } from '@/domain/workflow';
import { SUBMISSION_FORMS } from '@/domain/submissions';
import { TASK_FORMS } from '@/domain/tasks';
import { person } from '@/domain/people';
import type { FlagScope, WorkspaceState } from './workspaceReducer';

/** Steps the request is genuinely blocked on right now. */
export function runningSteps(stages: WorkflowStage[]): WorkflowStep[] {
  return stages
    .filter((stage) => stage.status === 'current')
    .flatMap((stage) => stage.steps)
    .filter((step) => step.status === 'active' || step.status === 'overdue' || step.status === 'declined');
}

/**
 * The stat strip is mostly static request metadata, but "Stage" and "Waiting on"
 * are recomputed so the header responds when a step is actioned.
 */
export function statStrip(state: WorkspaceState): StatItem[] {
  const running = runningSteps(state.stages);

  return STAT_STRIP.map((stat) => {
    if (stat.id === 'stage' && stat.meter) {
      return {
        ...stat,
        caption: `Approvals phase · ${running.length} running`,
        meter: { ...stat.meter, running: running.length },
      };
    }

    if (stat.id === 'waiting') {
      if (running.length === 0) {
        return { ...stat, value: 'Nobody', caption: 'All stage actions complete', personId: undefined };
      }
      const [first, ...rest] = running;
      const owner = person(first.assigneeId);
      const suffix = rest.length > 0 ? `+${rest.length} more · ` : '';
      return {
        ...stat,
        value: owner.name,
        caption: `${suffix}longest 3 days`,
        personId: owner.id,
      };
    }

    return stat;
  });
}

export interface SectionProgress {
  answered: number;
  total: number;
  flagged: number;
}

export interface TaskProgress {
  answered: number;
  total: number;
  sections: Record<string, SectionProgress>;
}

export function taskProgress(form: TaskForm, answers: AnswerMap, flags: AnswerFlag[] = []): TaskProgress {
  const sections: Record<string, SectionProgress> = {};
  const flaggedQuestions = new Set(flags.filter((flag) => !flag.resolved).map((flag) => flag.questionId));
  let answered = 0;
  let total = 0;

  for (const section of form.sections) {
    let sectionAnswered = 0;
    let flagged = 0;
    for (const question of section.questions) {
      const value = answers[question.id];
      if (value && value.length > 0) sectionAnswered += 1;
      if (flaggedQuestions.has(question.id)) flagged += 1;
    }
    sections[section.id] = { answered: sectionAnswered, total: section.questions.length, flagged };
    answered += sectionAnswered;
    total += section.questions.length;
  }

  return { answered, total, sections };
}

export function sortDocuments(
  documents: DocumentRow[],
  sort: WorkspaceState['documentSort'],
): DocumentRow[] {
  if (!sort) return documents;
  const factor = sort.direction === 'asc' ? 1 : -1;
  return [...documents].sort((a, b) => {
    const left = (a[sort.key] ?? '').toString().toLowerCase();
    const right = (b[sort.key] ?? '').toString().toLowerCase();
    return left.localeCompare(right) * factor;
  });
}

/** Every flag raised against one form's answers, resolved ones included. */
export function formFlags(state: WorkspaceState, scope: FlagScope, formId: string): AnswerFlag[] {
  return state.flags[scope][formId] ?? [];
}

/** Unresolved flags raised against one form's answers. */
export function openFlags(state: WorkspaceState, scope: FlagScope, formId: string): AnswerFlag[] {
  return formFlags(state, scope, formId).filter((flag) => !flag.resolved);
}

/**
 * The tasks and submissions badges are the total open flags across each tab's
 * forms, so they add up against the per-form flag badges and drop as flags are
 * resolved. Documents counts rows in the table.
 */
export function tabCounts(state: WorkspaceState) {
  const countFlags = (scope: FlagScope, formIds: string[]) =>
    formIds.reduce((total, formId) => total + openFlags(state, scope, formId).length, 0);

  return {
    tasks: countFlags('task', TASK_FORMS.map((form) => form.id)),
    submissions: countFlags('submission', SUBMISSION_FORMS.map((form) => form.id)),
    documents: state.documents.length,
  };
}
