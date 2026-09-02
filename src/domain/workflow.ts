import type { Comment, RequestSummary, StatItem, UserRole, WorkflowStage, WorkflowStep } from './types';

export const REQUEST: RequestSummary = {
  supplier: 'Mailchimp',
  reference: 'OM-49',
  riskBadge: 'HIGH RISK',
  subtitle: 'New purchase · Acme Inc (USA) · raised by Ben Williams on 24 May 2024',
  logoInitial: 'M',
};

export const STAT_STRIP: StatItem[] = [
  {
    id: 'stage',
    label: 'Stage',
    value: '3 of 9',
    caption: 'Approvals phase · 2 running',
    meter: { total: 9, complete: 2, running: 2 },
  },
  { id: 'value', label: 'Value', value: '$20,000 / yr', caption: 'Marketing · in budget' },
  { id: 'due', label: 'Due', value: 'Mon, 18 Jun', caption: 'On track' },
  { id: 'risk', label: 'Risk', value: '13', caption: '7 open · 1 high', tone: 'danger' },
  {
    id: 'waiting',
    label: 'Waiting on',
    value: 'Martha Nelson',
    caption: '+1 more · longest 3 days',
    personId: 'martha',
  },
  { id: 'assurance', label: 'Assurance', value: 'SOC 2 valid', caption: 'DPA awaiting signature' },
];

export const WORKFLOW_META = {
  type: 'New purchase',
  stageLabel: 'Phase 3 of 6 · Stage 3 of 13',
  updatedLabel: 'Updated 6 Jun, 12:34',
};

