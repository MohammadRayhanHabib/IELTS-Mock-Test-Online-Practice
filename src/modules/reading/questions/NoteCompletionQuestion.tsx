import React from "react";
import NoteCompletionGaps from "../../../components/reading/NoteCompletionGaps";
import { answerAsArray, type ReadingQuestionComponentProps } from "./types";

const NoteCompletionQuestion: React.FC<ReadingQuestionComponentProps> = ({ question, answer, onChange, firstQuestionNumber, textClassName, visualVariant, flaggedQuestions, onToggleFlag }) => (
  <NoteCompletionGaps lines={question.options ?? []} answer={answerAsArray(answer)} onChange={onChange} firstQuestionNumber={firstQuestionNumber} lineTextClassName={`${textClassName ?? "text-base"} text-gray-800`} showBullet appearance={visualVariant === "client-preview" ? "official" : "note"} flaggedQuestions={flaggedQuestions} onToggleFlag={onToggleFlag} />
);

export default NoteCompletionQuestion;
