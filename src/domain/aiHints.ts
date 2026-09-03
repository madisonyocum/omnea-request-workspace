import type { TabId, UserRole } from './types';

/**
 * Copy for the AI hint under the phase rail, keyed by viewer and by the phase
 * being viewed. The suggestion a requester needs ("what can I do to speed this
 * up") is not the one an approver needs ("what is waiting on me"), and both
 * change again once the phase is done, so each cell is written on its own.
 *
 * `{step}`, `{owner}` and `{first}` resolve against the phase's live open step.
 */

export type AiHintCta =
  | { label: string; kind: 'remind' }
  | { label: string; kind: 'tab'; tab: TabId }
  | { label: string; kind: 'dismiss' };

export interface AiHintCopy {
  /** One-line observation shown collapsed. */
  hint: string;
  /** The link that opens the suggestion. */
  action: string;
  /** The suggestion itself. */
  detail: string;
  cta: AiHintCta;
}

const DISMISS = (label: string): AiHintCta => ({ label, kind: 'dismiss' });

export const AI_HINTS: Record<UserRole, Record<string, AiHintCopy>> = {
  requester: {
    'stage-1': {
      hint: 'Your intake answered every routing question first time, which saved a day.',
      action: 'See what sped it up',
      detail:
        'Complete answers skip the clarification loop with procurement, worth repeating on your next request.',
      cta: DISMISS('Got it'),
    },
    'stage-2': {
      hint: 'Procurement cleared this in 2 days, inside the 3 day target.',
      action: 'See what helped',
      detail:
        'No existing contract covered marketing automation, so the vendor comparison step was skipped entirely.',
      cta: DISMISS('Got it'),
    },
    'stage-3': {
      hint: 'This approval is likely to take longer than similar requests, let’s find a faster solution.',
      action: 'Suggest a faster route',
      detail:
        '{step} has been with {owner} the longest. A reminder clears it fastest, legal review is queued behind it.',
      cta: { label: 'Remind {first}', kind: 'remind' },
    },
    'stage-4': {
      hint: 'Security review has not started, and it gates the purchase order.',
      action: 'See how to prepare',
      detail:
        'Reviews stall most often on a missing current SOC 2 report. Adding it now saves the usual round trip.',
      cta: { label: 'Open documents', kind: 'tab', tab: 'documents' },
    },
    'stage-5': {
      hint: 'Engagement setup needs the supplier’s bank details before a PO can be raised.',
      action: 'See what to chase',
      detail:
        'Peter Kaminsky still has the engagement form open. Chasing it now keeps the PO on the same day as sign-off.',
      cta: { label: 'Open submissions', kind: 'tab', tab: 'submissions' },
    },
    'stage-6': {
      hint: 'The purchase order is raised automatically once finance signs off.',
      action: 'See what happens next',
      detail: 'Netsuite creates the PO within a day of the last approval, so there is nothing to do here.',
      cta: DISMISS('Got it'),
    },
  },

  approver: {
    'stage-1': {
      hint: 'Intake was complete on submission, so nothing came back to you for clarification.',
      action: 'See what you skipped',
      detail: 'Requests that arrive complete reach a decision around 4 days faster across this workflow.',
      cta: DISMISS('Got it'),
    },
    'stage-2': {
      hint: 'Procurement found no overlapping contract, so this is genuinely net new spend.',
      action: 'See the check',
      detail:
        'Devon Lane compared this against the marketing stack before routing it, the duplicate check is already done.',
      cta: DISMISS('Got it'),
    },
    'stage-3': {
      hint: 'Deciding today keeps this request inside its SLA, tomorrow it breaches.',
      action: 'See what your decision unblocks',
      detail:
        '{step} is still open with {owner}, and legal review is queued behind your line. Both move the moment you decide.',
      cta: { label: 'Remind {first}', kind: 'remind' },
    },
    'stage-4': {
      hint: 'Reviews run after your line, so your decision is not waiting on them.',
      action: 'See the sequence',
      detail:
        'Security and finance both start once approvals close, they will not send anything back to you unless a risk is raised.',
      cta: DISMISS('Got it'),
    },
    'stage-5': {
      hint: 'Engagement is procurement’s step, nothing here needs an approver.',
      action: 'See who owns it',
      detail: 'Procurement collects the supplier’s details and sets up the engagement record after reviews close.',
      cta: DISMISS('Got it'),
    },
    'stage-6': {
      hint: 'The purchase order is automated, your approval is the last human step.',
      action: 'See what happens next',
      detail: 'Netsuite raises the PO once finance signs off, no further approval is asked of you.',
      cta: DISMISS('Got it'),
    },
  },

  admin: {
    'stage-1': {
      hint: 'Intake cleared in 4 hours against a 1 day SLA, the fastest phase on this request.',
      action: 'See the timing',
      detail: 'Routing matched the software track automatically, which is where most of the saving came from.',
      cta: DISMISS('Got it'),
    },
    'stage-2': {
      hint: 'Procurement took 2 days 6 hours, comfortably inside its 3 day SLA.',
      action: 'See the timing',
      detail: 'This phase has held its SLA on every request this quarter, no intervention needed.',
      cta: DISMISS('Got it'),
    },
    'stage-3': {
      hint: 'This phase is tracking 2 days behind comparable approvals, and the SLA breaches tomorrow.',
      action: 'Suggest a faster route',
      detail:
        '{step} is the outlier, {owner} has held it past the 3 day SLA. A reminder resolves it faster than reassigning.',
      cta: { label: 'Remind {first}', kind: 'remind' },
    },
    'stage-4': {
      hint: 'Security review has not started, and it is the single biggest driver of cycle time here.',
      action: 'See the risk',
      detail:
        'Two high risks are already open against this supplier, starting the review now avoids a second breach.',
      cta: { label: 'Open documents', kind: 'tab', tab: 'documents' },
    },
    'stage-5': {
      hint: 'Engagement setup adds 3 days on average when supplier details arrive late.',
      action: 'See how to shorten it',
      detail:
        'Requesting bank details alongside the assessment, rather than after it, removes most of that delay.',
      cta: { label: 'Open submissions', kind: 'tab', tab: 'submissions' },
    },
    'stage-6': {
      hint: 'Purchase orders are raised by Netsuite, typically within a day of sign-off.',
      action: 'See the handoff',
      detail: 'No manual step remains once finance approves, the integration writes the PO and closes the request.',
      cta: DISMISS('Got it'),
    },
  },
};

/** Fills `{step}`, `{owner}` and `{first}` in a copy string. */
export function fillHint(
  template: string,
  tokens: { step: string; owner: string },
): string {
  return template
    .replace('{step}', tokens.step)
    .replace('{owner}', tokens.owner)
    .replace('{first}', tokens.owner.split(' ')[0]);
}
