import React from "react";
import MultipleChoiceQuestion from "./MultipleChoiceQuestion";
import { answerAsArray, type ReadingQuestionComponentProps } from "./types";

const McqMultipleQuestion: React.FC<ReadingQuestionComponentProps> = ({ question, answer, onChange, textClassName }) => (
  <MultipleChoiceQuestion questionId={question._id} options={question.options ?? []} answer={answerAsArray(answer)} onChange={onChange} textClassName={textClassName} />
);

export default McqMultipleQuestion;
