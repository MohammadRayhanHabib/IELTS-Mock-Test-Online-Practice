import React from "react";
import ListMatchingPanel from "../../../components/reading/ListMatchingPanel";
import { answerAsArray, type ReadingQuestionComponentProps } from "./types";

const ListMatchingQuestion: React.FC<ReadingQuestionComponentProps> = ({ question, answer, onChange, firstQuestionNumber, visualVariant }) => (
  <ListMatchingPanel questionId={question._id} purposes={question.options ?? []} wordBank={question.wordBank ?? []} bankTitle={question.questionText} answer={answerAsArray(answer)} onChange={onChange} firstQuestionNumber={firstQuestionNumber} visualVariant={visualVariant === "client-preview" ? "two-letter" : "list"} />
);

export default ListMatchingQuestion;
