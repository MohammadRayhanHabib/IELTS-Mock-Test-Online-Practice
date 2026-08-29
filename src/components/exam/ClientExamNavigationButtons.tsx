import React from "react";

interface ClientExamNavigationButtonsProps {
  onPrevious: () => void;
  onNext: () => void;
  hasPrevious: boolean;
  hasNext: boolean;
  previousLabel?: string;
  nextLabel?: string;
  className?: string;
}

const ClientExamNavigationButtons: React.FC<
  ClientExamNavigationButtonsProps
> = ({
  onPrevious,
  onNext,
  hasPrevious,
  hasNext,
  previousLabel = "Previous question",
  nextLabel = "Next question",
  className = "",
}) => {
  const buttonClass = (enabled: boolean) =>
    `inline-flex h-16 w-16 shrink-0 items-center justify-center rounded-[3px] text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 focus-visible:ring-offset-2 ${
      enabled
        ? "cursor-pointer bg-black hover:bg-[#222222] active:bg-[#333333]"
        : "cursor-not-allowed bg-[#dedede]"
    }`;

  return (
    <nav
      aria-label="Question navigation"
      className={`flex items-center gap-1 ${className}`}
      data-client-exam-navigation
    >
      <button
        type="button"
        onClick={onPrevious}
        disabled={!hasPrevious}
        aria-label={previousLabel}
        className={buttonClass(hasPrevious)}
      >
        <NavigationArrow direction="left" />
      </button>
      <button
        type="button"
        onClick={onNext}
        disabled={!hasNext}
        aria-label={nextLabel}
        className={buttonClass(hasNext)}
      >
        <NavigationArrow direction="right" />
      </button>
    </nav>
  );
};

const NavigationArrow: React.FC<{ direction: "left" | "right" }> = ({
  direction,
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3.4"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-8 w-8"
    aria-hidden="true"
  >
    {direction === "left" ? (
      <>
        <line x1="19" y1="12" x2="5" y2="12" />
        <polyline points="12 19 5 12 12 5" />
      </>
    ) : (
      <>
        <line x1="5" y1="12" x2="19" y2="12" />
        <polyline points="12 5 19 12 12 19" />
      </>
    )}
  </svg>
);

export default ClientExamNavigationButtons;
