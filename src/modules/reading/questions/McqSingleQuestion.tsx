import React from "react";
import QuestionChoiceGroup from "./QuestionChoiceGroup";
import SingleChoiceQuestion from "./SingleChoiceQuestion";
import { answerAsArray, answerAsString, type ReadingQuestionComponentProps } from "./types";

const McqSingleQuestion: React.FC<ReadingQuestionComponentProps> = ({ question, answer, onChange, firstQuestionNumber, textClassName, visualVariant, flaggedQuestions, onToggleFlag, onSelectQuestion }) => {
  const grouped = (question.options ?? []).some((row) => row.includes("|||"));
  return grouped ? (
    <QuestionChoiceGroup questionId={question._id} rows={question.options ?? []} answer={answerAsArray(answer, question.options?.length)} onChange={onChange} firstQuestionNumber={firstQuestionNumber} textClassName={textClassName} visualVariant={visualVariant === "client-preview" ? "single-choice-reference" : "default"} flaggedQuestions={flaggedQuestions} onToggleFlag={onToggleFlag} onSelectQuestion={onSelectQuestion} />
  ) : (
    <SingleChoiceQuestion questionId={question._id} options={question.options ?? []} answer={answerAsString(answer)} onChange={onChange} textClassName={textClassName} />
  );
};

export default McqSingleQuestion;
