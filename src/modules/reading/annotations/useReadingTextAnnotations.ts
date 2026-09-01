import { useCallback, useEffect, useRef, useState, type MouseEvent as ReactMouseEvent, type RefObject } from "react";
import {
  applyCssTextHighlights,
  clearCssTextHighlights,
  type CssTextHighlightEntry,
} from "../../../utils/cssTextHighlights";
import type {
  PendingReadingSelection,
  ReadingAnnotation,
  ReadingAnnotationKind,
} from "./types";

const PASSAGE_SCOPE = "lexora-reading-passage-selection";
const QUESTION_SCOPE = "lexora-reading-question-selection";

interface UseReadingTextAnnotationsOptions {
  containerRef: RefObject<HTMLElement | null>;
  passageRef: RefObject<HTMLElement | null>;
  questionRef: RefObject<HTMLElement | null>;
  partId: string;
  questionNumber: number;
  annotations: ReadingAnnotation[];
  passageRenderKey?: string | number;
  onCreate: (annotation: ReadingAnnotation) => void;
  onOpenNote?: (annotationId: string) => void;
}

interface CaretPoint {
  node: Node;
  offset: number;
}

const getCaretPoint = (clientX: number, clientY: number): CaretPoint | null => {
  const caretDocument = document as Document & {
    caretPositionFromPoint?: (x: number, y: number) => { offsetNode: Node; offset: number } | null;
    caretRangeFromPoint?: (x: number, y: number) => Range | null;
  };
  const position = caretDocument.caretPositionFromPoint?.(clientX, clientY);
  if (position) return { node: position.offsetNode, offset: position.offset };
  const range = caretDocument.caretRangeFromPoint?.(clientX, clientY);
  return range ? { node: range.startContainer, offset: range.startOffset } : null;
};

const getOffsetWithinRoot = (root: HTMLElement, point: CaretPoint) => {
  if (!root.contains(point.node)) return null;
  const range = document.createRange();
  range.selectNodeContents(root);
  try {
    range.setEnd(point.node, point.offset);
  } catch {
    return null;
  }
  return range.toString().length;
};

const getPassageOffset = (passage: HTMLElement, point: CaretPoint) => {
  const element = point.node.nodeType === Node.ELEMENT_NODE ? point.node as Element : point.node.parentElement;
  const activeSegment = element?.closest<HTMLElement>("[data-reading-passage-segment]");
  if (!activeSegment || !passage.contains(activeSegment)) return null;
  const segments = Array.from(passage.querySelectorAll<HTMLElement>("[data-reading-passage-segment]"));
  let offset = 0;
  for (const segment of segments) {
    if (segment === activeSegment) {
      const localOffset = getOffsetWithinRoot(segment, point);
      return localOffset == null ? null : offset + localOffset;
    }
    offset += segment.textContent?.length ?? 0;
  }
  return null;
};

const collectHighlights = (
  roots: HTMLElement[],
  annotations: ReadingAnnotation[],
): CssTextHighlightEntry[] => {
  const nodes: Array<{ node: Text; start: number; end: number }> = [];
  let cursor = 0;
  roots.forEach((root) => {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let current = walker.nextNode();
    while (current) {
      const node = current as Text;
      nodes.push({ node, start: cursor, end: cursor + node.data.length });
      cursor += node.data.length;
      current = walker.nextNode();
    }
  });
  const highlights: CssTextHighlightEntry[] = [];
  nodes.forEach(({ node, start, end }) => {
    annotations
      .map((annotation) => ({ annotation, start: Math.max(0, annotation.start - start), end: Math.min(end - start, annotation.end - start) }))
      .filter((segment) => segment.start < segment.end)
      .forEach((segment) => {
        if (segment.end > node.data.length) return;
        const range = document.createRange();
        range.setStart(node, segment.start);
        range.setEnd(node, segment.end);
        highlights.push({ kind: segment.annotation.kind, range });
      });
  });
  return highlights;
};

