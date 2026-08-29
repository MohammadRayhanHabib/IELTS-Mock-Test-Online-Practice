import React, { useState } from "react";
import { answerAsArray, type ReadingQuestionComponentProps } from "./types";

export const HEADING_DRAG_MIME = "application/x-lexora-reading-heading";

export interface ReadingHeadingBankProps {
  headings: string[];
  answer: string[];
  selectedLetter: string | null;
  onSelect: (letter: string) => void;
  onReturn?: (letter: string) => void;
  visualVariant?: "interactive" | "reference";
}

export const ReadingHeadingBank: React.FC<ReadingHeadingBankProps> = ({ headings, answer, selectedLetter, onSelect, onReturn, visualVariant = "interactive" }) => {
  const usedLetters = new Set(answer.filter(Boolean));
  const [draggingLetter, setDraggingLetter] = useState<string | null>(null);
  const reference = visualVariant === "reference";
  return (
    <div className={reference ? "space-y-5" : "space-y-2"} onDragOver={(event) => { if (onReturn) event.preventDefault(); }} onDrop={(event) => { if (!onReturn) return; event.preventDefault(); const letter = event.dataTransfer.getData(HEADING_DRAG_MIME); if (letter) onReturn(letter); }}>
      <p className={reference ? "text-lg font-bold text-gray-950" : "text-sm font-bold text-gray-950"}>List of Headings</p>
      {!reference ? <p className="text-xs leading-relaxed text-gray-500">Drag a heading to a passage slot, or select it and then choose a slot.</p> : null}
      <div className={`${reference ? "space-y-3 pl-4" : "space-y-2 pt-1"} transition-colors`}>
        {headings.map((heading, index) => {
          const letter = String.fromCharCode(65 + index);
          if (usedLetters.has(letter)) return null;
          return (
            <button key={`${letter}-${heading}`} type="button" draggable onDragStart={(event) => { event.dataTransfer.setData(HEADING_DRAG_MIME, letter); event.dataTransfer.effectAllowed = "copy"; setDraggingLetter(letter); onSelect(letter); }} onDragEnd={() => setDraggingLetter(null)} onClick={() => onSelect(letter)} className={`flex w-fit max-w-full items-start border text-left leading-snug transition-all ${reference ? "min-h-8 rounded-none border-gray-500 px-5 py-1.5 text-base font-normal" : "rounded-sm px-2 py-1 text-sm font-semibold"} ${draggingLetter === letter ? "opacity-0" : ""} ${selectedLetter === letter ? "border-sky-600 bg-sky-50 text-sky-950 shadow-sm" : "cursor-grab border-gray-300 bg-white text-gray-900 hover:border-gray-500 hover:shadow-sm active:cursor-grabbing"}`}>{reference ? <span className="mr-1.5">{letter}.</span> : null}{heading}</button>
          );
        })}
      </div>
    </div>
  );
};

export interface ReadingHeadingDropZoneProps {
  slotIndex: number;
  slotCount: number;
  headings: string[];
  answer: string[];
  selectedLetter: string | null;
  onChange: (next: string[]) => void;
  onSelectionConsumed: () => void;
  firstQuestionNumber: number;
  allowDragBack?: boolean;
}

export const ReadingHeadingDropZone: React.FC<ReadingHeadingDropZoneProps> = ({ slotIndex, slotCount, headings, answer, selectedLetter, onChange, onSelectionConsumed, firstQuestionNumber, allowDragBack = false }) => {
  const values = Array.from({ length: slotCount }, (_, index) => answer[index] ?? "");
  const placed = values[slotIndex];
  const place = (letter: string) => {
    const headingIndex = letter.charCodeAt(0) - 65;
    if (!/^[A-Z]$/.test(letter) || headingIndex < 0 || headingIndex >= headings.length) return;
    const next = values.map((value) => value === letter ? "" : value);
    next[slotIndex] = letter;
    onChange(next);
    onSelectionConsumed();
  };
  return (
    <div className="not-prose mb-1.5 select-none">
      <button type="button" draggable={allowDragBack && Boolean(placed)} onDragStart={(event) => { if (!placed) return; event.dataTransfer.setData(HEADING_DRAG_MIME, placed); }} onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); place(event.dataTransfer.getData(HEADING_DRAG_MIME)); }} onClick={() => selectedLetter && place(selectedLetter)} className={`flex min-h-7 items-center gap-2 rounded-sm border transition-colors ${placed ? allowDragBack ? "w-fit min-w-80 max-w-full cursor-grab border-[#5b8def] bg-[#5b8def] px-5 py-1.5 text-base font-medium text-white" : "w-fit max-w-full border-sky-500 bg-white px-2 py-0.5 text-sm font-semibold text-gray-950" : "w-full justify-center border-dashed border-sky-300 bg-white px-2 py-0.5 text-sm font-bold text-gray-900 hover:border-sky-500 hover:bg-sky-50 hover:text-sky-950"}`}>{placed ? `${allowDragBack ? `${placed}. ` : ""}${headings[placed.charCodeAt(0) - 65] ?? placed}` : firstQuestionNumber + slotIndex}</button>
    </div>
  );
};

const MatchingHeadingsQuestion: React.FC<ReadingQuestionComponentProps> = ({ question, answer, onChange, firstQuestionNumber, visualVariant }) => {
  const values = answerAsArray(answer, question.options?.length);
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  return (
    <div className="space-y-5">
      <ReadingHeadingBank headings={question.wordBank ?? []} answer={values} selectedLetter={selectedLetter} onSelect={setSelectedLetter} onReturn={(letter) => { onChange(values.map((value) => value === letter ? "" : value)); setSelectedLetter(null); }} visualVariant={visualVariant === "client-preview" ? "reference" : "interactive"} />
      <div className="space-y-3">
        {(question.options ?? []).map((slot, slotIndex) => <div key={`${slot}-${slotIndex}`} className="grid items-start gap-2 sm:grid-cols-[minmax(120px,0.35fr)_1fr]"><span className="pt-1 text-sm font-semibold text-gray-900">{slot}</span><ReadingHeadingDropZone slotIndex={slotIndex} slotCount={question.options?.length ?? 0} headings={question.wordBank ?? []} answer={values} selectedLetter={selectedLetter} onChange={onChange} onSelectionConsumed={() => setSelectedLetter(null)} firstQuestionNumber={firstQuestionNumber} allowDragBack={visualVariant === "client-preview"} /></div>)}
      </div>
    </div>
  );
};

export default MatchingHeadingsQuestion;
