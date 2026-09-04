import React from "react";
import {
  FLOWCHART_GAP_TOKEN,
  countFlowchartGapTokens,
} from "../../../api/reading";
import type { ReadingQuestionComponentProps } from "./types";
import { answerAsArray } from "./types";
import ReadingQuestionFlagButton from "../../../components/reading/ReadingQuestionFlagButton";

function gapsBeforeRow(rows: string[], rowIndex: number): number {
  let count = 0;
  for (let index = 0; index < rowIndex; index += 1) {
    count += Math.max(0, (rows[index] ?? "").split(FLOWCHART_GAP_TOKEN).length - 1);
  }
  return count;
}

interface FlowchartCompletionQuestionProps {
  title: string;
  rows: string[];
  hints: string[];
  answer: string[];
  onChange: (next: string[]) => void;
  firstQuestionNumber: number;
  visualVariant?: "default" | "key-events-reference";
  flaggedQuestions?: ReadonlySet<number>;
  onToggleFlag?: (questionNumber: number) => void;
  onSelectQuestion?: (questionNumber: number) => void;
}

export const FlowchartCompletionPanel: React.FC<FlowchartCompletionQuestionProps> = ({
  title,
  rows,
  hints,
  answer,
  onChange,
  firstQuestionNumber,
  visualVariant = "default",
  flaggedQuestions,
  onToggleFlag,
  onSelectQuestion,
}) => {
  const gapCount = countFlowchartGapTokens(rows);
  const values = Array.from({ length: gapCount }, (_, index) => String(answer[index] ?? ""));
  const setValue = (gapIndex: number, value: string) => {
    const next = [...values];
    next[gapIndex] = value;
    onChange(next);
  };

  if (visualVariant === "key-events-reference") {
    return (
      <div className="space-y-3">
        {title.trim() ? <h3 className="pb-1 text-center text-base font-bold text-gray-900">{title.trim()}</h3> : null}
        <div>
          {rows.map((row, rowIndex) => {
            const parts = (row ?? "").split(FLOWCHART_GAP_TOKEN);
            return (
              <div key={rowIndex} className="flex min-h-[72px] flex-wrap items-center justify-center gap-x-2 gap-y-2 border-b border-gray-200 px-3 py-3 text-center text-base leading-relaxed text-gray-900 last:border-b-0">
                {parts.map((part, partIndex) => {
                  const gapIndex = gapsBeforeRow(rows, rowIndex) + partIndex;
                  const questionNumber = firstQuestionNumber + gapIndex;
                  const value = values[gapIndex] ?? "";
                  return (
                    <React.Fragment key={`${rowIndex}-${partIndex}`}>
                      {part ? <span className="whitespace-pre-wrap">{part}</span> : null}
                      {partIndex < parts.length - 1 ? (
                        <span className="inline-flex items-center gap-1 align-middle">
                        <span className="relative inline-flex h-[30px] w-[200px] shrink-0 items-stretch border border-gray-500 bg-white focus-within:border-2 focus-within:border-[#1683d8]">
                          {!value.trim() ? <span className="pointer-events-none absolute inset-0 flex items-center justify-center font-semibold tabular-nums text-gray-600">{questionNumber}</span> : null}
                          <input type="text" value={value} onFocus={() => onSelectQuestion?.(questionNumber)} onClick={() => onSelectQuestion?.(questionNumber)} onChange={(event) => setValue(gapIndex, event.target.value)} aria-label={`Flowchart gap ${questionNumber}`} className="ielts-numbered-answer-input relative z-[1] h-full min-w-0 flex-1 bg-transparent px-2 text-center font-semibold text-gray-900 focus:outline-none" autoComplete="off" />
                        </span>
                        {flaggedQuestions && onToggleFlag ? <ReadingQuestionFlagButton questionNumber={questionNumber} flagged={flaggedQuestions.has(questionNumber)} onToggle={onToggleFlag} className="h-9 w-9" /> : null}
                        </span>
                      ) : null}
                    </React.Fragment>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {title.trim() ? <h3 className="text-center text-base font-bold text-gray-900">{title.trim()}</h3> : null}
      <div className="rounded-xl border-2 border-gray-200 bg-white p-4 shadow-sm">
        {rows.map((row, rowIndex) => {
          const parts = (row ?? "").split(FLOWCHART_GAP_TOKEN);
          return (
            <React.Fragment key={rowIndex}>
              {rowIndex > 0 ? <div className="flex justify-center py-0.5 text-xl leading-none text-gray-700" aria-hidden>↓</div> : null}
              <div className="flex min-h-[2.5rem] flex-wrap items-center justify-center gap-x-1 gap-y-2 rounded-lg border border-gray-200 bg-gradient-to-b from-gray-50/90 to-white px-3 py-3 text-center text-sm leading-relaxed text-gray-900">
                {parts.map((part, partIndex) => {
                  const gapIndex = gapsBeforeRow(rows, rowIndex) + partIndex;
                  const questionNumber = firstQuestionNumber + gapIndex;
                  const value = values[gapIndex] ?? "";
                  return (
                    <React.Fragment key={`${rowIndex}-${partIndex}`}>
                      {part ? <span className="whitespace-pre-wrap">{part}</span> : null}
                      {partIndex < parts.length - 1 ? (
                        <span className="mx-1 inline-flex shrink-0 items-center gap-1 align-baseline">
                        <span className="relative inline-flex items-stretch">
                          {!value.trim() ? <span className="pointer-events-none absolute inset-0 flex items-center justify-center text-sm font-bold tabular-nums text-rose-900">{questionNumber}</span> : null}
                          <input type="text" value={value} onFocus={() => onSelectQuestion?.(questionNumber)} onClick={() => onSelectQuestion?.(questionNumber)} onChange={(event) => setValue(gapIndex, event.target.value)} aria-label={`Flowchart gap ${questionNumber}`} className="ielts-numbered-answer-input relative z-[1] min-h-10 w-[min(12rem,85vw)] min-w-[7rem] rounded-md border-2 border-dashed border-rose-300 bg-transparent px-2 py-1 text-center text-sm text-gray-900 outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-200" autoComplete="off" />
                        </span>
                        {flaggedQuestions && onToggleFlag ? <ReadingQuestionFlagButton questionNumber={questionNumber} flagged={flaggedQuestions.has(questionNumber)} onToggle={onToggleFlag} className="h-9 w-9" /> : null}
                        </span>
                      ) : null}
                    </React.Fragment>
                  );
                })}
              </div>
            </React.Fragment>
          );
        })}
      </div>
      {hints.length > 0 ? (
        <div className="rounded-lg border border-dashed border-rose-200 bg-rose-50/50 p-3">
          <p className="mb-2 text-center text-xs font-semibold uppercase tracking-wide text-rose-900/90">Word bank</p>
          <div className="flex flex-wrap justify-center gap-2">
            {hints.map((hint, index) => <span key={`${hint}-${index}`} className="rounded-full border border-rose-200 bg-white px-2.5 py-1 text-xs text-gray-800 shadow-sm">{hint}</span>)}
          </div>
        </div>
      ) : null}
    </div>
  );
};

const FlowchartCompletionQuestion: React.FC<ReadingQuestionComponentProps> = ({ question, answer, onChange, firstQuestionNumber, visualVariant, flaggedQuestions, onToggleFlag, onSelectQuestion }) => (
  <FlowchartCompletionPanel title={question.questionText} rows={question.options ?? []} hints={(question.wordBank ?? []).filter((hint) => hint.trim())} answer={answerAsArray(answer)} onChange={onChange} firstQuestionNumber={firstQuestionNumber} visualVariant={visualVariant === "client-preview" ? "key-events-reference" : "default"} flaggedQuestions={flaggedQuestions} onToggleFlag={onToggleFlag} onSelectQuestion={onSelectQuestion} />
);

export default FlowchartCompletionQuestion;
