# Invoice Buddy

A responsive invoice management app built with React, TypeScript, Tailwind CSS, and localStorage persistence.

## Setup instructions

### Prerequisites
- [Node.js](https://nodejs.org/) 18+ **or** [Bun](https://bun.sh/) 1.0+

### Install
```bash
bun install
# or
npm install
```

### Run dev server
```bash
bun dev
# or
npm run dev
```

### Production build
```bash
bun run build
# or
npm run build
```

The dev server starts on `http://localhost:8080`.

## Architecture

```
src/
├── pages/         Route-level views (Index list, InvoiceDetail, NotFound)
├── components/    Reusable UI (InvoiceForm, InvoiceListItem, StatusBadge,
│                  StatusFilter, Sidebar, AppLayout, DeleteModal, EmptyState…)
│   └── ui/        shadcn/ui primitives
├── context/       Global state providers
│                    • InvoiceContext — CRUD + localStorage persistence
│                    • ThemeContext   — light/dark mode + system preference
├── lib/           Pure utilities
│                    • invoiceSchema.ts — Zod validation schema
│                    • storage.ts       — localStorage helpers + ID generator
│                    • seed.ts          — first-load sample data
│                    • format.ts        — currency / date formatting
├── types/         Shared TypeScript interfaces (Invoice, InvoiceStatus, …)
└── hooks/         Reusable hooks
```

State flows top-down through two providers wrapping the router. Forms use **React Hook Form** with a **Zod** resolver. Routes: `/` (list) and `/invoice/:id` (detail).

## Trade-offs

- **localStorage over IndexedDB** — chosen for simplicity. Sufficient for a single-user, single-device invoice list; no async API or migrations to maintain.
- **No backend** — no multi-device sync, no auth, no shared invoices. Data lives only in the current browser.
- **Seed data injected once** — sample invoices are inserted on first load and gated by a `invoice-app:seeded` flag so they don't reappear after the user clears them.
- **Drawer form vs. dedicated route** — the create/edit form is a slide-in drawer (matching Figma) instead of its own page, which keeps list context but complicates focus/scroll management.

## Accessibility notes

- **Delete modal** — full focus trap, focus returns to trigger, ESC closes, `role="alertdialog"` with `aria-labelledby`/`aria-describedby`.
- **Invoice form overlay** — `role="dialog"` + `aria-modal`, ESC closes, focus trap cycles Tab / Shift+Tab within the panel, focus moves to the first field on open, body scroll locked.
- **Forms** — every input is paired with a `<label htmlFor>`; Zod errors render inline with `text-destructive` and visible error border.
- **Theme toggle** — descriptive `aria-label` reflecting target mode.
- **Status badges** — decorative dots use `aria-hidden`; status text is read normally by assistive tech.
- **Semantic HTML** — `<header>`, `<main>`, `<nav>`, `<address>`, `<article>` used appropriately.
- **Buttons are real `<button>` elements** with visible hover and focus states.
- **Color contrast** — design tokens chosen to meet WCAG AA in both light and dark modes.

## Improvements beyond requirements

- **System dark-mode detection** — first load reads `prefers-color-scheme` when no stored preference exists.
- **Collision-resistant IDs** — invoice IDs follow the `XX####` Figma format and are checked against existing IDs to guarantee uniqueness.
- **Single source of truth for validation** — the Zod schema (`lib/invoiceSchema.ts`) drives both form types and runtime validation.
- **Draft workflow** — drafts skip validation on save, can be edited freely, and offer a dedicated **Save & Send** action to promote to pending.
- **Status-aware actions** — Send / Edit / Mark as Paid buttons appear only for legal transitions (paid is terminal).
- **Responsive from 320px** — list, detail, and form all adapt with a fixed mobile action bar on the detail page.
