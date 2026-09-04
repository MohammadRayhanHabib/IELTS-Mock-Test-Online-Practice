import React from "react";
import { FiBookmark } from "react-icons/fi";

interface ListeningQuestionBookmarkProps {
  questionNumber: number;
  bookmarked: boolean;
  onToggle: (questionNumber: number) => void;
  pattern?: string;
  className?: string;
}

interface ListeningQuestionBookmarkContextValue {
  activeQuestion: number;
  activePattern: string;
}

const ListeningQuestionBookmarkContext =
  React.createContext<ListeningQuestionBookmarkContextValue | null>(null);

export const ListeningQuestionBookmarkProvider: React.FC<{
  activeQuestion: number;
  activePattern: string;
  children: React.ReactNode;
}> = ({ activeQuestion, activePattern, children }) => (
  <ListeningQuestionBookmarkContext.Provider
    value={{ activeQuestion, activePattern }}
  >
    {children}
  </ListeningQuestionBookmarkContext.Provider>
);

const ListeningQuestionBookmark: React.FC<
  ListeningQuestionBookmarkProps
> = ({
  questionNumber,
  bookmarked,
  onToggle,
  pattern,
  className = "",
}) => {
  const visibility = React.useContext(ListeningQuestionBookmarkContext);
  const isVisible =
    !visibility ||
    (visibility.activeQuestion === questionNumber &&
      (!pattern || visibility.activePattern === pattern));

  if (!isVisible) return null;

  return (
    <button
      type="button"
      data-question-bookmark={questionNumber}
      aria-label={`${bookmarked ? "Remove" : "Bookmark"} question ${questionNumber} for review`}
      aria-pressed={bookmarked}
      title={`${bookmarked ? "Remove bookmark from" : "Bookmark"} question ${questionNumber}`}
      onClick={(event) => {
        event.stopPropagation();
        onToggle(questionNumber);
      }}
      className={`inline-flex h-9 w-9 shrink-0 items-center justify-center self-center bg-transparent align-middle transition-[color,filter] focus:outline-none focus-visible:drop-shadow-[0_1px_1px_rgba(23,41,64,0.35)] ${
        bookmarked
          ? "text-[#ef1f2d]"
          : "text-[#525a66] hover:text-[#c81e1e]"
      } ${className}`}
    >
      <FiBookmark
        aria-hidden="true"
        className={`h-5 w-5 ${bookmarked ? "fill-current" : ""}`}
      />
    </button>
  );
};

export default ListeningQuestionBookmark;
