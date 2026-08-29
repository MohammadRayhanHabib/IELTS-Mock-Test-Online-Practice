import React from "react";
import TextAnswerQuestion from "./TextAnswerQuestion";
import { answerAsString, type ReadingQuestionComponentProps } from "./types";

const FillInBlanksQuestion: React.FC<ReadingQuestionComponentProps> = ({ answer, onChange, textClassName }) => (
  <TextAnswerQuestion value={answerAsString(answer)} onChange={onChange} textClassName={textClassName} />
);

export default FillInBlanksQuestion;