export const WORKFLOW_STAGES: WorkflowStage[] = [
  {
    id: 'stage-1',
    label: 'Intake',
    status: 'complete',
    steps: [
      {
        id: 'intake',
        name: 'Intake',
        assigneeId: 'joe',
        status: 'complete',
        caption: 'Submitted 24 May',
        meta: { icon: 'doc', label: 'Intake form submitted' },
        artefact: { label: 'Intake form', target: 'intake' },
        detail: {
          summary: 'Requester completed the new purchase intake form. Routing rules matched the software track.',
          slaLabel: 'Completed in 4h 12m · SLA 1 day',
          history: [
            { at: '24 May, 09:02', label: 'Intake form started', actor: 'Ben Williams' },
            { at: '24 May, 13:14', label: 'Intake form submitted', actor: 'Ben Williams' },
            { at: '24 May, 13:14', label: 'Routed to procurement review', actor: 'Automation' },
          ],
          attachments: [{ name: 'Pricing schedule.xlsx', size: '84 KB' }],
        },
        actions: ['open-form'],
      },
    ],
  },
  {
    id: 'stage-2',
    label: 'Procurement',
    status: 'complete',
    steps: [
      {
        id: 'procurement-review',
        name: 'Procurement review',
        assigneeId: 'devon',
        status: 'complete',
        caption: 'Approved 27 May',
        meta: { icon: 'doc', label: 'Approved - 2 comments' },
        artefact: { label: 'Review form' },
        detail: {
          summary: 'Procurement confirmed there is no existing contract that covers marketing automation.',
          slaLabel: 'Completed in 2d 6h · SLA 3 days',
          history: [
            { at: '24 May, 13:20', label: 'Assigned to Devon Lane', actor: 'Automation' },
            { at: '26 May, 10:41', label: 'Comment added on pricing tiers', actor: 'Devon Lane' },
            { at: '27 May, 11:05', label: 'Approved with conditions', actor: 'Devon Lane' },
          ],
          attachments: [
            { name: 'Procurement review.pdf', size: '212 KB' },
            { name: 'Supplier comparison.xlsx', size: '48 KB' },
          ],
        },
        actions: ['open-form'],
      },
    ],
  },
  {
    id: 'stage-3',
    label: 'Approvals',
    status: 'current',
    blocker: { message: 'Security review not started · 2 high risks', linkLabel: 'Open risks' },
    steps: [
      {
        id: 'manager-approval',
        name: 'Manager approval',
        assigneeId: 'martha',
        status: 'active',
        caption: 'Due 1 Jun',
        pill: { label: '3d in stage', tone: 'neutral' },
        meta: { icon: 'bell', label: 'Reminder sent 30 May', tone: 'warning' },
        artefact: { label: 'Approval form' },
        detail: {
          summary: 'Line manager sign-off on the commercial case before finance releases budget.',
          slaLabel: '3 days in stage · SLA 2 days',
          history: [
            { at: '27 May, 11:06', label: 'Assigned to Martha Nelson', actor: 'Automation' },
            { at: '30 May, 08:00', label: 'Reminder sent', actor: 'Automation' },
          ],
          attachments: [
            { name: 'Approval form', size: '128 KB' },
            { name: 'Budget request', size: '64 KB' },
            { name: 'Business case.pdf', size: '640 KB' },
            { name: 'Vendor quote.pdf', size: '212 KB' },
          ],
        },
        actions: ['remind', 'reassign', 'open-form'],
      },
      {
        id: 'budget-approval',
        name: 'Budget approval',
        assigneeId: 'jaslyn',
        status: 'overdue',
        lineStatus: { label: '2 days overdue · blocking PO', tone: 'danger' },
        lineMeta: 'Due 29 May · 4 days in stage · £48,000 · Last nudged 1 Jun · 3 files',
        detail: {
          summary: 'Finance confirms the spend sits inside the approved FY26 marketing envelope.',
          slaLabel: 'Requested 2 days ago · SLA 2 days',
          history: [
            { at: '27 May, 11:06', label: 'Assigned to Jaslyn Moore', actor: 'Automation' },
            { at: '4 Jun, 09:12', label: 'Approval requested', actor: 'Alex Green' },
          ],
          attachments: [
            { name: 'Pricing schedule.xlsx', size: '84 KB' },
            { name: 'MSA v3.2.pdf', size: '1.2 MB' },
          ],
        },
        actions: ['approve', 'remind', 'reassign'],
      },
      {
        id: 'legal-review',
        name: 'Legal review',
        assigneeId: 'angelina',
        status: 'waiting',
        lineStatus: { label: 'Not started · waiting on DPA', tone: 'neutral' },
        lineMeta: 'Queued behind Budget approval · Est. 3 days · DPA requested 1 Jun · 1 file',
        detail: {
          summary: 'Legal review of the MSA and DPA, including the data retention clause raised by Robert Fox.',
          slaLabel: 'Not started · SLA 5 days',
          history: [{ at: '27 May, 11:06', label: 'Queued behind Budget approval', actor: 'Automation' }],
          attachments: [{ name: 'Mailchimp - Contract-v3.pdf', size: '820 KB' }],
        },
        actions: ['remind', 'approve'],
      },
    ],
  },
  {
    id: 'stage-4',
    label: 'Reviews',
    status: 'upcoming',
    steps: [
      {
        id: 'security-review',
        name: 'Security review',
        assigneeId: 'sadie',
        status: 'waiting',
        artefact: { label: 'Security questionnaire', target: 'tasks' },
        detail: {
          summary: 'Security assess the supplier questionnaire and the two open high risks before engagement.',
          slaLabel: 'Not started · SLA 5 days',
          history: [{ at: '27 May, 11:06', label: 'Queued behind Stage 3', actor: 'Automation' }],
          attachments: [
            { name: 'Security questionnaire', size: '96 KB' },
            { name: 'Approval form', size: '128 KB' },
            { name: 'Mailchimp - SOC2.pdf', size: '2.4 MB' },
          ],
        },
        actions: ['remind', 'reassign', 'approve'],
      },
      {
        id: 'finance-review',
        name: 'Finance review',
        assigneeId: 'curtis',
        status: 'active',
        lineStatus: { label: 'Not started', tone: 'neutral' },
        lineMeta: 'Awaiting security clearance · SLA 3 days',
        detail: {
          summary: 'Controller validates cost centre coding and payment terms ahead of PO creation.',
          slaLabel: 'Not started · SLA 3 days',
          history: [{ at: '27 May, 11:06', label: 'Queued behind Stage 3', actor: 'Automation' }],
          attachments: [],
        },
        actions: ['remind', 'approve'],
      },
    ],
  },
  {
    id: 'stage-5',
    label: 'Engagement',
    status: 'upcoming',
    steps: [
      {
        id: 'create-engagement',
        name: 'Create engagement',
        assigneeId: 'procurement',
        status: 'upcoming',
        caption: 'Due 18 Jun',
        artefact: { label: 'Engagement form', target: 'submissions' },
        detail: {
          summary: 'Procurement records the engagement, owner and renewal date in the supplier register.',
          slaLabel: 'Not started · SLA 2 days',
          history: [],
          attachments: [],
        },
        actions: ['open-form'],
      },
    ],
  },
  {
    id: 'stage-6',
    label: 'Purchase order',
    status: 'upcoming',
    steps: [
      {
        id: 'create-po',
        name: 'Create PO',
        assigneeId: 'netsuite',
        status: 'upcoming',
        caption: 'Due 18 Jun',
        meta: { icon: 'arrow', label: 'Runs automatically' },
        artefact: { label: 'Netsuite payload' },
        detail: {
          summary: 'Netsuite creates the purchase order from the approved engagement and notifies the requester.',
          slaLabel: 'Automated · runs on stage entry',
          history: [],
          attachments: [],
        },
      },
    ],
  },
];