export const useReadingTextAnnotations = ({
  containerRef,
  passageRef,
  questionRef,
  partId,
  questionNumber,
  annotations,
  passageRenderKey,
  onCreate,
  onOpenNote,
}: UseReadingTextAnnotationsOptions) => {
  const toolbarRef = useRef<HTMLDivElement | null>(null);
  const rangeRef = useRef<Range | null>(null);
  const [pendingSelection, setPendingSelection] = useState<PendingReadingSelection | null>(null);

  useEffect(() => {
    const passage = passageRef.current;
    if (!passage) return;
    const roots = Array.from(passage.querySelectorAll<HTMLElement>("[data-reading-passage-segment]"));
    const scoped = annotations.filter((annotation) => annotation.partId === partId && annotation.scope === "passage");
    applyCssTextHighlights(PASSAGE_SCOPE, collectHighlights(roots, scoped));
    return () => clearCssTextHighlights(PASSAGE_SCOPE);
  }, [annotations, partId, passageRef, passageRenderKey]);

  useEffect(() => {
    const question = questionRef.current;
    if (!question) return;
    const scoped = annotations.filter((annotation) => annotation.partId === partId && annotation.scope === "question" && annotation.questionNumber === questionNumber);
    applyCssTextHighlights(QUESTION_SCOPE, collectHighlights([question], scoped));
    return () => clearCssTextHighlights(QUESTION_SCOPE);
  }, [annotations, partId, questionNumber, questionRef]);

  const clearSelection = useCallback(() => {
    window.getSelection()?.removeAllRanges();
    rangeRef.current = null;
    setPendingSelection(null);
  }, []);

  const captureSelection = useCallback(() => {
    const container = containerRef.current;
    const selection = window.getSelection();
    if (!container || !selection || selection.rangeCount === 0 || selection.isCollapsed) {
      clearSelection();
      return;
    }
    const range = selection.getRangeAt(0);
    if (!container.contains(range.commonAncestorContainer)) {
      clearSelection();
      return;
    }
    const passage = passageRef.current;
    const question = questionRef.current;
    const scope = passage?.contains(range.startContainer) && passage.contains(range.endContainer)
      ? "passage"
      : question?.contains(range.startContainer) && question.contains(range.endContainer)
        ? "question"
        : null;
    if (!scope) {
      clearSelection();
      return;
    }
    const rawText = range.toString();
    const text = rawText.trim();
    if (!text) {
      clearSelection();
      return;
    }
    rangeRef.current = range.cloneRange();
    const activeRoot = scope === "passage" ? passage : question;
    if (!activeRoot) return;
    let start = 0;
    if (scope === "passage") {
      const element = range.startContainer.nodeType === Node.ELEMENT_NODE ? range.startContainer as Element : range.startContainer.parentElement;
      const startSegment = element?.closest<HTMLElement>("[data-reading-passage-segment]");
      const segments = Array.from(activeRoot.querySelectorAll<HTMLElement>("[data-reading-passage-segment]"));
      for (const segment of segments) {
        if (segment === startSegment) {
          const before = document.createRange();
          before.selectNodeContents(segment);
          before.setEnd(range.startContainer, range.startOffset);
          start += before.toString().length;
          break;
        }
        start += segment.textContent?.length ?? 0;
      }
    } else {
      const before = document.createRange();
      before.selectNodeContents(activeRoot);
      before.setEnd(range.startContainer, range.startOffset);
      start = before.toString().length;
    }
    start += rawText.length - rawText.trimStart().length;
    const rect = range.getBoundingClientRect();
    const below = rect.bottom + 67 <= window.innerHeight;
    setPendingSelection({
      partId,
      scope,
      questionNumber: scope === "question" ? questionNumber : undefined,
      start,
      end: start + text.length,
      text,
      top: below ? rect.bottom + 9 : Math.max(8, rect.top - 67),
      left: Math.min(window.innerWidth - 144, Math.max(8, rect.left + rect.width / 2 - 68)),
      placement: below ? "below" : "above",
    });
  }, [clearSelection, containerRef, partId, passageRef, questionNumber, questionRef]);

  const saveSelection = useCallback((kind: ReadingAnnotationKind) => {
    if (!pendingSelection) return;
    onCreate({
      id: `${pendingSelection.partId}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      partId: pendingSelection.partId,
      scope: pendingSelection.scope,
      questionNumber: pendingSelection.questionNumber,
      start: pendingSelection.start,
      end: pendingSelection.end,
      text: pendingSelection.text,
      kind,
    });
    clearSelection();
  }, [clearSelection, onCreate, pendingSelection]);

  const openNoteAtPoint = useCallback((event: ReactMouseEvent<HTMLElement>) => {
    if (!onOpenNote || window.getSelection()?.isCollapsed === false) return;
    const point = getCaretPoint(event.clientX, event.clientY);
    if (!point) return;
    const passage = passageRef.current;
    const question = questionRef.current;
    const scope = passage?.contains(point.node)
      ? "passage"
      : question?.contains(point.node)
        ? "question"
        : null;
    if (!scope) return;
    const offset = scope === "passage"
      ? passage ? getPassageOffset(passage, point) : null
      : question ? getOffsetWithinRoot(question, point) : null;
    if (offset == null) return;
    const clickedOffsets = [offset, Math.max(0, offset - 1)];
    const note = annotations.find((annotation) =>
      annotation.kind === "note" &&
      annotation.partId === partId &&
      annotation.scope === scope &&
      (scope === "passage" || annotation.questionNumber === questionNumber) &&
      clickedOffsets.some((clickedOffset) => annotation.start <= clickedOffset && clickedOffset < annotation.end),
    );
    if (note) onOpenNote(note.id);
  }, [annotations, onOpenNote, partId, passageRef, questionNumber, questionRef]);

  useEffect(() => {
    if (!pendingSelection) return;
    const dismiss = (event?: Event) => {
      const target = event?.target as Node | undefined;
      if (target && (toolbarRef.current?.contains(target) || containerRef.current?.contains(target))) return;
      clearSelection();
    };
    const onEscape = (event: KeyboardEvent) => { if (event.key === "Escape") clearSelection(); };
    document.addEventListener("pointerdown", dismiss);
    document.addEventListener("scroll", dismiss, true);
    window.addEventListener("resize", dismiss);
    window.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("pointerdown", dismiss);
      document.removeEventListener("scroll", dismiss, true);
      window.removeEventListener("resize", dismiss);
      window.removeEventListener("keydown", onEscape);
    };
  }, [clearSelection, containerRef, pendingSelection]);

  return { pendingSelection, toolbarRef, captureSelection, clearSelection, saveSelection, openNoteAtPoint };
};
