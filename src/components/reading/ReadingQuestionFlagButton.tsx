import React from "react";
import { FiBookmark } from "react-icons/fi";

export interface ReadingQuestionFlagButtonProps {
  questionNumber: number;
  flagged: boolean;
  onToggle: (questionNumber: number) => void;
  className?: string;
}

const ReadingQuestionFlagButton: React.FC<ReadingQuestionFlagButtonProps> = ({
  questionNumber,
  flagged,
  onToggle,
  className = "",
}) => (
  <button
    type="button"
    onClick={() => onToggle(questionNumber)}
    aria-label={`${flagged ? "Remove flag from" : "Flag"} question ${questionNumber}`}
    aria-pressed={flagged}
    title={`${flagged ? "Remove flag from" : "Flag"} question ${questionNumber}`}
    className={`inline-flex h-10 w-10 shrink-0 items-center justify-center bg-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1683d8] focus-visible:ring-offset-2 ${
      flagged
        ? "ielts-review-flag text-[#ef1f2d] hover:text-[#c91622]"
        : "text-[#525a66] hover:text-gray-950"
    } ${className}`}
  >
    <FiBookmark
      aria-hidden="true"
      className={`h-5 w-5 ${flagged ? "fill-current" : "fill-none"}`}
    />
  </button>
);

export default ReadingQuestionFlagButton;
