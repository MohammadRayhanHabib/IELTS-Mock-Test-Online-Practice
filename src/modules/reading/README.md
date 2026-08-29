# Reading module handoff

Every supported Reading task type has a dedicated controlled component in
`questions/`. Route pages do not choose layouts with a long conditional; they
render `ReadingQuestionRenderer`, which resolves the type through
`READING_QUESTION_COMPONENTS`.

```tsx
<ReadingQuestionRenderer
  question={questionFromApi}
  answer={answers[questionFromApi._id] ?? ""}
  onChange={(answer) => saveDraft(questionFromApi._id, answer)}
  firstQuestionNumber={questionNumber}
/>
```

## Question components

| Backend type | Component |
| --- | --- |
| `TRUE_FALSE_NOT_GIVEN` | `TrueFalseNotGivenQuestion` |
| `YES_NO_NOT_GIVEN` | `YesNoNotGivenQuestion` |
| `MCQ_SINGLE` | `McqSingleQuestion` |
| `MCQ_MULTIPLE` | `McqMultipleQuestion` |
| `TITLE_SUBTITLE_FINDING` | `TitleSubtitleFindingQuestion` |
| `FILL_IN_BLANKS` | `FillInBlanksQuestion` |
| `SENTENCE_COMPLETION` | `SentenceCompletionQuestion` |
| `SUMMARY_COMPLETION` | `SummaryCompletionQuestion` |
| `NOTE_COMPLETION` | `NoteCompletionQuestion` |
| `MATCHING_HEADINGS` | `MatchingHeadingsQuestion` |
| `MATCHING_INFORMATION` | `MatchingInformationQuestion` |
| `MATCHING_FEATURES` | `MatchingFeaturesQuestion` |
| `LIST_MATCHING` | `ListMatchingQuestion` |
| `CLASSIFICATION` | `ClassificationQuestion` |
| `MATCHING_SENTENCE_ENDINGS` | `MatchingSentenceEndingsQuestion` |
| `DRAG_AND_DROP` | `DragAndDropQuestion` |
| `TABLE_COMPLETION` | `TableCompletionQuestion` |
| `FLOWCHART_COMPLETION` | `FlowchartCompletionQuestion` |
| `DIAGRAM_LABEL_COMPLETION` | `DiagramLabelCompletionQuestion` |
| `SHORT_ANSWER` | `ShortAnswerQuestion` |

The registry is typed as `Record<ReadingQuestionType, ComponentType<...>>`, so
TypeScript reports an error if a new backend enum is added without a renderer.

## Notes, highlights and bookmarks

The `annotations/` folder separates interaction from persistence:

- `useReadingTextAnnotations` captures a selection, calculates stable text
  offsets and paints scoped passage/question highlights without wrapping or
  replacing DOM nodes.
- `ReadingSelectionToolbar` exposes Note and Highlight actions.
- `ReadingNotesDrawer` is a controlled editor/list with save and delete
  callbacks.
- `ReadingQuestionBookmarkButton` is a controlled per-question review flag.
- `ReadingAnnotationRepository` documents the backend persistence boundary.

Keep answer, flag and annotation state in the route/container. A backend
integration should implement the repository/gateway callbacks; question
components themselves should remain API-agnostic.
