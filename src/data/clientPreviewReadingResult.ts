import type { IReadingQuestionStudent } from "../api/reading";
import {
  READING_PART_1_DEMO_QUESTIONS,
  READING_PART_1_SHOWCASE_TEST,
  READING_PART_2_DEMO_QUESTIONS,
  READING_PART_2_SHOWCASE_TEST,
  READING_PART_3_DEMO_QUESTIONS,
  READING_PART_3_SHOWCASE_TEST,
} from "./readingPart1Showcase";
import { getClientPreviewFullReadingMock } from "./clientPreviewFullReadingMocks";

export const CLIENT_READING_RESULT_KEY =
  "lexora.client-preview.reading.result.v1";

export interface ClientReadingStoredResult {
  testNumber: number;
  answers: Record<string, string | string[]>;
  correctAnswers: number;
  totalQuestions: number;
  bandScore: number;
  durationSeconds: number;
  completedAt: string;
  flaggedQuestions: number[];
}

export interface ClientReadingAnswerDefinition {
  number: number;
  partLabel: string;
  questionId: string;
  questionTypeLabel: string;
  prompt: string;
  displayAnswer: string;
  acceptedAnswers: string[];
  contextTitle: string;
  context: string;
}

const REFERENCE_ANSWERS: Record<number, string> = {
  1: "A",
  2: "B",
  3: "Tackling the issue using a different approach",
  4: "A significant improvement on last time",
  5: "How robots can save human lives",
  6: "B",
  7: "A",
  8: "C",
  9: "C",
  10: "B",
  11: "D",
  12: "receive regular care",
  13: "extend above pavements and buildings",
  14: "mathematics",
  15: "educational standards",
  16: "distraction",
  17: "directions",
  18: "people",
  19: "security procedures",
  20: "destination",
  21: "road",
  22: "conference",
  23: "factory",
  24: "steel",
  25: "mixed",
  26: "inferior",
  27: "economic downturn",
  28: "five years",
  29: "six metres",
  30: "moss",
  31: "C",
  32: "B",
  33: "YES",
  34: "NO",
  35: "TRUE",
  36: "TRUE",
  37: "A",
  38: "A",
  39: "A",
  40: "A",
};

const PARTS: Array<{
  partLabel: string;
  questions: IReadingQuestionStudent[];
  contextTitle: string;
  context: string;
}> = [
  {
    partLabel: "Part 1",
    questions: READING_PART_1_DEMO_QUESTIONS,
    contextTitle: READING_PART_1_SHOWCASE_TEST.passageTitle,
    context:
      "Urban trees cool streets, manage rainwater and become more resilient when planting, maintenance and community knowledge work together.",
  },
  {
    partLabel: "Part 2",
    questions: READING_PART_2_DEMO_QUESTIONS,
    contextTitle: READING_PART_2_SHOWCASE_TEST.passageTitle,
    context:
      "Airports are diversifying beyond aviation and retail by developing leisure, workplace and business-meeting facilities inside terminals.",
  },
  {
    partLabel: "Part 3",
    questions: READING_PART_3_DEMO_QUESTIONS,
    contextTitle: READING_PART_3_SHOWCASE_TEST.passageTitle,
    context:
      "The passage traces changing views about photography, creativity and whether a mechanically produced image can be considered art.",
  },
];

export const CLIENT_READING_ANSWER_DEFINITIONS = PARTS.flatMap((part) =>
  part.questions.flatMap((question) => {
    const firstNumber = question.pageNumber ?? question.orderNumber;
    const marks = Math.max(1, question.marks ?? 1);
    return Array.from({ length: marks }, (_, index) => {
      const number = firstNumber + index;
      return {
        number,
        partLabel: part.partLabel,
        questionId: question._id,
        questionTypeLabel: question.groupLabel ?? "Reading question",
        prompt: buildPrompt(question, index, number),
        displayAnswer: REFERENCE_ANSWERS[number] ?? "Reference answer",
        acceptedAnswers: [REFERENCE_ANSWERS[number] ?? "Reference answer"],
        contextTitle: part.contextTitle,
        context: part.context,
      } satisfies ClientReadingAnswerDefinition;
    });
  }),
);

