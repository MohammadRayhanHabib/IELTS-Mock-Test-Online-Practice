import React from "react";

interface StatementAgreementQuestionProps {
  options: readonly string[];
  answer: string;
  onChange: (answer: string) => void;
  textClassName?: string;
}

const StatementAgreementQuestion: React.FC<StatementAgreementQuestionProps> = ({
  options,
  answer,
  onChange,
  textClassName = "text-base",
}) => (
  <div className="space-y-2">
    {options.map((option) => (
      <label key={option} className="group flex cursor-pointer items-center gap-3">
        <input
          type="radio"
          checked={answer === option}
          onChange={() => onChange(option)}
          className="sr-only"
        />
        <span
          aria-hidden="true"
          className={`flex h-4 w-4 items-center justify-center rounded-full border-2 transition-all ${
            answer === option
              ? "border-gray-700"
              : "border-gray-400 group-hover:border-gray-600"
          }`}
        >
          {answer === option ? <span className="h-2 w-2 rounded-full bg-gray-700" /> : null}
        </span>
        <span className={`${textClassName} text-gray-800`}>{option}</span>
      </label>
    ))}
  </div>
);

export default StatementAgreementQuestion;
