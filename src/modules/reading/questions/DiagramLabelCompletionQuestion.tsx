import React from "react";
import DiagramLabelCompletionPanel from "../../../components/reading/DiagramLabelCompletionPanel";
import { answerAsArray, type ReadingQuestionComponentProps } from "./types";

const DiagramLabelCompletionQuestion: React.FC<ReadingQuestionComponentProps> = ({ question, answer, onChange, firstQuestionNumber, visualVariant }) => (
  <DiagramLabelCompletionPanel questionId={question._id} bankTitle={question.questionText} gapHints={question.options ?? []} wordBank={question.wordBank ?? []} answer={answerAsArray(answer)} onChange={onChange} firstQuestionNumber={firstQuestionNumber} visualVariant={visualVariant === "client-preview" ? "building-structure-reference" : "default"} />
);

export default DiagramLabelCompletionQuestion;
