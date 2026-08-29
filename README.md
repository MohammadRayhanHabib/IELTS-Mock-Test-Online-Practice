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

```bash
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

## Detailed folder and component map

### `src/pages` — route containers

Pages own route parameters, loading, timers, local draft state, navigation and
submission orchestration. Backend developers should connect APIs here (or in a
container wrapping these pages), not inside the visual question components.

| File | Responsibility |
| --- | --- |
| `pages/tests/ClientPreviewMockTestsPage.tsx` | Mock-test catalogue; selects Test 1–4 and starts the journey. |
| `pages/tests/ClientPreviewMockSetupPage.tsx` | Candidate details, system checks and exam instructions before starting. |
| `pages/tests/ClientPreviewListeningPreTestPage.tsx` | Pre-test video/confirmation and module readiness workflow. |
| `pages/tests/ClientPreviewListeningPage.tsx` | Full Listening timer, audio, answers, notes, flags, autosave and submit flow. |
| `pages/tests/IELTSExamPage.tsx` | Full Reading workspace and the combined exam orchestrator used by the preview. |
| `pages/tests/ClientPreviewWritingPage.tsx` | Writing Task 1/2 editor, timer, word count, drafts and submission. |
| `pages/tests/ClientPreviewSpeakingBookingPage.tsx` | Speaking date/time booking UI. |
| `pages/tests/ClientPreviewSpeakingPreTestPage.tsx` | Microphone/equipment check before Speaking. |
| `pages/tests/ClientPreviewSpeakingPage.tsx` | Three-part Speaking prompts, timer, notes and browser audio recording. |
| `pages/tests/ClientPreviewListeningResultPage.tsx` | Listening score and answer review. |
| `pages/tests/ClientPreviewReadingResultPage.tsx` | Reading score and answer review. |
| `pages/tests/WritingResultPage.tsx` | Writing response, evaluator feedback and score presentation. |
| `pages/tests/ClientPreviewSpeakingResultPage.tsx` | Speaking result and feedback presentation. |
| `pages/tests/ClientPreviewMockResultPage.tsx` | Combined result for all completed modules. |
| `pages/payment/ClientPreviewSubscriptionPage.tsx` | Trial/monthly/quarterly/annual plan selection UI. |

### `src/components/navigation` and `src/components/layout`

| Component | Responsibility |
| --- | --- |
| `navigation/LexoraBrand.tsx` | Reusable Lexora Academy logo/brand link. |
| `navigation/NavbarSearch.tsx` | Controlled navbar search field. |
| `navigation/NavbarActions.tsx` | Notification, settings and profile actions. |
| `layout/LexoraTopNavbar.tsx` | Dashboard/catalogue navbar composition. |
| `layout/ClientPreviewMockLayout.tsx` | Shared sidebar + top-navbar shell for non-exam pages. |

### `src/components/exam` — shared exam chrome

| Component | Responsibility |
| --- | --- |
| `ClientExamNavigationButtons.tsx` | Previous/next arrows and disabled-state behavior. |
| `ClientExamSectionFooter.tsx` | Part tabs, question numbers, completion line and review markers. |
| `ClientExamNotesDrawer.tsx` | Generic exam notes drawer used outside Reading annotations. |
| `ClientExamOptionsOverlay.tsx` | Submit/options/contrast/text-size overlay. |
| `ClientMockJourneyStepper.tsx` | Setup → checks → instructions → start progress indicator. |

### `src/components/listening` — Listening engines and panels

| Component | Responsibility |
| --- | --- |
| `ClientListeningExamHeader.tsx` | Candidate ID, remaining time, audio controls and exam actions. |
| `ListeningWorkspace.tsx` | Composes active Listening part, question UI and footer navigation. |
| `ClientFullListeningPart.tsx` | Full-part renderer for questions and section instructions. |
| `ListeningQuestionTypeBanner.tsx` | Developer-visible question-type label/banner. |
| `ListeningQuestionBookmark.tsx` | Controlled per-question review flag. |
| `ListeningMcqPanel.tsx` | Single/multiple-choice Listening questions. |
| `ListeningMapLabellingPanel.tsx` | Map/image labels and answer positions. |
| `ListeningFactorMatchingPanel.tsx` | Factor/feature matching. |
| `ListeningListMatchingPanel.tsx` | List matching. |
| `ListeningTableCompletionPanel.tsx` | Table completion. |
| `ListeningFlowChartCompletionPanel.tsx` | Flow-chart completion. |
| `ListeningNoteCompletionPanel.tsx` | Note completion. |
| `ListeningSentenceCompletionPanel.tsx` | Sentence completion. |
| `ListeningSummaryCompletionPanel.tsx` | Summary completion. |
| `ListeningShortAnswerPanel.tsx` | Short-answer inputs. |

`modules/listening/questions/index.ts` exposes backend-friendly names without
making route code depend on the physical panel filenames:

| Export | UI implementation |
| --- | --- |
| `FactorMatchingQuestion` | `ListeningFactorMatchingPanel` |
| `FlowChartCompletionQuestion` | `ListeningFlowChartCompletionPanel` |
| `ListMatchingQuestion` | `ListeningListMatchingPanel` |
| `MapLabellingQuestion` | `ListeningMapLabellingPanel` |
| `MultipleChoiceQuestion` | `ListeningMcqPanel` |
| `NoteCompletionQuestion` | `ListeningNoteCompletionPanel` |
| `SentenceCompletionQuestion` | `ListeningSentenceCompletionPanel` |
| `ShortAnswerQuestion` | `ListeningShortAnswerPanel` |
| `SummaryCompletionQuestion` | `ListeningSummaryCompletionPanel` |
| `TableCompletionQuestion` | `ListeningTableCompletionPanel` |
| `ListeningAnswerField` | Generic numbered text input used by completion patterns. |

### `src/components/reading` — reusable Reading primitives

These are lower-level layout engines used by the named task components in
`modules/reading/questions`.

| Component | Responsibility |
| --- | --- |
| `DiagramLabelCompletionPanel.tsx` | Diagram callouts and label inputs. |
| `ListMatchingPanel.tsx` | Shared matching/classification answer grid. |
| `MatchingInformationGrid.tsx` | Statement-to-paragraph/column matching table. |
| `NoteCompletionGaps.tsx` | Inline numbered note gaps. |
| `SentenceEndingMatchingPanel.tsx` | Sentence beginnings and ending choices. |
| `StatementMatchingPanel.tsx` | Reusable statement-to-feature matcher. |
| `SummaryClueCompletionPanel.tsx` | Summary text with clue/choice gaps. |
| `TableCompletionPanel.tsx` | Structured table with numbered answer cells. |

### `src/modules/reading/questions` — all Reading task components

Every backend `ReadingQuestionType` has one controlled component. All of them
receive `question`, `answer`, `onChange` and `firstQuestionNumber` through
`ReadingQuestionComponentProps`.

| Backend `ReadingQuestionType` | Component file |
| --- | --- |
| `TRUE_FALSE_NOT_GIVEN` | `TrueFalseNotGivenQuestion.tsx` |
| `YES_NO_NOT_GIVEN` | `YesNoNotGivenQuestion.tsx` |
| `MCQ_SINGLE` | `McqSingleQuestion.tsx` |
| `MCQ_MULTIPLE` | `McqMultipleQuestion.tsx` |
| `TITLE_SUBTITLE_FINDING` | `TitleSubtitleFindingQuestion.tsx` |
| `FILL_IN_BLANKS` | `FillInBlanksQuestion.tsx` |
| `SENTENCE_COMPLETION` | `SentenceCompletionQuestion.tsx` |
| `SUMMARY_COMPLETION` | `SummaryCompletionQuestion.tsx` |
| `NOTE_COMPLETION` | `NoteCompletionQuestion.tsx` |
| `MATCHING_HEADINGS` | `MatchingHeadingsQuestion.tsx` |
| `MATCHING_INFORMATION` | `MatchingInformationQuestion.tsx` |
| `MATCHING_FEATURES` | `MatchingFeaturesQuestion.tsx` |
| `LIST_MATCHING` | `ListMatchingQuestion.tsx` |
| `CLASSIFICATION` | `ClassificationQuestion.tsx` |
| `MATCHING_SENTENCE_ENDINGS` | `MatchingSentenceEndingsQuestion.tsx` |
| `DRAG_AND_DROP` | `DragAndDropQuestion.tsx` |
| `TABLE_COMPLETION` | `TableCompletionQuestion.tsx` |
| `FLOWCHART_COMPLETION` | `FlowchartCompletionQuestion.tsx` |
| `DIAGRAM_LABEL_COMPLETION` | `DiagramLabelCompletionQuestion.tsx` |
| `SHORT_ANSWER` | `ShortAnswerQuestion.tsx` |

Supporting files:

| File | Responsibility |
| --- | --- |
| `ReadingQuestionRenderer.tsx` | Typed `ReadingQuestionType → component` registry. This is the preferred production entry point. |
| `types.ts` | Shared controlled-component answer/prop contracts. |
| `QuestionChoiceGroup.tsx` | Grouped official-style choice rows. |
| `SingleChoiceQuestion.tsx` | Shared radio-choice primitive. |
| `MultipleChoiceQuestion.tsx` | Shared checkbox-choice primitive. |
| `StatementAgreementQuestion.tsx` | Shared TRUE/FALSE/NOT GIVEN-style primitive. |
| `TextAnswerQuestion.tsx` | Shared text-answer primitive. |
| `index.ts` | Public barrel exports for copying/importing task components. |

Reading question payload fields expected from the backend:

| Field | Meaning |
| --- | --- |
| `_id` | Stable question ID used as the answer/autosave key. |
| `questionType` | One value from `ReadingQuestionType`; selects the renderer. |
| `questionText` | Prompt, statement, stem or encoded completion text. |
| `instructions` | Candidate-facing IELTS answer instructions. |
| `options` | Rows, statements, answer choices or completion structure depending on type. |
| `wordBank` | Reusable headings/features/labels/ending choices when the type needs a bank. |
| `orderNumber` / `pageNumber` | Backend ordering and visible question-range start. |
| `marks` | Number of visible answer slots represented by the task group. |

Answer values are controlled by the page: single inputs use `string`; grouped,
multiple-choice, matching and multi-gap patterns use `string[]`. The backend
should accept both through `Record<questionId, string | string[]>` or normalize
them into answer-entry rows during autosave/submission.

### `src/modules/reading/annotations` — notes, highlights and review flags

| File | Responsibility / backend boundary |
| --- | --- |
| `useReadingTextAnnotations.ts` | Captures passage/question selection, calculates text offsets and paints scoped CSS highlights. |
| `ReadingSelectionToolbar.tsx` | Shows Note and Highlight actions only after text is selected. |
| `ReadingNotesDrawer.tsx` | Controlled annotation list/editor with save and delete callbacks. |
| `ReadingQuestionBookmarkButton.tsx` | Controlled per-question review flag. |
| `types.ts` | `ReadingAnnotation` payload and `ReadingAnnotationRepository` persistence contract. |
| `index.ts` | Public annotation exports. |

Annotations deliberately store text offsets instead of injecting `<mark>` tags,
so highlighting a question cannot mutate or highlight the passage DOM.

### Other feature modules

| Folder/component | Responsibility |
| --- | --- |
| `modules/mock-tests/components/ExamSummary.tsx` | Full-exam hero/module summary. |
| `modules/mock-tests/components/ExamInfoStrips.tsx` | Environment requirements and question-bank update strips. |
| `modules/mock-tests/components/MockTestCard.tsx` | Individual catalogue test card. |
| `modules/writing/components/WritingTaskOneVisual.tsx` | Task 1 chart/table/process visual variants. |
| `modules/speaking/components/SpeakingSettings.tsx` | Speaking text-size/settings control. |
| `components/results/ResultScoreHero.tsx` | Shared overall/module score header. |
| `components/results/AnswerKeyReview.tsx` | Correct answer, user answer and explanation review. |
| `components/ui/Spinner.tsx` | Page/inline loading states. |

### `src/data` — preview fixtures only

| File | Preview data supplied |
| --- | --- |
| `clientPreviewMockTests.ts` | Catalogue metadata for Test 1–4. |
| `clientPreviewListening.ts` | Base Listening questions/audio metadata and result storage keys. |
| `clientPreviewFullListeningMocks.ts` | Complete Listening mock variants. |
| `readingPart1Showcase.ts` | Reading passages and task-pattern showcase questions. |
| `clientPreviewFullReadingMocks.ts` | Complete Reading Test 1–4 variants. |
| `clientPreviewReadingResult.ts` | Reading answer key and client-side score helper. |

Replace fixture imports at the page/container layer with API query results. Do
not copy fixture data into production question components.

### `src/api` and `src/integration` — backend connection points

| File | Responsibility |
| --- | --- |
| `api/axios.ts` | Axios instance, API base URL and authorization interceptor boundary. |
| `api/mockExam.ts` | Mock exam/attempt types and existing mock-exam request functions. |
| `api/listening.ts` | Listening test, attempt, timer, autosave and submit requests. |
| `api/reading.ts` | All Reading enums, payload types, parsers and Reading request functions. |
| `api/writing.ts` | Writing module/session types, draft and submit requests. |
| `integration/mockTestGateway.ts` | Framework-neutral production contract for the complete mock-test journey. |

`MockTestGateway` defines the operations the backend adapter must provide:

```ts
interface MockTestGateway {
  listTests(): Promise<MockTestSummary[]>;
  startAttempt(testId: string): Promise<AttemptSnapshot>;
  loadAttempt(attemptId: string): Promise<AttemptSnapshot>;
  autosave(attemptId: string, patch: Partial<AttemptSnapshot>): Promise<void>;
  submitModule(attemptId: string, module: ExamModule): Promise<AttemptSnapshot>;
  getResult(attemptId: string): Promise<unknown>;
  createSpeakingBooking(input: {
    attemptId: string;
    startsAt: string;
  }): Promise<{ bookingId: string }>;
  uploadSpeakingAudio(input: {
    attemptId: string;
    part: 1 | 2 | 3;
    questionId: string;
    audio: Blob;
  }): Promise<{ recordingId: string }>;
}
```

The backend should remain the source of truth for `attemptId`, active module,
active question, remaining seconds, answers, flagged questions and annotations.

## Route map

| Route | Page |
| --- | --- |
| `/client-preview/mock-tests` | Test catalogue |
| `/client-preview/mock-test/setup` | Candidate/system setup |
| `/client-preview/listening/pre-test` | Listening readiness confirmation |
| `/client-preview/listening` | Listening exam |
| `/client-preview/reading-part-1` | Reading exam |
| `/client-preview/writing` | Writing exam |
| `/client-preview/speaking/booking` | Speaking booking |
| `/client-preview/speaking/pre-test` | Speaking equipment check |
| `/client-preview/speaking` | Speaking exam/recording |
| `/client-preview/listening/result` | Listening result |
| `/client-preview/reading/result` | Reading result |
| `/client-preview/writing/result` | Writing result |
| `/client-preview/speaking/result` | Speaking result |
| `/client-preview/results` | Combined result |
| `/client-preview/subscription` | Subscription plans |

## State ownership and copy strategy

Use this rule when moving code into the production frontend:

1. Copy reusable UI from `components/` and task components from `modules/`.
2. Keep `answer`, `flags`, `annotations`, timer and submission state in the
   production route/container or store.
3. Pass values and callbacks down to the controlled components.
4. Replace `src/data` fixtures and browser storage with the API/gateway adapter.
5. Send Speaking `Blob` recordings through `uploadSpeakingAudio`; the current
   preview does not provide durable server storage.
6. Fetch combined results only after the backend confirms every required module
   is submitted.

Minimal Reading integration:

```tsx
<ReadingQuestionRenderer
  question={questionFromApi}
  answer={attempt.answers[questionFromApi._id] ?? ""}
  onChange={(answer) => autosaveAnswer(questionFromApi._id, answer)}
  firstQuestionNumber={displayNumber}
/>
```

Minimal annotation persistence adapter:

```ts
const annotationRepository: ReadingAnnotationRepository = {
  list: async (attemptId) =>
    (await api.get<ReadingAnnotation[]>(`/attempts/${attemptId}/annotations`)).data,
  create: async (attemptId, annotation) =>
    (await api.post<ReadingAnnotation>(
      `/attempts/${attemptId}/annotations`,
      annotation,
    )).data,
  update: async (attemptId, annotationId, note) => {
    await api.patch(`/attempts/${attemptId}/annotations/${annotationId}`, { note });
  },
  remove: async (attemptId, annotationId) => {
    await api.delete(`/attempts/${attemptId}/annotations/${annotationId}`);
  },
};
```

The endpoint paths above are examples; map them to the production backend
without changing the annotation components.

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

This README is the portable component and backend-integration map included in
the standalone repository.
