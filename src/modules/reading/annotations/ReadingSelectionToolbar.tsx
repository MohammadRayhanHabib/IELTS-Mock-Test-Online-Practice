import React, { type Ref } from "react";
import type { PendingReadingSelection, ReadingAnnotationKind } from "./types";

interface ReadingSelectionToolbarProps {
  selection: PendingReadingSelection;
  toolbarRef: Ref<HTMLDivElement>;
  onSave: (kind: ReadingAnnotationKind) => void;
  onOpenNotes: () => void;
}

const ReadingSelectionToolbar: React.FC<ReadingSelectionToolbarProps> = ({ selection, toolbarRef, onSave, onOpenNotes }) => (
  <div ref={toolbarRef} data-testid="reading-selection-toolbar" style={{ top: selection.top, left: selection.left }} onMouseDown={(event) => event.preventDefault()} data-selection-placement={selection.placement} className="ielts-selection-toolbar fixed z-[80] w-[136px] rounded-[2px] border border-[#6b7280] bg-white p-1 text-gray-700 shadow-[0_4px_14px_rgba(0,0,0,0.18)]">
    <span aria-hidden="true" className={`pointer-events-none absolute left-1/2 h-0 w-0 -translate-x-1/2 border-x-[7px] border-x-transparent ${selection.placement === "below" ? "bottom-full border-b-[7px] border-b-[#6b7280]" : "top-full border-t-[7px] border-t-[#6b7280]"}`} />
    <span aria-hidden="true" className={`pointer-events-none absolute left-1/2 h-0 w-0 -translate-x-1/2 border-x-[6px] border-x-transparent ${selection.placement === "below" ? "bottom-full border-b-[6px] border-b-white" : "top-full border-t-[6px] border-t-white"}`} />
    <div className="grid grid-cols-2 divide-x divide-gray-200">
      <button type="button" onClick={() => { onOpenNotes(); onSave("note"); }} aria-label="Add a note to selected text" className="flex h-[48px] flex-col items-center justify-center gap-0.5 rounded-[1px] bg-white text-[11px] font-medium text-[#1c629e] transition-colors hover:bg-[#f2f6fa]"><span className="flex h-4 w-4 items-center justify-center rounded-[1px] bg-[#424f60] text-[13px] font-bold leading-none text-white">“</span><span>Note</span></button>
      <button type="button" onClick={() => onSave("highlight")} aria-label="Highlight selected text" className="flex h-[48px] flex-col items-center justify-center gap-0.5 rounded-[1px] bg-white text-[11px] font-medium text-[#1c629e] transition-colors hover:bg-[#f2f6fa]"><span className="relative h-4 w-4" aria-hidden="true"><span className="absolute bottom-0 left-0 h-[3.5px] w-4 rounded-[0.5px] bg-[#f0cc35]" /><span className="absolute bottom-1 left-[7px] h-[10px] w-[2.5px] -rotate-12 rounded-[0.5px] bg-[#4b5563]" /></span><span>Highlight</span></button>
    </div>
  </div>
);

export default ReadingSelectionToolbar;
