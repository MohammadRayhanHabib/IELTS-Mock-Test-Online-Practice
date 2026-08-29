import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import toast from "react-hot-toast";
import {
  FiCheck,
  FiChevronLeft,
  FiChevronRight,
  FiEye,
  FiSend,
  FiType,
  FiX,
} from "react-icons/fi";
import { mockExamApi, IMockExam, IMockExamAttempt } from "../../api/mockExam";
import {
  readingApi,
  IReadingTest,
  IReadingQuestionStudent,
  IReadingAnswerEntry,
  ReadingQuestionType,
  countFlowchartGapTokens,
  countNoteCompletionGaps,
  countTableGapTokens,
} from "../../api/reading";
import {
  getListeningTest,
  startListeningAttempt,
  submitListeningAttempt,
} from "../../api/listening";
import ListeningWorkspace from "../../components/listening/ListeningWorkspace";
import ClientListeningExamHeader from "../../components/listening/ClientListeningExamHeader";
import ClientExamSectionFooter, {
  ClientExamFooterSection,
} from "../../components/exam/ClientExamSectionFooter";
import ClientExamNavigationButtons from "../../components/exam/ClientExamNavigationButtons";
import {
  ReadingHeadingBank,
  ReadingHeadingDropZone,
  ReadingQuestionRenderer,
} from "../../modules/reading/questions";
import {
  ReadingQuestionBookmarkButton,
  ReadingNotesDrawer,
  ReadingSelectionToolbar,
  useReadingTextAnnotations,
  type ReadingAnnotation,
} from "../../modules/reading/annotations";
import {
  writingApi,
  IWritingModule,
  WritingSessionMode,
} from "../../api/writing";
import { PageLoader } from "../../components/ui/Spinner";
import {
  READING_PART_1_DEMO_QUESTIONS,
  READING_PART_1_SHOWCASE_ATTEMPT,
  READING_PART_1_SHOWCASE_EXAM,
  READING_PART_1_SHOWCASE_TEST,
  READING_PART_2_DEMO_QUESTIONS,
  READING_PART_2_SHOWCASE_TEST,
  READING_PART_3_DEMO_QUESTIONS,
  READING_PART_3_SHOWCASE_TEST,
} from "../../data/readingPart1Showcase";
import {
  CLIENT_READING_RESULT_KEY,
  scoreClientReadingAnswers,
} from "../../data/clientPreviewReadingResult";
import { getClientPreviewFullReadingMock } from "../../data/clientPreviewFullReadingMocks";

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

type ExamSection =
  | "intro"
  | "listening"
  | "reading"
  | "writing"
  | "speaking"
  | "done";

type ExamOptionsView = "menu" | "contrast" | "text-size";
type ExamContrastMode =
  | "black-on-white"
  | "white-on-black"
  | "yellow-on-black";
type ExamTextSize = "base" | "lg" | "xl";

interface ReadingPart {
  testId: string;
  test: IReadingTest;
  questions: IReadingQuestionStudent[];
  attemptId: string | null;
  offset: number; // how many questions precede this part
}

// ─────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────

interface IELTSExamPageProps {
  /** Local, read-only-data client preview. It never calls or mutates the API. */
  showcase?: boolean;
}

const parseShowcaseRoute = () => {
  if (typeof window === "undefined") {
    return { testNumber: 1, initialQuestion: 1 };
  }

  const params = new URLSearchParams(window.location.search);
  const requestedTest = Number.parseInt(params.get("test") ?? "1", 10);
  const requestedQuestion = Number.parseInt(
    params.get("q") ?? params.get("question") ?? "1",
    10,
  );

  return {
    testNumber:
      Number.isFinite(requestedTest) && requestedTest >= 1
        ? requestedTest
        : 1,
    initialQuestion:
      Number.isFinite(requestedQuestion) && requestedQuestion >= 1
        ? Math.min(40, requestedQuestion)
        : 1,
  };
};

