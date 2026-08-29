import React from "react";

interface SingleChoiceQuestionProps {
  questionId: string;
  options: string[];
  answer: string;
  onChange: (answer: string) => void;
  textClassName?: string;
}

const SingleChoiceQuestion: React.FC<SingleChoiceQuestionProps> = ({
  questionId,
  options,
  answer,
  onChange,
  textClassName = "text-base",
}) => (
  <div className="space-y-2">
    {options.map((option, index) => (
      <label
        key={`${questionId}-${index}`}
        className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-all ${
          answer === option
            ? "border-indigo-400 bg-indigo-50"
            : "border-gray-200 bg-white hover:bg-gray-50"
        }`}
      >
        <input
          type="radio"
          name={`q-${questionId}`}
          checked={answer === option}
          onChange={() => onChange(option)}
          className="text-indigo-600"
        />
        <span className="w-4 font-mono text-xs text-gray-500">
          {String.fromCharCode(65 + index)}
        </span>
        <span className={`${textClassName} text-gray-800`}>{option}</span>
      </label>
    ))}
  </div>
);

export default SingleChoiceQuestion;
