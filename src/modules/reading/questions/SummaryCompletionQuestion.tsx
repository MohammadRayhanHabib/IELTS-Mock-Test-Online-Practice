import React from "react";
import { countNoteCompletionGaps } from "../../../api/reading";
import NoteCompletionGaps from "../../../components/reading/NoteCompletionGaps";
import SummaryClueCompletionPanel from "../../../components/reading/SummaryClueCompletionPanel";
import TextAnswerQuestion from "./TextAnswerQuestion";
import { answerAsArray, answerAsString, type ReadingQuestionComponentProps } from "./types";

const SummaryCompletionQuestion: React.FC<ReadingQuestionComponentProps> = ({ question, answer, onChange, firstQuestionNumber, textClassName, visualVariant }) => {
  const clues = (question.wordBank ?? []).filter((word) => word.trim());
  if (clues.length > 0 && visualVariant === "client-preview") {
    return <SummaryClueCompletionPanel questionId={question._id} title={question.questionText} lines={question.options ?? []} clues={clues} answer={answerAsArray(answer)} onChange={onChange} firstQuestionNumber={firstQuestionNumber} />;
  }
  if (countNoteCompletionGaps(question.options) > 0) {
    return <NoteCompletionGaps lines={question.options ?? []} answer={answerAsArray(answer)} onChange={onChange} firstQuestionNumber={firstQuestionNumber} lineTextClassName={`${textClassName ?? "text-base"} text-gray-800`} showBullet={false} appearance={visualVariant === "client-preview" ? "summary-official" : "summary"} emptyLinePlaceholder="Summary paragraph…" />;
  }
  return <TextAnswerQuestion value={answerAsString(answer)} onChange={onChange} textClassName={textClassName} />;
};

export default SummaryCompletionQuestion;
