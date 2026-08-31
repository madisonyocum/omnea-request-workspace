# Omnea — Request workspace prototype

An interactive, high-fidelity prototype of a procurement request workspace, coded from a Figma
design. It covers one request end to end (`OM-49 · Mailchimp`) across five tabs, with working
state so it behaves like a product rather than a click-through mockup.

```bash
npm install
npm run dev
```

## Stack

React 19 · TypeScript · Vite · Tailwind CSS v4 · lucide-react. No other runtime dependencies —
state is a single `useReducer` store, data is local mock data.

## Layout

The shell is viewport-locked: the app rail, request header, stat strip and tab bar never move.
Everything below the tab bar fills the remaining height, and long content scrolls inside its own
pane. On the form tabs the section list on the left stays fixed while the form body scrolls.

## Screens

| Tab | What it shows |
| --- | --- |
| **Overview** | Workflow spine (6 stages, parallel branches), activity feed, and the action waiting on you |
| **My tasks** | Supplier questionnaires with expandable sections and live answer counts |
| **Intake** | The submitted intake form, read-only, with a scroll-spy section nav |
| **Submissions** | Supplier assessment and engagement forms, including pending states |
| **Documents** | Sortable document table with a dropzone and per-row actions |

## Interactions

Everything visible does something.

- **Workflow** — click any step for a drawer with its history, SLA, attachments and actions
  (send reminder, reassign). Artefact chips deep-link to the tab that holds them.
- **Approve / Decline** — approving marks the step complete, advances the spine, recomputes the
  stat strip ("2 running" → "1 running", "Waiting on" reassigns) and swaps the right rail to a
  "next up" card. Declining requires a reason and posts it to the activity feed.
- **Activity** — post comments, expand and reply to threads, resolve and reopen.
- **My tasks** — answering questions updates the section counters, the "17 of 22 answered" line
  and the flagged badge. "Next section" walks the accordion; "Save & close" returns to Overview.
- **Documents** — sort columns, toggle repository storage, upload via drag-and-drop or browse,
  remove rows. The tab badge tracks the row count.
- **Chrome** — Following toggles, Share opens a dialog, the overflow and account menus work, and
  every rail icon has a tooltip.

Tab badges are derived from content rather than hardcoded, so the numbers stay consistent with
what each tab actually contains.

## Structure

```
src/
  domain/       types + mock data (people, workflow, tasks, intake, submissions, documents)
  state/        useReducer store, context, derived selectors
  components/
    chrome/     app rail, request header, stat strip, tab bar
    workflow/   timeline, stage, step, status dot, step drawer
    overview/   activity card, action card
    forms/      split form shell, question field
    ui/         avatar, button, pill, choice, menu, modal, drawer, tooltip, toast
  views/        one component per tab
  styles/       Tailwind theme carrying the Figma design tokens
```

Design tokens (colours, radii, type sizes, elevation) are transcribed from the Figma variable
collection into `src/styles/index.css` under `@theme`, so token names map back to the source.