/* -------------------------------------------------------------- user roles */

export const ROLE_LABEL: Record<UserRole, string> = {
  requester: 'Requester',
  approver: 'Approver',
  admin: 'Admin',
};

/**
 * Who "you" are while previewing each role. Requester and admin are always
 * Alex Green; the approver is always whoever the current phase's lead step
 * is actually assigned to, so "Approver" tracks the real decision-maker as
 * the workflow moves from Martha (Approvals) to Sadie (Reviews) and so on.
 */
export function roleViewerId(role: UserRole, stages: WorkflowStage[]): string {
  if (role !== 'approver') return 'me';
  const current = stages.find((stage) => stage.status === 'current');
  return current?.steps[0]?.assigneeId ?? 'martha';
}

export const ROLE_TASKS_TAB: Record<UserRole, { label: string }> = {
  requester: { label: 'My tasks' },
  approver: { label: 'Tasks' },
  admin: { label: 'Queue' },
};

/** Approver/admin queues aren't backed by real per-request data — flavour counts only. */
export const ROLE_TASKS_COUNT: Partial<Record<UserRole, number>> = {
  approver: 3,
  admin: 12,
};

/**
 * Admin's "Waiting on" caption when the blocking step isn't (yet) overdue —
 * keyed by stage id so a phase that just started doesn't inherit another
 * phase's urgency framing. Falls back to a neutral caption when unset.
 */
export const ROLE_ADMIN_SLA_CAPTION: Record<string, string> = {
  'stage-3': 'SLA breach in 1 day',
};

/** The 5th stat-strip tile, which reframes around what the viewer needs to know. */
export const ROLE_STAT: Record<UserRole, StatItem> = {
  requester: {
    id: 'waiting',
    label: 'Waiting on',
    value: 'Martha Nelson',
    caption: '+1 more · longest 3 days',
    personId: 'martha',
  },
  approver: {
    id: 'decision',
    label: 'Your decision',
    value: 'Approval needed',
    caption: 'Sent by Ben Williams',
  },
  admin: {
    id: 'waiting',
    label: 'Waiting on',
    value: 'Martha Nelson',
    caption: 'SLA breach in 1 day',
    captionTone: 'danger',
    personId: 'martha',
  },
};

export interface RoleActionButton {
  label: string;
  variant: 'dark' | 'secondary';
  kind: 'remind' | 'reassign' | 'approve' | 'decline' | 'override' | 'reopen';
}

