import React from "react";
import { FiTrash2, FiX } from "react-icons/fi";

export interface ExamTextAnnotation {
  id: string;
  text: string;
  kind: "highlight" | "note";
  note?: string;
  partLabel?: string;
}

export interface ClientExamNotesDrawerProps {
  value: string;
  onChange: (value: string) => void;
  onClose: () => void;
  moduleLabel?: string;
  annotations?: ExamTextAnnotation[];
  onDeleteAnnotation?: (id: string) => void;
  onUpdateAnnotationNote?: (id: string, note: string) => void;
}

const ClientExamNotesDrawer: React.FC<ClientExamNotesDrawerProps> = ({
  value,
  onChange,
  onClose,
  moduleLabel = "Listening",
  annotations = [],
  onDeleteAnnotation,
  onUpdateAnnotationNote,
}) => {
  return (
    <aside
      aria-label="Notes"
      className="ielts-notes-drawer absolute bottom-[70px] right-0 top-[52px] z-40 flex w-full flex-col border-l border-gray-400 bg-[#eeeeee] shadow-2xl sm:w-[360px]"
    >
      <div className="flex min-h-12 items-center justify-between border-b border-gray-400 bg-white px-3">
        <h2 className="text-base font-bold text-gray-950">Notes</h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close notes"
          className="flex h-10 w-10 items-center justify-center text-gray-700 hover:bg-gray-100"
        >
          <FiX className="h-6 w-6" />
        </button>
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto p-3">
        {/* Highlighted text annotations */}
        {annotations.length > 0 ? (
          <div className="mb-3 max-h-[55%] space-y-2 overflow-y-auto border-b border-gray-300 pb-3">
            <p className="text-xs font-bold text-gray-700 uppercase tracking-wider">
              Highlighted Sections ({annotations.length})
            </p>
            {annotations.map((annotation) => (
              <div
                key={annotation.id}
                className={`rounded border p-2.5 text-xs ${
                  annotation.kind === "note"
                    ? "border-sky-300 bg-sky-50 text-gray-900"
                    : "border-amber-300 bg-amber-50 text-gray-900"
                }`}
              >
                {annotation.partLabel ? (
                  <p className="mb-1 text-[11px] font-bold text-gray-600">
                    {annotation.partLabel}
                  </p>
                ) : null}

                <div className="flex items-start justify-between gap-2">
                  <p className="line-clamp-3 font-medium leading-relaxed italic text-gray-800">
                    “{annotation.text}”
                  </p>
                  {onDeleteAnnotation ? (
                    <button
                      type="button"
                      onClick={() => onDeleteAnnotation(annotation.id)}
                      aria-label="Remove annotation"
                      title="Remove highlight"
                      className="shrink-0 text-gray-400 hover:text-red-600 p-0.5"
                    >
                      <FiTrash2 className="h-3.5 w-3.5" />
                    </button>
                  ) : null}
                </div>

                {annotation.kind === "note" ? (
                  <div className="mt-2 pt-2 border-t border-sky-200/60">
                    <textarea
                      value={annotation.note ?? ""}
                      onChange={(e) =>
                        onUpdateAnnotationNote?.(annotation.id, e.target.value)
                      }
                      placeholder="Write your note here..."
                      className="min-h-[54px] w-full resize-none border border-sky-300 bg-white p-1.5 text-xs text-gray-900 outline-none focus:border-sky-600 rounded-sm"
                    />
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        ) : null}

        {/* General scratchpad notes */}
        <div className="flex min-h-0 flex-1 flex-col">
          <p className="mb-2 text-xs font-bold text-gray-700 uppercase tracking-wider">
            General Notes
          </p>
          <label
            htmlFor={`${moduleLabel.toLowerCase()}-preview-notes`}
            className="sr-only"
          >
            {moduleLabel} preview notes
          </label>
          <textarea
            id={`${moduleLabel.toLowerCase()}-preview-notes`}
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder="Write your notes here..."
            className="min-h-[160px] flex-1 resize-none border border-gray-400 bg-white p-3 text-sm leading-6 text-gray-950 outline-none focus:border-sky-600 rounded-sm"
          />
          <p className="mt-1.5 text-right text-[11px] text-gray-500" aria-live="polite">
            Saved automatically
          </p>
        </div>
      </div>
    </aside>
  );
};

export default ClientExamNotesDrawer;
