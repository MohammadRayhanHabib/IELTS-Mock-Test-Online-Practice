import React from "react";
import ListeningQuestionBookmark from "./ListeningQuestionBookmark";
import ListeningQuestionTypeBanner from "./ListeningQuestionTypeBanner";

type AnswerMap = Record<number, string>;

interface ListeningSummaryCompletionPanelProps {
  answers: AnswerMap;
  bookmarkedQuestions: ReadonlySet<number>;
  onAnswerChange: (number: number, value: string) => void;
  onAnswerFocus: (number: number) => void;
  onBookmarkToggle: (number: number) => void;
  registerInput: (number: number, element: HTMLInputElement | null) => void;
}

interface InlineAnswerProps {
  number: number;
  answers: AnswerMap;
  onAnswerChange: (number: number, value: string) => void;
  onAnswerFocus: (number: number) => void;
  registerInput: (number: number, element: HTMLInputElement | null) => void;
}

const InlineAnswer: React.FC<InlineAnswerProps> = ({
  number,
  answers,
  onAnswerChange,
  onAnswerFocus,
  registerInput,
}) => (
  <input
    ref={(element) => registerInput(number, element)}
    type="text"
    value={answers[number] ?? ""}
    placeholder={String(number)}
    aria-label={`Answer ${number}`}
    onChange={(event) => onAnswerChange(number, event.target.value)}
    onFocus={() => onAnswerFocus(number)}
    className="mx-1 inline-block h-[31px] w-[210px] max-w-full border border-[#8c8c8c] bg-white px-3 text-center align-middle text-[15px] font-semibold text-gray-900 outline-none placeholder:text-[#666] focus:border-2 focus:border-[#2589db]"
  />
);

const ListeningSummaryCompletionPanel: React.FC<
  ListeningSummaryCompletionPanelProps
> = ({
  answers,
  bookmarkedQuestions,
  onAnswerChange,
  onAnswerFocus,
  onBookmarkToggle,
  registerInput,
}) => (
  <section className="max-w-[1780px] pb-20" aria-labelledby="summary-completion-heading">
    <ListeningQuestionTypeBanner code="L-08" name="Summary Completion" exampleCount={4} />
    <div className="w-full min-w-0">
        <h2 id="summary-completion-heading" className="text-[16px] font-bold">
          Questions 23 - 26
        </h2>
        <div className="mt-7 space-y-4 text-[16px]">
          <p className="italic">Complete the summary below.</p>
          <p className="italic">
            Write <strong>NO MORE THAN TWO WORDS</strong> for each answer.
          </p>
        </div>
        <h3 className="mt-9 text-center text-[16px] font-bold">
          George&apos;s experience of university
        </h3>
        <div className="mt-6 max-w-[1580px] text-[16px] leading-[3.35rem]">
          <span>
            George is studying Mechanical Engineering which involves several
            disciplines. He is finding
          </span>
          <InlineAnswer number={23} answers={answers} onAnswerChange={onAnswerChange} onAnswerFocus={onAnswerFocus} registerInput={registerInput} />
          <span>the most difficult.</span>
          <ListeningQuestionBookmark questionNumber={23} bookmarked={bookmarkedQuestions.has(23)} onToggle={onBookmarkToggle} />
          <span>At the moment, his course is mainly</span>
          <InlineAnswer number={24} answers={answers} onAnswerChange={onAnswerChange} onAnswerFocus={onAnswerFocus} registerInput={registerInput} />
          <span>.</span>
          <ListeningQuestionBookmark questionNumber={24} bookmarked={bookmarkedQuestions.has(24)} onToggle={onBookmarkToggle} />
          <span>He will soon have an assignment which involves a study of</span>
          <InlineAnswer number={25} answers={answers} onAnswerChange={onAnswerChange} onAnswerFocus={onAnswerFocus} registerInput={registerInput} />
          <span>.</span>
          <ListeningQuestionBookmark questionNumber={25} bookmarked={bookmarkedQuestions.has(25)} onToggle={onBookmarkToggle} />
          <span>He thinks there are too many</span>
          <InlineAnswer number={26} answers={answers} onAnswerChange={onAnswerChange} onAnswerFocus={onAnswerFocus} registerInput={registerInput} />
          <span>and would like less of them.</span>
          <ListeningQuestionBookmark questionNumber={26} bookmarked={bookmarkedQuestions.has(26)} onToggle={onBookmarkToggle} />
        </div>
    </div>
  </section>
);

export default ListeningSummaryCompletionPanel;
