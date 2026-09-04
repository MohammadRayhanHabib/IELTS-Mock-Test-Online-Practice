import React from "react";
import ListeningQuestionBookmark from "./ListeningQuestionBookmark";
import ListeningQuestionTypeBanner from "./ListeningQuestionTypeBanner";

type AnswerMap = Record<number, string>;

interface ListeningShortAnswerPanelProps {
  answers: AnswerMap;
  bookmarkedQuestions: ReadonlySet<number>;
  onAnswerChange: (number: number, value: string) => void;
  onAnswerFocus: (number: number) => void;
  onBookmarkToggle: (number: number) => void;
  registerInput: (number: number, element: HTMLInputElement | null) => void;
}

const SHORT_ANSWER_QUESTIONS = [
  { number: 31, question: "What was the Sea Life Centre previously called?" },
  { number: 32, question: "What is the newest attraction called?" },
  { number: 33, question: "When is the main feeding time?" },
  { number: 34, question: "What can you do with a VIP ticket?" },
  {
    number: 35,
    question: "What special event will the Sea Life Centre arrange for you?",
  },
  {
    number: 36,
    question: "Where will the petition for animal conservation be sent to?",
  },
  { number: 37, question: "What can you use to test what you have learnt?" },
] as const;

const ListeningShortAnswerPanel: React.FC<ListeningShortAnswerPanelProps> = ({
  answers,
  bookmarkedQuestions,
  onAnswerChange,
  onAnswerFocus,
  onBookmarkToggle,
  registerInput,
}) => (
  <section
    className="relative w-full max-w-[1120px] pb-16"
    aria-labelledby="listening-short-answer-heading"
  >
    <ListeningQuestionTypeBanner code="L-09" name="Short-Answer Questions" exampleCount={7} />
    <h2 id="listening-short-answer-heading" className="text-[16px] font-bold">
      Questions 31 - 37
    </h2>

    <div className="mt-7 space-y-4 text-[16px]">
      <p className="italic">Answer the questions below.</p>
      <p className="italic">
        Write <strong>NO MORE THAN THREE WORDS</strong> for each answer.
      </p>
    </div>

    <h3 className="mt-9 text-[16px] font-bold">Sea Life Centre — information</h3>

    <div className="mt-6 space-y-[25px]">
      {SHORT_ANSWER_QUESTIONS.map((item) => (
        <div
          key={item.number}
          className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[16px]"
        >
          <input
            ref={(element) => registerInput(item.number, element)}
            id={`listening-short-answer-${item.number}`}
            type="text"
            value={answers[item.number] ?? ""}
            placeholder={String(item.number)}
            aria-label={`Answer ${item.number}`}
            onChange={(event) =>
              onAnswerChange(item.number, event.target.value)
            }
            onFocus={() => onAnswerFocus(item.number)}
            className="h-[31px] w-[210px] shrink-0 border border-[#8c8c8c] bg-white px-3 text-center text-[15px] font-semibold text-gray-900 outline-none placeholder:text-[#666] focus:border-2 focus:border-[#2589db]"
          />
          <label htmlFor={`listening-short-answer-${item.number}`} className="min-w-0">
            {item.question}
          </label>
          <ListeningQuestionBookmark questionNumber={item.number} bookmarked={bookmarkedQuestions.has(item.number)} onToggle={onBookmarkToggle} />
        </div>
      ))}
    </div>

  </section>
);

export default ListeningShortAnswerPanel;
