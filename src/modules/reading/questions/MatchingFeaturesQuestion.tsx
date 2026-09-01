import React from "react";
import MatchingInformationGrid from "../../../components/reading/MatchingInformationGrid";
import StatementMatchingPanel, { parseStatementMatchChoices } from "../../../components/reading/StatementMatchingPanel";
import { answerAsArray, type ReadingQuestionComponentProps } from "./types";

const MatchingFeaturesQuestion: React.FC<ReadingQuestionComponentProps> = ({ question, answer, onChange, firstQuestionNumber, visualVariant, textClassName, flaggedQuestions, onToggleFlag, onSelectQuestion }) => {
  const choices = parseStatementMatchChoices(question.wordBank);
  if (visualVariant !== "client-preview") {
    return <StatementMatchingPanel questionId={question._id} statements={question.options ?? []} wordBank={question.wordBank ?? []} answer={answerAsArray(answer)} onChange={onChange} firstQuestionNumber={firstQuestionNumber} flaggedQuestions={flaggedQuestions} onToggleFlag={onToggleFlag} />;
  }
  return (
    <div className="space-y-6">
      <section aria-labelledby={`${question._id}-features-title`}>
        <h3 id={`${question._id}-features-title`} className={`mb-3 text-center font-bold text-gray-950 ${textClassName ?? "text-base"}`}>{question.questionText || "List of Features"}</h3>
        <div className="mx-auto max-w-[680px] border border-gray-400 bg-white">
          {choices.map((choice) => <div key={choice.letter} className="grid grid-cols-[3rem_minmax(0,1fr)] border-b border-gray-300 text-sm last:border-b-0"><strong className="border-r border-gray-300 px-3 py-2 text-center text-gray-950">{choice.letter}</strong><span className="px-4 py-2 text-gray-900">{choice.description}</span></div>)}
        </div>
      </section>
      <MatchingInformationGrid questionId={question._id} statements={question.options ?? []} columnLabels={choices.map((choice) => choice.letter)} answer={answerAsArray(answer)} onChange={onChange} firstQuestionNumber={firstQuestionNumber} statementHeader="Statements" selectionLabel="feature" visualVariant="features" flaggedQuestions={flaggedQuestions} onToggleFlag={onToggleFlag} onSelectQuestion={onSelectQuestion} />
    </div>
  );
};

export { parseStatementMatchChoices };
export default MatchingFeaturesQuestion;