export function getClientReadingAnswerDefinitions(
  testNumber = 1,
): ClientReadingAnswerDefinition[] {
  if (testNumber === 1) return CLIENT_READING_ANSWER_DEFINITIONS;
  const mock = getClientPreviewFullReadingMock(testNumber);
  if (!mock) return CLIENT_READING_ANSWER_DEFINITIONS;

  return mock.parts.flatMap((part, partIndex) =>
    part.questions.flatMap((question) => {
      const firstNumber = question.pageNumber ?? question.orderNumber;
      const marks = Math.max(1, question.marks ?? 1);
      return Array.from({ length: marks }, (_, index) => {
        const number = firstNumber + index;
        const answer = mock.answers[number] ?? "Reference answer";
        return {
          number,
          partLabel: `Part ${partIndex + 1}`,
          questionId: question._id,
          questionTypeLabel: question.groupLabel ?? "Reading question",
          prompt: buildPrompt(question, index, number),
          displayAnswer: answer,
          acceptedAnswers: [answer],
          contextTitle: part.test.passageTitle,
          context: stripHtml(part.test.passageContent).slice(0, 720),
        } satisfies ClientReadingAnswerDefinition;
      });
    }),
  );
}

export function scoreClientReadingAnswers(
  answers: Record<string, string | string[]>,
  durationSeconds: number,
  flaggedQuestions: number[],
  testNumber = 1,
): ClientReadingStoredResult {
  const definitions = getClientReadingAnswerDefinitions(testNumber);
  const correctAnswers = definitions.reduce(
    (total, definition) => {
      const submitted = readDefinitionAnswer(definition, answers, definitions);
      const correct = definition.acceptedAnswers.some(
        (answer) => normalizeReadingAnswer(answer) === normalizeReadingAnswer(submitted),
      );
      return total + (correct ? 1 : 0);
    },
    0,
  );
  const totalQuestions = definitions.length;

  return {
    testNumber,
    answers,
    correctAnswers,
    totalQuestions,
    bandScore: readingBandScore(correctAnswers),
    durationSeconds: Math.max(0, Math.floor(durationSeconds)),
    completedAt: new Date().toISOString(),
    flaggedQuestions,
  };
}

export function readDefinitionAnswer(
  definition: ClientReadingAnswerDefinition,
  answers: Record<string, string | string[]>,
  definitions = CLIENT_READING_ANSWER_DEFINITIONS,
): string {
  const value = answers[definition.questionId];
  if (Array.isArray(value)) {
    const siblings = definitions.filter(
      (candidate) => candidate.questionId === definition.questionId,
    );
    const index = siblings.findIndex(
      (candidate) => candidate.number === definition.number,
    );
    return value[Math.max(0, index)] ?? "";
  }
  return value ?? "";
}

export function normalizeReadingAnswer(value: string): string {
  return value
    .toLowerCase()
    .replace(/[—–:.,()]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function readingBandScore(correctAnswers: number): number {
  if (correctAnswers >= 39) return 9;
  if (correctAnswers >= 37) return 8.5;
  if (correctAnswers >= 35) return 8;
  if (correctAnswers >= 33) return 7.5;
  if (correctAnswers >= 30) return 7;
  if (correctAnswers >= 27) return 6.5;
  if (correctAnswers >= 23) return 6;
  if (correctAnswers >= 19) return 5.5;
  if (correctAnswers >= 15) return 5;
  if (correctAnswers >= 13) return 4.5;
  if (correctAnswers >= 10) return 4;
  return 3;
}

function buildPrompt(
  question: IReadingQuestionStudent,
  index: number,
  number: number,
): string {
  const option = question.options?.[index]?.replace(/\[\[GAP\]\]/g, "____");
  if (option?.trim()) return option.replace(/\|\|\|/g, " · ").trim();
  if (question.questionText.trim()) return question.questionText.trim();
  return `${question.groupLabel ?? "Reading question"} — Question ${number}`;
}

function stripHtml(value: string): string {
  return value
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}