export interface RoleActiveCardContent {
  duePill: string;
  contextLabel: string;
  body: string;
  meta: { personId: string; caption: string };
  actions: RoleActionButton[];
  linkLabel: string;
  policyBanner?: { message: string; linkLabel: string };
}

/** How the current step of each phase reads for each viewer, keyed by stage id. */
export const ROLE_ACTIVE_CARD: Record<string, Record<UserRole, RoleActiveCardContent>> = {
  'stage-3': {
    requester: {
      duePill: 'Due in 2 days',
      contextLabel: 'APPROVALS · STAGE 1 OF 3',
      body: 'Waiting on Martha Nelson. You sent the request 2 days ago.',
      meta: { personId: 'martha', caption: 'Due 1 Jun · 3 days in stage' },
      actions: [
        { label: 'Send reminder', variant: 'dark', kind: 'remind' },
        { label: 'Reassign approver', variant: 'secondary', kind: 'reassign' },
      ],
      linkLabel: 'More details',
    },
    approver: {
      duePill: 'Needs your decision',
      contextLabel: 'YOUR LINE · APPROVALS · STAGE 1 OF 3',
      body: 'Ben Williams sent this to you on 4 Jun. Approving here unblocks Budget approval and the purchase order.',
      meta: { personId: 'ben', caption: 'Requested 4 Jun · Waiting 2 days' },
      actions: [
        { label: 'Approve request', variant: 'dark', kind: 'approve' },
        { label: 'Decline', variant: 'secondary', kind: 'decline' },
      ],
      linkLabel: 'More details',
    },
    admin: {
      duePill: 'Due in 2 days',
      contextLabel: 'APPROVALS · STAGE 1 OF 3',
      body: 'Waiting on Martha Nelson for 3 days. The 3-day approval SLA breaches tomorrow at 12:00.',
      meta: { personId: 'martha', caption: 'Due 1 Jun · 3 days in stage · SLA 3 days' },
      actions: [
        { label: 'Send reminder', variant: 'dark', kind: 'remind' },
        { label: 'Reassign approver', variant: 'secondary', kind: 'reassign' },
        { label: 'Override & advance', variant: 'secondary', kind: 'override' },
      ],
      linkLabel: 'Audit trail',
      policyBanner: {
        message: 'Policy · 3-day approval SLA, auto-escalates to Priya Raman on breach',
        linkLabel: 'Edit rule',
      },
    },
  },
  'stage-4': {
    requester: {
      duePill: 'In progress',
      contextLabel: 'REVIEWS · STAGE 1 OF 2',
      body: 'Waiting on Sadie Bernard to finish the security review — the last thing standing between here and engagement.',
      meta: { personId: 'sadie', caption: 'Started 6 Jun · SLA 5 days' },
      actions: [
        { label: 'Send reminder', variant: 'dark', kind: 'remind' },
        { label: 'Reassign approver', variant: 'secondary', kind: 'reassign' },
      ],
      linkLabel: 'More details',
    },
    approver: {
      duePill: 'Needs your review',
      contextLabel: 'YOUR LINE · REVIEWS · STAGE 1 OF 2',
      body: 'Alex Green sent this to you once Approvals cleared. Approving here unblocks Finance review and engagement.',
      meta: { personId: 'me', caption: 'Requested 6 Jun · Waiting 0 days' },
      actions: [
        { label: 'Approve request', variant: 'dark', kind: 'approve' },
        { label: 'Decline', variant: 'secondary', kind: 'decline' },
      ],
      linkLabel: 'More details',
    },
    admin: {
      duePill: 'In progress',
      contextLabel: 'REVIEWS · STAGE 1 OF 2',
      body: 'Sadie Bernard is inside the 5-day security review SLA, with no open risks since Approvals cleared.',
      meta: { personId: 'sadie', caption: 'Started 6 Jun · SLA 5 days' },
      actions: [
        { label: 'Send reminder', variant: 'dark', kind: 'remind' },
        { label: 'Reassign approver', variant: 'secondary', kind: 'reassign' },
        { label: 'Override & advance', variant: 'secondary', kind: 'override' },
      ],
      linkLabel: 'Audit trail',
      policyBanner: {
        message: 'Policy · 5-day security review SLA, auto-escalates to the CISO on breach',
        linkLabel: 'Edit rule',
      },
    },
  },
};

