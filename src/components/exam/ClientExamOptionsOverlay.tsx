import React from "react";
import {
  FiCheck,
  FiChevronLeft,
  FiChevronRight,
  FiEye,
  FiSend,
  FiType,
  FiX,
} from "react-icons/fi";

export type ClientExamOptionsView = "menu" | "contrast" | "text-size";
export type ClientExamContrastMode =
  | "black-on-white"
  | "white-on-black"
  | "yellow-on-black";
export type ClientExamTextSize = "base" | "lg" | "xl";

interface ClientExamOptionsOverlayProps {
  view: ClientExamOptionsView;
  contrastMode: ClientExamContrastMode;
  textSize: ClientExamTextSize;
  onViewChange: (view: ClientExamOptionsView) => void;
  onClose: () => void;
  onSubmit: () => void;
  onContrastChange: (mode: ClientExamContrastMode) => void;
  onTextSizeChange: (size: ClientExamTextSize) => void;
}

const ClientExamOptionsOverlay: React.FC<ClientExamOptionsOverlayProps> = ({
  view,
  contrastMode,
  textSize,
  onViewChange,
  onClose,
  onSubmit,
  onContrastChange,
  onTextSizeChange,
}) => {
  const title =
    view === "contrast" ? "Contrast" : view === "text-size" ? "Text size" : "Options";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="client-exam-options-title"
      className="ielts-options-overlay absolute inset-0 z-[80] overflow-y-auto bg-white"
    >
      <div className="relative min-h-full px-5 pb-16 pt-5 sm:px-10">
        {view !== "menu" ? (
          <button
            type="button"
            onClick={() => onViewChange("menu")}
            className="absolute left-4 top-4 flex min-h-10 items-center gap-1 px-2 text-xl font-medium sm:left-7"
          >
            <FiChevronLeft className="h-7 w-7" strokeWidth={3} />
            Options
          </button>
        ) : null}
        <h1 id="client-exam-options-title" className="text-center text-[28px] font-medium">
          {title}
        </h1>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close options"
          className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center sm:right-7"
        >
          <FiX className="h-7 w-7" strokeWidth={3.5} />
        </button>

        <div className="mx-auto mt-7 w-full max-w-[700px]">
          {view === "menu" ? (
            <div className="space-y-4">
              <button
                type="button"
                onClick={onSubmit}
                className="ielts-options-primary flex min-h-[76px] w-full items-center gap-5 rounded-[3px] border border-[#bd0f2d] bg-[#ec1235] px-9 text-left text-base font-semibold text-white shadow-sm"
              >
                <FiSend className="h-6 w-6" />
                Go to submission page
                <FiChevronRight className="ml-auto h-7 w-7" strokeWidth={3.5} />
              </button>
              <div className="overflow-hidden rounded-[3px] border border-gray-300 bg-white">
                <MenuRow label="Contrast" icon={<FiEye />} onClick={() => onViewChange("contrast")} />
                <MenuRow label="Text size" icon={<FiType />} onClick={() => onViewChange("text-size")} last />
              </div>
            </div>
          ) : null}

          {view === "contrast" ? (
            <div className="overflow-hidden rounded-[3px] border border-gray-300 bg-white">
              {CONTRAST_OPTIONS.map(([mode, label], index) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => onContrastChange(mode)}
                  aria-pressed={contrastMode === mode}
                  className={`flex min-h-[74px] w-full items-center gap-5 px-10 text-left text-lg hover:bg-gray-100 ${index < 2 ? "border-b border-gray-300" : ""}`}
                >
                  <span className="flex h-6 w-6 items-center justify-center">
                    {contrastMode === mode ? <FiCheck className="h-5 w-5" strokeWidth={3.5} /> : null}
                  </span>
                  {label}
                  <ContrastSample mode={mode} />
                </button>
              ))}
            </div>
          ) : null}

          {view === "text-size" ? (
            <div className="overflow-hidden rounded-[3px] border border-gray-300 bg-white">
              {TEXT_SIZE_OPTIONS.map(([size, label], index) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => onTextSizeChange(size)}
                  aria-pressed={textSize === size}
                  className={`flex min-h-[74px] w-full items-center gap-5 px-10 text-left hover:bg-gray-100 ${index < 2 ? "border-b border-gray-300" : ""} ${size === "base" ? "text-base" : size === "lg" ? "text-lg" : "text-xl"}`}
                >
                  <span className="flex h-6 w-6 items-center justify-center">
                    {textSize === size ? <FiCheck className="h-5 w-5" strokeWidth={3.5} /> : null}
                  </span>
                  {label}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

const MenuRow: React.FC<{
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  last?: boolean;
}> = ({ label, icon, onClick, last = false }) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex min-h-[76px] w-full items-center gap-5 px-9 text-left text-lg hover:bg-gray-100 ${last ? "" : "border-b border-gray-300"}`}
  >
    <span className="h-6 w-6 text-gray-400">{icon}</span>
    {label}
    <FiChevronRight className="ml-auto h-7 w-7" strokeWidth={3.5} />
  </button>
);

const ContrastSample: React.FC<{ mode: ClientExamContrastMode }> = ({ mode }) => {
  const foreground =
    mode === "yellow-on-black" ? "#ffd400" : mode === "white-on-black" ? "#ffffff" : "#111111";
  const background = mode === "black-on-white" ? "#ffffff" : "#050505";
  return (
    <span
      data-contrast-preview={mode}
      aria-hidden="true"
      className="ielts-contrast-preview ml-auto flex h-10 w-14 flex-col justify-center gap-1 border border-gray-300 px-2 shadow-sm"
      style={{ backgroundColor: background }}
    >
      {[0, 1, 2].map((line) => (
        <span
          key={line}
          className="ielts-contrast-preview-line block h-0.5 w-full"
          style={{ backgroundColor: foreground }}
        />
      ))}
    </span>
  );
};

const CONTRAST_OPTIONS: ReadonlyArray<[ClientExamContrastMode, string]> = [
  ["black-on-white", "Black on white"],
  ["white-on-black", "White on black"],
  ["yellow-on-black", "Yellow on black"],
];

const TEXT_SIZE_OPTIONS: ReadonlyArray<[ClientExamTextSize, string]> = [
  ["base", "Regular"],
  ["lg", "Large"],
  ["xl", "Extra large"],
];

export default ClientExamOptionsOverlay;
