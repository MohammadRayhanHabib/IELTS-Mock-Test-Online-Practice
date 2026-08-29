import React from "react";

interface ListeningQuestionTypeBannerProps {
  code: string;
  name: string;
  exampleCount: number;
  className?: string;
}

const ListeningQuestionTypeBanner: React.FC<
  ListeningQuestionTypeBannerProps
> = ({ code, name, exampleCount, className = "" }) => (
  <div
    className={`mb-6 flex flex-wrap items-center justify-between gap-3 rounded-md border border-sky-200 bg-sky-50 px-4 py-3 ${className}`}
    data-question-type-code={code}
    data-question-type-name={name}
  >
    <div>
      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-sky-700">
        Question type
      </p>
      <p className="mt-0.5 text-[17px] font-bold text-gray-950">
        {code} · {name}
      </p>
    </div>
    <span className="rounded-full border border-sky-200 bg-white px-3 py-1 text-xs font-semibold text-sky-800">
      {exampleCount} {exampleCount === 1 ? "example" : "examples"}
    </span>
  </div>
);

export default ListeningQuestionTypeBanner;
