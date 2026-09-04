import React from "react";
import ListeningQuestionBookmark from "./ListeningQuestionBookmark";
import ListeningQuestionTypeBanner from "./ListeningQuestionTypeBanner";

type AnswerMap = Record<number, string>;

interface McqOption {
  value: "A" | "B" | "C";
  label: string;
}

interface McqQuestion {
  number: number;
  prompt: string;
  options: McqOption[];
}

interface ListeningMcqPanelProps {
  activeQuestion: number;
  answers: AnswerMap;
  bookmarkedQuestions: ReadonlySet<number>;
  onAnswerChange: (number: number, value: string) => void;
  onAnswerFocus: (number: number) => void;
  onBookmarkToggle: (number: number) => void;
  registerInput: (number: number, element: HTMLInputElement | null) => void;
}

const MCQ_QUESTIONS: McqQuestion[] = [
  {
    number: 21,
    prompt: "Dave Hadley says that the computer system has",
    options: [
      { value: "A", label: "too many users." },
      { value: "B", label: "never worked well." },
      { value: "C", label: "become outdated." },
    ],
  },
  {
    number: 22,
    prompt: "The main problem with the computer system is that it",
    options: [
      { value: "A", label: "is too slow." },
      { value: "B", label: "stops working." },
      { value: "C", label: "displays incorrect data." },
    ],
  },
];

const ListeningMcqPanel: React.FC<ListeningMcqPanelProps> = ({
  activeQuestion,
  answers,
  bookmarkedQuestions,
  onAnswerChange,
  onAnswerFocus,
  onBookmarkToggle,
  registerInput,
}) => (
  <section className="max-w-[1780px] pb-20" aria-labelledby="mcq-heading">
    <ListeningQuestionTypeBanner
      code="L-06"
      name="Multiple Choice Questions (MCQ)"
      exampleCount={2}
    />
    <div className="w-full max-w-[980px]">
        <h2 id="mcq-heading" className="text-[16px] font-bold">
          Questions 21 - 22
        </h2>
        <p className="mt-6 text-[16px] italic">
          Choose the correct letter, <strong>A</strong>, <strong>B</strong> or{" "}
          <strong>C</strong>.
        </p>

        <div className="mt-10 space-y-11">
          {MCQ_QUESTIONS.map((question) => (
            <fieldset key={question.number} className="relative min-w-0">
              <legend className="w-fit max-w-full text-[16px] font-bold leading-6">
                <span className="flex max-w-full items-start gap-3">
                  <span
                    className={`flex h-[25px] min-w-[38px] items-center justify-center px-1 ${
                      activeQuestion === question.number
                        ? "border-2 border-[#1689dc] bg-white"
                        : "border-2 border-transparent"
                    }`}
                  >
                    {question.number}
                  </span>
                  <span className="min-w-0 pt-0.5">
                    {question.prompt}
                    <ListeningQuestionBookmark className="-my-1 ml-2" questionNumber={question.number} bookmarked={bookmarkedQuestions.has(question.number)} onToggle={onBookmarkToggle} />
                  </span>
                </span>
              </legend>

              <div className="ml-6 mt-4 max-w-[910px] space-y-1">
                {question.options.map((option, optionIndex) => {
                  const isSelected = answers[question.number] === option.value;
                  return (
                    <label
                      key={option.value}
                      className={`flex min-h-[43px] cursor-pointer items-center gap-4 px-3 text-[16px] transition-colors ${
                        isSelected ? "bg-[#b5daf3]" : "hover:bg-gray-50"
                      }`}
                    >
                      <input
                        ref={(element) => {
                          if (optionIndex === 0) {
                            registerInput(question.number, element);
                          }
                        }}
                        type="radio"
                        name={`listening-question-${question.number}`}
                        value={option.value}
                        checked={isSelected}
                        aria-label={`${question.number} ${option.value}. ${option.label}`}
                        onChange={() =>
                          onAnswerChange(question.number, option.value)
                        }
                        onFocus={() => onAnswerFocus(question.number)}
                        className="h-4 w-4 accent-[#1689dc]"
                      />
                      <span>{option.label}</span>
                    </label>
                  );
                })}
              </div>
            </fieldset>
          ))}
        </div>
    </div>
  </section>
);

export default ListeningMcqPanel;