const IELTSExamPage: React.FC<IELTSExamPageProps> = ({ showcase = false }) => {
  const { examId } = useParams<{ examId: string }>();
  const navigate = useNavigate();
  const showcaseRoute = useMemo(parseShowcaseRoute, []);

  const [pageState, setPageState] = useState<"loading" | "ready">("loading");
  const [exam, setExam] = useState<IMockExam | null>(null);
  const [mockAttempt, setMockAttempt] = useState<IMockExamAttempt | null>(null);
  const [section, setSection] = useState<ExamSection>("intro");

  // ── Reading state ──────────────────────────────────────────
  const [readingParts, setReadingParts] = useState<ReadingPart[]>([]);
  const [readingAnswers, setReadingAnswers] = useState<
    Record<string, string | string[]>
  >({});
  const [activeQNum, setActiveQNum] = useState(1); // 1-indexed across all parts
  const [readingSecondsLeft, setReadingSecondsLeft] = useState(0);
  const [flaggedReadingQuestions, setFlaggedReadingQuestions] = useState<
    Set<number>
  >(new Set());
  const [readingAnnotations, setReadingAnnotations] = useState<
    ReadingAnnotation[]
  >([]);
  const [readingAnnotationDrafts, setReadingAnnotationDrafts] = useState<
    Record<string, string>
  >({});
  const [activeReadingNoteId, setActiveReadingNoteId] = useState<string | null>(
    null,
  );
  const [deletingReadingNoteId, setDeletingReadingNoteId] = useState<
    string | null
  >(null);
  const [paused, setPaused] = useState(false);
  const readingTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const readingAutoSaveRef = useRef<ReturnType<typeof setInterval> | null>(
    null,
  );
  const sectionBootstrappedRef = useRef<ExamSection | null>(null);
  const pausedRef = useRef(paused);
  const readingAnswersRef = useRef(readingAnswers);
  readingAnswersRef.current = readingAnswers;

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  // ── Listening state ────────────────────────────────────────
  const [listeningTest, setListeningTest] = useState<any>(null);
  const [listeningAnswers, setListeningAnswers] = useState<
    Record<string, string>
  >({});
  const listeningAnswersRef = useRef(listeningAnswers);
  listeningAnswersRef.current = listeningAnswers;
  const [listeningActiveSection, setListeningActiveSection] = useState(0);
  const [listeningSecondsLeft, setListeningSecondsLeft] = useState(0);
  const listeningTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const listeningAttemptIdRef = useRef<string | null>(null);

  // ── Writing state ──────────────────────────────────────────
  const [writingModules, setWritingModules] = useState<IWritingModule[]>([]);
  const [writingSessionIds, setWritingSessionIds] = useState<string[]>([]);
  const [writingTexts, setWritingTexts] = useState<string[]>(["", ""]);
  const [activeWritingTask, setActiveWritingTask] = useState(0);
  const [writingSecondsLeft, setWritingSecondsLeft] = useState(0);
  const writingTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── UI shared ──────────────────────────────────────────────
  const [showSettings, setShowSettings] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [notes, setNotes] = useState("");
  const [fontSize, setFontSize] = useState<ExamTextSize>("base");
  const [contrastMode, setContrastMode] =
    useState<ExamContrastMode>("black-on-white");
  const [optionsView, setOptionsView] = useState<ExamOptionsView | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!optionsView) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOptionsView(null);
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [optionsView]);

  // ── Load exam + start attempt ──────────────────────────────
  const initExam = useCallback(async () => {
    if (showcase) {
      const fullMock = getClientPreviewFullReadingMock(showcaseRoute.testNumber);
      if (fullMock) {
        setExam(fullMock.exam);
        setMockAttempt(fullMock.attempt);
        setReadingParts(
          fullMock.parts.map((part) => ({
            testId: part.test._id,
            test: part.test,
            questions: part.questions,
            attemptId: null,
            offset: part.offset,
          })),
        );
        setReadingSecondsLeft(fullMock.exam.readingDuration * 60);
        setActiveQNum(showcaseRoute.initialQuestion);
        setSection("reading");
        setPageState("ready");
        return;
      }

      setExam(READING_PART_1_SHOWCASE_EXAM);
      setMockAttempt(READING_PART_1_SHOWCASE_ATTEMPT);
      setReadingParts([
        {
          testId: READING_PART_1_SHOWCASE_TEST._id,
          test: READING_PART_1_SHOWCASE_TEST,
          questions: READING_PART_1_DEMO_QUESTIONS,
          attemptId: null,
          offset: 0,
        },
        {
          testId: READING_PART_2_SHOWCASE_TEST._id,
          test: READING_PART_2_SHOWCASE_TEST,
          questions: READING_PART_2_DEMO_QUESTIONS,
          attemptId: null,
          offset: 13,
        },
        {
          testId: READING_PART_3_SHOWCASE_TEST._id,
          test: READING_PART_3_SHOWCASE_TEST,
          questions: READING_PART_3_DEMO_QUESTIONS,
          attemptId: null,
          offset: 26,
        },
      ]);
      setReadingSecondsLeft(READING_PART_1_SHOWCASE_EXAM.readingDuration * 60);
      setActiveQNum(showcaseRoute.initialQuestion);
      setSection("reading");
      setPageState("ready");
      return;
    }
    if (!examId) return;
    try {
      const [examRes, attemptRes] = await Promise.all([
        mockExamApi.getExam(examId),
        mockExamApi.startAttempt(examId),
      ]);
      const e = examRes.data.data!;
      const { attempt } = attemptRes.data.data!;
      setExam(e);
      setMockAttempt(attempt);

      // Determine section from status
      const statusMap: Record<string, ExamSection> = {
        in_progress: "intro",
        listening_done: "reading",
        reading_done: "writing",
        writing_done: "speaking",
        completed: "done",
      };
      setSection(statusMap[attempt.status] ?? "intro");
      setReadingSecondsLeft(e.readingDuration * 60);
      setListeningSecondsLeft(e.listeningDuration * 60);
      setWritingSecondsLeft(e.writingDuration * 60);
      setPageState("ready");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to load exam");
    }
  }, [
    examId,
    showcase,
    showcaseRoute.initialQuestion,
    showcaseRoute.testNumber,
  ]);

  useEffect(() => {
    initExam();
  }, [initExam]);

  // ── Start Reading (listening submit chains into this) ─────
  const startReading = useCallback(async () => {
    if (!exam) return;
    const partIds = [
      exam.readingPart1Id,
      exam.readingPart2Id,
      exam.readingPart3Id,
    ].filter(Boolean) as string[];
    if (!partIds.length) {
      setSection("writing");
      return;
    }
    try {
      const loaded = await Promise.all(
        partIds.map(async (testId) => {
          const [testRes, startRes] = await Promise.all([
            readingApi.getTest(testId),
            readingApi.startAttempt(testId),
          ]);
          return {
            testId,
            test: testRes.data.data!.test,
            questions: testRes.data.data!.questions,
            attemptId: startRes.data.data!.attempt._id,
            offset: 0, // computed below
          } as ReadingPart;
        }),
      );
      // Compute offsets
      let off = 0;
      const withOffsets = loaded.map((p) => {
        const result = { ...p, offset: off };
        off += p.questions.length;
        return result;
      });
      setReadingParts(withOffsets);
      setActiveQNum(1);
      setSection("reading");
      startSectionTimer(
        readingTimerRef,
        readingSecondsLeft,
        setReadingSecondsLeft,
        handleReadingTimeout,
      );
      // Auto-save
      readingAutoSaveRef.current = setInterval(() => {
        autoSaveReading(readingAnswersRef.current, withOffsets);
      }, 30_000);
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || "Failed to start reading section",
      );
    }
  }, [exam, readingSecondsLeft]);

  const submitListeningSection = useCallback(async () => {
    if (!exam?.listeningTestId) return;
    setSubmitting(true);
    try {
      const result = await submitListeningAttempt(
        exam.listeningTestId,
        listeningAnswersRef.current,
        {
          attemptId: listeningAttemptIdRef.current ?? undefined,
          mode: "exam",
        },
      );
      const raw = result.data?.data?._id;
      const listeningAttemptId =
        raw != null
          ? typeof raw === "string"
            ? raw
            : String(raw)
          : undefined;
      if (mockAttempt) {
        const updated = await mockExamApi.updateAttempt(mockAttempt._id, {
          listeningAttemptId,
          listeningScore: result.data?.data?.score,
          listeningTotalScore: result.data?.data?.totalQuestions,
          listeningBand: result.data?.data?.percentage
            ? Math.round((result.data.data.percentage / 100) * 9 * 2) / 2
            : undefined,
          status: "listening_done",
        });
        setMockAttempt(updated.data.data!);
      }
      clearInterval(listeningTimerRef.current!);
      await startReading();
    } catch {
      toast.error("Failed to submit listening");
    } finally {
      setSubmitting(false);
    }
  }, [exam, mockAttempt, startReading]);

  const handleListeningTimeout = useCallback(async () => {
    toast("⏰ Listening time's up!", { icon: "⏰" });
    await submitListeningSection();
  }, [submitListeningSection]);

  const startListening = useCallback(async () => {
    if (!exam?.listeningTestId || !mockAttempt) return;
    try {
      const startRes = await startListeningAttempt(
        exam.listeningTestId,
        "exam",
      );
      const payload = startRes.data.data;
      if (payload?.test) {
        setListeningTest(payload.test);
      } else {
        const testRes = await getListeningTest(exam.listeningTestId);
        setListeningTest(testRes.data.data ?? null);
      }
      const att =
        payload?.attempt ??
        (payload &&
        typeof payload === "object" &&
        "_id" in payload &&
        "userId" in payload
          ? payload
          : null);
      if (att && typeof att === "object" && "_id" in att && att._id) {
        listeningAttemptIdRef.current =
          typeof att._id === "string" ? att._id : String(att._id);
      }
      setListeningActiveSection(0);
      setSection("listening");
      const nextListeningSeconds = exam.listeningDuration * 60;
      setListeningSecondsLeft(nextListeningSeconds);
      startSectionTimer(
        listeningTimerRef,
        nextListeningSeconds,
        setListeningSecondsLeft,
        handleListeningTimeout,
      );
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ?? "Failed to start listening section",
      );
    }
  }, [exam, mockAttempt, handleListeningTimeout]);

  const handleReadingTimeout = useCallback(() => {
    toast("⏰ Reading time's up!", { icon: "⏰" });
    submitReadingSection();
  }, []);

  const autoSaveReading = async (
    answers: Record<string, string | string[]>,
    parts: ReadingPart[],
  ) => {
    for (const part of parts) {
      if (!part.attemptId) continue;
      const entries: IReadingAnswerEntry[] = part.questions
        .filter((q) => answers[q._id] !== undefined)
        .map((q) => ({ questionId: q._id, answer: answers[q._id] }));
      if (entries.length) {
        readingApi.autoSave(part.attemptId, entries).catch(() => {});
      }
    }
  };

  const calcReadingBand = (score: number) => {
    if (score >= 39) return 9.0;
    if (score >= 37) return 8.5;
    if (score >= 35) return 8.0;
    if (score >= 33) return 7.5;
    if (score >= 30) return 7.0;
    if (score >= 27) return 6.5;
    if (score >= 23) return 6.0;
    if (score >= 19) return 5.5;
    if (score >= 15) return 5.0;
    if (score >= 13) return 4.5;
    if (score >= 10) return 4.0;
    return 3.5;
  };

  const submitReadingSection = useCallback(async () => {
    if (!mockAttempt || !readingParts.length) return;
    if (mockAttempt.status === "reading_done") {
      await startWriting();
      return;
    }
    setSubmitting(true);
    clearInterval(readingTimerRef.current!);
    clearInterval(readingAutoSaveRef.current!);
    try {
      let totalScore = 0;
      let totalPossible = 0;
      const attemptIds: string[] = [];
      for (const part of readingParts) {
        if (!part.attemptId) continue;
        const entries: IReadingAnswerEntry[] = part.questions.map((q) => ({
          questionId: q._id,
          answer: readingAnswersRef.current[q._id] ?? "",
        }));
        const res = await readingApi.submitAttempt(part.attemptId, entries);
        const submitted = res.data.data!;
        totalScore += submitted.score ?? 0;
        totalPossible += submitted.totalScore ?? part.questions.length;
        attemptIds.push(part.attemptId);
      }
      const readingBand = calcReadingBand(totalScore);
      const updated = await mockExamApi.updateAttempt(mockAttempt._id, {
        readingAttempt1Id: attemptIds[0],
        readingAttempt2Id: attemptIds[1],
        readingAttempt3Id: attemptIds[2],
        readingScore: totalScore,
        readingTotalScore: totalPossible,
        readingBand,
        status: "reading_done",
      });
      setMockAttempt(updated.data.data!);
      toast.success("Reading submitted!");
      await startWriting();
    } catch {
      toast.error("Failed to submit reading");
    } finally {
      setSubmitting(false);
    }
  }, [mockAttempt, readingParts]);

  // ── Start Writing ──────────────────────────────────────────
  const startWriting = useCallback(async () => {
    if (!exam) return;
    const moduleIds = [exam.writingTask1Id, exam.writingTask2Id].filter(
      Boolean,
    ) as string[];
    if (!moduleIds.length) {
      setSection("speaking");
      return;
    }
    try {
      const modules = await Promise.all(
        moduleIds.map((id) =>
          writingApi.getModule(id).then((r) => r.data.data!),
        ),
      );
      const sessions = await Promise.all(
        moduleIds.map((id) =>
          writingApi
            .startSession(id, WritingSessionMode.EXAM, {
              allowRetake: true,
            })
            .then((r) => r.data.data!._id),
        ),
      );
      setWritingModules(modules);
      setWritingSessionIds(sessions);
      setWritingTexts((prev) =>
        prev
          .slice(0, modules.length)
          .concat(
            Array.from(
              { length: Math.max(0, modules.length - prev.length) },
              () => "",
            ),
          ),
      );
      setActiveWritingTask(0);
      setSection("writing");
      startSectionTimer(
        writingTimerRef,
        writingSecondsLeft,
        setWritingSecondsLeft,
        handleWritingTimeout,
      );
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || "Failed to start writing section",
      );
    }
  }, [exam, writingSecondsLeft]);

  const handleWritingTimeout = useCallback(() => {
    toast("⏰ Writing time's up!", { icon: "⏰" });
    void submitWritingSection();
  }, []);

  const submitWritingSection = useCallback(async () => {
    if (!mockAttempt || !writingSessionIds.length) return;
    setSubmitting(true);
    clearInterval(writingTimerRef.current!);
    try {
      await Promise.all(
        writingSessionIds.map((sessionId, index) =>
          writingApi.submit(sessionId, writingTexts[index] ?? ""),
        ),
      );
      const updated = await mockExamApi.updateAttempt(mockAttempt._id, {
        status: "writing_done",
      });
      setMockAttempt(updated.data.data!);
      setSection("speaking");
    } catch {
      toast.error("Failed to submit writing");
    } finally {
      setSubmitting(false);
    }
  }, [mockAttempt, writingSessionIds, writingTexts]);

  // Resume mid-exam sections (e.g. reading after listening) without re-clicking Start
  useEffect(() => {
    if (pageState !== "ready" || !exam || !mockAttempt) return;
    if (section === "intro" || section === "done") return;
    if (sectionBootstrappedRef.current === section) return;

    if (section === "reading" && readingParts.length === 0) {
      sectionBootstrappedRef.current = section;
      void startReading();
    } else if (section === "writing" && writingModules.length === 0) {
      sectionBootstrappedRef.current = section;
      void startWriting();
    }
  }, [
    pageState,
    exam,
    mockAttempt,
    section,
    readingParts.length,
    writingModules.length,
    startReading,
    startWriting,
  ]);

  // ── Complete exam ──────────────────────────────────────────
  const completeExam = useCallback(async () => {
    if (!mockAttempt) return;
    try {
      const updated = await mockExamApi.updateAttempt(mockAttempt._id, {
        status: "completed",
      });
      setMockAttempt(updated.data.data!);
      navigate(`/exam/result/${mockAttempt._id}`);
    } catch {
      toast.error("Failed to complete exam");
    }
  }, [mockAttempt, navigate]);

  // ─────────────────────────────────────────────────────────
  // Timer helpers
  // ─────────────────────────────────────────────────────────

  function startSectionTimer(
    ref: React.MutableRefObject<ReturnType<typeof setInterval> | null>,
    initialSeconds: number,
    setter: React.Dispatch<React.SetStateAction<number>>,
    onTimeout: () => void,
  ) {
    if (ref.current) clearInterval(ref.current);
    setter(initialSeconds);
    ref.current = setInterval(() => {
      setter((s) => {
        if (pausedRef.current) return s;
        if (s <= 1) {
          clearInterval(ref.current!);
          onTimeout();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  }

  // ─────────────────────────────────────────────────────────
  // Reading helpers
  // ─────────────────────────────────────────────────────────

  const getPartQuestionCount = (part: ReadingPart) =>
    part.test.createdBy === "client-preview"
      ? part.test.totalQuestions
      : part.questions.length;

  const totalReadingQuestions = readingParts.reduce(
    (sum, part) => sum + getPartQuestionCount(part),
    0,
  );

  const getActivePart = () => {
    for (const part of readingParts) {
      const end = part.offset + getPartQuestionCount(part);
      if (activeQNum <= end) return part;
    }
    return readingParts[readingParts.length - 1];
  };

  const getActiveQuestion = (): IReadingQuestionStudent | null => {
    const part = getActivePart();
    if (!part) return null;
    if (part.test.createdBy === "client-preview") {
      return (
        part.questions.find((question) => {
          const start = question.pageNumber ?? part.offset + 1;
          const end = start + Math.max(1, question.marks ?? 1) - 1;
          return activeQNum >= start && activeQNum <= end;
        }) ?? null
      );
    }
    const localIdx = activeQNum - 1 - part.offset;
    return part.questions[localIdx] ?? null;
  };

  const isReadingAnswered = (globalNum: number) => {
    const part = readingParts.find(
      (candidate) =>
        globalNum > candidate.offset &&
        globalNum <= candidate.offset + getPartQuestionCount(candidate),
    );
    if (!part) return false;
    const q =
      part.test.createdBy === "client-preview"
        ? part.questions.find((question) => {
            const start = question.pageNumber ?? part.offset + 1;
            const end = start + Math.max(1, question.marks ?? 1) - 1;
            return globalNum >= start && globalNum <= end;
          })
        : part.questions[globalNum - 1 - part.offset];
    if (!q) return false;
    const a = readingAnswers[q._id];
    if (!a) return false;
    if (Array.isArray(a)) {
      const answerIndex = Math.max(0, globalNum - (q.pageNumber ?? globalNum));
      return Boolean(a[answerIndex]?.trim());
    }
    return a.trim().length > 0;
  };

  const setReadingAnswer = (qId: string, val: string | string[]) =>
    setReadingAnswers((prev) => ({ ...prev, [qId]: val }));

  const toggleReadingFlag = (questionNumber: number) =>
    setFlaggedReadingQuestions((previous) => {
      const next = new Set(previous);
      if (next.has(questionNumber)) next.delete(questionNumber);
      else next.add(questionNumber);
      return next;
    });

  const saveReadingAnnotationNote = (annotationId: string) => {
    const note = (readingAnnotationDrafts[annotationId] ?? "").trim();
    setReadingAnnotations((previous) =>
      previous.map((annotation) =>
        annotation.id === annotationId
          ? { ...annotation, note: note || undefined }
          : annotation,
      ),
    );
    setActiveReadingNoteId(null);
  };

  const deleteReadingAnnotation = (annotationId: string) => {
    setReadingAnnotations((previous) =>
      previous.filter((annotation) => annotation.id !== annotationId),
    );
    setReadingAnnotationDrafts((previous) => {
      const next = { ...previous };
      delete next[annotationId];
      return next;
    });
    setActiveReadingNoteId((current) =>
      current === annotationId ? null : current,
    );
    setDeletingReadingNoteId((current) =>
      current === annotationId ? null : current,
    );
  };

  const getReadingAnnotationPartNumber = (annotation: ReadingAnnotation) =>
    Math.max(
      1,
      readingParts.findIndex((part) => part.testId === annotation.partId) + 1,
    );

  // ─────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────

  if (pageState === "loading") return <PageLoader />;
  if (!exam || !mockAttempt) return null;

  // Section label for header
  const sectionLabel =
    section === "listening"
      ? "Listening"
      : section === "reading"
        ? "Reading"
        : section === "writing"
          ? "Writing"
          : section === "speaking"
            ? "Speaking"
            : "";

  const currentSectionSeconds =
    section === "listening"
      ? listeningSecondsLeft
      : section === "reading"
        ? readingSecondsLeft
        : section === "writing"
          ? writingSecondsLeft
          : 0;

  const testLabel = exam.academicNumber
    ? `C${exam.academicNumber}${exam.testNumber ? ` Test ${exam.testNumber}` : ""} ${sectionLabel}`
    : `${exam.title} ${sectionLabel}`;

  const handleSubmitAction = () => {
    setOptionsView(null);
    if (showcase) {
      const result = scoreClientReadingAnswers(
        readingAnswers,
        Math.max(
          0,
          READING_PART_1_SHOWCASE_EXAM.readingDuration * 60 -
            readingSecondsLeft,
        ),
        Array.from(flaggedReadingQuestions).sort((a, b) => a - b),
        showcaseRoute.testNumber,
      );
      window.sessionStorage.setItem(
        CLIENT_READING_RESULT_KEY,
        JSON.stringify(result),
      );
      navigate(
        `/client-preview/listening/pre-test?test=${showcaseRoute.testNumber}&completed=reading`,
      );
      return;
    }
    if (section === "reading") {
      void submitReadingSection();
    } else if (section === "writing") {
      void submitWritingSection();
    } else if (section === "listening") {
      void submitListeningSection();
    } else {
      void completeExam();
    }
  };

  // ── Intro screen ───────────────────────────────────────────
  if (section === "intro") {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-center z-50">
        <Helmet>
          <title>{exam.title} – IELTS Mock Exam – Lexora</title>
        </Helmet>
        <div className="max-w-2xl w-full mx-4">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-10 text-white text-center space-y-8">
            {/* Logo */}
            <div className="flex items-center justify-center gap-3">
              <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center text-white font-black text-lg">
                L
              </div>
              <div className="text-left">
                <p className="font-black text-lg leading-tight">LEXORA</p>
                <p className="text-xs text-white/60 tracking-widest">ACADEMY</p>
              </div>
            </div>

            <div>
              <h1 className="text-3xl font-black mb-2">{exam.title}</h1>
              {exam.description && (
                <p className="text-white/60 text-sm">{exam.description}</p>
              )}
            </div>

            {/* Sections */}
            <div className="grid grid-cols-2 gap-3">
              {[
                {
                  icon: "🎧",
                  label: "Listening",
                  duration: exam.listeningDuration,
                  enabled: !!exam.listeningTestId,
                },
                {
                  icon: "📖",
                  label: "Reading",
                  duration: exam.readingDuration,
                  enabled: !!(
                    exam.readingPart1Id ||
                    exam.readingPart2Id ||
                    exam.readingPart3Id
                  ),
                },
                {
                  icon: "✍️",
                  label: "Writing",
                  duration: exam.writingDuration,
                  enabled: !!(exam.writingTask1Id || exam.writingTask2Id),
                },
                {
                  icon: "🎙️",
                  label: "Speaking",
                  duration: exam.speakingDuration,
                  enabled: !!exam.speakingTestId,
                },
              ].map(({ icon, label, duration, enabled }) => (
                <div
                  key={label}
                  className={`flex items-center gap-3 p-4 rounded-xl border ${enabled ? "border-white/20 bg-white/10" : "border-white/5 opacity-40"}`}
                >
                  <span className="text-2xl">{icon}</span>
                  <div className="text-left">
                    <p className="font-semibold text-sm">{label}</p>
                    <p className="text-white/50 text-xs">{duration} minutes</p>
                  </div>
                  {enabled && (
                    <FiCheck className="w-4 h-4 text-green-400 ml-auto" />
                  )}
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <p className="text-white/50 text-xs">
                ⚠️ Do not close the browser window during the exam. Your
                progress is auto-saved.
              </p>
              <button
                onClick={exam.listeningTestId ? startListening : startReading}
                className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-2xl text-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                Start Exam →
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Common exam shell ──────────────────────────────────────

  return (
    <div
      translate="no"
      data-gramm="false"
      data-gramm_editor="false"
      data-enable-grammarly="false"
      data-ielts-contrast={contrastMode}
      data-ielts-text-size={fontSize}
      className="notranslate ielts-exam-shell fixed inset-0 z-50 flex flex-col bg-[#f0f0f0]"
    >
      <Helmet>
        <title>{testLabel} – IELTS Exam – Lexora</title>
      </Helmet>

      {/* ── GLOBAL HEADER ───────────────────────────────────── */}
      <ClientListeningExamHeader
        moduleLabel={
          section === "reading"
            ? "Reading"
            : section === "writing"
              ? "Writing"
              : section === "listening"
                ? "Listening"
                : section === "speaking"
                  ? "Speaking"
                  : "Mock Exam"
        }
        candidateLabel={
          showcase
            ? `48887345 · Test ${showcaseRoute.testNumber}`
            : `Candidate ${mockAttempt._id.slice(-8).toUpperCase()}`
        }
        showAudioControls={false}
        isPaused={paused}
        remainingSeconds={
          section === "reading"
            ? readingSecondsLeft
            : currentSectionSeconds
        }
        notesCount={readingAnnotations.filter((a) => Boolean(a.note)).length}
        onPauseToggle={() => setPaused((p) => !p)}
        onSubmit={handleSubmitAction}
        onSaveExit={() => {
          if (showcase) {
            navigate("/client-preview/mock-tests");
            return;
          }
          if (confirm("Save progress and exit?")) navigate("/mock-tests");
        }}
        onOpenSettings={() => {
          setShowNotes(false);
          setOptionsView(null);
          setShowSettings((s) => !s);
        }}
        onOpenOptions={() => {
          setShowSettings(false);
          setDeletingReadingNoteId(null);
          setShowNotes(false);
          setOptionsView("menu");
        }}
        onOpenNotes={() => {
          setShowSettings(false);
          setOptionsView(null);
          setShowNotes((current) => {
            if (current) setDeletingReadingNoteId(null);
            return !current;
          });
        }}
      />

      {/* Pause overlay */}
      {paused && (
        <div className="absolute inset-0 z-50 bg-black/60 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-10 text-center shadow-2xl">
            <p className="text-2xl font-bold text-gray-900 mb-2">Exam Paused</p>
            <p className="text-gray-500 mb-6">
              Your progress is saved. Click Resume to continue.
            </p>
            <button
              onClick={() => setPaused(false)}
              className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
            >
              Resume Exam
            </button>
          </div>
        </div>
      )}

      {/* Settings panel */}
      {showSettings && (
        <div className="absolute top-14 right-4 z-40 bg-white shadow-lg rounded-xl border border-gray-200 p-4 w-56 space-y-3">
          <p className="font-semibold text-gray-800 text-sm">Settings</p>
          <div>
            <p className="text-xs text-gray-500 mb-1">Font Size</p>
            <div className="flex gap-2">
              {(["base", "lg", "xl"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setFontSize(s)}
                  className={`flex-1 py-1.5 rounded-lg text-xs border transition-colors ${fontSize === s ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"}`}
                >
                  {s === "base" ? "A" : s === "lg" ? "A+" : "A++"}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={() => setShowSettings(false)}
            className="w-full py-1.5 text-xs text-gray-500 hover:text-gray-700"
          >
            Close
          </button>
        </div>
      )}

      {optionsView && (
        <ExamOptionsOverlay
          view={optionsView}
          contrastMode={contrastMode}
          textSize={fontSize}
          submitting={submitting}
          onViewChange={setOptionsView}
          onClose={() => setOptionsView(null)}
          onSubmit={handleSubmitAction}
          onContrastChange={setContrastMode}
          onTextSizeChange={setFontSize}
        />
      )}

      {/* Notes are controlled here; swap these callbacks for repository/API calls. */}
      {showNotes ? (
        <ReadingNotesDrawer
          annotations={section === "reading" ? readingAnnotations : []}
          drafts={readingAnnotationDrafts}
          activeNoteId={activeReadingNoteId}
          deletingNoteId={deletingReadingNoteId}
          generalNotes={notes}
          compactBottom={section === "reading"}
          getPartNumber={getReadingAnnotationPartNumber}
          onDraftChange={(annotationId, value) =>
            setReadingAnnotationDrafts((previous) => ({
              ...previous,
              [annotationId]: value,
            }))
          }
          onSaveNote={saveReadingAnnotationNote}
          onRequestDelete={setDeletingReadingNoteId}
          onDelete={deleteReadingAnnotation}
          onGeneralNotesChange={setNotes}
          onClose={() => {
            setDeletingReadingNoteId(null);
            setShowNotes(false);
          }}
        />
      ) : null}
      {/* ── SECTION BODY ───────────────────────────────────── */}
      <div
        className={`flex-1 overflow-hidden transition-[margin] duration-200 ${
          showNotes ? "sm:mr-[350px]" : ""
        }`}
      >
        {section === "listening" && (
          <ListeningWorkspace
            test={listeningTest}
            answers={listeningAnswers}
            activeSection={listeningActiveSection}
            onSectionChange={setListeningActiveSection}
            onAnswerChange={(id, val) =>
              setListeningAnswers((p) => ({ ...p, [id]: val }))
            }
            mode="exam"
            className="h-full"
          />
        )}

        {section === "reading" && readingParts.length > 0 && (
          <div className="flex h-full flex-col overflow-hidden">
            <div className="min-h-0 flex-1 overflow-hidden">
              <ReadingSection
                parts={readingParts}
                activeQNum={activeQNum}
                answers={readingAnswers}
                setAnswer={setReadingAnswer}
                getActivePart={getActivePart}
                getActiveQuestion={getActiveQuestion}
                fontSize={fontSize}
                flaggedQuestions={flaggedReadingQuestions}
                onToggleFlag={toggleReadingFlag}
                annotations={readingAnnotations}
                onAddAnnotation={(annotation) => {
                  setReadingAnnotations((previous) => [
                    ...previous,
                    annotation,
                  ]);
                  if (annotation.kind === "note") {
                    setReadingAnnotationDrafts((previous) => ({
                      ...previous,
                      [annotation.id]: annotation.note ?? "",
                    }));
                    setActiveReadingNoteId(annotation.id);
                  }
                }}
                onOpenNotes={() => {
                  setShowSettings(false);
                  setOptionsView(null);
                  setShowNotes(true);
                }}
                onPreviousQuestion={() => setActiveQNum(Math.max(1, activeQNum - 1))}
                onNextQuestion={() =>
                  setActiveQNum(Math.min(totalReadingQuestions, activeQNum + 1))
                }
                canGoPrevious={activeQNum > 1}
                canGoNext={activeQNum < totalReadingQuestions}
              />
            </div>
            <ReadingBottomNav
              totalQuestions={totalReadingQuestions}
              activeQNum={activeQNum}
              setActiveQNum={setActiveQNum}
              isAnswered={isReadingAnswered}
              parts={readingParts}
              flaggedQuestions={flaggedReadingQuestions}
            />
          </div>
        )}

        {section === "writing" && writingModules.length > 0 && (
          <WritingSection
            modules={writingModules}
            texts={writingTexts}
            setTexts={setWritingTexts}
            activeTask={activeWritingTask}
            setActiveTask={setActiveWritingTask}
            onSubmit={submitWritingSection}
            submitting={submitting}
          />
        )}

        {section === "speaking" && (
          <SpeakingSection
            examId={exam._id}
            speaking={exam.speakingTestId}
            onComplete={completeExam}
          />
        )}
      </div>
    </div>
  );
};

const ExamOptionsOverlay: React.FC<{
  view: ExamOptionsView;
  contrastMode: ExamContrastMode;
  textSize: ExamTextSize;
  submitting: boolean;
  onViewChange: (view: ExamOptionsView) => void;
  onClose: () => void;
  onSubmit: () => void;
  onContrastChange: (mode: ExamContrastMode) => void;
  onTextSizeChange: (size: ExamTextSize) => void;
}> = ({
  view,
  contrastMode,
  textSize,
  submitting,
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
      aria-labelledby="exam-options-title"
      className="ielts-options-overlay absolute inset-0 z-[80] overflow-y-auto bg-white"
    >
      <div className="relative min-h-full px-5 pb-16 pt-5 sm:px-10">
        {view !== "menu" && (
          <button
            type="button"
            onClick={() => onViewChange("menu")}
            className="absolute left-4 top-4 flex min-h-10 items-center gap-1 rounded-sm px-2 text-xl font-medium text-black hover:bg-gray-100 sm:left-7"
          >
            <FiChevronLeft className="h-7 w-7" strokeWidth={3} />
            <span>Options</span>
          </button>
        )}

        <h1
          id="exam-options-title"
          className="text-center text-[28px] font-medium leading-10 text-black"
        >
          {title}
        </h1>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close options"
          className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-sm text-black hover:bg-gray-100 sm:right-7"
        >
          <FiX className="h-7 w-7" strokeWidth={3.5} />
        </button>

        <div className="mx-auto mt-7 w-full max-w-[700px]">
          {view === "menu" && (
            <div className="space-y-4">
              <button
                type="button"
                onClick={onSubmit}
                disabled={submitting}
                className="ielts-options-primary flex min-h-[76px] w-full items-center gap-5 rounded-[3px] border border-[#bd0f2d] bg-[#ec1235] px-9 text-left text-base font-semibold text-white shadow-sm transition-colors hover:bg-[#d80f30] disabled:opacity-60"
              >
                <FiSend className="h-6 w-6 shrink-0" />
                <span>Go to submission page</span>
                <FiChevronRight className="ml-auto h-7 w-7 shrink-0" strokeWidth={3.5} />
              </button>

              <div className="overflow-hidden rounded-[3px] border border-gray-300 bg-white">
                <button
                  type="button"
                  onClick={() => onViewChange("contrast")}
                  className="flex min-h-[76px] w-full items-center gap-5 border-b border-gray-300 px-9 text-left text-lg text-black transition-colors hover:bg-gray-100"
                >
                  <FiEye className="h-6 w-6 shrink-0 text-gray-400" />
                  <span>Contrast</span>
                  <FiChevronRight
                    className="ml-auto h-7 w-7 shrink-0"
                    strokeWidth={3.5}
                  />
                </button>
                <button
                  type="button"
                  onClick={() => onViewChange("text-size")}
                  className="flex min-h-[76px] w-full items-center gap-5 px-9 text-left text-lg text-black transition-colors hover:bg-gray-100"
                >
                  <FiType className="h-6 w-6 shrink-0 text-gray-400" />
                  <span>Text size</span>
                  <FiChevronRight
                    className="ml-auto h-7 w-7 shrink-0"
                    strokeWidth={3.5}
                  />
                </button>
              </div>
            </div>
          )}

          {view === "contrast" && (
            <div className="overflow-hidden rounded-[3px] border border-gray-300 bg-white">
              {(
                [
                  ["black-on-white", "Black on white"],
                  ["white-on-black", "White on black"],
                  ["yellow-on-black", "Yellow on black"],
                ] as const
              ).map(([mode, label], index) => {
                const selected = contrastMode === mode;
                const sampleText =
                  mode === "yellow-on-black" ? "#ffd400" : mode === "white-on-black" ? "#ffffff" : "#111111";
                const sampleBackground =
                  mode === "black-on-white" ? "#ffffff" : "#050505";
                return (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => onContrastChange(mode)}
                    aria-pressed={selected}
                    className={`flex min-h-[74px] w-full items-center gap-5 px-10 text-left text-lg transition-colors hover:bg-gray-100 ${
                      index < 2 ? "border-b border-gray-300" : ""
                    }`}
                  >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center">
                      {selected && <FiCheck className="h-5 w-5" strokeWidth={3.5} />}
                    </span>
                    <span>{label}</span>
                    <span
                      aria-hidden="true"
                      data-contrast-preview={mode}
                      className="ielts-contrast-preview ml-auto flex h-10 w-14 flex-col justify-center gap-1 border border-gray-300 px-2 shadow-sm"
                      style={{ backgroundColor: sampleBackground }}
                    >
                      {[0, 1, 2].map((line) => (
                        <span
                          key={line}
                          className="ielts-contrast-preview-line block h-0.5 w-full"
                          style={{ backgroundColor: sampleText }}
                        />
                      ))}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {view === "text-size" && (
            <div className="overflow-hidden rounded-[3px] border border-gray-300 bg-white">
              {(
                [
                  ["base", "Regular"],
                  ["lg", "Large"],
                  ["xl", "Extra large"],
                ] as const
              ).map(([size, label], index) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => onTextSizeChange(size)}
                  aria-pressed={textSize === size}
                  className={`flex min-h-[74px] w-full items-center gap-5 px-10 text-left transition-colors hover:bg-gray-100 ${
                    index < 2 ? "border-b border-gray-300" : ""
                  } ${size === "base" ? "text-base" : size === "lg" ? "text-lg" : "text-xl"}`}
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center">
                    {textSize === size && (
                      <FiCheck className="h-5 w-5" strokeWidth={3.5} />
                    )}
                  </span>
                  <span>{label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// Reading Section — IELTS split-screen (matches reference image)
// ─────────────────────────────────────────────────────────────

function splitPassageForHeadingSlots(html: string, slotCount: number): string[] {
  if (slotCount <= 1 || typeof document === "undefined") return [html];

  const container = document.createElement("div");
  container.innerHTML = html;
  const blocks = Array.from(container.children) as HTMLElement[];
  if (blocks.length <= 1) return [html];

  const sectionStarts = [0];
  for (let index = 1; index < blocks.length; index += 1) {
    const block = blocks[index];
    const tagName = block.tagName.toUpperCase();
    const firstChildTag = block.firstElementChild?.tagName.toUpperCase();
    const isSectionHeading =
      /^H[1-6]$/.test(tagName) ||
      (tagName === "P" &&
        (firstChildTag === "STRONG" || firstChildTag === "B") &&
        (block.textContent?.trim().length ?? 0) <= 180);
    if (isSectionHeading) sectionStarts.push(index);
    if (sectionStarts.length === slotCount) break;
  }

  for (let slotIndex = 1; sectionStarts.length < slotCount; slotIndex += 1) {
    const candidate = Math.floor((blocks.length * slotIndex) / slotCount);
    if (candidate > 0 && candidate < blocks.length && !sectionStarts.includes(candidate)) {
      sectionStarts.push(candidate);
    }
    if (slotIndex > blocks.length * 2) break;
  }

  sectionStarts.sort((a, b) => a - b);
  const starts = sectionStarts.slice(0, slotCount);
  const segments = starts.map((start, index) => {
    const end = starts[index + 1] ?? blocks.length;
    return blocks
      .slice(start, end)
      .map((block) => block.outerHTML)
      .join("");
  });
  while (segments.length < slotCount) segments.push("");
  return segments;
}

const CompactReadingQuestion: React.FC<{
  question: IReadingQuestionStudent;
  questionNumber: number;
  answer: string | string[] | undefined;
  setAnswer: (questionId: string, value: string | string[]) => void;
  flagged: boolean;
  onToggleFlag: () => void;
}> = ({ question, questionNumber, answer, setAnswer, flagged, onToggleFlag }) => (
  <div className="border-t border-gray-200 pt-6">
    <div className="mb-4 flex items-start justify-between gap-4">
      <p className="text-base font-medium leading-relaxed text-gray-900">
        <span className="mr-2 font-bold">{questionNumber}</span>
        {question.questionText}
      </p>
      <ReadingQuestionBookmarkButton
        questionNumber={questionNumber}
        flagged={flagged}
        onToggle={onToggleFlag}
        size="compact"
      />
    </div>
    <ReadingQuestionRenderer
      question={question}
      answer={answer ?? ""}
      onChange={(next) => setAnswer(question._id, next)}
      firstQuestionNumber={questionNumber}
    />
  </div>
);
const ReadingSection: React.FC<{
  parts: ReadingPart[];
  activeQNum: number;
  answers: Record<string, string | string[]>;
  setAnswer: (qId: string, val: string | string[]) => void;
  getActivePart: () => ReadingPart;
  getActiveQuestion: () => IReadingQuestionStudent | null;
  fontSize: ExamTextSize;
  flaggedQuestions: Set<number>;
  onToggleFlag: (questionNumber: number) => void;
  annotations: ReadingAnnotation[];
  onAddAnnotation: (annotation: ReadingAnnotation) => void;
  onOpenNotes: () => void;
  onPreviousQuestion?: () => void;
  onNextQuestion?: () => void;
  canGoPrevious?: boolean;
  canGoNext?: boolean;
}> = ({
  parts,
  activeQNum,
  answers,
  setAnswer,
  getActivePart,
  getActiveQuestion,
  fontSize,
  flaggedQuestions,
  onToggleFlag,
  annotations,
  onAddAnnotation,
  onOpenNotes,
  onPreviousQuestion,
  onNextQuestion,
  canGoPrevious,
  canGoNext,
}) => {
  const activePart = getActivePart();
  const currentQ = getActiveQuestion();
  const isClientShowcase = activePart.test.createdBy === "client-preview";
  const clientPreviewListSelectUi =
    isClientShowcase &&
    currentQ?.questionType === ReadingQuestionType.LIST_MATCHING;
  const clientPreviewHeadingMatchingUi =
    isClientShowcase &&
    currentQ?.questionType === ReadingQuestionType.MATCHING_HEADINGS;
  const clientPreviewMatchingFeaturesUi =
    isClientShowcase &&
    currentQ?.questionType === ReadingQuestionType.MATCHING_FEATURES;
  const clientPreviewInformationMatchingUi =
    isClientShowcase &&
    currentQ?.questionType === ReadingQuestionType.MATCHING_INFORMATION;
  const clientPreviewSentenceEndingUi =
    isClientShowcase &&
    currentQ?.questionType === ReadingQuestionType.MATCHING_SENTENCE_ENDINGS;
  const clientPreviewNoteCompletionUi =
    isClientShowcase &&
    currentQ?.questionType === ReadingQuestionType.NOTE_COMPLETION;
  const clientPreviewTableCompletionUi =
    isClientShowcase &&
    currentQ?.questionType === ReadingQuestionType.TABLE_COMPLETION;
  const clientPreviewSentenceCompletionUi =
    isClientShowcase &&
    currentQ?.questionType === ReadingQuestionType.SENTENCE_COMPLETION;
  const clientPreviewFlowchartCompletionUi =
    isClientShowcase &&
    currentQ?.questionType === ReadingQuestionType.FLOWCHART_COMPLETION;
  const clientPreviewDiagramCompletionUi =
    isClientShowcase &&
    currentQ?.questionType === ReadingQuestionType.DIAGRAM_LABEL_COMPLETION;
  const clientPreviewShortAnswerUi =
    isClientShowcase &&
    currentQ?.questionType === ReadingQuestionType.SHORT_ANSWER;
  const clientPreviewClassificationUi =
    isClientShowcase &&
    currentQ?.questionType === ReadingQuestionType.CLASSIFICATION;
  const clientPreviewYesNoNotGivenUi =
    isClientShowcase &&
    currentQ?.questionType === ReadingQuestionType.YES_NO_NOT_GIVEN;
  const clientPreviewTrueFalseNotGivenUi =
    isClientShowcase &&
    currentQ?.questionType === ReadingQuestionType.TRUE_FALSE_NOT_GIVEN;
  const clientPreviewStatementAgreementUi =
    clientPreviewYesNoNotGivenUi || clientPreviewTrueFalseNotGivenUi;
  const clientPreviewTitleSubtitleUi =
    isClientShowcase &&
    currentQ?.questionType === ReadingQuestionType.TITLE_SUBTITLE_FINDING;
  const clientPreviewMcqUi =
    isClientShowcase &&
    currentQ?.questionType === ReadingQuestionType.MCQ_SINGLE;
  const clientPreviewSingleChoiceUi =
    clientPreviewTitleSubtitleUi || clientPreviewMcqUi;
  const clientPreviewSummaryWithCluesUi =
    isClientShowcase &&
    currentQ?.questionType === ReadingQuestionType.SUMMARY_COMPLETION &&
    (currentQ.wordBank?.filter((word) => word.trim()).length ?? 0) > 0;
  const clientPreviewSummaryWithoutCluesUi =
    isClientShowcase &&
    currentQ?.questionType === ReadingQuestionType.SUMMARY_COMPLETION &&
    (currentQ.wordBank?.filter((word) => word.trim()).length ?? 0) === 0;
  const splitContainerRef = useRef<HTMLDivElement | null>(null);
  const passageContentRef = useRef<HTMLDivElement | null>(null);
  const questionContentRef = useRef<HTMLDivElement | null>(null);
  const [leftWidthPct, setLeftWidthPct] = useState(52);
  const [isResizing, setIsResizing] = useState(false);
  const [selectedHeadingLetter, setSelectedHeadingLetter] = useState<
    string | null
  >(null);

  // Question group (group all questions with same groupLabel)
  const groupStart = isClientShowcase
    ? (currentQ?.pageNumber ?? activeQNum)
    : currentQ?.groupLabel
      ? activePart.questions.findIndex(
          (q) => q.groupLabel === currentQ.groupLabel,
        ) +
        activePart.offset +
        1
      : activeQNum;
  const groupEnd = currentQ?.groupLabel
    ? activePart.offset +
      activePart.questions.filter((q) => q.groupLabel === currentQ.groupLabel)
        .length +
      (groupStart - activePart.offset - 1)
    : activeQNum;
  const displayGroupEnd = isClientShowcase
    ? groupStart + Math.max(1, currentQ?.marks ?? 1) - 1
    : currentQ?.questionType === ReadingQuestionType.MATCHING_HEADINGS ||
        currentQ?.questionType ===
          ReadingQuestionType.MATCHING_SENTENCE_ENDINGS
      ? Math.max(
          groupEnd,
          groupStart + Math.max(1, currentQ.options?.length ?? 1) - 1,
        )
      : groupEnd;
  const clientQuestionRange = `${groupStart}-${displayGroupEnd}`;

  const strAns = currentQ
    ? Array.isArray(answers[currentQ._id])
      ? ""
      : ((answers[currentQ._id] as string) ?? "")
    : "";
  const arrAns = currentQ
    ? Array.isArray(answers[currentQ._id])
      ? (answers[currentQ._id] as string[])
      : []
    : [];

  const flowOpts = currentQ?.options ?? [];
  const flowchartGapCount =
    currentQ?.questionType === ReadingQuestionType.FLOWCHART_COMPLETION
      ? countFlowchartGapTokens(flowOpts)
      : 0;
  const flowchartGapUi = Boolean(currentQ) && flowchartGapCount > 0;
  const flowVals =
    currentQ && flowchartGapUi
      ? Array.from({ length: flowchartGapCount }, (_, i) =>
          String(
            Array.isArray(answers[currentQ._id])
              ? ((answers[currentQ._id] as string[])[i] ?? "")
              : "",
          ),
        )
      : [];

  const tableOpts = currentQ?.options ?? [];
  const tableGapCount =
    currentQ?.questionType === ReadingQuestionType.TABLE_COMPLETION
      ? countTableGapTokens(tableOpts)
      : 0;
  const tableGapUi = Boolean(currentQ) && tableGapCount > 0;
  const tableVals =
    currentQ && tableGapUi
      ? Array.from({ length: tableGapCount }, (_, i) =>
          String(
            Array.isArray(answers[currentQ._id])
              ? ((answers[currentQ._id] as string[])[i] ?? "")
              : "",
          ),
        )
      : [];

  const diagramOpts = currentQ?.options ?? [];
  const diagramGapCount =
    currentQ?.questionType === ReadingQuestionType.DIAGRAM_LABEL_COMPLETION
      ? diagramOpts.length
      : 0;
  const diagramGapUi = Boolean(currentQ) && diagramGapCount > 0;
  const diagramVals =
    currentQ && diagramGapUi
      ? Array.from({ length: diagramGapCount }, (_, i) =>
          String(
            Array.isArray(answers[currentQ._id])
              ? ((answers[currentQ._id] as string[])[i] ?? "")
              : "",
          ),
        )
      : [];

  const shortAnswerGapUi =
    currentQ?.questionType === ReadingQuestionType.SHORT_ANSWER &&
    (currentQ.options?.length ?? 0) > 0;

  const sentenceCompletionGapUi =
    currentQ?.questionType === ReadingQuestionType.SENTENCE_COMPLETION &&
    countNoteCompletionGaps(currentQ.options ?? []) > 0;

  const summaryGapUi =
    currentQ?.questionType === ReadingQuestionType.SUMMARY_COMPLETION &&
    countNoteCompletionGaps(currentQ.options ?? []) > 0;

  const showcaseChoiceGroupUi =
    isClientShowcase &&
    currentQ != null &&
    (currentQ.questionType === ReadingQuestionType.YES_NO_NOT_GIVEN ||
      currentQ.questionType === ReadingQuestionType.TRUE_FALSE_NOT_GIVEN ||
      currentQ.questionType === ReadingQuestionType.TITLE_SUBTITLE_FINDING ||
      currentQ.questionType === ReadingQuestionType.MCQ_SINGLE) &&
    (currentQ.options?.length ?? 0) > 0;

  const noteCompletionGapCount =
    currentQ &&
    (currentQ.questionType === ReadingQuestionType.NOTE_COMPLETION ||
      shortAnswerGapUi ||
      sentenceCompletionGapUi ||
      summaryGapUi)
      ? countNoteCompletionGaps(currentQ.options ?? [])
      : 0;

  const statementOrListMatchingStemUi =
    currentQ != null &&
    (currentQ.questionType === ReadingQuestionType.MATCHING_FEATURES ||
      currentQ.questionType === ReadingQuestionType.LIST_MATCHING ||
      currentQ.questionType === ReadingQuestionType.CLASSIFICATION ||
      currentQ.questionType === ReadingQuestionType.DIAGRAM_LABEL_COMPLETION);

  const isType = (t: ReadingQuestionType) => currentQ?.questionType === t;
  const fontClass =
    fontSize === "xl" ? "text-xl" : fontSize === "lg" ? "text-lg" : "text-base";
  const questionFontClass = isClientShowcase
    ? fontSize === "xl"
      ? "text-2xl"
      : fontSize === "lg"
        ? "text-xl"
        : "text-lg"
    : fontClass;
  const questionInstructionFontClass = isClientShowcase
    ? fontSize === "xl"
      ? "text-xl"
      : fontSize === "lg"
        ? "text-lg"
        : "text-base"
    : "text-sm";

  const activeLocalIndex = currentQ
    ? activePart.questions.findIndex((question) => question._id === currentQ._id)
    : -1;
  const activePageNumber = currentQ?.pageNumber ?? 1;
  const supplementaryQuestions = activePart.questions
    .map((question, localIndex) => ({ question, localIndex }))
    .filter(
      ({ question, localIndex }) =>
        localIndex > activeLocalIndex &&
        (question.pageNumber ?? 1) === activePageNumber,
    );
  const matchingHeadingLocalIndex = activePart.questions.findIndex(
    (question) =>
      question.questionType === ReadingQuestionType.MATCHING_HEADINGS &&
      (question.pageNumber ?? 1) === activePageNumber,
  );
  const matchingHeadingQuestion =
    matchingHeadingLocalIndex >= 0
      ? activePart.questions[matchingHeadingLocalIndex]
      : undefined;
  const matchingHeadingAnswer = matchingHeadingQuestion
    ? Array.isArray(answers[matchingHeadingQuestion._id])
      ? (answers[matchingHeadingQuestion._id] as string[])
      : []
    : [];
  const matchingHeadingSlots = matchingHeadingQuestion?.options ?? [];
  const passageSegments = splitPassageForHeadingSlots(
    activePart.test.passageContent,
    matchingHeadingSlots.length,
  );

  const {
    pendingSelection,
    toolbarRef: selectionToolbarRef,
    captureSelection: captureExamSelection,
    saveSelection: savePassageSelection,
  } = useReadingTextAnnotations({
    containerRef: splitContainerRef,
    passageRef: passageContentRef,
    questionRef: questionContentRef,
    partId: activePart.testId,
    questionNumber: activeQNum,
    annotations,
    passageRenderKey: matchingHeadingSlots.length,
    onCreate: onAddAnnotation,
  });
  useEffect(() => {
    if (!isResizing) return;

    const onPointerMove = (ev: PointerEvent) => {
      const container = splitContainerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const rawPct = ((ev.clientX - rect.left) / rect.width) * 100;
      const clamped = Math.min(75, Math.max(25, rawPct));
      setLeftWidthPct(clamped);
    };

    const onPointerUp = () => setIsResizing(false);

    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);

    return () => {
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };
  }, [isResizing]);

  const activePartIndex = parts.findIndex(
    (part) => part.testId === activePart.testId,
  );
  const partStart = activePart.offset + 1;
  const partEnd = isClientShowcase
    ? activePart.offset + activePart.test.totalQuestions
    : activePart.offset + activePart.questions.length;

  return (
    <div
      ref={splitContainerRef}
      onMouseUp={captureExamSelection}
      className="flex h-full flex-col overflow-hidden bg-white"
    >
      <div className="shrink-0 border-b border-gray-300 bg-[#f3f3ef] px-5 py-3 sm:px-7">
        <p className="text-sm font-bold text-gray-950">Part {activePartIndex + 1}</p>
        {isClientShowcase ? (
          <p className="mt-0.5 text-sm italic text-gray-800">
            You should spend about 20 minutes on Questions {partStart}–{partEnd},
            which are based on Reading Passage {activePartIndex + 1} below.
          </p>
        ) : (
          <p className="mt-0.5 text-sm text-gray-800">
            Read the text and answer questions {partStart}–{partEnd}.
          </p>
        )}
      </div>

      {pendingSelection ? (
        <ReadingSelectionToolbar
          selection={pendingSelection}
          toolbarRef={selectionToolbarRef}
          onOpenNotes={onOpenNotes}
          onSave={savePassageSelection}
        />
      ) : null}
      <div className="flex min-h-0 flex-1 overflow-hidden">
      {/* ── LEFT: PASSAGE ───────────────────────────────── */}
      <div
        style={{ width: `${leftWidthPct}%` }}
        className="flex min-w-0 flex-col bg-white"
      >
        {/* Part header */}
        <div className="hidden">
          <p className="font-bold text-gray-800 text-sm">
            Part-
            {activePart.offset === 0
              ? 1
              : parts.findIndex((p) => p.testId === activePart.testId) + 1}
          </p>
          <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">
            You should spend about {Math.floor(activePart.test.duration ?? 20)}{" "}
            minutes on Questions {activePart.offset + 1}–
            {activePart.offset + activePart.questions.length}, which are based
            on Reading Passage{" "}
            {parts.findIndex((p) => p.testId === activePart.testId) + 1} below.
          </p>
        </div>

        {/* Passage card */}
        <div
          className={`flex-1 overflow-y-auto bg-white px-6 py-7 lg:px-8 ${
            isClientShowcase ? "ielts-reading-scrollbar" : ""
          }`}
        >
          <div className="mx-auto max-w-[780px]">
            <h2
              className={`mb-5 font-bold text-gray-950 ${
                fontSize === "xl"
                  ? "text-3xl"
                  : fontSize === "lg"
                    ? "text-2xl"
                    : "text-xl"
              }`}
            >
              {activePart.test.passageTitle}
            </h2>
            {activePart.test.passageImage && (
              <img
                src={activePart.test.passageImage}
                alt="Passage"
                className="w-full rounded-lg mb-4 object-cover"
              />
            )}
            <div
              ref={passageContentRef}
              onMouseUp={captureExamSelection}
              onContextMenu={(event) => {
                const selection = window.getSelection();
                if (selection && !selection.isCollapsed) {
                  event.preventDefault();
                  captureExamSelection();
                }
              }}
              className={`prose prose-gray max-w-none leading-[1.72] text-gray-900 prose-p:mb-5 ${fontClass}`}
            >
              {passageSegments.map((segment, segmentIndex) => (
                <React.Fragment
                  key={`${activePart.testId}-passage-segment-${segmentIndex}`}
                >
                  {matchingHeadingQuestion &&
                    segmentIndex < matchingHeadingSlots.length &&
                    (matchingHeadingQuestion.wordBank?.length ?? 0) > 0 && (
                      <ReadingHeadingDropZone
                        slotIndex={segmentIndex}
                        slotCount={matchingHeadingSlots.length}
                        headings={matchingHeadingQuestion.wordBank ?? []}
                        answer={matchingHeadingAnswer}
                        selectedLetter={selectedHeadingLetter}
                        onChange={(next) =>
                          setAnswer(matchingHeadingQuestion._id, next)
                        }
                        onSelectionConsumed={() =>
                          setSelectedHeadingLetter(null)
                        }
                        firstQuestionNumber={
                          isClientShowcase
                            ? (matchingHeadingQuestion.pageNumber ?? groupStart)
                            : activePart.offset + matchingHeadingLocalIndex + 1
                        }
                        allowDragBack={clientPreviewHeadingMatchingUi}
                      />
                    )}
                  <div
                    data-reading-passage-segment={segmentIndex}
                    className={`[&>*:first-child]:mt-0 ${
                      isClientShowcase
                        ? "[&_section]:mb-6 [&_section:last-child]:mb-0 [&_section>h3]:mt-0 [&_section>h3]:mb-2 [&_section>h3]:text-lg [&_section>h3]:font-bold [&_section>h3]:leading-snug [&_section>h3]:text-gray-950 [&_section>p]:mb-0"
                        : ""
                    }`}
                    dangerouslySetInnerHTML={{ __html: segment }}
                  />
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Middle draggable divider */}
      <div
        className={`ielts-reading-divider-gutter group relative shrink-0 ${
          isClientShowcase ? "w-2 bg-gray-200" : "w-4 bg-gray-100"
        }`}
      >
        <button
          type="button"
          role="separator"
          aria-label="Resize panels"
          aria-orientation="vertical"
          tabIndex={0}
          onPointerDown={(e) => {
            e.preventDefault();
            setIsResizing(true);
          }}
          onDoubleClick={() => setLeftWidthPct(52)}
          onKeyDown={(e) => {
            if (e.key === "ArrowLeft") {
              e.preventDefault();
              setLeftWidthPct((w) => Math.max(25, w - 2));
            }
            if (e.key === "ArrowRight") {
              e.preventDefault();
              setLeftWidthPct((w) => Math.min(75, w + 2));
            }
          }}
          className={`ielts-reading-divider-track absolute inset-y-0 left-1/2 z-20 flex -translate-x-1/2 cursor-col-resize items-center justify-center font-bold text-gray-950 transition-colors focus:outline-none focus:ring-2 focus:ring-[#b30d2f]/25 ${
            isClientShowcase
              ? "w-1 bg-gray-300 text-sm hover:bg-gray-500"
              : "w-1.5 bg-gray-400 text-[10px] hover:bg-gray-500"
          }`}
        >
          <span
            aria-hidden="true"
            className={`ielts-reading-divider-handle absolute flex items-center justify-center bg-white font-mono font-bold leading-none text-gray-950 ${
              isClientShowcase
                ? "h-10 w-10 border-2 border-gray-950 text-xl shadow-none"
                : "h-9 w-9 border border-gray-500 shadow-sm"
            }`}
          >
            ↔
          </span>
        </button>
      </div>

      {/* ── RIGHT: QUESTIONS ────────────────────────────── */}
      <div
        style={{ width: `${100 - leftWidthPct}%` }}
        className="relative flex min-w-0 flex-col bg-white"
        onMouseUp={captureExamSelection}
        onContextMenu={(event) => {
          const selection = window.getSelection();
          if (selection && !selection.isCollapsed) {
            event.preventDefault();
            captureExamSelection();
          }
        }}
      >
        <div
          ref={questionContentRef}
          className={`relative flex-1 overflow-y-auto px-6 pb-24 pt-7 lg:px-8 ${
            isClientShowcase ? "ielts-reading-scrollbar" : ""
          }`}
        >
          {currentQ ? (
            <div className="absolute right-6 top-5 z-10 lg:right-8">
              <ReadingQuestionBookmarkButton
                questionNumber={activeQNum}
                flagged={flaggedQuestions.has(activeQNum)}
                onToggle={() => onToggleFlag(activeQNum)}
              />
            </div>
          ) : null}
          {currentQ ? (
            <div
              className={`mx-auto space-y-5 ${
                clientPreviewMatchingFeaturesUi ||
                clientPreviewInformationMatchingUi ||
                clientPreviewSentenceEndingUi ||
                clientPreviewTableCompletionUi ||
                clientPreviewSentenceCompletionUi ||
                clientPreviewDiagramCompletionUi ||
                clientPreviewShortAnswerUi ||
                clientPreviewClassificationUi ||
                clientPreviewStatementAgreementUi ||
                clientPreviewSingleChoiceUi ||
                clientPreviewSummaryWithCluesUi ||
                clientPreviewSummaryWithoutCluesUi
                  ? "max-w-none pr-0"
                  : "max-w-[760px] pr-10"
              }`}
            >
              {isClientShowcase && currentQ.groupLabel && (
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-sky-200 bg-sky-50 px-4 py-3">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-sky-700">
                      Question type
                    </p>
                    <p
                      className={`mt-0.5 font-bold text-gray-950 ${questionFontClass}`}
                    >
                      {currentQ.groupLabel}
                    </p>
                  </div>
                  <span className="rounded-full border border-sky-200 bg-white px-3 py-1 text-xs font-semibold text-sky-800">
                    {clientPreviewListSelectUi
                      ? "2 answers"
                      : `${Math.max(1, currentQ.marks ?? 1)} examples`}
                  </span>
                </div>
              )}

              {/* Question range */}
              <p className={`font-bold text-gray-900 ${questionFontClass}`}>
                Questions {groupStart}
                {displayGroupEnd > groupStart
                  ? ` – ${displayGroupEnd}`
                  : ""}
              </p>

              {/* Group instruction */}
              {clientPreviewHeadingMatchingUi ? (
                <div className={`space-y-4 text-gray-900 ${questionInstructionFontClass}`}>
                  <p className="leading-relaxed">
                    The text on the following pages has several paragraphs, <strong>A-H</strong>.
                  </p>
                  <p className="italic leading-relaxed">
                    Choose the correct heading for each paragraph from the list
                    of headings (A–I) below.
                  </p>
                  <p className="italic leading-relaxed">
                    Write the correct number, <strong>A-I</strong>, in boxes {clientQuestionRange} on your
                    answer sheet.
                  </p>
                </div>
              ) : clientPreviewMatchingFeaturesUi ? (
                <div
                  className={`space-y-4 text-gray-900 ${questionInstructionFontClass}`}
                >
                  <p className="leading-relaxed">
                    Look at the following statements (Questions {clientQuestionRange}) and the
                    list of features below.
                  </p>
                  <p className="italic leading-relaxed">
                    Match each statement with the correct feature.
                  </p>
                  <p className="italic leading-relaxed">
                    Write the correct letter, <strong>A-E</strong>, in boxes
                    {clientQuestionRange} on your answer sheet.
                  </p>
                  <p className="italic leading-relaxed">
                    <strong>N.B.</strong> You may use any letter more than once.
                  </p>
                </div>
              ) : clientPreviewInformationMatchingUi ? (
                <div className={`space-y-4 text-gray-900 ${questionInstructionFontClass}`}>
                  <p className="italic leading-relaxed">
                    The text has eight paragraphs, <strong>A-H</strong>.
                  </p>
                  <p className="italic leading-relaxed">
                    Which paragraph contains the following information?
                  </p>
                  <p className="italic leading-relaxed">
                    Write the correct letter, <strong>A-H</strong>, in boxes {clientQuestionRange} on
                    your answer sheet.
                  </p>
                  <p className="italic leading-relaxed">
                    <strong>N.B.</strong> You may use any letter more than once.
                  </p>
                </div>
              ) : clientPreviewSentenceEndingUi ? (
                <div className={`space-y-1 text-gray-900 ${questionInstructionFontClass}`}>
                  <p className="leading-relaxed">
                    Complete each sentence with the correct ending, A-G, below.
                  </p>
                  <p className="leading-relaxed">
                    Choose the correct ending and move it into the gap.
                  </p>
                </div>
              ) : clientPreviewNoteCompletionUi ? (
                <div className={`space-y-1 text-gray-900 ${questionInstructionFontClass}`}>
                  <p className="leading-relaxed">Complete the notes below.</p>
                  <p className="leading-relaxed">
                    Write <strong>NO MORE THAN TWO WORDS AND/OR A NUMBER</strong>{" "}
                    from the passage in each gap.
                  </p>
                </div>
              ) : clientPreviewTableCompletionUi ? (
                <div className={`space-y-4 text-gray-900 ${questionInstructionFontClass}`}>
                  <p className="italic leading-relaxed">Complete the table below.</p>
                  <p className="italic leading-relaxed">
                    Choose <strong>NO MORE THAN TWO WORDS</strong> from the text for
                    each answer.
                  </p>
                  <p className="italic leading-relaxed">
                    Write your answers in boxes {clientQuestionRange} on your answer sheet.
                  </p>
                </div>
              ) : clientPreviewSentenceCompletionUi ? (
                <div className={`space-y-4 text-gray-900 ${questionInstructionFontClass}`}>
                  <p className="italic leading-relaxed">
                    Complete the sentences below.
                  </p>
                  <p className="italic leading-relaxed">
                    Choose <strong>NO MORE THAN TWO WORDS</strong> from the text for
                    each answer. Write your answers in boxes {clientQuestionRange} on your answer
                    sheet.
                  </p>
                </div>
              ) : clientPreviewFlowchartCompletionUi ? (
                <div className={`space-y-4 text-gray-900 ${questionInstructionFontClass}`}>
                  <p className="italic leading-relaxed">
                    Complete the flow-chart below.
                  </p>
                  <p className="italic leading-relaxed">
                    Choose <strong>ONE WORD ONLY</strong> from the text for each
                    answer.
                  </p>
                  <p className="italic leading-relaxed">
                    Write your answers in boxes {clientQuestionRange} on your answer sheet.
                  </p>
                </div>
              ) : clientPreviewDiagramCompletionUi ? (
                <div className={`space-y-1 text-gray-900 ${questionInstructionFontClass}`}>
                  <p className="leading-relaxed">Label the diagram below.</p>
                  <p className="leading-relaxed">
                    Write <strong>ONE WORD ONLY</strong> from the text for each gap.
                  </p>
                </div>
              ) : clientPreviewShortAnswerUi ? (
                <div className={`space-y-4 text-gray-900 ${questionInstructionFontClass}`}>
                  <p className="leading-relaxed">
                    Complete the questions below.
                  </p>
                  <p className="leading-relaxed">
                    Write <strong>NO MORE THAN THREE WORDS AND/OR A NUMBER</strong>{" "}
                    from the passage for each gap.
                  </p>
                </div>
              ) : clientPreviewClassificationUi ? (
                <div className={`text-gray-900 ${questionInstructionFontClass}`}>
                  <p className="italic leading-relaxed">
                    Write the correct letter, <strong>A</strong>, <strong>B</strong> or{" "}
                    <strong>C</strong>, in boxes {clientQuestionRange} on your answer sheet.
                  </p>
                </div>
              ) : clientPreviewStatementAgreementUi ? (
                <div
                  className={`space-y-5 text-gray-950 ${questionInstructionFontClass}`}
                >
                  <p className="leading-relaxed">
                    {clientPreviewYesNoNotGivenUi
                      ? "Do the following statements agree with the claims of the writer in the text?"
                      : "Do the following statements agree with the information given in the text?"}
                  </p>
                  <p className="italic leading-relaxed">
                    In boxes {clientQuestionRange} on your answer sheet, write
                  </p>
                  <div className="grid max-w-[690px] grid-cols-[108px_minmax(0,1fr)] gap-x-2 gap-y-4 italic leading-relaxed">
                    {(clientPreviewYesNoNotGivenUi
                      ? [
                          ["YES", "if the statement agrees with the claims of the writer"],
                          ["NO", "if the statement contradicts the claims of the writer"],
                          [
                            "NOT GIVEN",
                            "if it is impossible to say what the writer thinks about this",
                          ],
                        ]
                      : [
                          ["TRUE", "if the statement agrees with the information"],
                          ["FALSE", "if the statement contradicts the information"],
                          [
                            "NOT GIVEN",
                            "if there is no information on this",
                          ],
                        ]
                    ).map(([label, description]) => (
                      <React.Fragment key={label}>
                        <strong>{label}</strong>
                        <span>{description}</span>
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              ) : clientPreviewTitleSubtitleUi ? (
                <div
                  className={
                    "text-gray-950 " + questionInstructionFontClass
                  }
                >
                  <p className="italic leading-relaxed">
                    Choose the correct letter, <strong>A</strong>,{" "}
                    <strong>B</strong>, <strong>C</strong> or{" "}
                    <strong>D</strong>.
                  </p>
                </div>
              ) : clientPreviewMcqUi ? (
                <div
                  className={
                    "text-gray-950 " + questionInstructionFontClass
                  }
                >
                  <p className="italic leading-relaxed">
                    Choose the correct answer, <strong>A</strong>,{" "}
                    <strong>B</strong>, <strong>C</strong> or{" "}
                    <strong>D</strong>.
                  </p>
                </div>
              ) : clientPreviewSummaryWithCluesUi ? (
                <div className={`space-y-3 text-gray-900 ${questionInstructionFontClass}`}>
                  <p className="leading-relaxed">
                    Complete the summary below using words from the box.
                  </p>
                  <p className="leading-relaxed">
                    Write your answers in boxes {clientQuestionRange} on your answer sheet.
                  </p>
                </div>
              ) : clientPreviewSummaryWithoutCluesUi ? (
                <div className={`space-y-4 text-gray-900 ${questionInstructionFontClass}`}>
                  <p className="italic leading-relaxed">
                    Complete the summary below.
                  </p>
                  <p className="italic leading-relaxed">
                    Choose <strong>NO MORE THAN TWO WORDS</strong> from the text for
                    each answer.
                  </p>
                  <p className="italic leading-relaxed">
                    Write your answers in boxes {clientQuestionRange} on your answer sheet.
                  </p>
                </div>
              ) : currentQ.instructions ? (
                <div className="space-y-2">
                  <p
                    className={`${questionInstructionFontClass} text-gray-800 leading-relaxed font-medium`}
                  >
                    {currentQ.instructions}
                  </p>
                  <p
                    className={`${questionInstructionFontClass} text-gray-600 leading-relaxed`}
                  >
                    {isType(ReadingQuestionType.TRUE_FALSE_NOT_GIVEN) &&
                      "Choose TRUE if the statement agrees with the information given in the text, choose FALSE if the statement contradicts the information, or choose NOT GIVEN if there is no information on this."}
                    {isType(ReadingQuestionType.YES_NO_NOT_GIVEN) &&
                      "Choose YES if the statement agrees with the views of the writer, NO if the statement contradicts the views of the writer, or NOT GIVEN if it is impossible to say what the writer thinks about this."}
                  </p>
                </div>
              ) : null}

              {matchingHeadingQuestion &&
                (matchingHeadingQuestion.wordBank?.length ?? 0) > 0 && (
                  <ReadingHeadingBank
                    headings={matchingHeadingQuestion.wordBank ?? []}
                    answer={matchingHeadingAnswer}
                    selectedLetter={selectedHeadingLetter}
                    onSelect={setSelectedHeadingLetter}
                    onReturn={
                      clientPreviewHeadingMatchingUi
                        ? (letter) => {
                            setAnswer(
                              matchingHeadingQuestion._id,
                              matchingHeadingAnswer.map((value) =>
                                value === letter ? "" : value,
                              ),
                            );
                            setSelectedHeadingLetter(null);
                          }
                        : undefined
                    }
                    visualVariant={
                      clientPreviewHeadingMatchingUi
                        ? "reference"
                        : "interactive"
                    }
                  />
                )}

              {/* Question text / flowchart stem (title shown in chart when set) */}
              {clientPreviewHeadingMatchingUi ||
              clientPreviewMatchingFeaturesUi ||
              clientPreviewInformationMatchingUi ||
              clientPreviewSentenceEndingUi ||
              clientPreviewSentenceCompletionUi ||
              clientPreviewDiagramCompletionUi ||
              clientPreviewShortAnswerUi ||
              clientPreviewClassificationUi ||
              clientPreviewStatementAgreementUi ||
              clientPreviewSingleChoiceUi ||
              clientPreviewSummaryWithCluesUi ||
              clientPreviewSummaryWithoutCluesUi ? null : flowchartGapUi ? (
                !currentQ.questionText?.trim() ? (
                  <p
                    className={`text-gray-800 leading-snug font-medium ${questionFontClass}`}
                  >
                    Questions {groupStart}
                    {displayGroupEnd > groupStart
                      ? ` – ${displayGroupEnd}`
                      : ""}
                  </p>
                ) : null
              ) : tableGapUi ? (
                !currentQ.questionText?.trim() ? (
                  <p
                    className={`text-gray-800 leading-snug font-medium ${questionFontClass}`}
                  >
                    Questions {groupStart}
                    {displayGroupEnd > groupStart
                      ? ` – ${displayGroupEnd}`
                      : ""}
                  </p>
                ) : null
              ) : isType(ReadingQuestionType.NOTE_COMPLETION) ||
                shortAnswerGapUi ||
                sentenceCompletionGapUi ||
                summaryGapUi ? (
                currentQ.questionText?.trim() ? (
                  <p
                    className={`text-gray-800 leading-snug font-bold ${questionFontClass}`}
                  >
                    {currentQ.questionText}
                  </p>
                ) : (
                  <p
                    className={`text-gray-800 leading-snug font-medium ${questionFontClass}`}
                  >
                    Questions {groupStart}
                    {displayGroupEnd > groupStart
                      ? ` – ${displayGroupEnd}`
                      : ""}
                  </p>
                )
              ) : showcaseChoiceGroupUi ? (
                currentQ.questionText?.trim() ? (
                  <p
                    className={`text-gray-800 leading-snug font-bold ${questionFontClass}`}
                  >
                    {currentQ.questionText}
                  </p>
                ) : null
              ) : statementOrListMatchingStemUi ? (
                clientPreviewListSelectUi ? null : (
                (currentQ.questionType ===
                  ReadingQuestionType.MATCHING_FEATURES ||
                  currentQ.questionType ===
                    ReadingQuestionType.LIST_MATCHING) &&
                currentQ.questionText?.trim() ? (
                  <p
                    className={`text-gray-800 leading-snug ${
                      currentQ.questionType ===
                      ReadingQuestionType.MATCHING_FEATURES
                        ? "text-center font-bold"
                        : "font-medium"
                    } ${questionFontClass}`}
                  >
                    {currentQ.questionText}
                  </p>
                ) : (
                  <p
                    className={`text-gray-800 leading-snug font-medium ${questionFontClass}`}
                  >
                    Questions {groupStart}
                    {displayGroupEnd > groupStart
                      ? ` – ${displayGroupEnd}`
                      : ""}
                  </p>
                )
                )
              ) : (
                <p
                  className={`text-gray-800 leading-snug font-medium ${questionFontClass}`}
                >
                  {activeQNum}. {currentQ.questionText}
                </p>
              )}

              {/* Each IELTS task type is resolved by the public component registry. */}
              {currentQ.questionType !== ReadingQuestionType.MATCHING_HEADINGS ? (
                <ReadingQuestionRenderer
                  question={currentQ}
                  answer={answers[currentQ._id] ?? ""}
                  onChange={(next) => setAnswer(currentQ._id, next)}
                  firstQuestionNumber={groupStart}
                  textClassName={questionFontClass}
                  visualVariant={isClientShowcase ? "client-preview" : "default"}
                />
              ) : null}
              {/* Clear */}
              {!isClientShowcase &&
                (strAns ||
                  arrAns.some((x) => String(x ?? "").trim().length > 0) ||
                  (flowchartGapUi &&
                    flowVals.some((x) => String(x ?? "").trim().length > 0)) ||
                  (tableGapUi &&
                    tableVals.some((x) => String(x ?? "").trim().length > 0)) ||
                  (diagramGapUi &&
                    diagramVals.some(
                      (x) => String(x ?? "").trim().length > 0,
                    ))) && (
                <button
                  onClick={() =>
                    currentQ.questionType ===
                      ReadingQuestionType.NOTE_COMPLETION ||
                    (currentQ.questionType === ReadingQuestionType.SHORT_ANSWER &&
                      shortAnswerGapUi) ||
                    (currentQ.questionType ===
                      ReadingQuestionType.SENTENCE_COMPLETION &&
                      sentenceCompletionGapUi) ||
                    (currentQ.questionType === ReadingQuestionType.SUMMARY_COMPLETION &&
                      summaryGapUi)
                      ? setAnswer(
                          currentQ._id,
                          new Array(
                            Math.max(0, noteCompletionGapCount),
                          ).fill(""),
                        )
                      : showcaseChoiceGroupUi
                        ? setAnswer(
                            currentQ._id,
                            new Array(currentQ.options?.length ?? 0).fill(""),
                          )
                      : flowchartGapUi
                        ? setAnswer(
                            currentQ._id,
                            new Array(flowchartGapCount).fill(""),
                          )
                        : tableGapUi
                          ? setAnswer(
                              currentQ._id,
                              new Array(tableGapCount).fill(""),
                            )
                          : diagramGapUi
                            ? setAnswer(
                                currentQ._id,
                                new Array(diagramGapCount).fill(""),
                              )
                          : currentQ.questionType ===
                                ReadingQuestionType.MATCHING_HEADINGS ||
                              currentQ.questionType ===
                                ReadingQuestionType.MATCHING_INFORMATION ||
                              currentQ.questionType ===
                                ReadingQuestionType.MATCHING_FEATURES ||
                              currentQ.questionType ===
                                ReadingQuestionType.LIST_MATCHING ||
                              currentQ.questionType ===
                                ReadingQuestionType.CLASSIFICATION ||
                              currentQ.questionType ===
                                ReadingQuestionType.MATCHING_SENTENCE_ENDINGS ||
                              currentQ.questionType ===
                                ReadingQuestionType.DRAG_AND_DROP
                            ? setAnswer(
                                currentQ._id,
                                new Array(
                                  (currentQ.options ?? []).length || 0,
                                ).fill(""),
                              )
                            : setAnswer(currentQ._id, "")
                  }
                  className="text-xs text-gray-400 hover:text-red-500 transition-colors underline"
                >
                  Clear answer
                </button>
              )}

              {supplementaryQuestions.map(({ question, localIndex }) => {
                const questionNumber = activePart.offset + localIndex + 1;
                return (
                  <CompactReadingQuestion
                    key={question._id}
                    question={question}
                    questionNumber={questionNumber}
                    answer={answers[question._id]}
                    setAnswer={setAnswer}
                    flagged={flaggedQuestions.has(questionNumber)}
                    onToggleFlag={() => onToggleFlag(questionNumber)}
                  />
                );
              })}
            </div>
          ) : (
            <p className="text-gray-400 text-center mt-10">
              No question selected
            </p>
          )}
        </div>

        <ClientExamNavigationButtons
          className="absolute bottom-4 right-6 z-20"
          onPrevious={() => onPreviousQuestion?.()}
          onNext={() => onNextQuestion?.()}
          hasPrevious={Boolean(canGoPrevious)}
          hasNext={Boolean(canGoNext)}
        />
      </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// Reading Bottom Navigation Bar
// ─────────────────────────────────────────────────────────────

const ReadingBottomNav: React.FC<{
  totalQuestions: number;
  activeQNum: number;
  setActiveQNum: (n: number) => void;
  isAnswered: (n: number) => boolean;
  parts: ReadingPart[];
  flaggedQuestions: Set<number>;
}> = ({
  totalQuestions,
  activeQNum,
  setActiveQNum,
  isAnswered,
  parts,
  flaggedQuestions,
}) => {
  const sections: ClientExamFooterSection[] = parts.map((part, partIndex) => {
    const start = part.offset + 1;
    const questionCount =
      part.test.createdBy === "client-preview"
        ? part.test.totalQuestions
        : part.questions.length;
    const items = Array.from(
      { length: questionCount },
      (_, index) => start + index,
    );
    return {
      label: `Part ${partIndex + 1}`,
      items,
      completedItems: items.filter(isAnswered),
    };
  });

  return (
    <ClientExamSectionFooter
      sections={sections}
      activeItem={activeQNum}
      onItemSelect={setActiveQNum}
      flaggedItems={flaggedQuestions}
      onPreviousItem={() => setActiveQNum(Math.max(1, activeQNum - 1))}
      onNextItem={() => setActiveQNum(Math.min(totalQuestions, activeQNum + 1))}
      hasPrevious={activeQNum > 1}
      hasNext={activeQNum < totalQuestions}
      showNavigationArrows={false}
    />
  );
};

// ─────────────────────────────────────────────────────────────
// Writing Section
// ─────────────────────────────────────────────────────────────

const WritingSection: React.FC<{
  modules: IWritingModule[];
  texts: string[];
  setTexts: React.Dispatch<React.SetStateAction<string[]>>;
  activeTask: number;
  setActiveTask: (i: number) => void;
  onSubmit: () => void;
  submitting: boolean;
}> = ({
  modules,
  texts,
  setTexts,
  activeTask,
  setActiveTask,
  onSubmit,
  submitting,
}) => {
  const mod = modules[activeTask];
  const wordCount = (texts[activeTask] ?? "")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  const minWords = activeTask === 0 ? 150 : 250;

  return (
    <div className="flex h-full overflow-hidden">
      {/* Left: Task prompt */}
      <div className="w-[42%] border-r border-gray-200 overflow-y-auto bg-[#f8f8f8] p-5">
        <div className="flex gap-2 mb-4">
          {modules.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveTask(i)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${
                activeTask === i
                  ? "bg-[#7a1c2e] text-white"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              Task {i + 1}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wide text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
              {mod?.taskType === "task1" ? "Task 1" : "Task 2"}
            </span>
          </div>

          {mod?.imageUrl && (
            <img
              src={mod.imageUrl}
              alt="Task image"
              className="w-full rounded-lg border border-gray-200"
            />
          )}

          <div
            className="prose prose-sm max-w-none text-gray-800 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: mod?.instruction ?? "" }}
          />

          <p className="text-xs text-gray-500 bg-gray-50 rounded-lg p-3">
            ⏱ You should spend about {activeTask === 0 ? 20 : 40} minutes on
            this task. Write at least <strong>{minWords} words</strong>.
          </p>
        </div>
      </div>

      {/* Right: Essay editor */}
      <div className="flex-1 flex flex-col bg-white">
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200 bg-gray-50 shrink-0">
          <p className="text-sm font-semibold text-gray-700">
            Task {activeTask + 1} — Your Response
          </p>
          <div className="flex items-center gap-3">
            <span
              className={`text-xs font-medium ${wordCount < minWords ? "text-orange-500" : "text-green-600"}`}
            >
              {wordCount} / {minWords}+ words
            </span>
          </div>
        </div>

        <textarea
          value={texts[activeTask] ?? ""}
          onChange={(e) => {
            const updated = [...texts];
            updated[activeTask] = e.target.value;
            setTexts(updated);
          }}
          placeholder={`Write your ${activeTask === 0 ? "Task 1" : "Task 2"} response here…`}
          className="flex-1 resize-none p-5 text-base text-gray-800 leading-relaxed focus:outline-none placeholder-gray-300"
        />

        <div className="shrink-0 px-5 py-3 border-t border-gray-200 flex items-center justify-between">
          {activeTask < modules.length - 1 ? (
            <button
              onClick={() => setActiveTask(activeTask + 1)}
              className="px-5 py-2 bg-indigo-600 text-white rounded-xl font-semibold text-sm hover:bg-indigo-700 transition-colors"
            >
              Next: Task {activeTask + 2} →
            </button>
          ) : (
            <button
              onClick={onSubmit}
              disabled={submitting}
              className="px-8 py-2.5 bg-[#7a1c2e] text-white rounded-xl font-bold text-sm hover:bg-[#9b2335] transition-colors disabled:opacity-50"
            >
              {submitting ? "Submitting…" : "Submit Writing →"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// Speaking Section (simplified — instructions + completion)
// ─────────────────────────────────────────────────────────────

const SpeakingSection: React.FC<{
  examId: string;
  speaking?: string;
  onComplete: () => void;
}> = ({ onComplete }) => {
  return (
    <div className="flex items-center justify-center h-full bg-white">
      <div className="max-w-md text-center space-y-6 px-6">
        <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto">
          <span className="text-4xl">🎙️</span>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Speaking Section
          </h2>
          <p className="text-gray-500 leading-relaxed">
            Your Speaking test will be conducted separately with an examiner, or
            via the speaking practice module. Click below to complete your mock
            exam submission.
          </p>
        </div>
        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 text-sm text-indigo-800 text-left space-y-1">
          <p>
            <strong>Part 1:</strong> General questions about yourself (4–5 min)
          </p>
          <p>
            <strong>Part 2:</strong> Individual long turn with cue card (3–4
            min)
          </p>
          <p>
            <strong>Part 3:</strong> Two-way discussion with examiner (4–5 min)
          </p>
        </div>
        <button
          onClick={onComplete}
          className="w-full py-3 bg-[#7a1c2e] text-white rounded-xl font-bold hover:bg-[#9b2335] transition-colors"
        >
          Complete Exam & View Results
        </button>
      </div>
    </div>
  );
};

export default IELTSExamPage;
