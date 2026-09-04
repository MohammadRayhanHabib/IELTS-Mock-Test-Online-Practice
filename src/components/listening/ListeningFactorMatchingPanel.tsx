import React, { useMemo, useState } from "react";
import ListeningQuestionBookmark from "./ListeningQuestionBookmark";
import ListeningQuestionTypeBanner from "./ListeningQuestionTypeBanner";

type AnswerMap = Record<number, string>;

interface ListeningFactorMatchingPanelProps {
  answers: AnswerMap;
  bookmarkedQuestions: ReadonlySet<number>;
  onAnswerChange: (number: number, value: string) => void;
  onAnswerFocus: (number: number) => void;
  onBookmarkToggle: (number: number) => void;
  registerTarget: (number: number, element: HTMLButtonElement | null) => void;
}

const FACTOR_OPTION_MIME = "application/x-lexora-listening-factor";
const FACTOR_SOURCE_MIME = "application/x-lexora-listening-factor-source";

const FACTOR_PROMPTS = [
  { number: 38, label: "must not miss" },
  { number: 39, label: "temporarily closed" },
  { number: 40, label: "large queues" },
] as const;

const FACTOR_OPTIONS = [
  { letter: "A", label: "Aquarium" },
  { letter: "B", label: "Crocodile Cave" },
  { letter: "C", label: "Penguin Park" },
  { letter: "D", label: "Seal Centre" },
  { letter: "E", label: "Turtle Town" },
] as const;

const ListeningFactorMatchingPanel: React.FC<
  ListeningFactorMatchingPanelProps
