import React, { useState } from "react";
import { answerAsArray, type ReadingQuestionComponentProps } from "./types";

const MIME = "application/x-lexora-reading-answer";

const DragAndDropQuestion: React.FC<ReadingQuestionComponentProps> = ({ question, answer, onChange, firstQuestionNumber, onSelectQuestion }) => {
  const rows = question.options ?? [];
  const choices = question.wordBank ?? [];
  const values = answerAsArray(answer, rows.length);
  const [selected, setSelected] = useState<string | null>(null);
  const place = (rowIndex: number, value: string) => {
    if (!choices.includes(value)) return;
    const next = values.map((current) => (current === value ? "" : current));
    next[rowIndex] = value;
    onChange(next);
    setSelected(null);
  };
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2" aria-label="Available answers">
        {choices.filter((choice) => !values.includes(choice)).map((choice) => (
          <button key={choice} type="button" draggable onDragStart={(event) => { event.dataTransfer.setData(MIME, choice); setSelected(choice); }} onClick={() => setSelected(choice)} className={`cursor-grab rounded-sm border px-3 py-2 text-sm font-medium active:cursor-grabbing ${selected === choice ? "border-sky-600 bg-sky-50 text-sky-950" : "border-gray-400 bg-white text-gray-900"}`}>{choice}</button>
        ))}
      </div>
      <div className="space-y-3">
        {rows.map((row, rowIndex) => (
          <div key={`${question._id}-${rowIndex}`} onClick={() => onSelectQuestion?.(firstQuestionNumber + rowIndex)} onFocusCapture={() => onSelectQuestion?.(firstQuestionNumber + rowIndex)} className="grid items-center gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(180px,0.55fr)]">
            <p className="text-sm leading-relaxed text-gray-900"><strong className="mr-2 tabular-nums">{firstQuestionNumber + rowIndex}</strong>{row}</p>
            <button type="button" onClick={() => selected && place(rowIndex, selected)} onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); place(rowIndex, event.dataTransfer.getData(MIME)); }} className={`min-h-11 border px-3 py-2 text-left text-sm ${values[rowIndex] ? "border-sky-600 bg-sky-50 text-sky-950" : "border-dashed border-gray-400 bg-white text-gray-500"}`}>{values[rowIndex] || "Drop or select an answer"}</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DragAndDropQuestion;
