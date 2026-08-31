import type {
  AnswerMap,
  Comment,
  DocumentRow,
  DocumentSortKey,
  PendingAction,
  TabId,
  WorkflowStage,
  WorkflowStep,
} from '@/domain/types';
import { INITIAL_COMMENTS, PENDING_ACTION, WORKFLOW_STAGES } from '@/domain/workflow';
import { INITIAL_TASK_ANSWERS, TASK_FORMS } from '@/domain/tasks';
import { INITIAL_DOCUMENTS, SUBMISSION_FORMS } from '@/domain/submissions';
import { person } from '@/domain/people';

export interface Toast {
  id: string;
  message: string;
  tone: 'default' | 'success' | 'danger';
}

export interface WorkspaceState {
  activeTab: TabId;
  railNavId: string;
  following: boolean;
  stages: WorkflowStage[];
  comments: Comment[];
  pendingAction: PendingAction | null;
  /** Set once the signed-in user has actioned the pending approval. */
  actionOutcome: 'approved' | 'declined' | null;
  selectedStepId: string | null;
  taskAnswers: AnswerMap;
  activeTaskId: string;
  activeSubmissionId: string;
  documents: DocumentRow[];
  documentSort: { key: DocumentSortKey; direction: 'asc' | 'desc' } | null;
  toasts: Toast[];
}

export type WorkspaceAction =
  | { type: 'tab/select'; tab: TabId }
  | { type: 'rail/select'; id: string }
  | { type: 'following/toggle' }
  | { type: 'step/select'; stepId: string }
  | { type: 'step/close' }
  | { type: 'step/remind'; stepId: string }
  | { type: 'step/reassign'; stepId: string; assigneeId: string }
  | { type: 'action/approve' }
  | { type: 'action/decline'; reason: string }
  | { type: 'comment/add'; body: string }
  | { type: 'comment/reply'; commentId: string; body: string }
  | { type: 'comment/toggle-resolved'; commentId: string }
  | { type: 'task/select'; taskId: string }
  | { type: 'task/answer'; questionId: string; optionId: string; multiple: boolean }
  | { type: 'submission/select'; submissionId: string }
  | { type: 'document/toggle-store'; documentId: string }
  | { type: 'document/add'; name: string }
  | { type: 'document/remove'; documentId: string }
  | { type: 'document/sort'; key: DocumentSortKey }
  | { type: 'toast/show'; message: string; tone?: Toast['tone'] }
  | { type: 'toast/dismiss'; id: string };

export const initialWorkspaceState: WorkspaceState = {
  activeTab: 'overview',
  railNavId: 'inbox',
  following: true,
  stages: WORKFLOW_STAGES,
  comments: INITIAL_COMMENTS,
  pendingAction: PENDING_ACTION,
  actionOutcome: null,
  selectedStepId: null,
  taskAnswers: INITIAL_TASK_ANSWERS,
  activeTaskId: TASK_FORMS[0].id,
  activeSubmissionId: SUBMISSION_FORMS[0].id,
  documents: INITIAL_DOCUMENTS,
  documentSort: null,
  toasts: [],
};

/** Today's date in the prototype's timeline, used for generated captions. */
const TODAY = '6 Jun';

let sequence = 0;
const nextId = (prefix: string) => `${prefix}-${(sequence += 1)}`;

function mapStep(
  stages: WorkflowStage[],
  stepId: string,
  update: (step: WorkflowStep) => WorkflowStep,
): WorkflowStage[] {
  return stages.map((stage) => {
    if (!stage.steps.some((step) => step.id === stepId)) return stage;
    return { ...stage, steps: stage.steps.map((step) => (step.id === stepId ? update(step) : step)) };
  });
}

function withToast(state: WorkspaceState, message: string, tone: Toast['tone'] = 'default'): WorkspaceState {
  return { ...state, toasts: [...state.toasts, { id: nextId('toast'), message, tone }] };
}

function reminderLabel(step: WorkflowStep): string {
  const previous = step.detail.history.filter((event) => event.label === 'Reminder sent').length;
  const total = previous + 1;
  return total === 1 ? 'Reminder sent today' : `${total} reminders sent`;
}

