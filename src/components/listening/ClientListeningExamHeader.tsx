import React from "react";
import { Link } from "react-router-dom";
import {
  FiBell,
  FiEdit3,
  FiMenu,
  FiWifi,
} from "react-icons/fi";

export interface ClientListeningExamHeaderProps {
  mode?: "pretest" | "test";
  moduleLabel?: "Listening" | "Reading" | "Writing" | "Speaking" | "Mock Exam";
  candidateLabel?: string;
  showAudioControls?: boolean;
  isPlaying?: boolean;
  isPaused?: boolean;
  playbackSeconds?: number;
  totalSeconds?: number;
  remainingSeconds?: number;
  notesCount?: number;
  onTogglePlayback?: () => void;
  onPauseToggle?: () => void;
  onSubmit?: () => void;
  onSaveExit?: () => void;
  onOpenOptions?: () => void;
  onOpenNotes?: () => void;
  onOpenSettings?: () => void;
}

const ClientListeningExamHeader: React.FC<ClientListeningExamHeaderProps> = ({
  mode = "test",
  moduleLabel = "Listening",
  candidateLabel = "Client Preview",
  remainingSeconds = 30 * 60,
  notesCount = 0,
  onSubmit,
  onOpenOptions,
  onOpenNotes,
  onOpenSettings,
}) => {
  const timerMinutes = Math.max(0, Math.ceil(remainingSeconds / 60));
  const displayCandidate =
    mode === "pretest"
      ? "Test taker ID"
      : candidateLabel === "Client Preview"
        ? "48887345"
        : candidateLabel;
  const timerColor =
    remainingSeconds < 300
      ? "text-red-600 font-bold"
      : remainingSeconds < 600
        ? "text-orange-500 font-bold"
        : "text-black font-normal";

  return (
    <header className="relative z-30 flex h-[52px] min-h-[52px] shrink-0 items-center justify-between border-b border-[#d0d0d0] bg-white px-3 sm:px-8">
      <div className="flex min-w-0 items-center gap-4 sm:gap-7">
        <Link
          to="/client-preview/mock-tests"
          aria-label="Back to client-preview Mock Tests"
          title="Back to Mock Tests"
          className="group flex shrink-0 items-center gap-2 leading-none focus-visible:rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ed1c24]"
        >
          <LexoraAcademyMark />
          <span className="flex flex-col items-start">
            <span className="text-[14px] font-black tracking-[-0.035em] text-[#ed1c24]">
              LEXORA
            </span>
            <span className="mt-[3px] text-[6px] font-extrabold tracking-[0.2em] text-[#232323]">
              ACADEMY
            </span>
          </span>
        </Link>
        <div className="hidden min-w-0 sm:block">
          <p className="truncate text-[13px] font-bold leading-[1.05] text-black">
            {displayCandidate}
          </p>
          <p className={`mt-1 text-[11px] leading-none ${timerColor}`}>
            {mode === "test"
              ? `${timerMinutes} minutes remaining`
              : "Ready to begin"}
          </p>
        </div>
      </div>

      <nav aria-label={`${moduleLabel} test actions`} className="flex items-center gap-0.5 sm:gap-1.5">
        {mode === "test" && onSubmit ? (
          <button
            type="button"
            onClick={onSubmit}
            className="mr-1 flex h-9 items-center justify-center rounded-[3px] border border-black bg-white px-4 text-[13px] font-bold text-black transition-colors hover:bg-[#f1f1f1] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
          >
            Submit
          </button>
        ) : null}
        <span
          className="hidden h-9 w-9 items-center justify-center text-black sm:flex"
          aria-label="Connection available"
          title="Connection available"
        >
          <FiWifi className="h-[22px] w-[22px]" strokeWidth={2.4} />
        </span>
        <HeaderIconButton
          label="Notifications and settings"
          onClick={onOpenSettings}
          icon={<FiBell />}
        />
        <HeaderIconButton label="Open options" icon={<FiMenu />} onClick={onOpenOptions} />
        <HeaderIconButton
          label="Notes"
          badge={notesCount > 0 ? notesCount : undefined}
          icon={<FiEdit3 />}
          onClick={onOpenNotes}
        />
      </nav>
    </header>
  );
};

const HeaderIconButton: React.FC<{
  label: string;
  icon: React.ReactNode;
  badge?: number;
  onClick?: () => void;
}> = ({ label, icon, badge, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={label}
    title={label}
    className="relative flex h-9 w-9 items-center justify-center text-black transition-colors hover:bg-[#f1f1f1] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-black"
  >
    <span className="h-[22px] w-[22px] [&>svg]:h-full [&>svg]:w-full">{icon}</span>
    {badge !== undefined ? (
      <span className="absolute right-0 top-0 min-w-4 rounded-full bg-[#d40024] px-1 py-0.5 text-center text-[9px] font-bold leading-none text-white">
        {badge}
      </span>
    ) : null}
  </button>
);

const LexoraAcademyMark: React.FC = () => (
  <svg
    aria-hidden="true"
    viewBox="0 0 48 48"
    className="h-[30px] w-[30px] shrink-0"
  >
    <path
      fill="#ed1c24"
      d="M20.4 7.6c4-2.2 8.7-3.1 13.2-2.1 8.2 1.7 13.2 8.8 13.2 17v21.1h-8.2v-8.2c-3.7 5.3-9.5 8.4-16 8.5l6.9-8.4c5.4-2 9.1-7.2 9.1-13.1 0-7.8-6.3-12.9-13.3-10.8-1.8.5-3.4 1.4-4.9 2.5V7.6Z"
    />
    <path
      fill="#080808"
      d="M5.2 5.3h8.2v21.2c0 4.7 1.9 8.7 5.8 11.5l10.6-11.2c3-3.2 7.7-3.7 11.2-.9L20.5 46C10.8 42.8 5.2 35.7 5.2 26.4V5.3Z"
    />
  </svg>
);

export default ClientListeningExamHeader;
