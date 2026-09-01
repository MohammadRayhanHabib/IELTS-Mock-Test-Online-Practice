import React from "react";
import QuestionChoiceGroup from "./QuestionChoiceGroup";
import StatementAgreementQuestion from "./StatementAgreementQuestion";
import { answerAsArray, answerAsString, type ReadingQuestionComponentProps } from "./types";

const OPTIONS = ["TRUE", "FALSE", "NOT GIVEN"] as const;

const TrueFalseNotGivenQuestion: React.FC<ReadingQuestionComponentProps> = ({ question, answer, onChange, firstQuestionNumber, textClassName, visualVariant, flaggedQuestions, onToggleFlag }) =>
  visualVariant === "client-preview" || Array.isArray(answer) ? (
    <QuestionChoiceGroup questionId={question._id} rows={question.options ?? []} choices={OPTIONS} answer={answerAsArray(answer, question.options?.length)} onChange={onChange} firstQuestionNumber={firstQuestionNumber} textClassName={textClassName} visualVariant={visualVariant === "client-preview" ? "statement-reference" : "default"} flaggedQuestions={flaggedQuestions} onToggleFlag={onToggleFlag} />
  ) : (
    <StatementAgreementQuestion options={OPTIONS} answer={answerAsString(answer)} onChange={onChange} textClassName={textClassName} />
  );

export default TrueFalseNotGivenQuestion;
