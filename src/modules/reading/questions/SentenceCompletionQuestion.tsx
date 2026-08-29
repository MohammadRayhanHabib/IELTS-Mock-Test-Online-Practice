import React from "react";
import { countNoteCompletionGaps } from "../../../api/reading";
import NoteCompletionGaps from "../../../components/reading/NoteCompletionGaps";
import TextAnswerQuestion from "./TextAnswerQuestion";
import { answerAsArray, answerAsString, type ReadingQuestionComponentProps } from "./types";

const SentenceCompletionQuestion: React.FC<ReadingQuestionComponentProps> = ({ question, answer, onChange, firstQuestionNumber, textClassName }) =>
  countNoteCompletionGaps(question.options) > 0 ? (
    <NoteCompletionGaps lines={question.options ?? []} answer={answerAsArray(answer)} onChange={onChange} firstQuestionNumber={firstQuestionNumber} lineTextClassName={`${textClassName ?? "text-base"} text-gray-800`} showBullet={false} appearance="sentence" />
  ) : (
    <TextAnswerQuestion value={answerAsString(answer)} onChange={onChange} textClassName={textClassName} />
  );

export default SentenceCompletionQuestion;
