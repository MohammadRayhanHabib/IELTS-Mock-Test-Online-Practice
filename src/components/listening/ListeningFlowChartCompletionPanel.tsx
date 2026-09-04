import React from "react";
import ListeningQuestionBookmark from "./ListeningQuestionBookmark";
import ListeningQuestionTypeBanner from "./ListeningQuestionTypeBanner";

type AnswerMap = Record<number, string>;

interface ListeningFlowChartCompletionPanelProps {
  answers: AnswerMap;
  bookmarkedQuestions: ReadonlySet<number>;
  onAnswerChange: (number: number, value: string) => void;
  onAnswerFocus: (number: number) => void;
  onBookmarkToggle: (number: number) => void;
  registerInput: (number: number, element: HTMLInputElement | null) => void;
}

const FLOW_STEPS = [
  { number: 27, before: "Get approval from", after: "" },
  { number: 28, before: "Complete a", after: "form" },
  { number: 29, before: "Book a", after: "with the systems analyst" },
  { number: 30, before: "Set up a", after: "with technologies team" },
] as const;

const ListeningFlowChartCompletionPanel: React.FC<
  ListeningFlowChartCompletionPanelProps
> = ({
  answers,
  bookmarkedQuestions,
  onAnswerChange,
  onAnswerFocus,
  onBookmarkToggle,
  registerInput,
}) => (
  <section
    className="relative mt-14 w-full pb-16"
    aria-labelledby="listening-flow-chart-heading"
  >
    <ListeningQuestionTypeBanner code="L-08" name="Flow-chart Completion" exampleCount={4} />
    <h2 id="listening-flow-chart-heading" className="text-[16px] font-bold">
      Questions 27 - 30
    </h2>

    <div className="mt-7 space-y-4 text-[16px]">
      <p className="italic">Complete the flow-chart below.</p>
      <p className="italic">
        Write <strong>NO MORE THAN TWO WORDS</strong> for each answer.
      </p>
    </div>

    <h3 className="mt-9 text-center text-[16px] font-bold">Next steps</h3>

    <div className="mt-2 w-full">
      {FLOW_STEPS.map((step) => (
        <div
          key={step.number}
          className="min-h-[74px] border-b border-[#dedede] px-5 text-[16px] last:border-b-0"
        >
          <div className="flex min-h-[74px] flex-wrap items-center justify-center gap-x-2 gap-y-2">
            <span>{step.before}</span>
            <input
              ref={(element) => registerInput(step.number, element)}
              id={`listening-flow-answer-${step.number}`}
              type="text"
              value={answers[step.number] ?? ""}
              placeholder={String(step.number)}
              aria-label={`Answer ${step.number}`}
              onChange={(event) =>
                onAnswerChange(step.number, event.target.value)
              }
              onFocus={() => onAnswerFocus(step.number)}
              className="h-[31px] w-[210px] border border-[#8c8c8c] bg-white px-3 text-center text-[15px] font-semibold text-gray-900 outline-none placeholder:text-[#666] focus:border-2 focus:border-[#2589db]"
            />
            {step.after ? <span>{step.after}</span> : null}
            <ListeningQuestionBookmark questionNumber={step.number} bookmarked={bookmarkedQuestions.has(step.number)} onToggle={onBookmarkToggle} />
          </div>
        </div>
      ))}
    </div>

  </section>
);

export default ListeningFlowChartCompletionPanel;
