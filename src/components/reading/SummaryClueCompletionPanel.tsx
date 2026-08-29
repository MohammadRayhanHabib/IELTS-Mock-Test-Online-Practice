import React, { useMemo, useState } from "react";
import {
  FLOWCHART_GAP_TOKEN,
  countNoteCompletionGaps,
} from "../../api/reading";

const SUMMARY_CLUE_MIME = "application/x-lexora-summary-clue";
const SUMMARY_CLUE_SOURCE_MIME = "application/x-lexora-summary-clue-source";

export interface SummaryClueCompletionPanelProps {
  questionId: string;
  title: string;
  lines: string[];
  clues: string[];
  answer: string[];
  onChange: (next: string[]) => void;
  firstQuestionNumber: number;
  readOnly?: boolean;
}

const SummaryClueCompletionPanel: React.FC<
  SummaryClueCompletionPanelProps
> = ({
  questionId,
  title,
  lines,
  clues,
  answer,
  onChange,
  firstQuestionNumber,
  readOnly = false,
}) => {
  const gapCount = countNoteCompletionGaps(lines);
  const letters = useMemo(
    () => clues.map((_, index) => String.fromCharCode(65 + index)),
    [clues],
  );
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [overSlot, setOverSlot] = useState<number | null>(null);
  const [overBank, setOverBank] = useState(false);
  const normalizedAnswer = Array.from({ length: gapCount }, (_, index) =>
    String(answer[index] ?? "").trim().toUpperCase(),
  );
  const usedLetters = new Set(normalizedAnswer.filter(Boolean));

  const placeClue = (slotIndex: number, rawLetter: string) => {
    if (readOnly) return;
    const letter = rawLetter.trim().toUpperCase();
    if (!letters.includes(letter)) return;

    const next = [...normalizedAnswer];
    const previousSlot = next.indexOf(letter);
    if (previousSlot >= 0) next[previousSlot] = "";
    next[slotIndex] = letter;
    onChange(next);
    setSelectedLetter(null);
  };

  const clearSlot = (slotIndex: number) => {
    if (readOnly) return;
    const next = [...normalizedAnswer];
    next[slotIndex] = "";
    onChange(next);
  };

  const renderGap = (slotIndex: number) => {
    const questionNumber = firstQuestionNumber + slotIndex;
    const placedLetter = normalizedAnswer[slotIndex] ?? "";
    const clueIndex = placedLetter ? letters.indexOf(placedLetter) : -1;
    const placedClue = clueIndex >= 0 ? clues[clueIndex] ?? "" : "";
    const isOver = overSlot === slotIndex;

    return (
      <span
        key={`${questionId}-gap-${slotIndex}`}
        role={readOnly ? undefined : "button"}
        tabIndex={readOnly ? undefined : 0}
        draggable={!readOnly && Boolean(placedLetter)}
        aria-label={`Question ${questionNumber}${
          placedClue ? `. Selected clue ${placedLetter}, ${placedClue}` : ""
        }`}
        onDragStart={(event) => {
          if (readOnly || !placedLetter) return;
          event.dataTransfer.setData(SUMMARY_CLUE_MIME, placedLetter);
          event.dataTransfer.setData(
            SUMMARY_CLUE_SOURCE_MIME,
            String(slotIndex),
          );
          event.dataTransfer.effectAllowed = "move";
          setSelectedLetter(placedLetter);
        }}
        onDragEnd={() => {
          setSelectedLetter(null);
          setOverSlot(null);
          setOverBank(false);
        }}
        onDragOver={(event) => {
          if (readOnly) return;
          event.preventDefault();
          event.dataTransfer.dropEffect = "move";
          setOverSlot(slotIndex);
        }}
        onDragLeave={() => setOverSlot(null)}
        onDrop={(event) => {
          event.preventDefault();
          placeClue(slotIndex, event.dataTransfer.getData(SUMMARY_CLUE_MIME));
          setOverSlot(null);
        }}
        onClick={() => {
          if (selectedLetter) placeClue(slotIndex, selectedLetter);
          else if (placedLetter && !readOnly) setSelectedLetter(placedLetter);
        }}
        onKeyDown={(event) => {
          if (event.key !== "Enter" && event.key !== " ") return;
          event.preventDefault();
          if (selectedLetter) placeClue(slotIndex, selectedLetter);
          else if (placedLetter && !readOnly) setSelectedLetter(placedLetter);
        }}
        className={`mx-1 inline-flex min-h-[35px] align-middle transition-colors ${
          placedLetter
            ? "w-fit max-w-full cursor-grab items-center border border-gray-600 bg-white px-4 py-1 active:cursor-grabbing"
            : "w-36 items-center justify-center border border-dashed border-gray-600 bg-white px-3 py-1"
        } ${isOver ? "border-sky-600 bg-sky-50" : ""}`}
      >
        {placedLetter ? (
          <>
            <span className="mr-1 text-base text-gray-900">
              {placedLetter}.
            </span>
            <span className="text-base text-gray-900">{placedClue}</span>
          </>
        ) : (
          <span className="text-sm font-bold tabular-nums text-gray-800">
            {questionNumber}
          </span>
        )}
      </span>
    );
  };

  let globalGapIndex = 0;

  return (
    <div className="space-y-0 pr-10" data-question-id={questionId}>
      {title.trim() ? (
        <h3 className="pb-3 text-base font-bold text-gray-950">{title}</h3>
      ) : null}

      <div className="space-y-7 text-base leading-relaxed text-gray-900">
        {lines.map((line, lineIndex) => {
          const parts = String(line ?? "").split(FLOWCHART_GAP_TOKEN);
          const content: React.ReactNode[] = [];

          parts.forEach((part, partIndex) => {
            if (part) {
              content.push(
                <span key={`${lineIndex}-text-${partIndex}`}>{part}</span>,
              );
            }
            if (partIndex < parts.length - 1) {
              content.push(renderGap(globalGapIndex));
              globalGapIndex += 1;
            }
          });

          return (
            <p
              key={`${questionId}-line-${lineIndex}`}
              className="flex flex-wrap items-center gap-x-1 gap-y-2"
            >
              {content}
            </p>
          );
        })}
      </div>

      <div
        onDragOver={(event) => {
          if (readOnly) return;
          if (
            !Array.from(event.dataTransfer.types).includes(
              SUMMARY_CLUE_SOURCE_MIME,
            )
          )
            return;
          event.preventDefault();
          event.dataTransfer.dropEffect = "move";
          setOverBank(true);
        }}
        onDragLeave={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
            setOverBank(false);
          }
        }}
        onDrop={(event) => {
          if (readOnly) return;
          event.preventDefault();
          const sourceSlot = Number.parseInt(
            event.dataTransfer.getData(SUMMARY_CLUE_SOURCE_MIME),
            10,
          );
          if (
            Number.isInteger(sourceSlot) &&
            sourceSlot >= 0 &&
            sourceSlot < gapCount
          ) {
            clearSlot(sourceSlot);
          }
          setSelectedLetter(null);
          setOverBank(false);
        }}
        className={`min-h-[220px] space-y-3 pl-3 pt-16 transition-colors ${
          overBank ? "bg-sky-50" : ""
        }`}
        aria-label="Clue options"
      >
        {clues.map((rawClue, index) => {
          const clue = String(rawClue ?? "").trim();
          const letter = letters[index];
          const used = usedLetters.has(letter);
          const selected = selectedLetter === letter;
          if (!clue || used) return null;

          return (
            <button
              key={`${questionId}-clue-${letter}`}
              type="button"
              draggable={!readOnly}
              disabled={readOnly}
              onDragStart={(event) => {
                event.dataTransfer.setData(SUMMARY_CLUE_MIME, letter);
                event.dataTransfer.effectAllowed = "move";
                setSelectedLetter(letter);
              }}
              onDragEnd={() => setSelectedLetter(null)}
              onClick={() =>
                setSelectedLetter((current) =>
                  current === letter ? null : letter,
                )
              }
              className={`block w-fit max-w-full cursor-grab border px-4 py-1.5 text-left text-base text-gray-900 active:cursor-grabbing ${
                selected
                  ? "border-sky-600 bg-sky-50"
                  : "border-gray-600 bg-white hover:border-gray-900"
              }`}
            >
              <span className="mr-1">{letter}.</span>
              <span>{clue}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SummaryClueCompletionPanel;
