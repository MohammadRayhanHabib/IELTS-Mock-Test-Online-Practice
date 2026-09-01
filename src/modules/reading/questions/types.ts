import type { IReadingQuestionStudent } from "../../../api/reading";

export type ReadingQuestionAnswer = string | string[];
export type ReadingQuestionVisualVariant = "default" | "client-preview";

export interface ReadingQuestionComponentProps {
  question: IReadingQuestionStudent;
  answer: ReadingQuestionAnswer;
  onChange: (answer: ReadingQuestionAnswer) => void;
  firstQuestionNumber: number;
  textClassName?: string;
  visualVariant?: ReadingQuestionVisualVariant;
  flaggedQuestions?: ReadonlySet<number>;
  onToggleFlag?: (questionNumber: number) => void;
  onSelectQuestion?: (questionNumber: number) => void;
}

export const answerAsString = (answer: ReadingQuestionAnswer): string =>
  Array.isArray(answer) ? "" : answer;

export const answerAsArray = (
  answer: ReadingQuestionAnswer,
  length = 0,
): string[] => {
  const values = Array.isArray(answer) ? answer.map(String) : [];
  return length > 0
    ? Array.from({ length }, (_, index) => values[index] ?? "")
    : values;
};
