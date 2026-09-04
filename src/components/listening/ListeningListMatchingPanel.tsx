import React, { useMemo } from "react";
import ListeningQuestionBookmark from "./ListeningQuestionBookmark";
import ListeningQuestionTypeBanner from "./ListeningQuestionTypeBanner";

type AnswerMap = Record<number, string>;

interface ListeningListMatchingPanelProps {
  activeQuestion: number;
  answers: AnswerMap;
  bookmarkedQuestions: ReadonlySet<number>;
  onAnswerChange: (number: number, value: string) => void;
  onAnswerFocus: (number: number) => void;
  onBookmarkToggle: (number: number) => void;
  registerInput: (number: number, element: HTMLInputElement | null) => void;
}

interface ListOption {
  value: "A" | "B" | "C" | "D" | "E";
  label: string;
}

interface ListGroup {
  questionNumbers: readonly [number, number];
  prompt: string;
  options: readonly ListOption[];
}

const LIST_GROUPS: readonly ListGroup[] = [
  {
    questionNumbers: [11, 12],
    prompt: "Which TWO tasks will the volunteers in Group A be responsible for?",
    options: [
      { value: "A", label: "widening pathways" },
      { value: "B", label: "planting trees" },
      { value: "C", label: "picking up rubbish" },
      { value: "D", label: "putting up signs" },
      { value: "E", label: "building fences" },
    ],
  },
  {
    questionNumbers: [13, 14],
    prompt: "Which TWO items should volunteers in Group A bring with them?",
    options: [
      { value: "A", label: "food and water" },
      { value: "B", label: "boots" },
      { value: "C", label: "gloves" },
      { value: "D", label: "raincoats" },
      { value: "E", label: "their own tools" },
    ],
  },
];

const ListeningListMatchingPanel: React.FC<ListeningListMatchingPanelProps> = ({
  activeQuestion,
  answers,
  bookmarkedQuestions,
  onAnswerChange,
  onAnswerFocus,
  onBookmarkToggle,
  registerInput,
}) => (
  <section className="max-w-[1780px] pb-16" aria-labelledby="list-matching-heading">
    <ListeningQuestionTypeBanner code="L-04" name="List Matching" exampleCount={4} />
    <h2 id="list-matching-heading" className="sr-only">
      List Matching
    </h2>

    <div className="w-full max-w-[940px] space-y-16">
      {LIST_GROUPS.map((group) => (
        <ListMatchingGroup
          key={group.questionNumbers[0]}
          group={group}
          activeQuestion={activeQuestion}
          answers={answers}
          onAnswerChange={onAnswerChange}
          onAnswerFocus={onAnswerFocus}
          registerInput={registerInput}
          bookmark={
            <span className="ml-2 inline-flex align-middle" aria-label={`Review bookmarks for questions ${group.questionNumbers.join(" and ")}`}>
              {group.questionNumbers.map((number) => (
                <ListeningQuestionBookmark
                  key={number}
                  questionNumber={number}
                  bookmarked={bookmarkedQuestions.has(number)}
                  onToggle={onBookmarkToggle}
                  pattern="list-matching"
                />
              ))}
            </span>
          }
        />
      ))}
    </div>
  </section>
);

interface ListMatchingGroupProps {
  group: ListGroup;
  activeQuestion: number;
  answers: AnswerMap;
  onAnswerChange: (number: number, value: string) => void;
  onAnswerFocus: (number: number) => void;
  registerInput: (number: number, element: HTMLInputElement | null) => void;
  bookmark: React.ReactNode;
}

const ListMatchingGroup: React.FC<ListMatchingGroupProps> = ({
  group,
  activeQuestion,
  answers,
  onAnswerChange,
  onAnswerFocus,
  registerInput,
  bookmark,
}) => {
  const selectedValues = useMemo(
    () =>
      group.questionNumbers
        .map((number) => answers[number])
        .filter((value): value is string => Boolean(value)),
    [answers, group.questionNumbers],
  );

  const toggleOption = (value: string) => {
    const nextValues = selectedValues.includes(value)
      ? selectedValues.filter((selectedValue) => selectedValue !== value)
      : selectedValues.length < 2
        ? [...selectedValues, value]
        : selectedValues;

    group.questionNumbers.forEach((number, index) => {
      onAnswerChange(number, nextValues[index] ?? "");
    });
    onAnswerFocus(
      group.questionNumbers[nextValues.length > 1 ? 1 : 0],
    );
  };

  const isActive = group.questionNumbers.some(
    (number) => number === activeQuestion,
  );
  const rangeLabel = `${group.questionNumbers[0]} - ${group.questionNumbers[1]}`;

  return (
    <fieldset className="min-w-0">
      <legend className="text-[17px] font-bold text-gray-950">Questions {rangeLabel}</legend>
      <p className="mt-6 text-[16px] text-gray-800">
        Choose <strong>TWO</strong> correct answers.
      </p>

      <div className="mt-6">
        <div className="min-w-0">
          <div className="flex items-start gap-3 text-[17px] font-bold leading-7 text-gray-950">
            <span
              className={`flex h-[28px] min-w-[72px] items-center justify-center px-2 text-[15px] font-bold ${
                isActive ? "border-2 border-[#1689dc] bg-white text-sky-900" : "border-2 border-transparent"
              }`}
            >
              {rangeLabel}
            </span>
            <span className="min-w-0 pt-0.5">{group.prompt}{bookmark}</span>
          </div>

          <div className="mt-5 space-y-2.5">
            {group.options.map((option, optionIndex) => {
              const isSelected = selectedValues.includes(option.value);
              const isDisabled = !isSelected && selectedValues.length >= 2;
              return (
                <label
                  key={option.value}
                  className={`flex min-h-[46px] items-center gap-3.5 px-4 text-[16px] font-medium transition-colors ${
                    isSelected ? "bg-[#b5daf3] text-gray-950 font-semibold" : isDisabled ? "cursor-not-allowed opacity-60 text-gray-500" : "cursor-pointer text-gray-900 hover:bg-gray-100/70"
                  }`}
                >
                  <input
                    ref={(element) => {
                      if (optionIndex < group.questionNumbers.length) {
                        registerInput(group.questionNumbers[optionIndex], element);
                      }
                    }}
                    type="checkbox"
                    checked={isSelected}
                    disabled={isDisabled}
                    aria-label={`${rangeLabel} ${option.value}. ${option.label}`}
                    onChange={() => toggleOption(option.value)}
                    onFocus={() => {
                      const focusedQuestion = optionIndex < group.questionNumbers.length
                        ? group.questionNumbers[optionIndex]
                        : isActive
                          ? activeQuestion
                          : group.questionNumbers[0];
                      onAnswerFocus(focusedQuestion);
                    }}
                    className="h-4 w-4 accent-[#1689dc]"
                  />
                  <span>{option.value}. {option.label}</span>
                </label>
              );
            })}
          </div>

          <p className="ml-3 mt-3 text-[14px] font-medium text-gray-600" aria-live="polite">
            {selectedValues.length} of 2 answers selected
          </p>
        </div>
      </div>
    </fieldset>
  );
};

export default ListeningListMatchingPanel;
