import type {
  AnswerMap,
  DocumentRow,
  StatItem,
  TaskForm,
  WorkflowStage,
  WorkflowStep,
} from '@/domain/types';
import { STAT_STRIP } from '@/domain/workflow';
import { SUBMISSION_FORMS } from '@/domain/submissions';
import { TASK_FORMS } from '@/domain/tasks';
import { person } from '@/domain/people';
import type { WorkspaceState } from './workspaceReducer';

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

export function taskProgress(form: TaskForm, answers: AnswerMap): TaskProgress {
  const sections: Record<string, SectionProgress> = {};
  let answered = 0;
  let total = 0;

  for (const section of form.sections) {
    let sectionAnswered = 0;
    let flagged = 0;
    for (const question of section.questions) {
      const value = answers[question.id];
      if (value && value.length > 0) {
        sectionAnswered += 1;
        if (question.flagged) flagged += 1;
      }
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

/**
 * Tab badges are derived from what each tab actually shows, so the numbers add
 * up against the content: tasks still to finish, open comments across the
 * submitted forms, and rows in the documents table.
 */
export function tabCounts(state: WorkspaceState) {
  const openTasks = TASK_FORMS.filter((form) => {
    const progress = taskProgress(form, state.taskAnswers);
    return progress.answered < progress.total;
  }).length;

  const submissionComments = SUBMISSION_FORMS.reduce(
    (total, form) => total + (form.commentCount ?? 0),
    0,
  );

  return {
    tasks: openTasks,
    submissions: submissionComments,
    documents: state.documents.length,
  };
}