> = ({
  answers,
  bookmarkedQuestions,
  onAnswerChange,
  onAnswerFocus,
  onBookmarkToggle,
  registerTarget,
}) => {
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [dragOverQuestion, setDragOverQuestion] = useState<number | null>(null);
  const [isOverBank, setIsOverBank] = useState(false);

  const optionByLetter = useMemo(
    () =>
      new Map<string, (typeof FACTOR_OPTIONS)[number]>(
        FACTOR_OPTIONS.map((option) => [option.letter, option]),
      ),
    [],
  );
  const usedLetters = useMemo(
    () =>
      new Set(
        FACTOR_PROMPTS.map(({ number }) => answers[number]).filter(Boolean),
      ),
    [answers],
  );

  const placeOption = (questionNumber: number, letter: string) => {
    if (!optionByLetter.has(letter)) return;

    FACTOR_PROMPTS.forEach(({ number }) => {
      if (number !== questionNumber && answers[number] === letter) {
        onAnswerChange(number, "");
      }
    });
    onAnswerChange(questionNumber, letter);
    onAnswerFocus(questionNumber);
    setSelectedLetter(null);
  };

  const returnOptionToBank = (questionNumber: number) => {
    onAnswerChange(questionNumber, "");
    onAnswerFocus(questionNumber);
    setSelectedLetter(null);
  };

  return (
    <section
      className="relative mt-14 grid w-full max-w-[1420px] grid-cols-[minmax(0,1.2fr)_minmax(280px,0.8fr)] gap-8 pb-16"
      aria-labelledby="listening-factor-matching-heading"
    >
      <ListeningQuestionTypeBanner
        code="L-10"
        name="Factor Matching"
        exampleCount={3}
        className="col-span-full mb-0"
      />
      <div className="min-w-0">
        <h2
          id="listening-factor-matching-heading"
          className="text-[16px] font-bold"
        >
          Questions 38 - 40
        </h2>

        <div className="mt-7 space-y-4 text-[16px]">
          <p className="italic">
            What does the speaker say about each of the following attractions?
          </p>
          <p className="italic">
            Write the correct letter, <strong>A - E</strong>, next to Questions
            38 - 40.
          </p>
        </div>

        <div className="mt-9 space-y-[22px]">
          {FACTOR_PROMPTS.map(({ number, label }) => {
            const placedLetter = answers[number];
            const placedOption = placedLetter
              ? optionByLetter.get(placedLetter)
              : null;
            const isOver = dragOverQuestion === number;

            return (
              <div
                key={number}
                className="grid grid-cols-[210px_minmax(0,1fr)] items-center gap-4 text-[16px]"
              >
                <button
                  ref={(element) => registerTarget(number, element)}
                  type="button"
                  draggable={Boolean(placedOption)}
                  onClick={() => {
                    if (selectedLetter) placeOption(number, selectedLetter);
                    else if (placedOption) returnOptionToBank(number);
                  }}
                  onDragStart={(event) => {
                    if (!placedOption) return;
                    event.dataTransfer.setData(FACTOR_OPTION_MIME, placedLetter);
                    event.dataTransfer.setData(FACTOR_SOURCE_MIME, String(number));
                    event.dataTransfer.effectAllowed = "move";
                  }}
                  onDragOver={(event) => {
                    event.preventDefault();
                    event.dataTransfer.dropEffect = "move";
                    setDragOverQuestion(number);
                  }}
                  onDragLeave={() => setDragOverQuestion(null)}
                  onDrop={(event) => {
                    event.preventDefault();
                    placeOption(
                      number,
                      event.dataTransfer.getData(FACTOR_OPTION_MIME),
                    );
                    setDragOverQuestion(null);
                  }}
                  className={`min-h-[35px] w-[210px] border px-3 py-1.5 text-center text-[15px] transition-colors ${
                    placedOption
                      ? "cursor-grab border-solid border-gray-600 bg-white active:cursor-grabbing"
                      : isOver
                        ? "border-dashed border-sky-600 bg-sky-50"
                        : "border-dashed border-gray-600 bg-white"
                  }`}
                >
                  {placedOption ? (
                    <span>
                      {placedLetter}. {placedOption.label}
                    </span>
                  ) : (
                    <strong>{number}</strong>
                  )}
                </button>
                <span className="flex min-w-0 flex-wrap items-center gap-2">
                  <span>{label}</span>
                  <ListeningQuestionBookmark questionNumber={number} bookmarked={bookmarkedQuestions.has(number)} onToggle={onBookmarkToggle} />
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div
        aria-label="Attraction options"
        onDragOver={(event) => {
            if (!Array.from(event.dataTransfer.types).includes(FACTOR_SOURCE_MIME)) {
              return;
            }
            event.preventDefault();
            event.dataTransfer.dropEffect = "move";
            setIsOverBank(true);
          }}
          onDragLeave={() => setIsOverBank(false)}
          onDrop={(event) => {
            event.preventDefault();
            const sourceQuestion = Number.parseInt(
              event.dataTransfer.getData(FACTOR_SOURCE_MIME),
              10,
            );
            if (PART_QUESTION_NUMBERS.has(sourceQuestion)) {
              returnOptionToBank(sourceQuestion);
            }
            setIsOverBank(false);
          }}
          className={`min-h-[230px] space-y-3 px-6 py-1 transition-colors ${
            isOverBank ? "bg-sky-50" : "bg-white"
          }`}
        >
          {FACTOR_OPTIONS.map((option) => {
            const isUsed = usedLetters.has(option.letter);
            if (isUsed) return null;

            const isSelected = selectedLetter === option.letter;
            return (
              <button
                key={option.letter}
                type="button"
                draggable
                onClick={() =>
                  setSelectedLetter((current) =>
                    current === option.letter ? null : option.letter,
                  )
                }
                onDragStart={(event) => {
                  event.dataTransfer.setData(FACTOR_OPTION_MIME, option.letter);
                  event.dataTransfer.effectAllowed = "move";
                  setSelectedLetter(option.letter);
                }}
                onDragEnd={() => {
                  setSelectedLetter(null);
                  setDragOverQuestion(null);
                  setIsOverBank(false);
                }}
                className={`block w-fit cursor-grab border border-gray-600 px-5 py-1.5 text-left text-[16px] active:cursor-grabbing ${
                  isSelected ? "bg-sky-50 ring-2 ring-sky-500" : "bg-white"
                }`}
              >
                {option.letter}. {option.label}
              </button>
            );
          })}
        </div>

      </section>
    );
  };

const PART_QUESTION_NUMBERS = new Set<number>(
  FACTOR_PROMPTS.map(({ number }) => number),
);

export default ListeningFactorMatchingPanel;