export interface RoleApprovedContent {
  /** {next}, {nextAssignee} and {time} are resolved against the real next step at render time. */
  body: string;
  metaCaption: string;
  banner: { message: string; linkLabel: string };
  /** Admin only — surfaces when the next line is itself overdue. */
  escalation?: { message: string; linkLabel: string };
  /** Omitted for phases with no authored hand-off copy — just the banner and link show. */
  primaryLabel?: string;
  primaryKind?: 'open-next' | 'back-to-queue';
  secondaryLabel: string;
}

/** How the just-approved step reads for each viewer, keyed by stage id. */
export const ROLE_APPROVED_CARD: Record<string, Record<UserRole, RoleApprovedContent>> = {
  'stage-3': {
    requester: {
      body: 'Martha Nelson approved this stage just now. {next} is the last thing holding up the purchase order.',
      metaCaption: '3 days in stage',
      banner: { message: 'Approved by Martha Nelson · {time} · {next} unlocked', linkLabel: 'View approval' },
      primaryLabel: 'Open {next}',
      primaryKind: 'open-next',
      secondaryLabel: 'View approval',
    },
    approver: {
      body: 'You approved this stage at {time}. {next} is next — nothing else on this request needs you.',
      metaCaption: '4 days in stage',
      banner: { message: 'You approved this · {time} · {nextAssignee} notified', linkLabel: 'View approval' },
      primaryLabel: 'Back to my approvals',
      primaryKind: 'back-to-queue',
      secondaryLabel: 'View approval',
    },
    admin: {
      body: 'Martha Nelson approved at {time}, inside the 3-day SLA. {next} is now the critical path{nextCritical}.',
      metaCaption: '3 days in stage · SLA 3 days',
      banner: { message: 'Approved by Martha Nelson · {time} · logged to audit trail', linkLabel: 'View audit log' },
      escalation: { message: '{next} overdue 2 days · auto-escalated to Priya Raman', linkLabel: 'Override & advance' },
      primaryLabel: 'Open {next}',
      primaryKind: 'open-next',
      secondaryLabel: 'View audit log',
    },
  },
  'stage-4': {
    requester: {
      body: 'Sadie Bernard approved the security review just now. {next} is the last thing holding up engagement.',
      metaCaption: '1 day in stage',
      banner: { message: 'Approved by Sadie Bernard · {time} · {next} unlocked', linkLabel: 'View approval' },
      primaryLabel: 'Open {next}',
      primaryKind: 'open-next',
      secondaryLabel: 'View approval',
    },
    approver: {
      body: 'You approved this stage at {time}. {next} is next — nothing else on this request needs you.',
      metaCaption: '1 day in stage',
      banner: { message: 'You approved this · {time} · {nextAssignee} notified', linkLabel: 'View approval' },
      primaryLabel: 'Back to my approvals',
      primaryKind: 'back-to-queue',
      secondaryLabel: 'View approval',
    },
    admin: {
      body: 'Sadie Bernard approved at {time}, inside the 5-day SLA. {next} is now the critical path{nextCritical}.',
      metaCaption: '1 day in stage · SLA 5 days',
      banner: { message: 'Approved by Sadie Bernard · {time} · logged to audit trail', linkLabel: 'View audit log' },
      escalation: { message: '{next} is overdue · auto-escalated to the finance lead', linkLabel: 'Override & advance' },
      primaryLabel: 'Open {next}',
      primaryKind: 'open-next',
      secondaryLabel: 'View audit log',
    },
  },
};

export interface RoleAlsoRunningContent {
  heading: string;
  /** Approvers only view the other lines; requesters and admins can act on them. */
  viewOnly: boolean;
}

