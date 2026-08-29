import React from "react";
import { FiBookOpen, FiEdit3, FiHeadphones, FiMic } from "react-icons/fi";

const MODULE_SUMMARY = [
  { label: "Listening", detail: "40 Questions", timing: "30 Minutes", icon: <FiHeadphones />, color: "text-[#ff385c]" },
  { label: "Reading", detail: "40 Questions", timing: "60 Minutes", icon: <FiBookOpen />, color: "text-[#20b8d7]" },
  { label: "Writing", detail: "2 Tasks", timing: "60 Minutes", icon: <FiEdit3 />, color: "text-[#e9a400]" },
  { label: "Speaking", detail: "3 Parts", timing: "14 Minutes", icon: <FiMic />, color: "text-[#e9a400]" },
] as const;

const ExamSummary: React.FC = () => (
  <section className="relative overflow-hidden rounded-2xl bg-[#061b37] px-6 py-4 text-white shadow-[0_12px_28px_rgba(10,28,54,0.18)] sm:px-8">
    <svg aria-hidden="true" viewBox="0 0 520 210" className="pointer-events-none absolute -right-16 -top-2 h-[210px] w-[520px] opacity-30">
      {Array.from({ length: 11 }, (_, index) => <path key={index} d={`M 20 ${35 + index * 9} C 135 ${-8 + index * 6}, 220 ${110 + index * 2}, 500 ${25 + index * 7}`} fill="none" stroke="#4f7ca7" strokeDasharray="2 5" strokeWidth="1" />)}
    </svg>
    <div className="relative max-w-[700px]">
      <span className="inline-flex items-center gap-2 rounded-full bg-[#a90e35] px-3 py-0.5 text-[9px] font-black uppercase tracking-[0.08em] text-white"><span className="h-1.5 w-1.5 rounded-full bg-[#ff718b]" />Official CD-IELTS simulation</span>
      <h1 className="mt-2 max-w-[560px] text-[28px] font-black leading-[0.94] tracking-[-0.035em] sm:text-[30px]">Full Computer-Delivered<br />Mock Exam</h1>
      <p className="mt-1.5 max-w-[760px] text-[11px] font-medium leading-4 text-[#d2ddeb]">Experience the complete IELTS computer-based exam with authentic timing, question patterns and frontend scoring previews.</p>
    </div>
    <div className="relative mt-3 grid border-t border-white/10 pt-3 sm:grid-cols-2 xl:grid-cols-4">
      {MODULE_SUMMARY.map((module, index) => (
        <div key={module.label} className={`flex items-start gap-2.5 py-1.5 sm:px-4 sm:first:pl-0 xl:py-0 ${index > 0 ? "xl:border-l xl:border-white/10" : ""}`}>
          <span aria-hidden="true" className={`mt-0.5 text-lg ${module.color}`}>{module.icon}</span>
          <span><strong className="block text-xs font-bold">{module.label}</strong><span className="mt-0.5 block text-[10px] font-medium text-[#d2ddeb]">{module.detail}</span><span className="block text-[10px] font-medium text-[#d2ddeb]">{module.timing}</span></span>
        </div>
      ))}
    </div>
  </section>
);

export default ExamSummary;
