import React from "react";
import QuestionChoiceGroup from "./QuestionChoiceGroup";
import SingleChoiceQuestion from "./SingleChoiceQuestion";
import {
  answerAsArray,
  answerAsString,
  type ReadingQuestionComponentProps,
} from "./types";

const TitleSubtitleFindingQuestion: React.FC<ReadingQuestionComponentProps> = ({
  question,
  answer,
  onChange,
  firstQuestionNumber,
  textClassName,
  visualVariant,
  flaggedQuestions,
  onToggleFlag,
  onSelectQuestion,
}) => {
  const rows = question.options ?? [];
  const grouped = rows.some((row) => row.includes("|||"));

  return grouped ? (
    <QuestionChoiceGroup
      questionId={question._id}
      rows={rows}
      answer={answerAsArray(answer, rows.length)}
      onChange={onChange}
      firstQuestionNumber={firstQuestionNumber}
      textClassName={textClassName}
      visualVariant={
        visualVariant === "client-preview"
          ? "single-choice-reference"
          : "default"
      }
      flaggedQuestions={flaggedQuestions}
      onToggleFlag={onToggleFlag}
      onSelectQuestion={onSelectQuestion}
    />
  ) : (
    <SingleChoiceQuestion
      questionId={question._id}
      options={rows}
      answer={answerAsString(answer)}
      onChange={(next) => onChange(next)}
      textClassName={textClassName}
    />
  );
};

export default TitleSubtitleFindingQuestion;
