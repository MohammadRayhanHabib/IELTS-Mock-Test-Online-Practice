import React from "react";
import { FiAlertTriangle, FiCheckCircle, FiCloud, FiGrid, FiHeadphones, FiMonitor, FiRefreshCw, FiShield } from "react-icons/fi";

const UPDATED_LABEL = "29 Aug 2026";

const InfoItem: React.FC<{ icon: React.ReactNode; label: string; detail: string; tone: "requirement" | "update" }> = ({ icon, label, detail, tone }) => (
  <div className={`flex items-center gap-2 text-[10px] font-semibold lg:border-l lg:pl-5 ${tone === "requirement" ? "border-[#ead9bd]" : "border-[#cfe2db]"}`}>
    <span aria-hidden="true" className={`text-base ${tone === "requirement" ? "text-[#a66654]" : "text-[#3bae89]"}`}>{icon}</span>
    <span>{tone === "requirement" ? <><strong className="block">{label}</strong><span className="block font-medium text-[#8b5f3a]">{detail}</span></> : <><span className="block">{label}</span><strong className="block text-[#177358]">{detail}</strong></>}</span>
  </div>
);

export const RequirementsStrip: React.FC = () => (
  <section aria-label="Exam environment requirements" className="mt-3 grid items-center gap-3 rounded-xl border border-[#f2ddbd] bg-[#fffaf1] px-4 py-2 text-[#754116] lg:grid-cols-[1.1fr_1fr_1fr_1fr]">
    <div className="flex items-center gap-2 text-xs font-black"><FiAlertTriangle aria-hidden="true" className="text-base text-[#f59e0b]" />Exam Environment Requirements</div>
    <InfoItem tone="requirement" icon={<FiMonitor />} label="Desktop / Laptop" detail="browser only" />
    <InfoItem tone="requirement" icon={<FiHeadphones />} label="Headphones" detail="recommended" />
    <InfoItem tone="requirement" icon={<FiCloud />} label="Real-time autosave" detail="enabled" />
  </section>
);

export const UpdatesStrip: React.FC = () => (
  <section aria-label="Question bank updates" className="mt-2 grid items-center gap-3 rounded-xl border border-[#cfe8df] bg-[#f5fbf8] px-4 py-2 text-[#245f50] lg:grid-cols-[1.1fr_1fr_1fr_1fr]">
    <div className="flex items-center gap-2 text-xs font-black"><FiRefreshCw aria-hidden="true" className="text-lg text-[#3bae89]" />Question Bank Updates</div>
    <InfoItem tone="update" icon={<FiCheckCircle />} label="Last updated" detail={UPDATED_LABEL} />
    <InfoItem tone="update" icon={<FiShield />} label="Questions are" detail="updated regularly" />
    <InfoItem tone="update" icon={<FiGrid />} label="New and revised" detail="questions added weekly" />
  </section>
);
