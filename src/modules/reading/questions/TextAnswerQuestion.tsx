import React from "react";

interface TextAnswerQuestionProps {
  value: string;
  onChange: (answer: string) => void;
  textClassName?: string;
}

const TextAnswerQuestion: React.FC<TextAnswerQuestionProps> = ({
  value,
  onChange,
  textClassName = "text-base",
}) => (
  <input
    type="text"
    value={value}
    onChange={(event) => onChange(event.target.value)}
    placeholder="Type your answer here…"
    className={`block w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 ${textClassName} text-gray-900 placeholder-gray-400 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20`}
  />
);

export default TextAnswerQuestion;
