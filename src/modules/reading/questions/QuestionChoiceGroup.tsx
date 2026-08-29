import React from "react";

interface QuestionChoiceGroupProps {
  questionId: string;
  rows: string[];
  choices?: readonly string[];
  answer: string[];
  onChange: (next: string[]) => void;
  firstQuestionNumber: number;
  textClassName?: string;
  visualVariant?: "default" | "statement-reference" | "single-choice-reference";
}

const QuestionChoiceGroup: React.FC<QuestionChoiceGroupProps> = ({
  questionId,
  rows,
  choices: fixedChoices,
  answer,
  onChange,
  firstQuestionNumber,
  textClassName = "text-sm",
  visualVariant = "default",
}) => {
  const normalizedAnswers = Array.from({ length: rows.length }, (_, index) => answer[index] ?? "");

  if (visualVariant === "statement-reference" && fixedChoices) {
    return (
      <div className="space-y-16 pb-4">
        {rows.map((row, rowIndex) => {
          const questionNumber = firstQuestionNumber + rowIndex;
          return (
            <fieldset key={`${questionId}-${rowIndex}`} className="min-w-0 border-0 p-0">
              <legend className="sr-only">Question {questionNumber}</legend>
              <div className="flex items-start gap-2">
                <span className={`flex h-8 min-w-9 shrink-0 items-center justify-center px-1.5 text-base font-bold tabular-nums text-gray-950 ${rowIndex === 0 ? "rounded-sm border-2 border-[#1683d8] bg-white" : "border-2 border-transparent"}`}>{questionNumber}</span>
                <p className={`pt-0.5 font-bold leading-relaxed text-gray-950 ${textClassName}`}>{row}</p>
              </div>
              <div className="mt-5 space-y-5 pl-12">
                {fixedChoices.map((choice) => (
                  <label key={`${questionId}-${rowIndex}-${choice}`} className={`flex w-fit cursor-pointer items-center gap-4 leading-none text-gray-950 ${textClassName}`}>
                    <input type="radio" name={`${questionId}-${rowIndex}`} checked={normalizedAnswers[rowIndex] === choice} onChange={() => { const next = [...normalizedAnswers]; next[rowIndex] = choice; onChange(next); }} className="h-4 w-4 shrink-0 accent-gray-900" />
                    <span>{choice}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          );
        })}
      </div>
    );
  }

  if (visualVariant === "single-choice-reference") {
    return (
      <div className="space-y-14 pb-4">
        {rows.map((row, rowIndex) => {
          const [prompt = "", ...choices] = row.split("|||");
          const questionNumber = firstQuestionNumber + rowIndex;
          return (
            <fieldset key={`${questionId}-${rowIndex}`} className="min-w-0 border-0 p-0">
              <legend className="sr-only">Question {questionNumber}</legend>
              <div className="flex items-start gap-2">
                <span className={`flex h-8 min-w-9 shrink-0 items-center justify-center px-1.5 text-base font-bold tabular-nums text-gray-950 ${rowIndex === 0 ? "rounded-sm border-2 border-[#1683d8] bg-white" : "border-2 border-transparent"}`}>{questionNumber}</span>
                <p className={`pt-0.5 font-bold leading-relaxed text-gray-950 ${textClassName}`}>{prompt}</p>
              </div>
              <div className="mt-4 space-y-1 pl-3">
                {choices.map((choice, choiceIndex) => (
                  <label key={`${questionId}-${rowIndex}-${choiceIndex}`} className={`flex min-h-9 w-full cursor-pointer items-center gap-4 px-3 py-1.5 leading-relaxed text-gray-950 transition-colors ${textClassName} ${normalizedAnswers[rowIndex] === choice ? "bg-[#b7ddf6]" : "bg-transparent hover:bg-gray-50"}`}>
                    <input type="radio" name={`${questionId}-${rowIndex}`} checked={normalizedAnswers[rowIndex] === choice} onChange={() => { const next = [...normalizedAnswers]; next[rowIndex] = choice; onChange(next); }} className="h-4 w-4 shrink-0 accent-[#1683d8]" />
                    <span>{choice}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          );
        })}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {rows.map((row, rowIndex) => {
        const [prompt = "", ...encodedChoices] = row.split("|||");
        const choices = fixedChoices ?? encodedChoices;
        const questionNumber = firstQuestionNumber + rowIndex;
        return (
          <fieldset key={`${questionId}-${rowIndex}`} className="rounded-md border border-gray-200 bg-white p-4 shadow-sm">
            <legend className="sr-only">Question {questionNumber}</legend>
            <div className="mb-3 flex items-start gap-3">
              <span className="flex h-7 min-w-7 shrink-0 items-center justify-center rounded-sm border border-sky-600 bg-sky-50 px-1.5 text-xs font-bold tabular-nums text-sky-950">{questionNumber}</span>
              <p className={`pt-0.5 font-medium leading-relaxed text-gray-900 ${textClassName}`}>{prompt || row}</p>
            </div>
            <div className={fixedChoices ? "grid gap-2 pl-10 sm:grid-cols-3" : "space-y-2 pl-10"}>
              {choices.map((choice, choiceIndex) => (
                <label key={`${choice}-${choiceIndex}`} className={`flex cursor-pointer items-start gap-2.5 rounded-sm border px-3 py-2 transition-colors ${textClassName} ${normalizedAnswers[rowIndex] === choice ? "border-sky-600 bg-sky-50 text-sky-950" : "border-gray-200 bg-white text-gray-800 hover:bg-gray-50"}`}>
                  <input type="radio" name={`${questionId}-${rowIndex}`} checked={normalizedAnswers[rowIndex] === choice} onChange={() => { const next = [...normalizedAnswers]; next[rowIndex] = choice; onChange(next); }} className="mt-0.5 h-4 w-4 accent-gray-900" />
                  {!fixedChoices ? <span className="font-semibold text-gray-500">{String.fromCharCode(65 + choiceIndex)}</span> : null}
                  <span>{choice}</span>
                </label>
              ))}
            </div>
          </fieldset>
        );
      })}
    </div>
  );
};

export default QuestionChoiceGroup;
