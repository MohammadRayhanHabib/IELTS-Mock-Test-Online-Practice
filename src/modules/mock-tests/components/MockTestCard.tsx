import React from "react";
import { Link } from "react-router-dom";
import { FiArrowRight, FiBookOpen, FiClock, FiEdit3, FiGrid, FiHeadphones, FiMic } from "react-icons/fi";
import type { ClientPreviewMockTestConfig } from "../../../data/clientPreviewMockTests";

const TEST_ART = ["/mock-test-01.svg", "/mock-test-02.svg", "/mock-test-03.svg", "/mock-test-04.svg"] as const;

const MockTestCard: React.FC<{ test: ClientPreviewMockTestConfig }> = ({ test }) => (
  <article className="group overflow-hidden rounded-xl border border-[#e1e5eb] bg-white p-2.5 shadow-[0_5px_16px_rgba(33,43,58,0.07)] transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-0.5 hover:border-[#f3b7bf] hover:shadow-[0_10px_24px_rgba(33,43,58,0.12)]">
    <div className="relative h-[96px] overflow-hidden rounded-lg bg-[#efe9df]">
      <img src={TEST_ART[test.number - 1] ?? TEST_ART[0]} alt="" className="h-full w-full object-cover" />
      <span className="absolute left-2 top-2 flex h-7 w-7 items-center justify-center rounded-md bg-white text-sm text-[#3b82f6] shadow-[0_3px_9px_rgba(17,24,39,0.18)]">{test.number === 1 ? <FiHeadphones aria-hidden="true" /> : test.number === 2 ? <FiBookOpen aria-hidden="true" /> : test.number === 3 ? <FiEdit3 aria-hidden="true" /> : <FiMic aria-hidden="true" />}</span>
    </div>
    <div className="px-1 pb-1 pt-2.5">
      <h2 className="text-sm font-black text-[#151b29]">Mock Test {String(test.number).padStart(2, "0")}</h2>
      <p className="mt-1 text-[10px] font-semibold text-[#5f6877]">CD-IELTS Simulation · {test.label}</p>
      <div className="mt-2.5 flex items-center gap-4 text-[10px] font-semibold text-[#687385]"><span className="inline-flex items-center gap-1"><FiClock aria-hidden="true" />2h 44m</span><span className="inline-flex items-center gap-1"><FiGrid aria-hidden="true" />4 Modules</span></div>
      <Link to={test.startPath} aria-label={`Start Mock Test ${test.number}`} className="mt-2.5 flex min-h-9 w-full items-center justify-center gap-2 rounded-lg border border-[#ffd6dc] bg-[#fff5f6] px-3 text-xs font-black text-[#c51d3e] transition-colors hover:border-[#ff9aaa] hover:bg-[#ffecef] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ff6a7c] focus-visible:ring-offset-2">Start Test<FiArrowRight aria-hidden="true" className="transition-transform group-hover:translate-x-0.5" /></Link>
    </div>
  </article>
);

export default MockTestCard;
