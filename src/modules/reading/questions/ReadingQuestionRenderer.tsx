import React from "react";
import { ReadingQuestionType } from "../../../api/reading";
import ClassificationQuestion from "./ClassificationQuestion";
import DiagramLabelCompletionQuestion from "./DiagramLabelCompletionQuestion";
import DragAndDropQuestion from "./DragAndDropQuestion";
import FillInBlanksQuestion from "./FillInBlanksQuestion";
import FlowchartCompletionQuestion from "./FlowchartCompletionQuestion";
import ListMatchingQuestion from "./ListMatchingQuestion";
import MatchingFeaturesQuestion from "./MatchingFeaturesQuestion";
import MatchingHeadingsQuestion from "./MatchingHeadingsQuestion";
import MatchingInformationQuestion from "./MatchingInformationQuestion";
import MatchingSentenceEndingsQuestion from "./MatchingSentenceEndingsQuestion";
import McqMultipleQuestion from "./McqMultipleQuestion";
import McqSingleQuestion from "./McqSingleQuestion";
import NoteCompletionQuestion from "./NoteCompletionQuestion";
import SentenceCompletionQuestion from "./SentenceCompletionQuestion";
import ShortAnswerQuestion from "./ShortAnswerQuestion";
import SummaryCompletionQuestion from "./SummaryCompletionQuestion";
import TableCompletionQuestion from "./TableCompletionQuestion";
import TitleSubtitleFindingQuestion from "./TitleSubtitleFindingQuestion";
import TrueFalseNotGivenQuestion from "./TrueFalseNotGivenQuestion";
import YesNoNotGivenQuestion from "./YesNoNotGivenQuestion";
import type { ReadingQuestionComponentProps } from "./types";

export const READING_QUESTION_COMPONENTS: Record<
  ReadingQuestionType,
  React.ComponentType<ReadingQuestionComponentProps>
> = {
  [ReadingQuestionType.TRUE_FALSE_NOT_GIVEN]: TrueFalseNotGivenQuestion,
  [ReadingQuestionType.YES_NO_NOT_GIVEN]: YesNoNotGivenQuestion,
  [ReadingQuestionType.MCQ_SINGLE]: McqSingleQuestion,
  [ReadingQuestionType.MCQ_MULTIPLE]: McqMultipleQuestion,
  [ReadingQuestionType.TITLE_SUBTITLE_FINDING]: TitleSubtitleFindingQuestion,
  [ReadingQuestionType.FILL_IN_BLANKS]: FillInBlanksQuestion,
  [ReadingQuestionType.SENTENCE_COMPLETION]: SentenceCompletionQuestion,
  [ReadingQuestionType.SUMMARY_COMPLETION]: SummaryCompletionQuestion,
  [ReadingQuestionType.NOTE_COMPLETION]: NoteCompletionQuestion,
  [ReadingQuestionType.MATCHING_HEADINGS]: MatchingHeadingsQuestion,
  [ReadingQuestionType.MATCHING_INFORMATION]: MatchingInformationQuestion,
  [ReadingQuestionType.MATCHING_FEATURES]: MatchingFeaturesQuestion,
  [ReadingQuestionType.LIST_MATCHING]: ListMatchingQuestion,
  [ReadingQuestionType.CLASSIFICATION]: ClassificationQuestion,
  [ReadingQuestionType.MATCHING_SENTENCE_ENDINGS]: MatchingSentenceEndingsQuestion,
  [ReadingQuestionType.DRAG_AND_DROP]: DragAndDropQuestion,
  [ReadingQuestionType.TABLE_COMPLETION]: TableCompletionQuestion,
  [ReadingQuestionType.FLOWCHART_COMPLETION]: FlowchartCompletionQuestion,
  [ReadingQuestionType.DIAGRAM_LABEL_COMPLETION]: DiagramLabelCompletionQuestion,
  [ReadingQuestionType.SHORT_ANSWER]: ShortAnswerQuestion,
};

const ReadingQuestionRenderer: React.FC<ReadingQuestionComponentProps> = (props) => {
  const Component = READING_QUESTION_COMPONENTS[props.question.questionType];
  return <Component {...props} />;
};

export default ReadingQuestionRenderer;
