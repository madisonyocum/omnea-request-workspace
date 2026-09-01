import type { AnswerMap, TaskForm } from './types';

const yesNo = [
  { id: 'yes', label: 'Yes' },
  { id: 'no', label: 'No' },
];

export const TASK_FORMS: TaskForm[] = [
  {
    id: 'security',
    name: 'Security',
    flags: [
      {
        id: 'task-flag-sec-1',
        questionId: 'pen-2',
        raisedById: 'sadie',
        raisedAt: '11 Sep',
        reason: 'A test older than 24 months does not meet the policy. Book one before this goes to security review.',
        severity: 'blocker',
      },
      {
        id: 'task-flag-sec-2',
        questionId: 'dh-4',
        raisedById: 'amir',
        raisedAt: '12 Sep',
        reason: 'Sub-processors are named as yes but not listed. Add the full list before submitting.',
        severity: 'query',
      },
    ],
    status: 'required',
    dueLabel: 'Due 17 Sep',
    lastEdited: 'Last edited 10 Sep by Peter Kaminsky',
    sections: [
      {
        id: 'governance',
        title: 'Governance & policy',
        questions: [
          {
            id: 'gov-1',
            label: 'Do you hold a current ISO 27001 certificate or SOC 2 Type 2 report?',
            kind: 'radio',
            options: [
              { id: 'iso', label: 'ISO 27001' },
              { id: 'soc2', label: 'SOC 2 Type 2' },
              { id: 'both', label: 'Both' },
              { id: 'neither', label: 'Neither' },
            ],
          },
          {
            id: 'gov-2',
            label: 'Is your information security policy reviewed at least annually?',
            kind: 'radio',
            options: yesNo,
          },
          {
            id: 'gov-3',
            label: 'Who is accountable for information security in your organisation?',
            kind: 'radio',
            options: [
              { id: 'ciso', label: 'Dedicated CISO' },
              { id: 'cto', label: 'CTO or equivalent' },
              { id: 'outsourced', label: 'Outsourced to a third party' },
            ],
          },
          {
            id: 'gov-4',
            label: 'Do all employees complete security awareness training on joining?',
            kind: 'radio',
            options: yesNo,
          },
          {
            id: 'gov-5',
            label: 'Do you run background checks on staff with production access?',
            kind: 'radio',
            options: yesNo,
          },
          {
            id: 'gov-6',
            label: 'Which frameworks do you map your controls against?',
            kind: 'checkbox',
            options: [
              { id: 'nist', label: 'NIST CSF' },
              { id: 'cis', label: 'CIS Controls' },
              { id: 'csa', label: 'CSA CCM' },
            ],
          },
        ],
      },
      {
        id: 'pen-testing',
        title: 'Penetration testing',
        questions: [
          {
            id: 'pen-1',
            label: 'Do you conduct external penetration tests relevant to service delivery with ACME?',
            kind: 'radio',
            options: yesNo,
          },
          {
            id: 'pen-2',
            label: 'Last penetration test date',
            kind: 'radio',
            options: [
              { id: 'lt12', label: 'Less than 12 months' },
              { id: '12-24', label: '12 - 24 months' },
              { id: 'gt24', label: '24 months +' },
            ],
          },
          {
            id: 'pen-3',
            label: 'Were any high/critical risks identified in your last penetration test?',
            kind: 'radio',
            options: yesNo,
          },
          {
            id: 'pen-4',
            label: 'Will you share the executive summary of your most recent test with ACME?',
            kind: 'radio',
            options: [
              { id: 'yes', label: 'Yes, under NDA' },
              { id: 'summary', label: 'Summary letter only' },
              { id: 'no', label: 'No' },
            ],
          },
        ],
      },
      {
        id: 'data-handling',
        title: 'Data handling',
        questions: [
          { id: 'dh-1', label: 'Is customer data encrypted at rest?', kind: 'radio', options: yesNo },
          { id: 'dh-2', label: 'Is customer data encrypted in transit using TLS 1.2 or above?', kind: 'radio', options: yesNo },
          {
            id: 'dh-3',
            label: 'In which regions is ACME data stored?',
            kind: 'checkbox',
            options: [
              { id: 'us', label: 'United States' },
              { id: 'eu', label: 'European Union' },
              { id: 'uk', label: 'United Kingdom' },
              { id: 'apac', label: 'APAC' },
            ],
          },
          {
            id: 'dh-4',
            label: 'Do you use sub-processors that access ACME data?',
            kind: 'radio',
            options: yesNo,
          },
          { id: 'dh-5', label: 'Can ACME data be exported on request in a machine readable format?', kind: 'radio', options: yesNo },
          {
            id: 'dh-6',
            label: 'What is your data retention period after contract termination?',
            kind: 'radio',
            options: [
              { id: '30', label: '30 days' },
              { id: '90', label: '90 days' },
              { id: '365', label: '12 months' },
            ],
          },
          { id: 'dh-7', label: 'Is production data used in non-production environments?', kind: 'radio', options: yesNo },
          { id: 'dh-8', label: 'Do you support customer managed encryption keys?', kind: 'radio', options: yesNo },
        ],
      },
      {
        id: 'access',
        title: 'Access & monitoring',
        questions: [
          { id: 'ac-1', label: 'Is multi-factor authentication enforced for all staff?', kind: 'radio', options: yesNo },
          { id: 'ac-2', label: 'Do you support SAML or OIDC single sign-on for customers?', kind: 'radio', options: yesNo },
          {
            id: 'ac-3',
            label: 'How long are access logs retained?',
            kind: 'radio',
            options: [
              { id: '30', label: '30 days' },
              { id: '90', label: '90 days' },
              { id: '365', label: '12 months or more' },
            ],
          },
          { id: 'ac-4', label: 'Are privileged access reviews performed at least quarterly?', kind: 'radio', options: yesNo },
        ],
      },
    ],
  },
  {
    id: 'business-continuity',
    name: 'Business continuity',
    status: 'required',
    dueLabel: 'Due 17 Sep',
    lastEdited: 'Last edited 8 Sep by Peter Kaminsky',
    sections: [
      {
        id: 'resilience',
        title: 'Resilience',
        questions: [
          {
            id: 'bc-1',
            label: 'Do you maintain a documented business continuity plan?',
            kind: 'radio',
            options: yesNo,
          },
          {
            id: 'bc-2',
            label: 'When was the plan last tested?',
            kind: 'radio',
            options: [
              { id: 'lt6', label: 'Within 6 months' },
              { id: 'lt12', label: 'Within 12 months' },
              { id: 'never', label: 'Not tested' },
            ],
          },
          {
            id: 'bc-3',
            label: 'What is your committed recovery time objective?',
            kind: 'radio',
            options: [
              { id: '4h', label: '4 hours' },
              { id: '24h', label: '24 hours' },
              { id: '72h', label: '72 hours' },
            ],
          },
        ],
      },
      {
        id: 'availability',
        title: 'Availability',
        questions: [
          {
            id: 'bc-4',
            label: 'What uptime do you commit to contractually?',
            kind: 'radio',
            options: [
              { id: '999', label: '99.9%' },
              { id: '995', label: '99.5%' },
              { id: 'none', label: 'No contractual commitment' },
            ],
          },
          { id: 'bc-5', label: 'Do you operate across multiple availability zones?', kind: 'radio', options: yesNo },
          { id: 'bc-6', label: 'Do you publish a public status page?', kind: 'radio', options: yesNo },
        ],
      },
    ],
  },
  {
    id: 'incident-management',
    name: 'Incident management',
    flags: [
      {
        id: 'task-flag-im-1',
        questionId: 'im-2',
        raisedById: 'amir',
        raisedAt: '10 Sep',
        reason: '72 hours does not meet our 24 hour contractual notification requirement.',
        severity: 'blocker',
      },
      {
        id: 'task-flag-im-2',
        questionId: 'im-4',
        raisedById: 'sadie',
        raisedAt: '10 Sep',
        reason: 'Attach the post-incident review for the March 2023 incident.',
        severity: 'query',
      },
    ],
    status: 'required',
    dueLabel: 'Due 17 Sep',
    lastEdited: 'Last edited 9 Sep by Peter Kaminsky',
    sections: [
      {
        id: 'process',
        title: 'Process',
        questions: [
          { id: 'im-1', label: 'Do you have a documented incident response plan?', kind: 'radio', options: yesNo },
          {
            id: 'im-2',
            label: 'Within what timeframe do you notify customers of a confirmed breach?',
            kind: 'radio',
            options: [
              { id: '24h', label: 'Within 24 hours' },
              { id: '72h', label: 'Within 72 hours' },
              { id: 'longer', label: 'Longer than 72 hours' },
            ],
          },
          { id: 'im-3', label: 'Do you run post-incident reviews and share them with customers?', kind: 'radio', options: yesNo },
        ],
      },
      {
        id: 'history',
        title: 'History',
        questions: [
          {
            id: 'im-4',
            label: 'Have you experienced a reportable security incident in the last 24 months?',
            kind: 'radio',
            options: yesNo,
          },
          { id: 'im-5', label: 'Do you carry cyber liability insurance?', kind: 'radio', options: yesNo },
        ],
      },
    ],
  },
];

/**
 * Pre-filled answers for the supplier questionnaire. Security is deliberately
 * part-complete (17 of 22) to match the state shown in the design.
 */
export const INITIAL_TASK_ANSWERS: AnswerMap = {
  // Security · Governance & policy — complete
  'gov-1': ['soc2'],
  'gov-2': ['yes'],
  'gov-3': ['ciso'],
  'gov-4': ['yes'],
  'gov-5': ['yes'],
  'gov-6': ['nist', 'cis'],
  // Security · Penetration testing — 3 of 4
  'pen-1': ['yes'],
  'pen-2': ['gt24'],
  'pen-3': ['no'],
  // Security · Data handling — complete, one answer flagged by the DPO
  'dh-1': ['yes'],
  'dh-2': ['yes'],
  'dh-3': ['us', 'eu'],
  'dh-4': ['yes'],
  'dh-5': ['yes'],
  'dh-6': ['365'],
  'dh-7': ['no'],
  'dh-8': ['no'],
  // Business continuity
  'bc-1': ['yes'],
  'bc-2': ['lt12'],
  'bc-4': ['999'],
  'bc-5': ['yes'],
  // Incident management
  'im-1': ['yes'],
  'im-2': ['72h'],
};
