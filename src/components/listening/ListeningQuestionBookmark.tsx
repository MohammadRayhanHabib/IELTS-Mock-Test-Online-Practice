import React from "react";
import { createPortal } from "react-dom";
import { FiBookmark } from "react-icons/fi";

interface ListeningQuestionBookmarkProps {
  questionNumber: number;
  bookmarked: boolean;
  onToggle: (questionNumber: number) => void;
  pattern?: string;
}

interface ListeningQuestionBookmarkContextValue {
  activeQuestion: number;
  activePattern: string;
}

const ListeningQuestionBookmarkContext =
  React.createContext<ListeningQuestionBookmarkContextValue | null>(null);

export const ListeningQuestionBookmarkProvider: React.FC<{
  activeQuestion: number;
  activePattern: string;
  children: React.ReactNode;
}> = ({ activeQuestion, activePattern, children }) => (
  <ListeningQuestionBookmarkContext.Provider
    value={{ activeQuestion, activePattern }}
  >
    {children}
  </ListeningQuestionBookmarkContext.Provider>
);

const ListeningQuestionBookmark: React.FC<
  ListeningQuestionBookmarkProps
> = ({
  questionNumber,
  bookmarked,
  onToggle,
  pattern,
}) => {
  const visibility = React.useContext(ListeningQuestionBookmarkContext);
  const anchorRef = React.useRef<HTMLSpanElement | null>(null);
  const [portalTarget, setPortalTarget] = React.useState<HTMLElement | null>(
    null,
  );
  const [top, setTop] = React.useState(0);
  const [left, setLeft] = React.useState(0);
  const isVisible =
    !visibility ||
    (visibility.activeQuestion === questionNumber &&
      (!pattern || visibility.activePattern === pattern));

  React.useLayoutEffect(() => {
    if (!isVisible) {
      setPortalTarget(null);
      return undefined;
    }

    const anchor = anchorRef.current;
    const surface = anchor?.closest<HTMLElement>(
      ".ielts-listening-preview-content",
    );
    if (!anchor || !surface) return undefined;
    const questionBoundary =
      anchor.closest<HTMLElement>("tr, fieldset") ?? anchor;

    const updatePosition = () => {
      const anchorRect = anchor.getBoundingClientRect();
      const surfaceRect = surface.getBoundingClientRect();
      const boundaryRect = questionBoundary.getBoundingClientRect();
      const preferredLane = Math.min(
        1180,
        Math.max(820, surface.clientWidth * 0.68),
      );
      const boundaryRight =
        boundaryRect.right - surfaceRect.left + surface.scrollLeft;
      setTop(
        anchorRect.top -
          surfaceRect.top +
          surface.scrollTop +
          (anchorRect.height - 44) / 2,
      );
      setLeft(
        Math.max(
          16,
          Math.min(
            surface.clientWidth - 64,
            Math.max(preferredLane, boundaryRight + 32),
          ),
        ),
      );
    };

    updatePosition();
    setPortalTarget(surface);

    const resizeObserver = new ResizeObserver(updatePosition);
    resizeObserver.observe(anchor);
    resizeObserver.observe(surface);
    if (questionBoundary !== anchor) resizeObserver.observe(questionBoundary);
    surface.addEventListener("scroll", updatePosition, { passive: true });
    window.addEventListener("resize", updatePosition);

    return () => {
      resizeObserver.disconnect();
      surface.removeEventListener("scroll", updatePosition);
      window.removeEventListener("resize", updatePosition);
    };
  }, [isVisible]);

  return (
    <>
      <span
        ref={anchorRef}
        aria-hidden="true"
        data-question-bookmark-anchor={questionNumber}
        className="inline-block h-[30px] w-0 shrink-0 align-middle"
      />
      {isVisible && portalTarget
        ? createPortal(
            <button
              type="button"
              data-question-bookmark={questionNumber}
              aria-label={`${bookmarked ? "Remove" : "Bookmark"} question ${questionNumber} for review`}
              aria-pressed={bookmarked}
              title={`${bookmarked ? "Remove bookmark from" : "Bookmark"} question ${questionNumber}`}
              style={{ top, left }}
              onClick={(event) => {
                event.stopPropagation();
                onToggle(questionNumber);
              }}
              className={`absolute z-30 inline-flex h-11 w-11 items-center justify-center bg-transparent transition-[color,filter] focus:outline-none focus-visible:drop-shadow-[0_1px_1px_rgba(23,41,64,0.35)] ${
                bookmarked
                  ? "text-[#ef1f2d]"
                  : "text-[#525a66] hover:text-[#c81e1e]"
              }`}
            >
              <FiBookmark
                aria-hidden="true"
                className={`h-6 w-6 ${bookmarked ? "fill-current" : ""}`}
              />
            </button>,
            portalTarget,
          )
        : null}
    </>
  );
};

export default ListeningQuestionBookmark;
