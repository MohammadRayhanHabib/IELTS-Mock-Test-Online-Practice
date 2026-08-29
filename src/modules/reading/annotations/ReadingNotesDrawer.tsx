import React from "react";
import { FiX } from "react-icons/fi";
import type { ReadingAnnotation } from "./types";

interface ReadingNotesDrawerProps {
  annotations: ReadingAnnotation[];
  drafts: Record<string, string>;
  activeNoteId: string | null;
  deletingNoteId: string | null;
  generalNotes: string;
  compactBottom?: boolean;
  getPartNumber: (annotation: ReadingAnnotation) => number;
  onDraftChange: (annotationId: string, value: string) => void;
  onSaveNote: (annotationId: string) => void;
  onRequestDelete: (annotationId: string | null) => void;
  onDelete: (annotationId: string) => void;
  onGeneralNotesChange: (value: string) => void;
  onClose: () => void;
}

/** Controlled notes UI. Parent code owns persistence and can connect a repository/API. */
const ReadingNotesDrawer: React.FC<ReadingNotesDrawerProps> = ({
  annotations,
  drafts,
  activeNoteId,
  deletingNoteId,
  generalNotes,
  compactBottom = false,
  getPartNumber,
  onDraftChange,
  onSaveNote,
  onRequestDelete,
  onDelete,
  onGeneralNotesChange,
  onClose,
}) => (
  <aside
    aria-label="Notes"
    className={`ielts-notes-drawer absolute right-0 top-[52px] z-40 flex w-full flex-col border-l border-gray-400 bg-[#eeeeee] sm:w-[350px] ${
      compactBottom ? "bottom-[88px]" : "bottom-0"
    }`}
  >
    <div className="flex min-h-12 shrink-0 items-center justify-between border-b border-gray-400 bg-white px-3">
      <h2 className="text-base font-medium text-gray-950">Notes</h2>
      <button type="button" onClick={onClose} aria-label="Close notes" className="flex h-10 w-10 items-center justify-center text-gray-800 hover:bg-gray-100">
        <FiX className="h-7 w-7" strokeWidth={2} />
      </button>
    </div>
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto p-3">
      {annotations.length > 0 ? (
        <div className="mb-3 max-h-[65%] space-y-2 overflow-y-auto border-b border-gray-300 pb-3">
          {annotations.map((annotation) => (
            <article
              key={annotation.id}
              className={`rounded-sm border p-2.5 text-xs ${
                annotation.kind === "note"
                  ? "ielts-selected-note-card border-sky-300 bg-sky-100 text-sky-950"
                  : "ielts-highlight-note-card border-amber-300 bg-amber-50 text-amber-950"
              }`}
            >
              {annotation.kind === "note" ? <p className="mb-1 font-bold">Part {getPartNumber(annotation)}</p> : null}
              <div className="flex items-start justify-between gap-2">
                <p className="line-clamp-3 font-medium leading-relaxed">“{annotation.text}”</p>
                {annotation.kind === "highlight" ? (
                  <button type="button" onClick={() => onDelete(annotation.id)} aria-label="Remove highlight" className="shrink-0 text-gray-500 hover:text-red-600">
                    <FiX className="h-4 w-4" />
                  </button>
                ) : null}
              </div>
              {annotation.kind === "note" ? (
                <>
                  <label htmlFor={`reading-note-${annotation.id}`} className="sr-only">Note for selected text</label>
                  <textarea
                    id={`reading-note-${annotation.id}`}
                    value={drafts[annotation.id] ?? annotation.note ?? ""}
                    onChange={(event) => onDraftChange(annotation.id, event.target.value)}
                    autoFocus={activeNoteId === annotation.id}
                    placeholder="Write a note for this selection..."
                    className="ielts-selected-note-input mt-2 min-h-24 w-full resize-y border border-sky-500 bg-white px-2 py-1.5 text-sm leading-relaxed text-gray-950 outline-none focus:ring-2 focus:ring-sky-500/30"
                  />
                  {deletingNoteId === annotation.id ? (
                    <div className="ielts-selected-note-delete-confirmation mt-3 border-t border-sky-400 pt-3" role="group" aria-live="polite" aria-label={`Confirm deleting note from Part ${getPartNumber(annotation)}`}>
                      <p className="text-sm leading-relaxed">You are about to delete a note from Part {getPartNumber(annotation)}</p>
                      <div className="mt-3 flex items-center justify-end gap-6">
                        <button type="button" onClick={() => onRequestDelete(null)} className="ielts-selected-note-cancel px-1 py-1 text-sm font-medium">Cancel</button>
                        <button type="button" onClick={() => onDelete(annotation.id)} className="ielts-selected-note-confirm px-1 py-1 text-sm font-medium">Confirm deleting</button>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-2 flex items-center justify-between">
                      <button type="button" onClick={() => onSaveNote(annotation.id)} aria-label="Save selected-text note" className="ielts-selected-note-save rounded-sm bg-gray-800 px-3 py-1.5 text-xs font-bold text-white hover:bg-gray-950">Save</button>
                      <button type="button" onClick={() => onRequestDelete(annotation.id)} aria-label="Delete selected-text note" className="ielts-selected-note-delete px-1 py-1 text-xs font-medium text-sky-900 underline underline-offset-2 hover:text-red-700">Delete</button>
                    </div>
                  )}
                </>
              ) : null}
            </article>
          ))}
        </div>
      ) : null}
      <label htmlFor="exam-general-notes" className="sr-only">General notes</label>
      <textarea
        id="exam-general-notes"
        value={generalNotes}
        onChange={(event) => onGeneralNotesChange(event.target.value)}
        placeholder="Write your notes here..."
        className="min-h-[220px] flex-1 resize-none border-0 bg-transparent p-2 text-sm leading-relaxed text-gray-900 outline-none placeholder:text-gray-500"
      />
    </div>
  </aside>
);

export default ReadingNotesDrawer;
