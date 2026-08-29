import React from "react";
import ListeningQuestionBookmark from "./ListeningQuestionBookmark";
import ListeningQuestionTypeBanner from "./ListeningQuestionTypeBanner";

type AnswerMap = Record<number, string>;

interface ListeningTableCompletionPanelProps {
  answers: AnswerMap;
  bookmarkedQuestions: ReadonlySet<number>;
  onAnswerChange: (number: number, value: string) => void;
  onAnswerFocus: (number: number) => void;
  onBookmarkToggle: (number: number) => void;
  registerInput: (number: number, element: HTMLInputElement | null) => void;
}

interface TableAnswerProps {
  number: number;
  value: string;
  className?: string;
  onChange: (number: number, value: string) => void;
  onFocus: (number: number) => void;
  registerInput: (number: number, element: HTMLInputElement | null) => void;
}

const TableAnswer: React.FC<TableAnswerProps> = ({
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

const ListeningTableCompletionPanel: React.FC<ListeningTableCompletionPanelProps> = ({
  answers,
  bookmarkedQuestions,
  onAnswerChange,
  onAnswerFocus,
  onBookmarkToggle,
  registerInput,
}) => (
  <section className="max-w-[1780px] pb-12" aria-labelledby="table-completion-heading">
    <ListeningQuestionTypeBanner code="L-02" name="Table Completion" exampleCount={4} />
    <div className="w-full max-w-[980px]">
        <h2 id="table-completion-heading" className="text-[16px] font-bold">
          Questions 11 - 14
        </h2>

        <div className="mt-8 space-y-4 text-[16px]">
          <p className="italic">Complete the table below.</p>
          <p className="italic">
            Write <strong>NO MORE THAN THREE WORDS AND/OR A NUMBER</strong> for each answer.
          </p>
        </div>

        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[880px] border-collapse text-left text-[16px]">
            <caption className="border border-b-0 border-[#333] px-3 py-2 text-center font-bold uppercase">
              Pacton-on-Sea Bus Tour
            </caption>
            <thead>
              <tr>
                <th className="w-[98px] border border-[#333] px-3 py-3 align-top">Bus stops</th>
                <th className="w-[340px] border border-[#333] px-3 py-3 align-top">Location</th>
                <th className="border border-[#333] px-3 py-3 align-top">Things to see</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-[#333] px-3 py-3">Bus stop 1</td>
                <td className="border border-[#333] px-3 py-3">train station</td>
                <td className="border border-[#333] px-3 py-3">start of tour</td>
              </tr>
              <tr>
                <td className="border border-[#333] px-3 py-4">Bus stop 2</td>
                <td className="border border-[#333] px-3 py-4">the aquarium</td>
                <td className="border border-[#333] px-3 py-4">
                  <span className="flex items-center gap-3">
                    <span>dolphins and</span>
                    <TableAnswer number={11} value={answers[11] ?? ""} onChange={onAnswerChange} onFocus={onAnswerFocus} registerInput={registerInput} />
                    <ListeningQuestionBookmark questionNumber={11} bookmarked={bookmarkedQuestions.has(11)} onToggle={onBookmarkToggle} pattern="table" />
                  </span>
                </td>
              </tr>
              <tr>
                <td className="border border-[#333] px-3 py-4">Bus stop 3</td>
                <td className="border border-[#333] px-3 py-4">
                  <span className="flex items-center gap-2">
                    <TableAnswer number={12} value={answers[12] ?? ""} onChange={onAnswerChange} onFocus={onAnswerFocus} registerInput={registerInput} />
                    <ListeningQuestionBookmark questionNumber={12} bookmarked={bookmarkedQuestions.has(12)} onToggle={onBookmarkToggle} pattern="table" />
                  </span>
                </td>
                <td className="border border-[#333] px-3 py-4">yachts and power boats</td>
              </tr>
              <tr>
                <td className="border border-[#333] px-3 py-4">Bus stop 4</td>
                <td className="border border-[#333] px-3 py-4">
                  <span className="flex items-center gap-3">
                    <TableAnswer number={13} value={answers[13] ?? ""} onChange={onAnswerChange} onFocus={onAnswerFocus} registerInput={registerInput} />
                    <ListeningQuestionBookmark questionNumber={13} bookmarked={bookmarkedQuestions.has(13)} onToggle={onBookmarkToggle} pattern="table" />
                    <span>centre</span>
                  </span>
                </td>
                <td className="border border-[#333] px-3 py-4">
                  <span className="flex items-center gap-3">
                    <span>very old</span>
                    <TableAnswer number={14} value={answers[14] ?? ""} onChange={onAnswerChange} onFocus={onAnswerFocus} registerInput={registerInput} />
                    <ListeningQuestionBookmark questionNumber={14} bookmarked={bookmarkedQuestions.has(14)} onToggle={onBookmarkToggle} pattern="table" />
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
    </div>
  </section>
);

export default ListeningTableCompletionPanel;
