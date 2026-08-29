import React from "react";

const LexoraBrand: React.FC = () => (
  <span className="flex items-center gap-1.5 text-[#d40f16]">
    <svg
      aria-hidden="true"
      viewBox="0 0 34 34"
      className="h-[24px] w-[24px] shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2.5" y="3" width="13" height="13" rx="2.5" />
      <rect x="12" y="3" width="13" height="13" rx="2.5" />
      <rect x="12" y="12.5" width="13" height="13" rx="2.5" />
      <path d="M7 16v4.5a5 5 0 0 0 5 5h4" />
    </svg>
    <span className="flex flex-col text-left leading-none">
      <span className="text-[13px] font-black tracking-[-0.03em]">LEXORA</span>
      <span className="mt-0.5 text-[7px] font-extrabold tracking-[0.12em]">ACADEMY</span>
    </span>
  </span>
);

export default LexoraBrand;
