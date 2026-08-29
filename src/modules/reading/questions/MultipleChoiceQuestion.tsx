import React from "react";

interface MultipleChoiceQuestionProps {
  questionId: string;
  options: string[];
  answer: string[];
  onChange: (answer: string[]) => void;
  textClassName?: string;
}

const MultipleChoiceQuestion: React.FC<MultipleChoiceQuestionProps> = ({
  questionId,
  options,
  answer,
  onChange,
  textClassName = "text-base",
}) => (
  <div className="space-y-2">
    <p className="text-xs text-gray-500">Select all that apply</p>
    {options.map((option, index) => {
      const selected = answer.includes(option);
      return (
        <label
          key={`${questionId}-${index}`}
          className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-all ${
            selected
              ? "border-indigo-400 bg-indigo-50"
              : "border-gray-200 bg-white hover:bg-gray-50"
          }`}
        >
          <input
            type="checkbox"
            checked={selected}
            onChange={() =>
              onChange(selected ? answer.filter((value) => value !== option) : [...answer, option])
            }
            className="rounded text-indigo-600"
          />
          <span className="w-4 font-mono text-xs text-gray-500">
            {String.fromCharCode(65 + index)}
          </span>
          <span className={`${textClassName} text-gray-800`}>{option}</span>
        </label>
      );
    })}
  </div>
);

export default MultipleChoiceQuestion;
