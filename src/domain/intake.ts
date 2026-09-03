import type { IntakeGroup } from './types';

/**
 * The submitted intake form. Rendered read-only — the answers are baked into
 * each question rather than held in state, because intake is locked after
 * submission.
 */
export const INTAKE_GROUPS: IntakeGroup[] = [
  {
    id: 'request-details',
    navLabel: 'Request details',
    questions: [
      {
        id: 'purchase-type',
        label: 'What are you looking to purchase?',
        required: true,
        kind: 'radio',
        options: [
          { id: 'software', label: 'Software' },
          { id: 'hardware', label: 'Hardware / Equipment' },
          { id: 'consulting', label: 'Consulting / Professional Services' },
          { id: 'other', label: 'Other (e.g. Events, Training and Education, Gifts and Charitable donations etc)' },
        ],
        value: 'software',
      },
      {
        id: 'supplier-name',
        label: 'What is the supplier called?',
        required: true,
        kind: 'chips',
        layout: 'column',
        options: [
          { id: 'mailchimp', label: 'Mailchimp' },
          { id: 'mailchimp-premium', label: 'Mailchimp Premium' },
        ],
      },
      {
        id: 'similar-suppliers',
        label: 'We have similar suppliers already, could they perform the same task?',
        required: true,
        kind: 'radio',
        options: [
          { id: 'intercom', label: 'Intercom' },
          { id: 'braze', label: 'Braze' },
          { id: 'none', label: 'No, Mailchimp is required' },
        ],
        value: 'none',
      },
      {
        id: 'supplier-contact',
        label: 'Main point of contact at Mailchimp',
        required: true,
        kind: 'checkbox',
        options: [{ id: 'has-contact', label: 'I have a supplier contact' }],
        value: 'has-contact',
      },
      {
        id: 'info-owner',
        label: 'Who will be responsible for providing additional information?',
        required: true,
        kind: 'checkbox',
        options: [{ id: 'ben', label: 'Ben Williams · ben.williams@acme.co' }],
        value: 'ben',
      },
      {
        id: 'service-description',
        label: 'What service will the supplier or product provide?',
        required: true,
        kind: 'longtext',
        value:
          'The supplier will provide marketing services, specifically email campaign management, marketing automation, and performance tracking.',
      },
    ],
  },
  {
    id: 'financials',
    overline: 'Financials',
    navLabel: 'Financials',
    questions: [
      {
        id: 'estimated-spend',
        label: 'What is the estimated spend?',
        required: true,
        kind: 'chips',
        options: [
          { id: 'currency', label: 'GBP £' },
          { id: 'amount', label: '20,000' },
          { id: 'cadence', label: 'Per year' },
        ],
      },
      {
        id: 'cost-centre',
        label: 'Which cost centre will this come from?',
        required: true,
        kind: 'radio',
        options: [
          { id: 'marketing', label: 'Marketing' },
          { id: 'ops', label: 'Ops' },
          { id: 'hr', label: 'HR' },
          { id: 'finance', label: 'Finance' },
        ],
        value: 'marketing',
      },
      {
        id: 'in-budget',
        label: 'Is this item in budget?',
        required: true,
        kind: 'radio',
        options: [
          { id: 'yes', label: 'Yes' },
          { id: 'no', label: 'No' },
        ],
        value: 'yes',
      },
    ],
  },
  {
    id: 'data-security',
    overline: 'Data & security',
    navLabel: 'Data & security',
    questions: [
      {
        id: 'integrations',
        label: 'Will the service need to integrate with other systems?',
        required: true,
        kind: 'radio',
        options: [
          { id: 'yes', label: 'Yes' },
          { id: 'no', label: 'No' },
        ],
        value: 'yes',
      },
      {
        id: 'data-access',
        label: 'Will this vendor require access to our data?',
        required: true,
        kind: 'checkbox',
        options: [
          { id: 'end-user', label: 'End user data - e.g. Name, Email, Address' },
          { id: 'employee', label: 'Employee data - e.g. Payroll, HR, Health data, genetic etc' },
          { id: 'documentary', label: 'Documentary sensitive data - e.g. Pricing, Roadmap etc' },
        ],
        value: 'end-user',
      },
      {
        id: 'business-critical',
        label:
          'Would loss or degradation of the supplier result in direct disruption to one of our important services or product?',
        required: true,
        kind: 'radio',
        options: [
          { id: 'yes', label: 'Yes' },
          { id: 'no', label: 'No' },
        ],
        value: 'no',
      },
    ],
  },
];

export const INTAKE_META = {
  title: 'Intake - New purchase',
  subtitle: 'Submitted 24 May by Ben Williams',
  lastEditedAt: '27 May',
  lastEditedById: 'ben',
};
