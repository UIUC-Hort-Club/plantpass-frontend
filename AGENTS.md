# PlantPass frontend — agent guide

The React app volunteers use to ring up sales at UIUC Horticulture Club events
(the plant sale and others). React 19, TypeScript, Vite, MUI 5, vitest.

**This repo holds only frontend-specific rules.** The product brief, roadmap,
decisions, architecture map and the agent skills (`plan-feature`,
`build-feature`, `check`, `ship`, `ponytail`) live in the backend repo. Check
both repos out side by side and start agents from the folder that holds them:

```
plantpass/
├── plantpass-backend/     ← AGENTS.md, docs/, .agents/skills/
└── plantpass-frontend/    ← you are here
```

Read `../plantpass-backend/AGENTS.md` and `../plantpass-backend/docs/PRODUCT.md`
before changing anything. If that folder is missing, clone
`UIUC-Hort-Club/plantpass-backend` next to this one, then run `make workspace`
inside it.

## The rules that matter most here

- **The architect (Joseph Ku) decides what gets built.** No feature work
  without an approved spec in `../plantpass-backend/docs/specs/`.
- **`npm run dev` talks to production.** `public/config.js` points at the live
  API. Do not start the dev server and submit a form, and do not write tests
  that make real requests.
- **A merge to `main` deploys to production.** Only the `ship` skill merges,
  through its merge gate.
- **The volunteer's screen is sacred.** `src/components/core/OrderEntry.tsx`
  and `OrderLookup.tsx` are used by untrained people with a queue in front of
  them. Every added field, button, dialog or decision there needs to be in the
  spec. Most are used on phones: check the small-screen layout.

## Commands

```bash
npm ci
npm run check                       # lint + vitest with coverage + typecheck + build
npx vitest run tests/api            # one folder
npx tsc --noEmit                    # types only
```

`npm test` already includes ESLint and enforces the coverage thresholds in
`vitest.config.ts`. Do not lower a threshold to get green.

## Where things go

| Change | Place |
|---|---|
| A new API call | one small file in `src/api/<resource>_interface/`, using `apiRequest` from `src/api/apiClient.ts`. Never call `fetch` directly. |
| An API shape | `src/types/index.ts`, mirrored by hand from the backend. Update `tests/types/contract-validation.test.ts` with it. |
| Sale-day screens | `src/components/core/` (and `SubComponents/`) |
| Organizer screens | `src/components/AdminConsole/` |
| Shared UI | `src/components/common/`. Reuse `ConfirmationDialog`, `LoadingSpinner`, `PasswordField`. |
| User-facing messages | `useNotification()` from `src/contexts/NotificationContext.tsx` |
| Feature toggles | `useFeatureToggles()` from `src/contexts/FeatureToggleContext.tsx` |
| Formatting money, percent, dates, order IDs | `src/utils/*Formatter.ts`. Do not format inline. |
| Tests | `tests/`, mirroring `src/`. Mock `src/api/apiClient`, as `tests/api/transaction.test.ts` does. |

## Conventions

- MUI components and the theme in `src/theme.ts`. No new UI or state library.
  No new dependency without the architect.
- Function components, TypeScript everywhere, no `any` unless unavoidable.
- The stored order uses `club_voucher` and `customer_email`; the create and
  update requests use `voucher` and `email`. Do not "fix" one side only.
- Tokens are in `localStorage` (`admin_token`, `staff_token`); go through
  `src/utils/authUtils.ts`.
- If a volunteer or organizer does anything differently after your change,
  update `USAGE.md` in the same commit.
- A deliberate shortcut gets a comment: `// shortcut: <the limit>, <when to
  upgrade>`.
