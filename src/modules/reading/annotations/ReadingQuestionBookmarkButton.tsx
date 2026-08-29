import React from "react";
import { FiBookmark } from "react-icons/fi";

interface ReadingQuestionBookmarkButtonProps {
  questionNumber: number;
  flagged: boolean;
  onToggle: () => void;
  size?: "compact" | "default";
}

/** Controlled review flag. Persist the flagged question numbers in the parent/backend adapter. */
const ReadingQuestionBookmarkButton: React.FC<ReadingQuestionBookmarkButtonProps> = ({
  questionNumber,
  flagged,
  onToggle,
  size = "default",
}) => {
  const compact = size === "compact";

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={flagged}
      aria-label={`${flagged ? "Remove flag from" : "Flag"} question ${questionNumber}`}
      title={flagged ? "Remove review flag" : "Flag for review"}
      className={`flex shrink-0 items-center justify-center bg-transparent transition-colors ${
        compact ? "h-8 w-8" : "h-9 w-9"
      } ${
        flagged
          ? "ielts-review-flag text-[#ff4d4f] hover:opacity-80"
          : "text-gray-700 hover:text-gray-950"
      }`}
    >
      <FiBookmark
        className={`${compact ? "h-4 w-4" : "h-5 w-5"} ${
          flagged ? "fill-current" : "fill-none"
        }`}
      />
    </button>
  );
};

export default ReadingQuestionBookmarkButton;