export function workspaceReducer(state: WorkspaceState, action: WorkspaceAction): WorkspaceState {
  switch (action.type) {
    case 'tab/select':
      return { ...state, activeTab: action.tab };

    case 'rail/select':
      return { ...state, railNavId: action.id };

    case 'following/toggle':
      return withToast(
        { ...state, following: !state.following },
        state.following ? 'You have stopped following OM-49' : 'You are now following OM-49',
      );

    case 'step/select':
      return { ...state, selectedStepId: action.stepId };

    case 'step/close':
      return { ...state, selectedStepId: null };

    case 'step/remind': {
      const step = findStep(state.stages, action.stepId);
      if (!step) return state;
      return withToast(
        {
          ...state,
          stages: mapStep(state.stages, action.stepId, (current) => ({
            ...current,
            meta: { icon: 'bell', label: reminderLabel(current) },
            detail: {
              ...current.detail,
              history: [
                ...current.detail.history,
                { at: `${TODAY}, 12:34`, label: 'Reminder sent', actor: 'Alex Green' },
              ],
            },
          })),
        },
        `Reminder sent to ${person(step.assigneeId).name}`,
        'success',
      );
    }

    case 'step/reassign': {
      const step = findStep(state.stages, action.stepId);
      if (!step) return state;
      return withToast(
        {
          ...state,
          stages: mapStep(state.stages, action.stepId, (current) => ({
            ...current,
            assigneeId: action.assigneeId,
            detail: {
              ...current.detail,
              history: [
                ...current.detail.history,
                { at: `${TODAY}, 12:34`, label: 'Reassigned', actor: 'Alex Green' },
              ],
            },
          })),
        },
        `${step.name} reassigned`,
        'success',
      );
    }

    case 'action/approve': {
      if (!state.pendingAction) return state;
      const { stepId } = state.pendingAction;
      return withToast(
        {
          ...state,
          actionOutcome: 'approved',
          pendingAction: null,
          selectedStepId: null,
          stages: mapStep(state.stages, stepId, (step) => ({
            ...step,
            status: 'complete',
            caption: `Approved ${TODAY}`,
            pill: undefined,
            meta: { icon: 'check', label: 'Approved by you' },
            artefact: { label: 'Approval record' },
            detail: {
              ...step.detail,
              slaLabel: `Completed ${TODAY} · SLA 2 days`,
              history: [
                ...step.detail.history,
                { at: `${TODAY}, 12:34`, label: 'Approved', actor: 'Alex Green' },
              ],
            },
            actions: ['open-form'],
          })),
        },
        'Budget approval recorded',
        'success',
      );
    }

    case 'action/decline': {
      if (!state.pendingAction) return state;
      const { stepId } = state.pendingAction;
      const comment: Comment = {
        id: nextId('comment'),
        authorId: 'me',
        timestamp: 'Just now',
        body: `Declined budget approval — ${action.reason}`,
        replies: [],
      };
      return withToast(
        {
          ...state,
          actionOutcome: 'declined',
          pendingAction: null,
          selectedStepId: null,
          comments: [comment, ...state.comments],
          stages: mapStep(state.stages, stepId, (step) => ({
            ...step,
            status: 'declined',
            caption: `Declined ${TODAY}`,
            pill: { label: 'returned', tone: 'danger' },
            meta: { icon: 'x', label: 'Returned to requester' },
            artefact: { label: 'Decline reason' },
            detail: {
              ...step.detail,
              slaLabel: `Declined ${TODAY} · returned to requester`,
              history: [
                ...step.detail.history,
                { at: `${TODAY}, 12:34`, label: `Declined — ${action.reason}`, actor: 'Alex Green' },
              ],
            },
            actions: [],
          })),
        },
        'Budget approval declined and returned',
        'danger',
      );
    }

    case 'comment/add': {
      const comment: Comment = {
        id: nextId('comment'),
        authorId: 'me',
        timestamp: 'Just now',
        body: action.body,
        replies: [],
      };
      return { ...state, comments: [comment, ...state.comments] };
    }

    case 'comment/reply':
      return {
        ...state,
        comments: state.comments.map((comment) =>
          comment.id === action.commentId
            ? {
                ...comment,
                replies: [
                  ...comment.replies,
                  { id: nextId('reply'), authorId: 'me', timestamp: 'Just now', body: action.body },
                ],
              }
            : comment,
        ),
      };

    case 'comment/toggle-resolved': {
      const target = state.comments.find((comment) => comment.id === action.commentId);
      return withToast(
        {
          ...state,
          comments: state.comments.map((comment) =>
            comment.id === action.commentId ? { ...comment, resolved: !comment.resolved } : comment,
          ),
        },
        target?.resolved ? 'Comment reopened' : 'Comment resolved',
      );
    }

    case 'task/select':
      return { ...state, activeTaskId: action.taskId };

    case 'task/answer': {
      const current = state.taskAnswers[action.questionId] ?? [];
      const next = action.multiple
        ? current.includes(action.optionId)
          ? current.filter((id) => id !== action.optionId)
          : [...current, action.optionId]
        : [action.optionId];
      const answers = { ...state.taskAnswers };
      if (next.length === 0) delete answers[action.questionId];
      else answers[action.questionId] = next;
      return { ...state, taskAnswers: answers };
    }

    case 'submission/select':
      return { ...state, activeSubmissionId: action.submissionId };

    case 'document/toggle-store':
      return {
        ...state,
        documents: state.documents.map((doc) =>
          doc.id === action.documentId ? { ...doc, storeInRepository: !doc.storeInRepository } : doc,
        ),
      };

    case 'document/add':
      return withToast(
        {
          ...state,
          documents: [
            {
              id: nextId('doc'),
              name: action.name,
              storeInRepository: true,
              source: 'Manual upload',
              uploadedById: 'me',
              uploadedAt: `${TODAY} 12:34`,
            },
            ...state.documents,
          ],
        },
        `${action.name} uploaded`,
        'success',
      );

    case 'document/remove': {
      const target = state.documents.find((doc) => doc.id === action.documentId);
      return withToast(
        { ...state, documents: state.documents.filter((doc) => doc.id !== action.documentId) },
        target ? `${target.name} removed` : 'Document removed',
      );
    }

    case 'document/sort': {
      const direction =
        state.documentSort?.key === action.key && state.documentSort.direction === 'asc' ? 'desc' : 'asc';
      return { ...state, documentSort: { key: action.key, direction } };
    }

    case 'toast/show':
      return withToast(state, action.message, action.tone);

    case 'toast/dismiss':
      return { ...state, toasts: state.toasts.filter((toast) => toast.id !== action.id) };

    default:
      return state;
  }
}

/* ------------------------------------------------------------------ helpers */

export function findStep(stages: WorkflowStage[], stepId: string): WorkflowStep | undefined {
  for (const stage of stages) {
    const step = stage.steps.find((candidate) => candidate.id === stepId);
    if (step) return step;
  }
  return undefined;
}

export function findStageForStep(stages: WorkflowStage[], stepId: string): WorkflowStage | undefined {
  return stages.find((stage) => stage.steps.some((step) => step.id === stepId));
}
