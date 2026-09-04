import React from "react";
import TableCompletionPanel from "../../../components/reading/TableCompletionPanel";
import { answerAsArray, type ReadingQuestionComponentProps } from "./types";

const TableCompletionQuestion: React.FC<ReadingQuestionComponentProps> = ({ question, answer, onChange, firstQuestionNumber, visualVariant, flaggedQuestions, onToggleFlag, onSelectQuestion }) => (
  <TableCompletionPanel title={question.questionText} firstQuestionNumber={firstQuestionNumber} options={question.options ?? []} hints={(question.wordBank ?? []).filter((hint) => hint.trim())} answer={answerAsArray(answer)} onChange={onChange} visualVariant={visualVariant === "client-preview" ? "change-blindness-reference" : "default"} flaggedQuestions={flaggedQuestions} onToggleFlag={onToggleFlag} onSelectQuestion={onSelectQuestion} />
);

export default TableCompletionQuestion;