export const ROLE_ALSO_RUNNING: Record<UserRole, RoleAlsoRunningContent> = {
  requester: { heading: 'ALSO RUNNING IN THIS PHASE', viewOnly: false },
  approver: { heading: 'OTHER LINES IN THIS PHASE · VIEW ONLY', viewOnly: true },
  admin: { heading: 'ALL LINES IN THIS PHASE · YOU CAN OVERRIDE', viewOnly: false },
};

/**
 * The signature colour for the "current" indicators — phase rail highlight,
 * the active card's rail — so the top of the workflow reads at a glance as
 * requester (brand), approver (amber, decision pending) or admin (ink).
 */
export const ROLE_ACCENT: Record<UserRole, { tint: string; dot: string; rail: string; text: string }> = {
  requester: { tint: 'bg-surface-brand-tint', dot: 'bg-brand-600', rail: 'bg-brand-600', text: 'text-brand-700' },
  approver: { tint: 'bg-warning-50', dot: 'bg-warning-500', rail: 'bg-warning-500', text: 'text-warning-700' },
  admin: { tint: 'bg-surface-sunken', dot: 'bg-surface-rail-active', rail: 'bg-surface-rail-active', text: 'text-text-primary' },
};

/**
 * Every phase is browsable from the rail, but only Approvals and Reviews have
 * bespoke role narratives (above). Other phases fall back to their own real
 * step data — still live, just not role-flavoured — so nothing crashes or
 * shows placeholder copy when you click Intake, Engagement, etc.
 */
export function genericActiveCardContent(step: WorkflowStep, stage: WorkflowStage): RoleActiveCardContent {
  const isPreview = stage.status === 'upcoming';
  return {
    duePill: step.pill?.label ?? step.caption ?? (isPreview ? 'Not started' : 'In progress'),
    contextLabel: `${stage.label.toUpperCase()} · STAGE 1 OF ${stage.steps.length}`,
    body: step.detail.summary,
    meta: { personId: step.assigneeId, caption: step.detail.slaLabel },
    actions: isPreview
      ? []
      : (step.actions ?? []).flatMap((action): RoleActionButton[] => {
          if (action === 'remind') return [{ label: 'Send reminder', variant: 'dark', kind: 'remind' }];
          if (action === 'reassign') return [{ label: 'Reassign', variant: 'secondary', kind: 'reassign' }];
          return [];
        }),
    linkLabel: 'More details',
  };
}

export function genericApprovedContent(step: WorkflowStep): RoleApprovedContent {
  const last = step.detail.history[step.detail.history.length - 1];
  return {
    body: step.detail.summary,
    metaCaption: step.detail.slaLabel,
    banner: {
      message: last ? `${last.label} · ${last.at}${last.actor ? ` · ${last.actor}` : ''}` : 'Completed',
      linkLabel: 'View details',
    },
    secondaryLabel: 'View details',
  };
}

export const INITIAL_COMMENTS: Comment[] = [
  {
    id: 'c1',
    authorId: 'anna',
    timestamp: '1h ago',
    body: 'Can we make sure we follow up with them regarding the Pentest in 3 months?',
    replies: [],
  },
  {
    id: 'c2',
    authorId: 'robert',
    timestamp: 'Yesterday, 14:51',
    body: 'Clause 5.2(a) is ambiguous on data retention. We should specify a maximum retention window after termination.',
    replies: [
      {
        id: 'c2r1',
        authorId: 'lena',
        timestamp: 'Yesterday, 15:20',
        body: 'Agreed — I have drafted a 30 day deletion window and shared it with their counsel.',
      },
      {
        id: 'c2r2',
        authorId: 'john',
        timestamp: 'Yesterday, 16:02',
        body: 'Mailchimp came back asking for 90 days. Flagging for legal review in Stage 4.',
      },
    ],
  },
  {
    id: 'c3',
    authorId: 'sam',
    timestamp: '25 May, 15:52',
    body: 'SOC 2 Type 2 and SSO only come with the Enterprise plan, which is 3x more expensive.',
    resolved: true,
    replies: [],
  },
];
