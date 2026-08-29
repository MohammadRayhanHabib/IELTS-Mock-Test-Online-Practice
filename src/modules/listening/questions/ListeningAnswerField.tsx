import React from "react";
import ListeningQuestionBookmark from "../../../components/listening/ListeningQuestionBookmark";

interface ListeningAnswerFieldProps {
  number: number;
  value: string;
  onChange: (value: string) => void;
  onFocus: () => void;
  inputRef: (element: HTMLInputElement | null) => void;
  bookmarked: boolean;
  onBookmarkToggle: (number: number) => void;
  className?: string;
}

const ListeningAnswerField: React.FC<ListeningAnswerFieldProps> = ({
  number,
  value,
  onChange,
  onFocus,
  inputRef,
  bookmarked,
  onBookmarkToggle,
  className = "w-[120px]",
}) => (
  <span className="inline-flex min-w-0 items-center gap-1">
    <input
      ref={inputRef}
      type="text"
      value={value}
      placeholder={String(number)}
      aria-label={`Answer ${number}`}
      onChange={(event) => onChange(event.target.value)}
      onFocus={onFocus}
      className={`${className} h-[30px] rounded-[2px] border border-gray-400 bg-white px-2 text-center text-[14px] font-semibold text-gray-900 outline-none placeholder:text-gray-400 transition-colors focus:border-2 focus:border-[#2589db]`}
    />
    <ListeningQuestionBookmark
      questionNumber={number}
      bookmarked={bookmarked}
      onToggle={onBookmarkToggle}
    />
  </span>
);

export default ListeningAnswerField;
