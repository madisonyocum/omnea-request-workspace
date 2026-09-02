/** Domain types for a single procurement request workspace. */

export type TabId = 'overview' | 'tasks' | 'intake' | 'submissions' | 'documents';

/** Who the workspace is currently being previewed as. */
export type UserRole = 'requester' | 'approver' | 'admin';

export interface Person {
  id: string;
  name: string;
  initials: string;
  /** Avatar background — the design uses a fixed per-person colour. */
  colour: string;
  email?: string;
  jobTitle?: string;
}

/* ---------------------------------------------------------------- workflow */

export type StepStatus = 'complete' | 'active' | 'overdue' | 'declined' | 'waiting' | 'upcoming';

export type StepMetaIcon = 'doc' | 'bell' | 'clock' | 'arrow' | 'check' | 'x';

export interface StepMeta {
  icon: StepMetaIcon;
  label: string;
  /** "warning" draws attention to a chase, e.g. a reminder already sent. */
  tone?: 'default' | 'warning';
}

export interface StepArtefact {
  label: string;
  /** Tab the artefact chip navigates to, when the artefact lives in this workspace. */
  target?: TabId;
}

export interface StepEvent {
  at: string;
  label: string;
  actor?: string;
}

export interface WorkflowStep {
  id: string;
  name: string;
  assigneeId: string;
  status: StepStatus;
  /** Single caption line, e.g. "Submitted 24 May" or "Due 18 Jun". */
  caption?: string;
  /** Pill shown beside the due date, e.g. "3d in stage" / "2d overdue". */
  pill?: { label: string; tone: 'neutral' | 'danger' | 'success' };
  meta?: StepMeta;
  artefact?: StepArtefact;
  /** Status text shown beside a sibling step's name in the "also running" list. */
  lineStatus?: { label: string; tone: 'neutral' | 'danger' };
  /** Smaller sub-line under a sibling step in the "also running" list. */
  lineMeta?: string;
  /** Content for the step drawer. */
  detail: {
    summary: string;
    slaLabel: string;
    history: StepEvent[];
    attachments: { name: string; size: string }[];
  };
  /** Actions offered in the drawer for this step. */
  actions?: ('remind' | 'reassign' | 'skip' | 'approve' | 'open-form')[];
}

export type StageStatus = 'complete' | 'current' | 'upcoming';

export interface WorkflowStage {
  id: string;
  /** Phase name shown in the rail, e.g. "Approvals". */
  label: string;
  status: StageStatus;
  steps: WorkflowStep[];
  /** A cross-cutting risk banner shown under the active step, e.g. an open security review. */
  blocker?: { message: string; linkLabel: string };
}

/* ---------------------------------------------------------------- activity */

export interface CommentReply {
  id: string;
  authorId: string;
  timestamp: string;
  body: string;
}

export interface Comment {
  id: string;
  authorId: string;
  timestamp: string;
  body: string;
  resolved?: boolean;
  replies: CommentReply[];
}

/* ------------------------------------------------------------------- forms */

/**
 * An issue a reviewer raised against one answer, on a task or a submission.
 * Flags are what the count badges on the section lists refer to.
 */
export interface AnswerFlag {
  id: string;
  /** Answer the flag was raised against. */
  questionId: string;
  raisedById: string;
  raisedAt: string;
  /** What is wrong with the answer, in the reviewer's words. */
  reason: string;
  severity: 'blocker' | 'query';
  resolved?: boolean;
  /** Set when the flag is resolved, e.g. "Resolved 6 Jun by Alex Green". */
  resolution?: string;
}

export type QuestionKind = 'radio' | 'checkbox' | 'text' | 'longtext' | 'select' | 'chips';

export interface QuestionOption {
  id: string;
  label: string;
}

export interface Question {
  id: string;
  label: string;
  required?: boolean;
  kind: QuestionKind;
  options?: QuestionOption[];
  /** For text/longtext/select answers rendered read-only. */
  value?: string;
  /** Stacking direction for `chips` answers. Defaults to a single row. */
  layout?: 'row' | 'column';
  /** Sub-fields for grouped inputs (address, contact). */
  fields?: { label: string; value: string; halfWidth?: boolean }[];
}

export interface QuestionnaireSection {
  id: string;
  title: string;
  questions: Question[];
}

export type TaskSectionStatus = 'required' | 'optional' | 'complete';

export interface TaskForm {
  id: string;
  name: string;
  status: TaskSectionStatus;
  dueLabel: string;
  lastEdited: string;
  /** Issues raised against this task's answers. */
  flags?: AnswerFlag[];
  sections: QuestionnaireSection[];
}

/** Answers keyed by question id. Radio/select hold one id, checkbox holds many. */
export type AnswerMap = Record<string, string[]>;

/* ------------------------------------------------------------------ intake */

export interface IntakeGroup {
  id: string;
  /** Overline shown above the group; omitted for the first group. */
  overline?: string;
  navLabel: string;
  questions: Question[];
}

/* ------------------------------------------------------------- submissions */

export type SubmissionStatus = 'submitted' | 'pending' | 'in-review';

export interface SubmissionForm {
  id: string;
  name: string;
  group: 'Supplier assessment' | 'Engagement';
  status: SubmissionStatus;
  /** Issues raised against this form's answers. */
  flags?: AnswerFlag[];
  lastEdited?: string;
  questions: Question[];
}

/* --------------------------------------------------------------- documents */

export interface DocumentRow {
  id: string;
  name: string;
  storeInRepository: boolean;
  type?: string;
  source: string;
  uploadedById: string;
  uploadedAt: string;
}

export type DocumentSortKey = 'name' | 'type' | 'source' | 'uploadedAt';

/* ------------------------------------------------------------------ header */

export interface RequestSummary {
  supplier: string;
  reference: string;
  riskBadge: string;
  subtitle: string;
  logoInitial: string;
}

export interface StatItem {
  id: string;
  label: string;
  value: string;
  caption: string;
  tone?: 'default' | 'danger';
  captionTone?: 'default' | 'danger';
  /** Rendered as the 9-segment stage meter. */
  meter?: { total: number; complete: number; running: number };
  personId?: string;
}
