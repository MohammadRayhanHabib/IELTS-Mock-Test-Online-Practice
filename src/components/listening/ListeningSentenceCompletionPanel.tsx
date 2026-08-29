import React from "react";
import ListeningQuestionBookmark from "./ListeningQuestionBookmark";
import ListeningQuestionTypeBanner from "./ListeningQuestionTypeBanner";

type AnswerMap = Record<number, string>;

interface ListeningSentenceCompletionPanelProps {
  answers: AnswerMap;
  bookmarkedQuestions: ReadonlySet<number>;
  onAnswerChange: (number: number, value: string) => void;
  onAnswerFocus: (number: number) => void;
  onBookmarkToggle: (number: number) => void;
  registerInput: (number: number, element: HTMLInputElement | null) => void;
}

interface SentenceAnswerProps {
  number: number;
  value: string;
  className?: string;
  onChange: (number: number, value: string) => void;
  onFocus: (number: number) => void;
  registerInput: (number: number, element: HTMLInputElement | null) => void;
}

const SentenceAnswer: React.FC<SentenceAnswerProps> = ({
  number,
  value,
  className = "w-[220px]",
  onChange,
  onFocus,
  registerInput,
}) => (
  <input
    ref={(element) => registerInput(number, element)}
    type="text"
    value={value}
    placeholder={String(number)}
    aria-label={`Answer ${number}`}
    onChange={(event) => onChange(number, event.target.value)}
    onFocus={() => onFocus(number)}
    className={`${className} h-[31px] max-w-full border border-[#8c8c8c] bg-white px-3 text-center text-[15px] font-semibold text-gray-900 outline-none placeholder:text-[#666] focus:border-2 focus:border-[#2589db]`}
  />
);

const ListeningSentenceCompletionPanel: React.FC<
  ListeningSentenceCompletionPanelProps
> = ({
  answers,
  bookmarkedQuestions,
  onAnswerChange,
  onAnswerFocus,
  onBookmarkToggle,
  registerInput,
}) => (
  <section
    className="max-w-[1780px] pb-20 pt-6"
    aria-labelledby="sentence-completion-heading"
  >
    <ListeningQuestionTypeBanner code="L-03" name="Sentence Completion" exampleCount={6} />
    <div className="w-full max-w-[980px]">
        <h2 id="sentence-completion-heading" className="text-[16px] font-bold">
          Questions 15 - 20
        </h2>

        <div className="mt-8 space-y-4 text-[16px]">
          <p className="italic">Complete the sentences below.</p>
          <p className="italic">
            Write <strong>NO MORE THAN TWO WORDS AND/OR A NUMBER</strong> for
            each answer.
          </p>
        </div>

        <div className="mt-9 space-y-7 text-[16px] leading-8">
          <p className="flex flex-wrap items-center gap-x-2 gap-y-2">
            <span>You need to have a</span>
            <SentenceAnswer
              number={15}
              value={answers[15] ?? ""}
              onChange={onAnswerChange}
              onFocus={onAnswerFocus}
              registerInput={registerInput}
            />
            <span>to buy a ticket for £10.</span>
            <ListeningQuestionBookmark questionNumber={15} bookmarked={bookmarkedQuestions.has(15)} onToggle={onBookmarkToggle} pattern="sentence" />
          </p>

          <p className="flex flex-wrap items-center gap-x-2 gap-y-2">
            <span>The bus tour lasts</span>
            <SentenceAnswer
              number={16}
              value={answers[16] ?? ""}
              onChange={onAnswerChange}
              onFocus={onAnswerFocus}
              registerInput={registerInput}
            />
            <span>in total.</span>
            <ListeningQuestionBookmark questionNumber={16} bookmarked={bookmarkedQuestions.has(16)} onToggle={onBookmarkToggle} pattern="sentence" />
          </p>

          <p className="flex flex-wrap items-center gap-x-2 gap-y-2">
            <span>The cost of the bus ticket includes entrance to the</span>
            <SentenceAnswer
              number={17}
              value={answers[17] ?? ""}
              onChange={onAnswerChange}
              onFocus={onAnswerFocus}
              registerInput={registerInput}
            />
            <span>.</span>
            <ListeningQuestionBookmark questionNumber={17} bookmarked={bookmarkedQuestions.has(17)} onToggle={onBookmarkToggle} pattern="sentence" />
          </p>

          <p className="flex flex-wrap items-center gap-x-2 gap-y-2">
            <span>You can listen to an audio commentary which has been made by the</span>
            <SentenceAnswer
              number={18}
              value={answers[18] ?? ""}
              onChange={onAnswerChange}
              onFocus={onAnswerFocus}
              registerInput={registerInput}
            />
            <span>.</span>
            <ListeningQuestionBookmark questionNumber={18} bookmarked={bookmarkedQuestions.has(18)} onToggle={onBookmarkToggle} pattern="sentence" />
          </p>

          <p className="flex flex-wrap items-center gap-x-2 gap-y-2">
            <span>If the weather is wet, it is a good idea to bring</span>
            <SentenceAnswer
              number={19}
              value={answers[19] ?? ""}
              onChange={onAnswerChange}
              onFocus={onAnswerFocus}
              registerInput={registerInput}
            />
            <span>.</span>
            <ListeningQuestionBookmark questionNumber={19} bookmarked={bookmarkedQuestions.has(19)} onToggle={onBookmarkToggle} pattern="sentence" />
          </p>

          <p className="flex flex-wrap items-center gap-x-2 gap-y-2">
            <span>Don't forget to bring your</span>
            <SentenceAnswer
              number={20}
              value={answers[20] ?? ""}
              onChange={onAnswerChange}
              onFocus={onAnswerFocus}
              registerInput={registerInput}
            />
            <span>when you book online.</span>
            <ListeningQuestionBookmark questionNumber={20} bookmarked={bookmarkedQuestions.has(20)} onToggle={onBookmarkToggle} pattern="sentence" />
          </p>
        </div>
    </div>
  </section>
);

export default ListeningSentenceCompletionPanel;
