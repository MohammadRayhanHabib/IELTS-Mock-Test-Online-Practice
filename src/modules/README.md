# Feature modules

Each module contains copy-friendly UI parts. Route pages compose these parts and
own workflow state; question components stay presentational.

- `mock-tests/components`: initial catalogue hero, environment/update strips and card.
- `reading/questions`: all 20 Reading task types, shared primitives and a typed renderer registry.
- `reading/annotations`: selection, highlight, note drawer and review-bookmark controls.
- `listening/questions`: named Listening question types and answer field.
- `writing/components`: Task 1 visuals.
- `speaking/components`: Speaking controls.

When adding a Reading pattern, create a controlled component named after the
IELTS task, export it from `questions/index.ts`, and register it in
`ReadingQuestionRenderer.tsx`. Keep API/storage changes outside presentational
components. See `reading/README.md` for the full component and persistence map.
