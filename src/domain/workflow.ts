import type { Comment, RequestSummary, StatItem, UserRole, WorkflowStage } from './types';

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
        actions: ['remind'],
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
        meta: { icon: 'clock', label: 'Waiting on Stage 3' },
        artefact: { label: 'Security questionnaire', target: 'tasks' },
        detail: {
          summary: 'Security assess the supplier questionnaire and the two open high risks before engagement.',
          slaLabel: 'Not started · SLA 5 days',
          history: [{ at: '27 May, 11:06', label: 'Queued behind Stage 3', actor: 'Automation' }],
          attachments: [{ name: 'Mailchimp - SOC2.pdf', size: '2.4 MB' }],
        },
        actions: ['open-form'],
      },
      {
        id: 'finance-review',
        name: 'Finance review',
        assigneeId: 'curtis',
        status: 'waiting',
        detail: {
          summary: 'Controller validates cost centre coding and payment terms ahead of PO creation.',
          slaLabel: 'Not started · SLA 3 days',
          history: [{ at: '27 May, 11:06', label: 'Queued behind Stage 3', actor: 'Automation' }],
          attachments: [],
        },
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

/** Who "you" are while previewing each role. */
export const ROLE_VIEWER_ID: Record<UserRole, string> = {
  requester: 'me',
  approver: 'martha',
  admin: 'me',
};

export const ROLE_TASKS_TAB: Record<UserRole, { label: string }> = {
  requester: { label: 'My tasks' },
  approver: { label: 'My approvals' },
  admin: { label: 'Queue' },
};

/** Approver/admin queues aren't backed by real per-request data — flavour counts only. */
export const ROLE_TASKS_COUNT: Partial<Record<UserRole, number>> = {
  approver: 3,
  admin: 12,
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

/** How the current step of the Approvals phase reads for each viewer. */
export const ROLE_ACTIVE_CARD: Record<UserRole, RoleActiveCardContent> = {
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
