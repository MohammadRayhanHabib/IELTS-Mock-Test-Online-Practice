import React from "react";
import MatchingInformationGrid from "../../../components/reading/MatchingInformationGrid";
import { answerAsArray, type ReadingQuestionComponentProps } from "./types";

const MatchingInformationQuestion: React.FC<ReadingQuestionComponentProps> = ({ question, answer, onChange, firstQuestionNumber, visualVariant }) => (
  <MatchingInformationGrid questionId={question._id} statements={question.options ?? []} columnLabels={question.wordBank ?? []} answer={answerAsArray(answer)} onChange={onChange} firstQuestionNumber={firstQuestionNumber} visualVariant={visualVariant === "client-preview" ? "reference" : "default"} />
);

export default MatchingInformationQuestion;
