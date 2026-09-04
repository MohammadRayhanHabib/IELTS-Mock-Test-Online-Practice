import React from "react";
import QuestionChoiceGroup from "./QuestionChoiceGroup";
import StatementAgreementQuestion from "./StatementAgreementQuestion";
import { answerAsArray, answerAsString, type ReadingQuestionComponentProps } from "./types";

const OPTIONS = ["YES", "NO", "NOT GIVEN"] as const;

const YesNoNotGivenQuestion: React.FC<ReadingQuestionComponentProps> = ({ question, answer, onChange, firstQuestionNumber, textClassName, visualVariant, flaggedQuestions, onToggleFlag, onSelectQuestion }) =>
  visualVariant === "client-preview" || Array.isArray(answer) ? (
    <QuestionChoiceGroup questionId={question._id} rows={question.options ?? []} choices={OPTIONS} answer={answerAsArray(answer, question.options?.length)} onChange={onChange} firstQuestionNumber={firstQuestionNumber} textClassName={textClassName} visualVariant={visualVariant === "client-preview" ? "statement-reference" : "default"} flaggedQuestions={flaggedQuestions} onToggleFlag={onToggleFlag} onSelectQuestion={onSelectQuestion} />
  ) : (
    <StatementAgreementQuestion options={OPTIONS} answer={answerAsString(answer)} onChange={onChange} textClassName={textClassName} />
  );

export default YesNoNotGivenQuestion;
