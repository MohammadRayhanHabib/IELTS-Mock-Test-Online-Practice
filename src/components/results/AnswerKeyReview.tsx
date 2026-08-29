import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  BookOpen,
  Check,
  ChevronRight,
  Download,
  MapPin,
  MessageCircleMore,
  Pause,
  Play,
  Puzzle,
  RotateCcw,
  RotateCw,
  Volume2,
  X,
} from "lucide-react";

export interface ResultAnswerItem {
  id: string;
  number: string;
  partLabel: string;
  question: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  explanation?: string;
  contextTitle?: string;
  context?: string;
}

export interface ResultAnswerGroup {
  label: string;
  items: ResultAnswerItem[];
}

interface AnswerKeyReviewProps {
  title: string;
  groups: ResultAnswerGroup[];
  reviewTitle: string;
  emptyMessage: string;
  audioUrl?: string;
  showAudioPlaceholder?: boolean;
  onDownload?: () => void;
}

const AnswerKeyReview: React.FC<AnswerKeyReviewProps> = ({
  title,
  groups,
  reviewTitle,
  emptyMessage,
  audioUrl,
  showAudioPlaceholder = false,
  onDownload,
}) => {
  const allItems = useMemo(
    () => groups.flatMap((group) => group.items),
    [groups],
  );
  const [selectedId, setSelectedId] = useState(allItems[0]?.id ?? "");
  const [showExplanation, setShowExplanation] = useState(false);

  useEffect(() => {
    if (!allItems.some((item) => item.id === selectedId)) {
      setSelectedId(allItems[0]?.id ?? "");
    }
  }, [allItems, selectedId]);

  const selectedIndex = Math.max(
    0,
    allItems.findIndex((item) => item.id === selectedId),
  );
  const selected = allItems[selectedIndex];
  const selectedGroup = groups.find((group) =>
    group.items.some((item) => item.id === selected?.id),
  );
  const isReferenceDemo = selected?.id.startsWith("demo-result-") ?? false;

  if (!allItems.length) {
    return (
      <section className="mx-auto w-full max-w-[900px] py-12 text-center">
        <h2 className="text-[24px] font-black text-[#284664]">{title}</h2>
        <p className="mt-3 text-sm text-[#7c8995]">{emptyMessage}</p>
      </section>
    );
  }

  const selectItem = (itemId: string) => {
    setSelectedId(itemId);
    setShowExplanation(false);
  };

  return (
    <div className="mt-[68px] space-y-[72px]">
      <section className="mx-auto w-full max-w-[620px]">
        <div className="flex items-center justify-between gap-5">
          <div className="flex items-center gap-3 text-[#284664]">
            <Puzzle className="h-7 w-7" strokeWidth={1.8} />
            <h2 className="text-[20px] font-black tracking-[-0.02em]">
              {title}
            </h2>
          </div>
          {onDownload && (
            <button
              type="button"
              onClick={onDownload}
              className="print:hidden inline-flex items-center gap-2 rounded-full bg-[#f3f3f3] px-3.5 py-2 text-[12px] font-semibold text-[#5c5c5c] transition hover:bg-[#e9e9e9]"
            >
              <Download className="h-4 w-4" />
              Download
            </button>
          )}
        </div>

        <div className="mt-9 space-y-9">
          {groups.map((group) => {
            const columns = splitBalanced(group.items);
            return (
              <div key={group.label}>
                <h3 className="mb-3 text-[14px] font-black text-[#284664]">
                  {group.label}
                </h3>
                <div className="grid gap-x-[72px] gap-y-2 md:grid-cols-2">
                  {columns.map((column, columnIndex) => (
                    <div
                      key={`${group.label}-${columnIndex}`}
                      className="space-y-1.5"
                    >
                      {column.map((item) => {
                        const answer =
                          item.correctAnswer ||
                          item.userAnswer ||
                          "No answer";
                        const active = selected?.id === item.id;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => selectItem(item.id)}
                            className={`flex w-full min-w-0 items-center gap-2.5 rounded-lg py-0.5 text-left transition ${
                              active
                                ? "text-[#183b5b]"
                                : "text-[#284664] hover:text-[#183b5b]"
                            }`}
                          >
                            <span
                              className={`flex h-6 min-w-6 items-center justify-center rounded-full bg-[#284664] px-1.5 text-[11px] font-black text-white ${
                                item.number.length > 3
                                  ? "rounded-[14px] leading-[11px]"
                                  : ""
                              }`}
                            >
                              {item.number}
                            </span>
                            <span className="min-w-0 flex-1 break-words text-[13px] font-medium">
                              {answer}
                              <span className="mx-2 text-[#242424]">:</span>
                              {item.isCorrect ? (
                                <Check className="inline h-4 w-4 text-[#31aa67]" />
                              ) : (
                                <X className="inline h-4 w-4 text-[#c27c87]" />
                              )}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="relative left-1/2 w-[calc(100vw-56px)] max-w-[1500px] -translate-x-1/2 rounded-[16px] bg-[#3d1414] p-[14px] shadow-sm">
        <div className="flex items-center gap-2.5 px-2 pb-3.5 text-white">
          <BookOpen className="h-5 w-5" strokeWidth={1.8} />
          <h2 className="text-[18px] font-black tracking-[-0.02em]">
            {reviewTitle}
          </h2>
        </div>

        <div className="grid min-h-[480px] overflow-hidden rounded-[14px] bg-white lg:grid-cols-2">
          <article className="flex min-h-[480px] flex-col bg-white">
            <div className="flex-1 overflow-y-auto px-5 py-6 sm:px-7">
              {isReferenceDemo ? (
                <ReferenceResultQuestion
                  selected={selected}
                  groupLabel={selectedGroup?.label}
                  showExplanation={showExplanation}
                  onToggleExplanation={() =>
                    setShowExplanation((value) => !value)
                  }
                />
              ) : (
                <>
                  <h3 className="text-[22px] font-black text-[#284664]">
                    {selectedGroup?.label ?? `Question ${selected.number}`}
                  </h3>
                  <p className="mt-6 whitespace-pre-line text-[15px] italic leading-7 text-[#3b3b3b]">
                    {selected.question}
                  </p>

                  <div className="mt-8 flex items-start gap-4">
                    <span className="flex h-8 min-w-8 items-center justify-center rounded-full bg-[#31854d] px-2 text-[13px] font-black text-white">
                      {selected.number}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[#607080]">
                        Your answer
                      </p>
                      <p
                        className={`mt-1 break-words text-[17px] font-black ${
                          selected.isCorrect
                            ? "text-[#31854d]"
                            : "text-[#f00000]"
                        }`}
                      >
                        {selected.userAnswer || "No answer"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-7">
                    <p className="text-[16px] font-medium text-[#343434]">
                      {selected.number} Answer:{" "}
                      <span className="font-black text-[#f00000]">
                        {selected.correctAnswer || "Not available"}
                      </span>
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <ReviewAction icon={<MapPin />} label="Locate" />
                      <ReviewAction
                        icon={<MessageCircleMore />}
                        label="Explain"
                        onClick={() =>
                          setShowExplanation((value) => !value)
                        }
                      />
                      <ReviewAction icon={<AlertTriangle />} label="Report" />
                    </div>
                  </div>

                  {showExplanation && (
                    <div className="mt-5 rounded-xl bg-[#f6f0df] p-4 text-sm leading-6 text-[#5e4b20]">
                      {selected.explanation ||
                        "An explanation is not available for this answer yet."}
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="flex min-h-[52px] items-center justify-end bg-[#d4dae0] px-7">
              <button
                type="button"
                disabled={selectedIndex === allItems.length - 1}
                onClick={() => selectItem(allItems[selectedIndex + 1].id)}
                className="inline-flex items-center gap-1 rounded-lg bg-[#327846] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#28643a] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </article>

          <article className="max-h-[520px] overflow-y-auto bg-[#e3ecf6]">
            {(audioUrl || showAudioPlaceholder) && (
              <ReviewAudioPlayer audioUrl={audioUrl} />
            )}
            <div className="px-6 py-5 sm:px-7">
              <h3 className="text-center text-[24px] font-black tracking-[-0.02em] text-[#284664]">
                {selected.contextTitle || "Question context"}
              </h3>
              <div className="mt-4 whitespace-pre-line text-[13px] leading-[1.55] text-[#333b43]">
                <HighlightedText
                  text={
                    selected.context ||
                    "The passage or transcript context for this answer is not available in the current result payload."
                  }
                  needle={selected.correctAnswer}
                />
              </div>
            </div>
          </article>
        </div>
      </section>
    </div>
  );
};

const ReviewAction: React.FC<{
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}> = ({ icon, label, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="inline-flex items-center gap-1.5 rounded border border-[#3d8954] px-3 py-1.5 text-xs font-medium text-[#3d8954] transition hover:bg-[#edf7f0]"
  >
    {React.isValidElement(icon)
      ? React.cloneElement(icon as React.ReactElement<{ className?: string }>, {
          className: "h-3.5 w-3.5",
        })
      : icon}
    {label}
  </button>
);

const ReferenceResultQuestion: React.FC<{
  selected: ResultAnswerItem;
  groupLabel?: string;
  showExplanation: boolean;
  onToggleExplanation: () => void;
}> = ({
  selected,
  groupLabel,
  showExplanation,
  onToggleExplanation,
}) => (
  <>
    <p className="text-[11px] font-black uppercase tracking-[0.14em] text-[#39a4bd]">
      {groupLabel?.replace("Question 1 - 13", "QUESTIONS 1-13")}
    </p>
    <h3 className="mt-4 text-[18px] font-black text-[#284664]">
      Questions 5-8
    </h3>
    <p className="mt-5 text-[13px] italic leading-6 text-[#50565b]">
      Complete the following sentences using{" "}
      <strong className="font-black text-[#f00000]">
        NO MORE THAN THREE WORDS
      </strong>{" "}
      from the text for each gap.
    </p>

    <div className="mt-5 space-y-4 text-[13px] leading-6 text-[#4a5157]">
      <ReferenceSentence
        number="5"
        before="Safaricom is the"
        after="mobile phone company in Kenya."
      />
      <ReferenceSentence
        number="6"
        before="An M-Pesa account needs to be credited by"
        after=""
      />
      <ReferenceSentence
        number="7"
        before=""
        after="companies are particularly interested in using M-Pesa"
      />
      <ReferenceSentence
        number="8"
        before="Companies like Moneygram and Western Union have"
        after="the international money transfer market."
      />
    </div>

    <div className="mt-5">
      <p className="text-[13px] font-medium text-[#343434]">
        {selected.number} Answer:{" "}
        <span className="font-black text-[#f00000]">
          {selected.correctAnswer || "Not available"}
        </span>
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <ReviewAction icon={<MapPin />} label="Locate" />
        <ReviewAction
          icon={<MessageCircleMore />}
          label="Explain"
          onClick={onToggleExplanation}
        />
        <ReviewAction icon={<AlertTriangle />} label="Report" />
      </div>
    </div>

    {showExplanation && (
      <div className="mt-5 rounded-xl bg-[#f6f0df] p-4 text-sm leading-6 text-[#5e4b20]">
        {selected.explanation ||
          "An explanation is not available for this answer yet."}
      </div>
    )}
  </>
);

const ReferenceSentence: React.FC<{
  number: string;
  before: string;
  after: string;
}> = ({ number, before, after }) => (
  <p className="flex flex-wrap items-center gap-x-2">
    {before && <span>{before}</span>}
    <span className="inline-flex items-center gap-2">
      <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-[#31854d] px-1 text-[11px] font-black text-white">
        {number}
      </span>
      <span className="h-px w-24 bg-[#9ba1a6]" aria-hidden="true" />
    </span>
    {after && <span>{after}</span>}
  </p>
);

const ReviewAudioPlayer: React.FC<{ audioUrl?: string }> = ({ audioUrl }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.72);

  useEffect(() => {
    setPlaying(false);
    setCurrentTime(0);
    setDuration(0);
  }, [audioUrl]);

  const togglePlayback = async () => {
    const audio = audioRef.current;
    if (!audioUrl || !audio) return;
    if (audio.paused) {
      try {
        await audio.play();
        setPlaying(true);
      } catch {
        setPlaying(false);
      }
    } else {
      audio.pause();
      setPlaying(false);
    }
  };

  const seekBy = (seconds: number) => {
    const audio = audioRef.current;
    if (!audioUrl || !audio) return;
    audio.currentTime = Math.max(
      0,
      Math.min(audio.duration || 0, audio.currentTime + seconds),
    );
  };

  const updateVolume = (value: number) => {
    setVolume(value);
    if (audioRef.current) audioRef.current.volume = value;
  };

  return (
    <div className="grid min-h-[82px] grid-cols-[72px_1fr] overflow-hidden bg-[#c8eef3] text-[#245268]">
      {audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          preload="metadata"
          onLoadedMetadata={(event) =>
            setDuration(event.currentTarget.duration || 0)
          }
          onTimeUpdate={(event) =>
            setCurrentTime(event.currentTarget.currentTime)
          }
          onEnded={() => setPlaying(false)}
        />
      )}
      <button
        type="button"
        onClick={togglePlayback}
        aria-label={playing ? "Pause audio" : "Play audio"}
        aria-disabled={!audioUrl}
        className="row-span-2 flex items-center justify-center bg-[#57c3d6] text-white"
      >
        {playing ? (
          <Pause className="h-7 w-7 fill-current" />
        ) : (
          <Play className="h-8 w-8 fill-current" />
        )}
      </button>

      <div className="flex items-center gap-4 px-5 pt-3">
        <span className="h-3 w-3 shrink-0 rounded-full bg-[#245268]" />
        <input
          type="range"
          min={0}
          max={duration || 60}
          step={0.1}
          value={Math.min(currentTime, duration || 60)}
          onChange={(event) => {
            const nextTime = Number(event.target.value);
            setCurrentTime(nextTime);
            if (audioRef.current) audioRef.current.currentTime = nextTime;
          }}
          disabled={!audioUrl}
          aria-label="Audio progress"
          className="h-1.5 min-w-0 flex-1 cursor-pointer appearance-none rounded-full bg-white/90 accent-[#245268] disabled:cursor-default"
        />
      </div>

      <div className="grid grid-cols-3 border-t border-[#9ddce5]">
        <button
          type="button"
          onClick={() => seekBy(-5)}
          aria-label="Rewind 5 seconds"
          aria-disabled={!audioUrl}
          className="flex items-center justify-center border-r border-[#9ddce5] py-2"
        >
          <RotateCcw className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => seekBy(5)}
          aria-label="Forward 5 seconds"
          aria-disabled={!audioUrl}
          className="flex items-center justify-center border-r border-[#9ddce5] py-2"
        >
          <RotateCw className="h-4 w-4" />
        </button>
        <label className="flex items-center gap-2 px-4">
          <Volume2 className="h-4 w-4 shrink-0" />
          <span className="sr-only">Volume</span>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={volume}
            onChange={(event) => updateVolume(Number(event.target.value))}
            className="h-1 min-w-0 flex-1 cursor-pointer appearance-none rounded-full bg-[#69aeba] accent-[#245268]"
          />
        </label>
      </div>
    </div>
  );
};

const HighlightedText: React.FC<{ text: string; needle: string }> = ({
  text,
  needle,
}) => {
  const search = needle.trim();
  if (!search || search.length < 2) return <>{text}</>;

  const expression = new RegExp(`(${escapeRegExp(search)})`, "gi");
  return (
    <>
      {text.split(expression).map((part, index) =>
        part.toLowerCase() === search.toLowerCase() ? (
          <mark
            key={`${part}-${index}`}
            className="bg-[#f9a95a] px-0.5 text-inherit"
          >
            {part}
          </mark>
        ) : (
          <React.Fragment key={`${part}-${index}`}>{part}</React.Fragment>
        ),
      )}
    </>
  );
};

function splitBalanced(items: ResultAnswerItem[]): ResultAnswerItem[][] {
  const splitAt = Math.ceil(items.length / 2);
  return [items.slice(0, splitAt), items.slice(splitAt)];
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export default AnswerKeyReview;
