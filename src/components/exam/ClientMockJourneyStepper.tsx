import React from "react";
import { FiCheck } from "react-icons/fi";

const STEPS = [
  "Confirm details",
  "System check",
  "Exam instructions",
  "Start exam",
] as const;

interface ClientMockJourneyStepperProps {
  currentStep: 1 | 2 | 3 | 4;
  completedThrough?: number;
}

const ClientMockJourneyStepper: React.FC<
  ClientMockJourneyStepperProps
> = ({ currentStep, completedThrough = currentStep - 1 }) => (
  <nav aria-label="Mock test preparation progress" className="overflow-x-auto">
    <ol className="mx-auto flex min-w-[650px] max-w-[900px] items-start px-2 py-1">
      {STEPS.map((label, index) => {
        const step = index + 1;
        const complete = step <= completedThrough;
        const current = step === currentStep;

        return (
          <li
            key={label}
            aria-current={current ? "step" : undefined}
            className="relative flex flex-1 flex-col items-center text-center"
          >
            {index > 0 ? (
              <span
                aria-hidden="true"
                className={`absolute right-1/2 top-[15px] h-px w-full ${
                  complete || current ? "bg-[#24953f]" : "bg-[#cfd3d8]"
                }`}
              />
            ) : null}
            <span
              className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-bold tabular-nums ${
                complete
                  ? "border-[#24953f] bg-[#24953f] text-white"
                  : current
                    ? "border-[#202124] bg-white text-[#202124]"
                    : "border-[#cfd3d8] bg-white text-[#70757c]"
              }`}
            >
              {complete ? <FiCheck aria-hidden="true" className="h-4 w-4" /> : step}
              {complete ? <span className="sr-only">Completed</span> : null}
            </span>
            <span
              className={`mt-2 text-xs font-semibold ${
                current || complete ? "text-[#202124]" : "text-[#5f6368]"
              }`}
            >
              {label}
            </span>
          </li>
        );
      })}
    </ol>
  </nav>
);

export default ClientMockJourneyStepper;
