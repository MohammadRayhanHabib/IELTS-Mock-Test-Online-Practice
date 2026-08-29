import React, { useState } from "react";

const DIAGRAM_LABEL_WORD_MIME = "application/x-lexora-diagram-label";

export interface DiagramLabelCompletionPanelProps {
  questionId: string;
  /** Title shown above the word box (e.g. “Dung Beetle Types”). */
  bankTitle: string;
  /** One entry per gap; optional hint beside the booklet number (6, 7, 8…). */
  gapHints?: string[];
  wordBank: string[];
  answer: string[];
  onChange: (next: string[]) => void;
  firstQuestionNumber: number;
  readOnly?: boolean;
  /** Client-preview rendering that mirrors the official IELTS diagram layout. */
  visualVariant?: "default" | "building-structure-reference";
}

const DiagramLabelCompletionPanel: React.FC<
  DiagramLabelCompletionPanelProps
> = ({
  questionId,
  bankTitle,
  gapHints = [],
  wordBank,
  answer,
  onChange,
  firstQuestionNumber,
  readOnly = false,
  visualVariant = "default",
}) => {
  const gapCount = Math.max(gapHints.length, answer.length);
  const [overSlot, setOverSlot] = useState<number | null>(null);

  if (gapCount === 0) {
    return (
      <p className="text-sm text-gray-500 italic" data-question-id={questionId}>
        No diagram gaps configured (add gap rows in the editor).
      </p>
    );
  }

  const getArr = (): string[] => {
    const base = Array.from({ length: gapCount }, () => "");
    answer.forEach((v, i) => {
      if (i < gapCount) base[i] = String(v ?? "").trim();
    });
    return base;
  };

  const setSlot = (slotIdx: number, word: string) => {
    if (readOnly) return;
    const w = word.trim();
    const arr = getArr();
    arr[slotIdx] = w;
    onChange(arr);
  };

  const clearSlot = (slotIdx: number) => {
    if (readOnly) return;
    const arr = getArr();
    arr[slotIdx] = "";
    onChange(arr);
  };

  const readIndex = (e: React.DragEvent) => {
    const raw = e.dataTransfer.getData(DIAGRAM_LABEL_WORD_MIME).trim();
    const n = parseInt(raw, 10);
    return Number.isFinite(n) ? n : -1;
  };

  const startDrag = (e: React.DragEvent, bankIndex: number) => {
    e.dataTransfer.setData(DIAGRAM_LABEL_WORD_MIME, String(bankIndex));
    e.dataTransfer.effectAllowed = "copy";
  };

  const onDrop = (e: React.DragEvent, slotIdx: number) => {
    e.preventDefault();
    const idx = readIndex(e);
    const label = (wordBank[idx] ?? "").trim();
    if (idx >= 0 && label) setSlot(slotIdx, label);
    setOverSlot(null);
  };

  const title = bankTitle.trim() || "Word box";

  if (visualVariant === "building-structure-reference") {
    const values = getArr();

    return (
      <div
        className="w-full max-w-[820px] space-y-4"
        data-question-id={questionId}
      >
        <div className="overflow-hidden bg-[#fbfbfb]">
          <svg
            viewBox="0 0 880 620"
            role="img"
            aria-label="Exploded structural building diagram with four numbered labels"
            className="block h-auto w-full text-gray-700"
          >
            <defs>
              <pattern
                id="diagram-grid"
                width="18"
                height="18"
                patternUnits="userSpaceOnUse"
              >
                <path d="M 18 0 L 0 0 0 18" fill="none" stroke="#d8dadd" strokeWidth="1" />
              </pattern>
            </defs>

            <rect x="0" y="0" width="880" height="620" fill="#fbfbfb" />
            <rect x="62" y="120" width="720" height="410" fill="none" stroke="#8f9499" strokeWidth="2" />

            <g fill="none" stroke="#687078" strokeWidth="3">
              <polygon points="115,280 275,205 585,170 716,226 542,287 260,325" fill="#e4e6e8" />
              <polygon points="115,280 275,205 585,170 716,226 542,287 260,325" fill="url(#diagram-grid)" opacity="0.8" />
              <line x1="155" y1="260" x2="302" y2="316" />
              <line x1="216" y1="232" x2="372" y2="305" />
              <line x1="296" y1="205" x2="454" y2="294" />
              <line x1="385" y1="194" x2="535" y2="287" />
              <line x1="480" y1="183" x2="616" y2="260" />
              <line x1="575" y1="172" x2="682" y2="238" />
              <line x1="150" y1="294" x2="570" y2="176" />
              <line x1="218" y1="313" x2="642" y2="196" />
              <line x1="300" y1="318" x2="700" y2="217" />
            </g>

            <g fill="#cfd3d6" stroke="#5f6870" strokeWidth="3">
              {[150, 275, 405, 540, 675].map((x, index) => (
                <g key={x}>
                  <path d={`M ${x - 18} 470 L ${x - 12} 344 L ${x - 42} 310 L ${x - 28} 294 L ${x - 8} 319 L ${x - 4} 275 L ${x + 11} 275 L ${x + 15} 319 L ${x + 38} 292 L ${x + 50} 310 L ${x + 22} 345 L ${x + 18} 470 Z`} />
                  <line x1={x - 11} y1="352" x2={x + 13} y2="459" />
                  <line x1={x + 13} y1="352" x2={x - 11} y2="459" />
                  {index % 2 === 0 ? <line x1={x} y1="286" x2={x} y2="345" /> : null}
                </g>
              ))}
            </g>

            <g fill="#d9dcdf" stroke="#59626a" strokeWidth="3">
              <rect x="100" y="420" width="630" height="54" />
              {Array.from({ length: 9 }, (_, index) => {
                const x = 100 + index * 70;
                return (
                  <g key={x}>
                    <line x1={x} y1="420" x2={x + 70} y2="474" />
                    <line x1={x + 70} y1="420" x2={x} y2="474" />
                  </g>
                );
              })}
            </g>

            <g fill="none" stroke="#343a40" strokeWidth="2.5">
              <line x1="80" y1="84" x2="142" y2="316" />
              <line x1="702" y1="94" x2="596" y2="204" />
              <line x1="775" y1="367" x2="690" y2="337" />
              <line x1="775" y1="410" x2="690" y2="448" />
              <line x1="78" y1="560" x2="122" y2="468" />
            </g>

            <g fill="#202428" fontFamily="Arial, sans-serif" fontSize="19">
              <text x="16" y="44">pipes and ducts installed</text>
              <text x="16" y="70">
                while in <tspan fontWeight="700">{firstQuestionNumber}</tspan>
                <tspan> __________</tspan>
              </text>

              <text x="602" y="38">section contains less</text>
              <text x="602" y="64">
                <tspan fontWeight="700">{firstQuestionNumber + 3}</tspan>
                <tspan> __________ than</tspan>
              </text>
              <text x="602" y="90">conventional buildings</text>

              <text x="692" y="326">diagonal bracing at</text>
              <text x="692" y="352">top and bottom of</text>
              <text x="692" y="378">
                <tspan fontWeight="700">{firstQuestionNumber + 2}</tspan>
                <tspan> __________</tspan>
              </text>

              <text x="16" y="592">
                <tspan fontWeight="700">{firstQuestionNumber + 1}</tspan>
                <tspan> __________ chosen by customer</tspan>
              </text>
            </g>
          </svg>
        </div>

        <div className="grid max-w-[390px] grid-cols-2 gap-x-12 gap-y-4 px-1">
          {Array.from({ length: gapCount }, (_, index) => {
            const qn = firstQuestionNumber + index;
            const value = values[index] ?? "";
            return (
              <label
                key={qn}
                className="relative block h-[31px] border border-gray-500 bg-white"
              >
                {!value.trim() ? (
                  <span className="pointer-events-none absolute inset-0 flex items-center justify-center text-sm font-semibold tabular-nums text-gray-600">
                    {qn}
                  </span>
                ) : null}
                <input
                  type="text"
                  value={value}
                  onChange={(event) => setSlot(index, event.target.value)}
                  readOnly={readOnly}
                  aria-label={`Question ${qn}`}
                  autoComplete="off"
                  className="ielts-numbered-answer-input relative z-[1] h-full w-full bg-transparent px-2 text-center text-sm font-semibold text-gray-900 focus:outline-none"
                />
              </label>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col gap-6 lg:flex-row lg:items-start"
      data-question-id={questionId}
    >
      {/* Word bank */}
      {wordBank.some((w) => String(w ?? "").trim()) ? (
        <div className="min-w-0 flex-1">
          <div className="rounded-xl border-2 border-dashed border-rose-200 bg-rose-50/60 p-4">
            <p className="mb-3 text-center text-sm font-bold text-gray-900">
              {title}
            </p>
            {!readOnly ? (
              <p className="mb-3 text-center text-[11px] text-rose-800/90">
                Drag a label into a numbered answer box. You can also type in the
                boxes.
              </p>
            ) : null}
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {wordBank.map((raw, i) => {
                const label = String(raw ?? "").trim();
                if (!label) return null;
                return (
                  <div
                    key={i}
                    draggable={!readOnly}
                    onDragStart={
                      readOnly ? undefined : (e) => startDrag(e, i)
                    }
                    className={`rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-800 shadow-sm ${
                      readOnly
                        ? ""
                        : "cursor-grab active:cursor-grabbing hover:border-rose-300 hover:bg-rose-50/50"
                    } transition-colors`}
                  >
                    {label}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : null}

      {/* Booklet numbers + answer boxes (e.g. 6, 7, 8) */}
      <div className="w-full shrink-0 space-y-3 lg:max-w-md">
        {Array.from({ length: gapCount }, (_, i) => {
          const qn = firstQuestionNumber + i;
          const placed = getArr()[i] ?? "";
          const hint = (gapHints[i] ?? "").trim();
          const isOver = overSlot === i;
          return (
            <div
              key={i}
              className="flex flex-wrap items-start gap-3 rounded-lg border border-gray-100 bg-white/80 p-2"
            >
              {hint ? (
                <div className="flex w-12 shrink-0 flex-col items-end gap-0.5 pt-2 text-right sm:w-14">
                  <span className="max-w-[5.5rem] text-[10px] leading-snug text-gray-500">
                    {hint}
                  </span>
                </div>
              ) : null}
              <div
                onDragOver={(e) => {
                  if (readOnly) return;
                  e.preventDefault();
                  setOverSlot(i);
                }}
                onDragLeave={() => setOverSlot(null)}
                onDrop={(e) => onDrop(e, i)}
                className={`relative min-h-[52px] min-w-0 flex-1 rounded-md border-2 px-2 py-2 transition-colors focus-within:border-indigo-500 focus-within:border-solid focus-within:ring-2 focus-within:ring-indigo-200/80 ${
                  placed
                    ? "border-rose-400 bg-rose-50"
                    : isOver
                      ? "scale-[1.01] border-rose-500 bg-rose-100/80"
                      : "border-dashed border-rose-300 bg-rose-50/60"
                }`}
              >
                {!placed ? (
                  <span className="pointer-events-none absolute inset-0 flex items-center justify-center text-sm font-bold tabular-nums text-rose-900">
                    {qn}
                  </span>
                ) : null}
                {readOnly ? (
                  <div className="text-center text-sm font-semibold text-gray-800">
                    {placed}
                  </div>
                ) : (
                  <div className="flex flex-col items-stretch gap-0.5">
                    <input
                      type="text"
                      value={placed}
                      onChange={(e) => setSlot(i, e.target.value)}
                      className="ielts-numbered-answer-input relative z-[1] w-full bg-transparent text-center text-sm font-semibold text-gray-900 focus:outline-none"
                      placeholder=""
                      aria-label={`Question ${qn}`}
                      autoComplete="off"
                    />
                    {placed ? (
                      <button
                        type="button"
                        onClick={() => clearSlot(i)}
                        className="text-center text-[10px] text-rose-700 underline hover:text-rose-900"
                      >
                        Clear
                      </button>
                    ) : null}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DiagramLabelCompletionPanel;
