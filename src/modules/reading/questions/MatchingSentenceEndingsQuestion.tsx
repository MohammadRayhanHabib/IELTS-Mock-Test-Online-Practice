import React from "react";
import SentenceEndingMatchingPanel from "../../../components/reading/SentenceEndingMatchingPanel";
import { answerAsArray, type ReadingQuestionComponentProps } from "./types";

const MatchingSentenceEndingsQuestion: React.FC<ReadingQuestionComponentProps> = ({ question, answer, onChange, firstQuestionNumber, visualVariant, flaggedQuestions, onToggleFlag, onSelectQuestion }) => (
  <SentenceEndingMatchingPanel questionId={question._id} stems={question.options ?? []} endings={question.wordBank ?? []} answer={answerAsArray(answer)} onChange={onChange} firstQuestionNumber={firstQuestionNumber} visualVariant={visualVariant === "client-preview" ? "reference" : "default"} flaggedQuestions={flaggedQuestions} onToggleFlag={onToggleFlag} onSelectQuestion={onSelectQuestion} />
);

export default MatchingSentenceEndingsQuestion;
