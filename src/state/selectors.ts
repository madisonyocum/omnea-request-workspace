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
 * Tab badges count rows the tab actually lists, so a badge always matches what
 * you see on opening it: tasks with work left, submitted forms carrying open
 * flags, and rows in the documents table.
 */
export function tabCounts(state: WorkspaceState) {
  const openTasks = TASK_FORMS.filter((form) => {
    const progress = taskProgress(form, state.taskAnswers);
    return progress.answered < progress.total || openFlags(state, 'task', form.id).length > 0;
  }).length;

  const flaggedSubmissions = SUBMISSION_FORMS.filter(
    (form) => openFlags(state, 'submission', form.id).length > 0,
  ).length;

  return {
    tasks: openTasks,
    submissions: flaggedSubmissions,
    documents: state.documents.length,
  };
}
