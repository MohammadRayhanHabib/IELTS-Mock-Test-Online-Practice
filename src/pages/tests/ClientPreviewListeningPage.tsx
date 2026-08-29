import React, { useEffect, useMemo, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { FiPause } from "react-icons/fi";
import ClientExamSectionFooter, {
  type ClientExamFooterSection,
} from "../../components/exam/ClientExamSectionFooter";
import ClientExamNotesDrawer, {
  type ExamTextAnnotation,
} from "../../components/exam/ClientExamNotesDrawer";
import ClientExamNavigationButtons from "../../components/exam/ClientExamNavigationButtons";
import ClientExamOptionsOverlay, {
  ClientExamContrastMode,
  ClientExamOptionsView,
  ClientExamTextSize,
} from "../../components/exam/ClientExamOptionsOverlay";
import ClientListeningExamHeader from "../../components/listening/ClientListeningExamHeader";
import ListeningQuestionTypeBanner from "../../components/listening/ListeningQuestionTypeBanner";
import { ListeningQuestionBookmarkProvider } from "../../components/listening/ListeningQuestionBookmark";
import ClientFullListeningPart from "../../components/listening/ClientFullListeningPart";
import {
  FactorMatchingQuestion as ListeningFactorMatchingPanel,
  FlowChartCompletionQuestion as ListeningFlowChartCompletionPanel,
  ListMatchingQuestion as ListeningListMatchingPanel,
  ListeningAnswerField as AnswerField,
  MapLabellingQuestion as ListeningMapLabellingPanel,
  MultipleChoiceQuestion as ListeningMcqPanel,
  SentenceCompletionQuestion as ListeningSentenceCompletionPanel,
  ShortAnswerQuestion as ListeningShortAnswerPanel,
  SummaryCompletionQuestion as ListeningSummaryCompletionPanel,
  TableCompletionQuestion as ListeningTableCompletionPanel,
} from "../../modules/listening/questions";
import {
  getClientPreviewFullListeningMock,
  scoreClientPreviewFullListening,
} from "../../data/clientPreviewFullListeningMocks";
import {
  CLIENT_LISTENING_LIST_MATCHING_NARRATION,
  CLIENT_LISTENING_MAP_LABELLING_NARRATION,
  CLIENT_LISTENING_NARRATION,
  CLIENT_LISTENING_RESULT_KEY,
  CLIENT_LISTENING_STARTED_KEY,
  pauseClientListeningNarration,
  playClientListeningNarration,
  resumeClientListeningNarration,
  setClientListeningNarrationVolume,
  scoreClientListeningAnswers,
  stopClientListeningNarration,
} from "../../data/clientPreviewListening";
import {
  applyCssTextHighlights,
  clearCssTextHighlights,
} from "../../utils/cssTextHighlights";

type AnswerMap = Record<number, string>;

const PART_ONE_QUESTIONS = Array.from({ length: 10 }, (_, index) => index + 1);
const PART_TWO_QUESTIONS = Array.from({ length: 10 }, (_, index) => index + 11);
const PART_THREE_QUESTIONS = Array.from({ length: 10 }, (_, index) => index + 21);
const PART_FOUR_QUESTIONS = Array.from({ length: 10 }, (_, index) => index + 31);
const ALL_DEMO_QUESTIONS = [
  ...PART_ONE_QUESTIONS,
  ...PART_TWO_QUESTIONS,
  ...PART_THREE_QUESTIONS,
  ...PART_FOUR_QUESTIONS,
];
const LISTENING_HIGHLIGHT_SCOPE = "lexora-listening-selection";
const LISTENING_ANSWERS_DRAFT_KEY = "lexora.client-preview.listening.answers.v1";
const LISTENING_NOTES_DRAFT_KEY = "lexora.client-preview.listening.notes.v1";
const LISTENING_ANNOTATIONS_DRAFT_KEY = "lexora.client-preview.listening.annotations.v1";

interface ListeningUrlConfig {
  partTwoPattern: "table" | "list-matching" | "map-labelling";
  initialQuestion: number;
  autoplay: boolean;
  testNumber: number;
}

function parseListeningUrlConfig(): ListeningUrlConfig {
  if (typeof window === "undefined") {
    return {
      partTwoPattern: "table",
      initialQuestion: 1,
      autoplay: false,
      testNumber: 1,
    };
  }
  const params = new URLSearchParams(window.location.search);
  const pattern = params.get("pattern")?.toLowerCase().trim();
  const qParam = params.get("q") ?? params.get("question");
  const autoplay =
    params.get("autoplay") === "1" || params.get("autoplay") === "true";
  const requestedTest = Number.parseInt(params.get("test") ?? "1", 10);
  const testNumber =
    Number.isFinite(requestedTest) && requestedTest >= 1 ? requestedTest : 1;

  let partTwoPattern: "table" | "list-matching" | "map-labelling" = "table";
  let initialQuestion = 1;

  if (
    pattern === "map-labelling" ||
    pattern === "map-labeling" ||
    pattern === "map"
  ) {
    partTwoPattern = "map-labelling";
    initialQuestion = 15;
  } else if (pattern === "list-matching" || pattern === "list") {
    partTwoPattern = "list-matching";
    initialQuestion = 11;
  } else if (
    pattern === "table-completion" ||
    pattern === "table" ||
    pattern === "table_completion"
  ) {
    partTwoPattern = "table";
    initialQuestion = 11;
  } else if (
    pattern === "sentence-completion" ||
    pattern === "sentence" ||
    pattern === "sentence_completion"
  ) {
    partTwoPattern = "table";
    initialQuestion = 15;
  } else if (pattern === "note-completion" || pattern === "note") {
    initialQuestion = 1;
  } else if (
    pattern === "mcq" ||
    pattern === "multiple-choice" ||
    pattern === "multiple-choice-questions"
  ) {
    initialQuestion = 21;
  } else if (pattern === "summary-completion" || pattern === "summary") {
    initialQuestion = 23;
  } else if (
    pattern === "flow-chart" ||
    pattern === "flowchart" ||
    pattern === "flow-chart-completion"
  ) {
    initialQuestion = 27;
  } else if (
    pattern === "short-answer" ||
    pattern === "short-answer-questions"
  ) {
    initialQuestion = 31;
  } else if (pattern === "factor-matching" || pattern === "factor") {
    initialQuestion = 38;
  }

  if (qParam) {
    const parsed = parseInt(qParam, 10);
    if (!isNaN(parsed) && parsed >= 1 && parsed <= 40) {
      initialQuestion = parsed;
    }
  }

  return { partTwoPattern, initialQuestion, autoplay, testNumber };
}

const ClientPreviewListeningPage: React.FC = () => {
  const navigate = useNavigate();
  const initialConfig = useMemo(parseListeningUrlConfig, []);
  const fullListeningMock = useMemo(
    () => getClientPreviewFullListeningMock(initialConfig.testNumber),
    [initialConfig.testNumber],
  );
  const answerDraftKey = fullListeningMock
    ? `${LISTENING_ANSWERS_DRAFT_KEY}.test-${initialConfig.testNumber}`
    : LISTENING_ANSWERS_DRAFT_KEY;
  const listAnswerDraftKey = `${answerDraftKey}.list-map`;
  const [answers, setAnswers] = useState<AnswerMap>(() =>
    readStoredAnswers(answerDraftKey),
  );
  const [listAnswers, setListAnswers] = useState<AnswerMap>(() =>
    readStoredAnswers(listAnswerDraftKey),
  );
  const [focusedPattern, setFocusedPattern] = useState<string>(() => {
    if (initialConfig.partTwoPattern === "map-labelling") return "map-labelling";
    if (initialConfig.partTwoPattern === "list-matching") return "list-matching";
    return "default";
  });
  const [activeQuestion, setActiveQuestion] = useState(
    initialConfig.initialQuestion,
  );
  const [isPlaying, setIsPlaying] = useState(true);
  const [listeningVolume, setListeningVolume] = useState(1);
  const [playbackSeconds, setPlaybackSeconds] = useState(0);
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<number>>(new Set());
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [isExamPaused, setIsExamPaused] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [notes, setNotes] = useState(() =>
    typeof window === "undefined"
      ? ""
      : window.localStorage.getItem(LISTENING_NOTES_DRAFT_KEY) ?? "",
  );
  const [annotations, setAnnotations] = useState<ExamTextAnnotation[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      return JSON.parse(
        window.localStorage.getItem(LISTENING_ANNOTATIONS_DRAFT_KEY) ?? "[]",
      );
    } catch {
      return [];
    }
  });
  const [pendingSelection, setPendingSelection] = useState<{
    text: string;
    top: number;
    left: number;
    placement: "below" | "above";
  } | null>(null);

  const [contrastMode, setContrastMode] =
    useState<ClientExamContrastMode>("black-on-white");
  const [textSize, setTextSize] = useState<ClientExamTextSize>("base");
  const [optionsView, setOptionsView] =
    useState<ClientExamOptionsView | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const inputRefs = useRef<Record<number, HTMLElement | null>>({});
  const listInputRefs = useRef<Record<number, HTMLElement | null>>({});
  const mainRef = useRef<HTMLElement | null>(null);
  const resumeAudioAfterPauseRef = useRef(false);

  const toggleFlag = (qNum: number) => {
    setFlaggedQuestions((prev) => {
      const next = new Set(prev);
      if (next.has(qNum)) {
        next.delete(qNum);
      } else {
        next.add(qNum);
      }
      return next;
    });
  };

  const pendingRangeRef = useRef<Range | null>(null);
  const annotationRangesRef = useRef(
    new Map<string, { kind: "highlight" | "note"; range: Range }>(),
  );

  const syncAnnotationHighlights = () => {
    applyCssTextHighlights(
      LISTENING_HIGHLIGHT_SCOPE,
      Array.from(annotationRangesRef.current.values()),
    );
  };

  useEffect(
    () => () => clearCssTextHighlights(LISTENING_HIGHLIGHT_SCOPE),
    [],
  );

  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed || selection.rangeCount === 0) {
      setPendingSelection(null);
      pendingRangeRef.current = null;
      return;
    }
    const text = selection.toString().trim();
    if (!text || text.length < 1) {
      setPendingSelection(null);
      pendingRangeRef.current = null;
      return;
    }
    const range = selection.getRangeAt(0);
    pendingRangeRef.current = range.cloneRange();

    const rect = range.getBoundingClientRect();
    const toolbarHeight = 58;
    const toolbarWidth = 136;
    const toolbarGap = 9;
    const viewportPadding = 8;
    const fitsBelow =
      rect.bottom + toolbarGap + toolbarHeight <= window.innerHeight;
    const placement = fitsBelow ? "below" : "above";
    const top = fitsBelow
      ? rect.bottom + toolbarGap
      : Math.max(viewportPadding, rect.top - toolbarHeight - toolbarGap);
    const left = Math.min(
      window.innerWidth - toolbarWidth - viewportPadding,
      Math.max(viewportPadding, rect.left + rect.width / 2 - toolbarWidth / 2),
    );

    setPendingSelection({ text, top, left, placement });
  };

  useEffect(() => {
    if (!pendingSelection) return;
    const onMouseDown = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (target.closest(".ielts-selection-toolbar")) return;
      setPendingSelection(null);
      pendingRangeRef.current = null;
    };
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, [pendingSelection]);

  const addAnnotation = (kind: "highlight" | "note") => {
    if (!pendingSelection) return;
    const annotationId = `listen-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const newAnnotation: ExamTextAnnotation = {
      id: annotationId,
      text: pendingSelection.text,
      kind,
      partLabel: `Part ${activePart}`,
      note: kind === "note" ? "" : undefined,
    };

    if (pendingRangeRef.current) {
      annotationRangesRef.current.set(annotationId, {
        kind,
        range: pendingRangeRef.current.cloneRange(),
      });
      syncAnnotationHighlights();
    }

    setAnnotations((prev) => {
      const updated = [...prev, newAnnotation];
      window.localStorage.setItem(
        LISTENING_ANNOTATIONS_DRAFT_KEY,
        JSON.stringify(updated),
      );
      return updated;
    });
    window.getSelection()?.removeAllRanges();
    setPendingSelection(null);
    pendingRangeRef.current = null;
    if (kind === "note") {
      setShowNotes(true);
    }
  };

  const deleteAnnotation = (id: string) => {
    annotationRangesRef.current.delete(id);
    syncAnnotationHighlights();

    setAnnotations((prev) => {
      const updated = prev.filter((a) => a.id !== id);
      window.localStorage.setItem(
        LISTENING_ANNOTATIONS_DRAFT_KEY,
        JSON.stringify(updated),
      );
      return updated;
    });
  };

  const updateAnnotationNote = (id: string, noteText: string) => {
    setAnnotations((prev) => {
      const updated = prev.map((a) =>
        a.id === id ? { ...a, note: noteText } : a,
      );
      window.localStorage.setItem(
        LISTENING_ANNOTATIONS_DRAFT_KEY,
        JSON.stringify(updated),
      );
      return updated;
    });
  };

  useEffect(() => {
    if (!window.sessionStorage.getItem(CLIENT_LISTENING_STARTED_KEY)) {
      window.sessionStorage.setItem(
        CLIENT_LISTENING_STARTED_KEY,
        String(Date.now()),
      );
    }

    if (
      initialConfig.autoplay &&
      "speechSynthesis" in window &&
      !window.speechSynthesis.speaking
    ) {
      const narration =
        fullListeningMock?.narration ??
        (initialConfig.partTwoPattern === "map-labelling"
          ? CLIENT_LISTENING_MAP_LABELLING_NARRATION
          : initialConfig.partTwoPattern === "list-matching"
            ? CLIENT_LISTENING_LIST_MATCHING_NARRATION
            : CLIENT_LISTENING_NARRATION);
      playClientListeningNarration(narration);
    }

    return () => stopClientListeningNarration();
  }, []);

  useEffect(() => {
    if (initialConfig.initialQuestion > 1) {
      const timer = window.setTimeout(() => {
        const patternTarget =
          initialConfig.partTwoPattern === "map-labelling"
            ? "map-labelling"
            : initialConfig.partTwoPattern === "list-matching"
              ? "list-matching"
              : undefined;
        goToQuestion(initialConfig.initialQuestion, patternTarget);
      }, 250);
      return () => window.clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    if (!isPlaying || isExamPaused) return undefined;

    const timer = window.setInterval(() => {
      setPlaybackSeconds((current) => Math.min(current + 1, 30 * 60));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [isExamPaused, isPlaying]);

  useEffect(() => {
    window.localStorage.setItem(
      answerDraftKey,
      JSON.stringify(answers),
    );
  }, [answerDraftKey, answers]);

  useEffect(() => {
    window.localStorage.setItem(
      listAnswerDraftKey,
      JSON.stringify(listAnswers),
    );
  }, [listAnswerDraftKey, listAnswers]);

  useEffect(() => {
    window.localStorage.setItem(LISTENING_NOTES_DRAFT_KEY, notes);
  }, [notes]);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOptionsView(null);
      setShowSettings(false);
      setShowNotes(false);
      setShowSubmitConfirm(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  const answeredCount = useMemo(
    () => ALL_DEMO_QUESTIONS.filter((number) => answers[number]?.trim()).length,
    [answers],
  );
  const activePart = activeQuestion <= 10
    ? 1
    : activeQuestion <= 20
      ? 2
      : activeQuestion <= 30
        ? 3
      : 4;

  useEffect(() => {
    annotationRangesRef.current.clear();
    clearCssTextHighlights(LISTENING_HIGHLIGHT_SCOPE);
  }, [activePart, activeQuestion]);

  const footerSections = useMemo<ClientExamFooterSection[]>(
    () => [
      {
        label: "Part 1",
        items: PART_ONE_QUESTIONS,
        completedItems: PART_ONE_QUESTIONS.filter((n) => answers[n]?.trim()),
      },
      {
        label: "Part 2",
        items: PART_TWO_QUESTIONS,
        completedItems: PART_TWO_QUESTIONS.filter(
          (n) => answers[n]?.trim() || listAnswers[n]?.trim(),
        ),
      },
      {
        label: "Part 3",
        items: PART_THREE_QUESTIONS,
        completedItems: PART_THREE_QUESTIONS.filter((n) => answers[n]?.trim()),
      },
      {
        label: "Part 4",
        items: PART_FOUR_QUESTIONS,
        completedItems: PART_FOUR_QUESTIONS.filter((n) => answers[n]?.trim()),
      },
    ],
    [answers, listAnswers],
  );

  const updateAnswer = (number: number, value: string) => {
    setAnswers((current) => ({ ...current, [number]: value }));
    setActiveQuestion(number);
  };

  const updateListAnswer = (number: number, value: string) => {
    setListAnswers((current) => ({ ...current, [number]: value }));
    setActiveQuestion(number);
  };

  const goToQuestion = (number: number, targetPattern?: string) => {
    setActiveQuestion(number);
    if (targetPattern) {
      setFocusedPattern(targetPattern);
    }
    window.requestAnimationFrame(() => {
      const el =
        targetPattern === "map-labelling" || targetPattern === "list-matching"
          ? (listInputRefs.current[number] ?? inputRefs.current[number])
          : (inputRefs.current[number] ?? listInputRefs.current[number]);
      el?.focus();
      el?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    });
  };

  const submitPreview = () => {
    const storedStartedAt = Number(
      window.sessionStorage.getItem(CLIENT_LISTENING_STARTED_KEY),
    );
    const startedAt =
      Number.isFinite(storedStartedAt) && storedStartedAt > 0
        ? storedStartedAt
        : Date.now();
    const combinedAnswers = { ...answers, ...listAnswers };
    const durationSeconds = Math.max(
      0,
      Math.round((Date.now() - startedAt) / 1000),
    );
    const result = fullListeningMock
      ? scoreClientPreviewFullListening(
          fullListeningMock,
          combinedAnswers,
          durationSeconds,
        )
      : scoreClientListeningAnswers(
          combinedAnswers,
          durationSeconds,
          focusedPattern === "map-labelling" ||
            focusedPattern === "list-matching"
            ? (focusedPattern as "map-labelling" | "list-matching")
            : "table",
        );

    window.sessionStorage.setItem(
      CLIENT_LISTENING_RESULT_KEY,
      JSON.stringify({ ...result, testNumber: initialConfig.testNumber }),
    );
    window.localStorage.removeItem(answerDraftKey);
    window.localStorage.removeItem(listAnswerDraftKey);
    stopClientListeningNarration();
    setIsPlaying(false);
    navigate(
      `/client-preview/listening/pre-test?test=${initialConfig.testNumber}&completed=listening`,
    );
  };

  const togglePlayback = () => {
    setIsPlaying((current) => {
      if (current) pauseClientListeningNarration();
      else resumeClientListeningNarration();
      return !current;
    });
  };

  const changeListeningVolume = (volume: number) => {
    const nextVolume = setClientListeningNarrationVolume(volume);
    setListeningVolume(nextVolume);
  };

  const toggleExamPause = () => {
    setIsExamPaused((current) => {
      if (!current) {
        resumeAudioAfterPauseRef.current = isPlaying;
        pauseClientListeningNarration();
        setIsPlaying(false);
      } else if (resumeAudioAfterPauseRef.current) {
        resumeClientListeningNarration();
        setIsPlaying(true);
        resumeAudioAfterPauseRef.current = false;
      }
      return !current;
    });
  };

  const saveAndExit = () => {
    stopClientListeningNarration();
    navigate("/client-preview/mock-tests");
  };

  return (
    <div
      translate="no"
      data-gramm="false"
      data-gramm_editor="false"
      data-enable-grammarly="false"
      data-ielts-contrast={contrastMode}
      data-ielts-text-size={textSize}
      className="notranslate ielts-exam-shell fixed inset-0 z-50 flex min-h-[680px] flex-col overflow-hidden bg-white text-[#171717]"
    >
      <Helmet>
        <title>Listening Test – Lexora</title>
      </Helmet>

      <ClientListeningExamHeader
        mode="test"
        moduleLabel="Listening"
        notesCount={annotations.length + (notes.trim() ? 1 : 0)}
        candidateLabel={`48887345 · Test ${initialConfig.testNumber}`}
        isPlaying={isPlaying}
        isPaused={isExamPaused}
        playbackSeconds={playbackSeconds}
        totalSeconds={30 * 60}
        remainingSeconds={Math.max(0, 30 * 60 - playbackSeconds)}
        onTogglePlayback={togglePlayback}
        onPauseToggle={toggleExamPause}
        onSubmit={() => {
          setOptionsView(null);
          setShowSubmitConfirm(true);
        }}
        onSaveExit={saveAndExit}
        onOpenSettings={() => {
          setShowNotes(false);
          setOptionsView(null);
          setShowSettings((current) => !current);
        }}
        onOpenOptions={() => {
          setShowSettings(false);
          setShowNotes(false);
          setOptionsView("menu");
        }}
        onOpenNotes={() => {
          setShowSettings(false);
          setOptionsView(null);
          setShowNotes((current) => !current);
        }}
      />

      {showSettings ? (
        <section
          aria-label="Settings"
          className="absolute right-20 top-[58px] z-50 w-56 rounded-xl border border-gray-200 bg-white p-4 text-gray-900 shadow-lg"
        >
          <h2 className="text-sm font-semibold">Settings</h2>
          <p className="mb-2 mt-3 text-xs text-gray-500">Font Size</p>
          <div className="flex gap-2">
            {QUICK_TEXT_SIZE_OPTIONS.map(([size, label]) => (
              <button
                key={size}
                type="button"
                onClick={() => setTextSize(size)}
                aria-pressed={textSize === size}
                className={`flex-1 rounded-lg border py-1.5 text-xs ${
                  textSize === size
                    ? "border-gray-900 bg-gray-900 text-white"
                    : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setShowSettings(false)}
            className="mt-3 w-full py-1.5 text-xs text-gray-500 hover:text-gray-800"
          >
            Close
          </button>
        </section>
      ) : null}

      {isExamPaused ? (
        <div className="absolute inset-0 z-[70] flex items-center justify-center bg-black/60 px-4">
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="listening-paused-title"
            className="w-full max-w-sm rounded-xl bg-white p-8 text-center shadow-2xl"
          >
            <FiPause className="mx-auto h-7 w-7 text-gray-900" />
            <h2 id="listening-paused-title" className="mt-3 text-2xl font-bold text-gray-900">
              Exam Paused
            </h2>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              Your answers and notes are saved. Resume when you are ready.
            </p>
            <button
              type="button"
              onClick={toggleExamPause}
              className="mt-6 rounded-md bg-gray-900 px-7 py-3 text-sm font-bold text-white hover:bg-black"
            >
              Resume Exam
            </button>
          </section>
        </div>
      ) : null}

      {optionsView ? (
        <ClientExamOptionsOverlay
          view={optionsView}
          contrastMode={contrastMode}
          textSize={textSize}
          onViewChange={setOptionsView}
          onClose={() => setOptionsView(null)}
          onSubmit={() => {
            setOptionsView(null);
            setShowSubmitConfirm(true);
          }}
          onContrastChange={setContrastMode}
          onTextSizeChange={setTextSize}
        />
      ) : null}

      {showNotes ? (
        <ClientExamNotesDrawer
          value={notes}
          onChange={setNotes}
          onClose={() => setShowNotes(false)}
          annotations={annotations}
          onDeleteAnnotation={deleteAnnotation}
          onUpdateAnnotationNote={updateAnnotationNote}
        />
      ) : null}

      {/* Official CD-IELTS Text Selection Floating Toolbar */}
      {pendingSelection && (
        <div
          data-selection-placement={pendingSelection.placement}
          style={{ top: pendingSelection.top, left: pendingSelection.left }}
          onMouseDown={(event) => event.preventDefault()}
          className="ielts-selection-toolbar fixed z-[80] w-[136px] rounded-[2px] border border-[#6b7280] bg-white p-1 text-gray-700 shadow-[0_4px_14px_rgba(0,0,0,0.18)]"
        >
          {/* Arrow Beak Outer Border */}
          <span
            aria-hidden="true"
            className={`ielts-selection-arrow-outer pointer-events-none absolute left-1/2 h-0 w-0 -translate-x-1/2 border-x-[7px] border-x-transparent ${
              pendingSelection.placement === "below"
                ? "bottom-full border-b-[7px] border-b-[#6b7280]"
                : "top-full border-t-[7px] border-t-[#6b7280]"
            }`}
          />
          {/* Arrow Beak Inner Fill */}
          <span
            aria-hidden="true"
            className={`ielts-selection-arrow-inner pointer-events-none absolute left-1/2 h-0 w-0 -translate-x-1/2 border-x-[6px] border-x-transparent ${
              pendingSelection.placement === "below"
                ? "bottom-full border-b-[6px] border-b-white"
                : "top-full border-t-[6px] border-t-white"
            }`}
          />

          <div className="grid grid-cols-2 divide-x divide-gray-200">
            {/* Note Button */}
            <button
              type="button"
              onClick={() => addAnnotation("note")}
              aria-label="Add a note to selected text"
              className="flex h-[48px] flex-col items-center justify-center gap-0.5 rounded-[1px] bg-white text-[11px] font-medium text-[#1c629e] hover:bg-[#f2f6fa] transition-colors"
            >
              <span className="flex h-[16px] w-[16px] items-center justify-center rounded-[1px] bg-[#424f60] text-[13px] font-bold leading-none text-white shadow-xs">
                “
              </span>
              <span>Note</span>
            </button>

            {/* Highlight Button */}
            <button
              type="button"
              onClick={() => addAnnotation("highlight")}
              aria-label="Highlight selected text"
              className="flex h-[48px] flex-col items-center justify-center gap-0.5 rounded-[1px] bg-white text-[11px] font-medium text-[#1c629e] hover:bg-[#f2f6fa] transition-colors"
            >
              <span className="relative h-[16px] w-[16px]" aria-hidden="true">
                <span className="absolute bottom-0 left-0 h-[3.5px] w-[16px] rounded-[0.5px] bg-[#f0cc35]" />
                <span className="absolute bottom-1 left-[7px] h-[10px] w-[2.5px] -rotate-12 rounded-[0.5px] bg-[#4b5563]" />
              </span>
              <span>Highlight</span>
            </button>
          </div>
        </div>
      )}

      <ListeningQuestionBookmarkProvider
        activeQuestion={activeQuestion}
        activePattern={focusedPattern}
      >
        <main
          ref={mainRef}
          onMouseUp={handleTextSelection}
          className={`ielts-listening-preview-content relative min-h-0 flex-1 overflow-y-auto px-10 pb-28 pt-6 transition-[margin] duration-200 ${
            showNotes ? "sm:mr-[350px]" : ""
          }`}
        >
        <div className="w-full">
          {/* Official Part 1 Instruction Banner */}
          <div className="rounded-[4px] border border-[#e5e5e2] bg-[#f5f5f2] px-5 py-3.5 mb-6">
            <h2 className="text-[14.5px] font-bold text-gray-900 leading-tight">
              Part {activePart}
            </h2>
            <p className="text-[13.5px] text-gray-700 mt-1 leading-tight">
              {activePart === 1
                ? "Listen and answer questions 1–10."
                : activePart === 2
                  ? "Listen and answer questions 11–20."
                  : activePart === 3
                    ? "Listen and answer questions 21–30."
                    : "Listen and answer questions 31–40."}
            </p>
          </div>

          {fullListeningMock ? (
            <ClientFullListeningPart
              part={fullListeningMock.parts[activePart - 1]}
              activeQuestion={activeQuestion}
              answers={answers}
              onAnswer={updateAnswer}
              onActivate={setActiveQuestion}
              registerInput={(number, element) => {
                inputRefs.current[number] = element;
              }}
              flaggedQuestions={flaggedQuestions}
              onToggleFlag={toggleFlag}
            />
          ) : activePart === 1 ? (
            <section
              className="pb-12"
              aria-labelledby="note-completion-heading"
            >
              <ListeningQuestionTypeBanner
                code="L-01"
                name="Note Completion"
                exampleCount={10}
              />
              <div className="w-full max-w-[800px]">
                  <h2
                    id="note-completion-heading"
                    className="text-[16px] font-bold"
                  >
                    Questions 1 - 6
                  </h2>

                  <div className="mt-6 space-y-3 text-[15px]">
                    <p className="italic">Complete the notes below.</p>
                    <p className="italic">
                      Write <strong>NO MORE THAN TWO WORDS AND/OR A NUMBER</strong> for each answer.
                    </p>
                  </div>

                  <h3 className="mt-8 text-center text-[17px] font-bold uppercase">
                    Preston Park Run
                  </h3>

                  <div className="mt-5 text-[15px]">
                    <p className="font-semibold text-gray-800">Details of run</p>
                    <p className="mt-3 italic text-gray-600">Example</p>
                    <p className="mt-2">
                      Day of Park Run: <span className="ml-2 border-b border-gray-700 px-4 font-medium">Saturday</span>
                    </p>

                    <div className="mt-6 space-y-4">
                      <div className="grid grid-cols-[160px_1fr] items-center gap-3">
                        <span>Start of run:</span>
                        <span className="flex items-center gap-2">
                          <span>in front of the</span>
                          <AnswerField
                            number={1}
                            value={answers[1] ?? ""}
                            onChange={(value) => updateAnswer(1, value)}
                            onFocus={() => {
                              setActiveQuestion(1);
                              setFocusedPattern("default");
                            }}
                            inputRef={(element) => {
                              inputRefs.current[1] = element;
                            }}
                            bookmarked={flaggedQuestions.has(1)}
                            onBookmarkToggle={toggleFlag}
                          />
                        </span>
                      </div>

                      <div className="grid grid-cols-[160px_1fr] items-center gap-3">
                        <span>Time of start:</span>
                        <AnswerField
                          number={2}
                          value={answers[2] ?? ""}
                          onChange={(value) => updateAnswer(2, value)}
                          onFocus={() => {
                            setActiveQuestion(2);
                            setFocusedPattern("default");
                          }}
                          inputRef={(element) => {
                            inputRefs.current[2] = element;
                          }}
                          bookmarked={flaggedQuestions.has(2)}
                          onBookmarkToggle={toggleFlag}
                        />
                      </div>

                      <div className="grid grid-cols-[160px_1fr] items-center gap-3">
                        <span>Length of run:</span>
                        <AnswerField
                          number={3}
                          value={answers[3] ?? ""}
                          onChange={(value) => updateAnswer(3, value)}
                          onFocus={() => {
                            setActiveQuestion(3);
                            setFocusedPattern("default");
                          }}
                          inputRef={(element) => {
                            inputRefs.current[3] = element;
                          }}
                          bookmarked={flaggedQuestions.has(3)}
                          onBookmarkToggle={toggleFlag}
                        />
                      </div>

                      <div className="grid grid-cols-[160px_1fr] items-center gap-3">
                        <span>At end of run:</span>
                        <span className="flex items-center gap-2">
                          <span>volunteer scans</span>
                          <AnswerField
                            number={4}
                            value={answers[4] ?? ""}
                            onChange={(value) => updateAnswer(4, value)}
                            onFocus={() => {
                              setActiveQuestion(4);
                              setFocusedPattern("default");
                            }}
                            inputRef={(element) => {
                              inputRefs.current[4] = element;
                            }}
                            bookmarked={flaggedQuestions.has(4)}
                            onBookmarkToggle={toggleFlag}
                          />
                        </span>
                      </div>

                      <div className="grid grid-cols-[160px_1fr] items-center gap-3">
                        <span>Best way to register:</span>
                        <span className="flex items-center gap-2">
                          <span>on the</span>
                          <AnswerField
                            number={5}
                            value={answers[5] ?? ""}
                            onChange={(value) => updateAnswer(5, value)}
                            onFocus={() => {
                              setActiveQuestion(5);
                              setFocusedPattern("default");
                            }}
                            inputRef={(element) => {
                              inputRefs.current[5] = element;
                            }}
                            bookmarked={flaggedQuestions.has(5)}
                            onBookmarkToggle={toggleFlag}
                          />
                        </span>
                      </div>

                      <div className="grid grid-cols-[160px_1fr] items-center gap-3">
                        <span>Cost of run:</span>
                        <span className="flex items-center gap-2">
                          <span>£</span>
                          <AnswerField
                            number={6}
                            value={answers[6] ?? ""}
                            onChange={(value) => updateAnswer(6, value)}
                            onFocus={() => {
                              setActiveQuestion(6);
                              setFocusedPattern("default");
                            }}
                            inputRef={(element) => {
                              inputRefs.current[6] = element;
                            }}
                            bookmarked={flaggedQuestions.has(6)}
                            onBookmarkToggle={toggleFlag}
                          />
                        </span>
                      </div>
                    </div>

                    <div className="mt-10">
                      <h2 className="text-[16px] font-bold">Questions 7 - 10</h2>
                      <div className="mt-4 space-y-2">
                        <p className="italic">Complete the notes below.</p>
                        <p className="italic">
                          Write <strong>NO MORE THAN TWO WORDS AND/OR A NUMBER</strong> for each answer.
                        </p>
                      </div>

                      <h3 className="mt-6 text-[16px] font-bold">Volunteering</h3>

                      <div className="mt-4 space-y-4">
                        <div className="flex items-center gap-2">
                          <span>Contact name: Pete</span>
                          <AnswerField
                            number={7}
                            value={answers[7] ?? ""}
                            onChange={(value) => updateAnswer(7, value)}
                            onFocus={() => {
                              setActiveQuestion(7);
                              setFocusedPattern("default");
                            }}
                            inputRef={(element) => {
                              inputRefs.current[7] = element;
                            }}
                            bookmarked={flaggedQuestions.has(7)}
                            onBookmarkToggle={toggleFlag}
                          />
                        </div>

                        <div className="flex items-center gap-2">
                          <span>Phone number:</span>
                          <AnswerField
                            number={8}
                            value={answers[8] ?? ""}
                            onChange={(value) => updateAnswer(8, value)}
                            onFocus={() => {
                              setActiveQuestion(8);
                              setFocusedPattern("default");
                            }}
                            inputRef={(element) => {
                              inputRefs.current[8] = element;
                            }}
                            bookmarked={flaggedQuestions.has(8)}
                            onBookmarkToggle={toggleFlag}
                          />
                        </div>

                        <p className="pt-1">Activities: setting up course</p>

                        <div className="flex items-center gap-2">
                          <AnswerField
                            number={9}
                            value={answers[9] ?? ""}
                            onChange={(value) => updateAnswer(9, value)}
                            onFocus={() => {
                              setActiveQuestion(9);
                              setFocusedPattern("default");
                            }}
                            inputRef={(element) => {
                              inputRefs.current[9] = element;
                            }}
                            bookmarked={flaggedQuestions.has(9)}
                            onBookmarkToggle={toggleFlag}
                          />
                          <span>the runners</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <AnswerField
                            number={10}
                            value={answers[10] ?? ""}
                            onChange={(value) => updateAnswer(10, value)}
                            onFocus={() => {
                              setActiveQuestion(10);
                              setFocusedPattern("default");
                            }}
                            inputRef={(element) => {
                              inputRefs.current[10] = element;
                            }}
                            bookmarked={flaggedQuestions.has(10)}
                            onBookmarkToggle={toggleFlag}
                          />
                          <span>for the weekly report</span>
                        </div>
                      </div>
                    </div>
                  </div>
              </div>
            </section>
          ) : activePart === 2 ? (
          <div className="space-y-16">
            <div>
              <ListeningTableCompletionPanel
                answers={answers}
                bookmarkedQuestions={flaggedQuestions}
                onAnswerChange={(num, val) => {
                  updateAnswer(num, val);
                  setFocusedPattern("table");
                }}
                onAnswerFocus={(num) => {
                  setActiveQuestion(num);
                  setFocusedPattern("table");
                }}
                onBookmarkToggle={toggleFlag}
                registerInput={(number, element) => {
                  inputRefs.current[number] = element;
                }}
              />
              <ListeningSentenceCompletionPanel
                answers={answers}
                bookmarkedQuestions={flaggedQuestions}
                onAnswerChange={(num, val) => {
                  updateAnswer(num, val);
                  setFocusedPattern("sentence");
                }}
                onAnswerFocus={(num) => {
                  setActiveQuestion(num);
                  setFocusedPattern("sentence");
                }}
                onBookmarkToggle={toggleFlag}
                registerInput={(number, element) => {
                  inputRefs.current[number] = element;
                }}
              />
            </div>

            <div className="border-t-2 border-dashed border-gray-300 pt-10">
              <div className="mb-8 flex items-center gap-3">
                <span className="rounded bg-sky-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-sky-900">
                  Part 2 · List Matching & Map Labelling
                </span>
                <div className="h-px flex-1 bg-gray-200" />
              </div>

              <ListeningListMatchingPanel
                activeQuestion={activeQuestion}
                answers={listAnswers}
                bookmarkedQuestions={flaggedQuestions}
                onAnswerChange={(num, val) => {
                  updateListAnswer(num, val);
                  setFocusedPattern("list-matching");
                }}
                onAnswerFocus={(num) => {
                  setActiveQuestion(num);
                  setFocusedPattern("list-matching");
                }}
                onBookmarkToggle={toggleFlag}
                registerInput={(number, element) => {
                  listInputRefs.current[number] = element;
                }}
              />
              <ListeningMapLabellingPanel
                activeQuestion={activeQuestion}
                answers={listAnswers}
                bookmarkedQuestions={flaggedQuestions}
                onAnswerChange={(num, val) => {
                  updateListAnswer(num, val);
                  setFocusedPattern("map-labelling");
                }}
                onAnswerFocus={(num) => {
                  setActiveQuestion(num);
                  setFocusedPattern("map-labelling");
                }}
                onBookmarkToggle={toggleFlag}
                registerInput={(number, element) => {
                  listInputRefs.current[number] = element;
                }}
              />
            </div>
          </div>
        ) : activePart === 3 ? (
          <div>
            <ListeningMcqPanel
              activeQuestion={activeQuestion}
              answers={answers}
              bookmarkedQuestions={flaggedQuestions}
              onAnswerChange={updateAnswer}
              onAnswerFocus={setActiveQuestion}
              onBookmarkToggle={toggleFlag}
              registerInput={(number, element) => {
                inputRefs.current[number] = element;
              }}
            />
            <ListeningSummaryCompletionPanel
              answers={answers}
              bookmarkedQuestions={flaggedQuestions}
              onAnswerChange={updateAnswer}
              onAnswerFocus={setActiveQuestion}
              onBookmarkToggle={toggleFlag}
              registerInput={(number, element) => {
                inputRefs.current[number] = element;
              }}
            />
            <ListeningFlowChartCompletionPanel
              answers={answers}
              bookmarkedQuestions={flaggedQuestions}
              onAnswerChange={updateAnswer}
              onAnswerFocus={setActiveQuestion}
              onBookmarkToggle={toggleFlag}
              registerInput={(number, element) => {
                inputRefs.current[number] = element;
              }}
            />
          </div>
        ) : (
          <div>
            <ListeningShortAnswerPanel
              answers={answers}
              bookmarkedQuestions={flaggedQuestions}
              onAnswerChange={updateAnswer}
              onAnswerFocus={setActiveQuestion}
              onBookmarkToggle={toggleFlag}
              registerInput={(number, element) => {
                inputRefs.current[number] = element;
              }}
            />
            <ListeningFactorMatchingPanel
              answers={answers}
              bookmarkedQuestions={flaggedQuestions}
              onAnswerChange={updateAnswer}
              onAnswerFocus={setActiveQuestion}
              onBookmarkToggle={toggleFlag}
              registerTarget={(number, element) => {
                inputRefs.current[number] = element;
              }}
            />
          </div>
        )}
        </div>
        </main>
      </ListeningQuestionBookmarkProvider>

      <ClientExamNavigationButtons
        className="fixed bottom-[168px] right-6 z-40"
        onPrevious={() => goToQuestion(Math.max(1, activeQuestion - 1))}
        onNext={() => goToQuestion(Math.min(40, activeQuestion + 1))}
        hasPrevious={activeQuestion > 1}
        hasNext={activeQuestion < 40}
      />

      <ClientExamSectionFooter
        sections={footerSections}
        activeItem={activeQuestion}
        onItemSelect={goToQuestion}
        flaggedItems={flaggedQuestions}
        onPreviousItem={() => goToQuestion(Math.max(1, activeQuestion - 1))}
        onNextItem={() => goToQuestion(Math.min(40, activeQuestion + 1))}
        hasPrevious={activeQuestion > 1}
        hasNext={activeQuestion < 40}
        soundEnabled
        soundActive={isPlaying}
        soundVolume={listeningVolume}
        onSoundToggle={togglePlayback}
        onSoundVolumeChange={changeListeningVolume}
      />

      {showSubmitConfirm ? (
        <div className="absolute inset-0 z-[70] flex items-center justify-center bg-black/60 px-4">
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="listening-submit-title"
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
          >
            <h2 id="listening-submit-title" className="text-xl font-bold text-slate-900">
              Submit Listening Preview?
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              You answered {answeredCount} of 40 questions.
              Submitting will score your answers and return to the exam overview,
              where Reading will unlock.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowSubmitConfirm(false)}
                className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50"
              >
                Continue test
              </button>
              <button
                type="button"
                onClick={submitPreview}
                className="rounded-lg bg-[#c93542] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#a92733]"
              >
                Submit Listening
              </button>
            </div>
          </section>
        </div>
      ) : null}
    </div>
  );
};

function readStoredAnswers(draftKey: string): AnswerMap {
  if (typeof window === "undefined") return {};
  try {
    const parsed = JSON.parse(
      window.localStorage.getItem(draftKey) ?? "{}",
    );
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
    return Object.fromEntries(
      Object.entries(parsed).flatMap(([number, value]) => {
        const numericNumber = Number(number);
        return Number.isInteger(numericNumber) && typeof value === "string"
          ? [[numericNumber, value]]
          : [];
      }),
    );
  } catch {
    return {};
  }
}

const QUICK_TEXT_SIZE_OPTIONS: ReadonlyArray<[
  ClientExamTextSize,
  string,
]> = [
  ["base", "A"],
  ["lg", "A+"],
  ["xl", "A++"],
];

export default ClientPreviewListeningPage;
