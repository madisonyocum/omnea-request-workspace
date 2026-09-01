import type { Comment, PendingAction, RequestSummary, StatItem, WorkflowStage } from './types';

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
  stageLabel: 'Stage 3 of 6',
  updatedLabel: 'Updated 6 Jun, 12:34',
};

export const WORKFLOW_STAGES: WorkflowStage[] = [
  {
    id: 'stage-1',
    label: 'Stage 1',
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
    label: 'Stage 2',
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
    label: 'Stage 3',
    status: 'current',
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
          attachments: [{ name: 'Business case.pdf', size: '640 KB' }],
        },
        actions: ['remind', 'reassign', 'open-form'],
      },
      {
        id: 'budget-approval',
        name: 'Budget approval',
        assigneeId: 'jaslyn',
        status: 'waiting',
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
    ],
  },
  {
    id: 'stage-4',
    label: 'Stage 4',
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
        id: 'legal-review',
        name: 'Legal review',
        assigneeId: 'angelina',
        status: 'waiting',
        detail: {
          summary: 'Legal review of the MSA and DPA, including the data retention clause raised by Robert Fox.',
          slaLabel: 'Not started · SLA 5 days',
          history: [{ at: '27 May, 11:06', label: 'Queued behind Stage 3', actor: 'Automation' }],
          attachments: [{ name: 'Mailchimp - Contract-v3.pdf', size: '820 KB' }],
        },
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
    label: 'Stage 5',
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
    label: 'Stage 6',
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

export const PENDING_ACTION: PendingAction = {
  stepId: 'budget-approval',
  duePill: 'Due in 2 days',
  title: 'Waiting on manager approval',
  subtitle: 'You sent a request 2 days ago to Jaslyn Moore',
  checklist: [
    { id: 'sent', label: 'Sent to your manager', state: 'done' },
    { id: 'security', label: 'Security review not started · 2 high risks', state: 'attention' },
  ],
  attachments: ['Pricing schedule.xlsx', 'MSA v3.2.pdf'],
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
