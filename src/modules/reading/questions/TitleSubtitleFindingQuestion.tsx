import React from "react";
import SingleChoiceQuestion from "./SingleChoiceQuestion";
import { answerAsString, type ReadingQuestionComponentProps } from "./types";

const TitleSubtitleFindingQuestion: React.FC<ReadingQuestionComponentProps> = ({
  question,
  answer,
  onChange,
  textClassName,
}) => (
  <SingleChoiceQuestion
    questionId={question._id}
    options={question.options ?? []}
    answer={answerAsString(answer)}
    onChange={(next) => onChange(next)}
    textClassName={textClassName}
  />
);

export default TitleSubtitleFindingQuestion;
