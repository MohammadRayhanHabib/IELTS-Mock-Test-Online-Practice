# IELTS-Mock-Test-Online-Practice

Standalone Lexora mock-test UI handoff for IELTS computer-delivered practice.

This folder is a standalone, runnable copy of the client-preview mock-test frontend. It contains the actual UI code for the catalogue, setup flow, Listening, Reading, Writing, Speaking, subscription, and results. It does not depend on the parent Lexora app at runtime.

## Run it

```bash
npm install
npm run dev
```

Open `http://localhost:4175/client-preview/mock-tests`.

Production check:

```bash
npm run build
npm run preview
```

Only packages imported by this standalone UI are included. The parent app's Redux, OAuth, charting, and course/practice dependencies are deliberately excluded.

The package intentionally mirrors the parent frontend's Vite 5 and React Router 6 stack. `npm audit` currently reports advisories whose automated fixes require major Vite/Router upgrades. Keep the dev server bound to localhost and schedule those major upgrades with the main frontend before production release.

## Component architecture

```text
src/
├── pages/                         route-level composition only
│   ├── tests/                     mock journey and exam routes
│   └── payment/                   subscription route
├── components/
│   ├── navigation/
│   │   ├── LexoraBrand.tsx
│   │   ├── NavbarSearch.tsx
│   │   └── NavbarActions.tsx
│   ├── layout/                    page shells/composers
│   ├── exam/                      footer, notes, settings, arrows, stepper
│   ├── listening/                 shared Listening engines/panels
│   ├── reading/                   shared Reading engines/panels
│   └── results/                   reusable score/review sections
├── modules/
│   ├── mock-tests/components/     catalogue hero, info strips, test card
│   ├── listening/questions/       one named export per Listening pattern
│   ├── reading/questions/         all 20 task components + typed renderer
│   ├── reading/annotations/       note, highlight and review-flag features
│   ├── writing/components/        Writing task-specific visuals
│   └── speaking/components/       Speaking-specific controls
├── data/                          tests, passages, answer keys, scoring
├── api/                           production-compatible types/clients
└── integration/                   backend gateway replacement boundary
```

The route pages own navigation, timer state and draft/submission orchestration.
Question components accept values and callbacks, so a senior developer can copy
one question pattern without copying the entire mock-test page. Import Reading
and Listening patterns from their `questions/index.ts` barrel files.

Examples:

```tsx
import {
  ReadingQuestionRenderer,
  TrueFalseNotGivenQuestion,
  TableCompletionQuestion,
} from "@/modules/reading/questions";

import {
  MapLabellingQuestion,
  SentenceCompletionQuestion,
} from "@/modules/listening/questions";
```

For production integration, prefer `ReadingQuestionRenderer`; its typed
registry guarantees that every `ReadingQuestionType` maps to a component. The
individual exports remain available when a screen needs one specific task UI.
The annotation module exposes a `ReadingAnnotationRepository` contract so note,
highlight and bookmark persistence can be wired without changing their UI.

## Backend integration

The current preview provider stores drafts/results in `localStorage` and `sessionStorage`. Implement `src/integration/mockTestGateway.ts`, then replace storage calls at page/container level. Keep the question components presentational.

Recommended order:

1. Test catalogue and attempt creation.
2. Server-owned timer and autosave.
3. Listening audio URL and Reading/Listening submission.
4. Writing draft/submission.
5. Speaking availability, booking, and recording upload.
6. Combined result endpoint and subscription checkout.

The detailed copy map and storage/API replacement table remain in `../../docs/frontend-handoff/CLIENT_PREVIEW_MOCK_TEST_HANDOFF.md` in the source repository.
