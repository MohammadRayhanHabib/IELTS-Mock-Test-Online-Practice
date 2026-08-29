import React from "react";
import type { ClientExamTextSize } from "../../../components/exam/ClientExamOptionsOverlay";

interface SpeakingSettingsProps {
  textSize: ClientExamTextSize;
  onTextSize: (value: ClientExamTextSize) => void;
}

const SpeakingSettings: React.FC<SpeakingSettingsProps> = ({
  textSize,
  onTextSize,
}) => (
  <section className="absolute right-20 top-[58px] z-50 w-56 rounded-xl border border-gray-200 bg-white p-4 text-gray-900 shadow-lg">
    <h2 className="text-sm font-semibold">Settings</h2>
    <p className="mb-2 mt-3 text-xs text-gray-500">Text size</p>
    <div className="flex gap-2">
      {(["base", "lg", "xl"] as const).map((size) => (
        <button
          key={size}
          type="button"
          onClick={() => onTextSize(size)}
          className={`flex-1 rounded border py-1.5 text-xs ${
            textSize === size
              ? "border-gray-900 bg-gray-900 text-white"
              : "border-gray-300 bg-white text-gray-700"
          }`}
        >
          {size === "base" ? "A" : size === "lg" ? "A+" : "A++"}
        </button>
      ))}
    </div>
  </section>
);

export default SpeakingSettings;
