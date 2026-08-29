import React, { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import {
  FiBookOpen,
  FiCheck,
  FiClock,
  FiDownload,
  FiHeadphones,
  FiMic,
  FiPenTool,
  FiRefreshCw,
} from "react-icons/fi";
import ResultScoreHero from "../../components/results/ResultScoreHero";
import {
  CLIENT_LISTENING_RESULT_KEY,
  type ClientListeningStoredResult,
} from "../../data/clientPreviewListening";
import {
  CLIENT_READING_RESULT_KEY,
  type ClientReadingStoredResult,
} from "../../data/clientPreviewReadingResult";

type ResultTab = "listening" | "reading" | "writing" | "speaking";

interface WritingStoredResult {
  essay?: string;
  taskTwoEssay?: string;
  elapsedSeconds?: number;
  submittedAt?: number;
}

interface SpeakingStoredResult {
  completed?: number;
  total?: number;
  elapsedSeconds?: number;
  submittedAt?: number;
}

const ClientPreviewMockResultPage: React.FC = () => {
  const result = useMemo(readFullMockResult, []);
  const [activeTab, setActiveTab] = useState<ResultTab>("listening");
  const incompleteModules = result.modules.filter((module) => !module.complete);

  return (
    <div className="mx-auto w-full max-w-[1080px] pb-12 text-[#24476b]">
      <Helmet>
        <title>Full Mock Test Result – Lexora Academy</title>
      </Helmet>

      <section className="rounded-[24px] bg-white px-4 pb-10 shadow-[0_14px_40px_rgba(39,48,60,0.08)] sm:px-8">
        <ResultScoreHero
          candidateName="Client Preview"
          avatarUrl="/result-preview-avatar.svg"
          correctAnswers={result.correctAnswers}
          totalQuestions={result.totalQuestions}
          overallBand={result.overallBand}
          durationLabel={formatDuration(result.durationSeconds)}
          durationLimitLabel="(Full mock)"
          resultPending={incompleteModules.length > 0}
        />

        <div className="mx-auto mt-12 max-w-[860px]">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#b4434c]">
                Full mock overview
              </p>
              <h2 className="mt-1 text-2xl font-black tracking-[-0.03em]">
                Module results
              </h2>
            </div>
            <button
              type="button"
              onClick={() => window.print()}
              className="print:hidden inline-flex items-center gap-2 rounded-full bg-[#f4f4f4] px-4 py-2 text-xs font-bold text-[#5c6570] transition hover:bg-[#e9e9e9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#24476b]"
            >
              <FiDownload aria-hidden="true" /> Download
            </button>
          </div>

          {incompleteModules.length > 0 ? (
            <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
              This final result is waiting for {incompleteModules.map((module) => module.label).join(", ")}. Complete every module to confirm the overall band.
            </div>
          ) : (
            <div className="mt-5 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-800">
              <FiCheck aria-hidden="true" /> Listening, Reading, Writing and Speaking are complete.
            </div>
          )}

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {result.modules.map((module) => (
              <button
                key={module.id}
                type="button"
                onClick={() => setActiveTab(module.id)}
                className={`rounded-2xl border p-4 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#24476b] ${
                  activeTab === module.id
                    ? "border-[#b4434c] bg-[#fff7f7] shadow-[0_8px_24px_rgba(180,67,76,0.12)]"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <span className="flex items-center justify-between gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#24476b] text-white">
                    {module.icon}
                  </span>
                  <span className={`rounded-full px-2.5 py-1 text-[10px] font-black ${module.complete ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-800"}`}>
                    {module.complete ? "Complete" : "Pending"}
                  </span>
                </span>
                <strong className="mt-4 block text-base font-black">{module.label}</strong>
                <span className="mt-1 block text-2xl font-black text-[#111827]">
                  {module.band == null ? "—" : `Band ${formatBand(module.band)}`}
                </span>
                <span className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                  <FiClock aria-hidden="true" /> {formatDuration(module.durationSeconds)}
                </span>
              </button>
            ))}
          </div>

          <section className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-[#f8fafc]">
            <div className="border-b border-slate-200 bg-[#4b1313] px-5 py-4 text-white">
              <h3 className="text-lg font-black">Review &amp; explanations: {capitalize(activeTab)}</h3>
            </div>
            <ResultDetails activeTab={activeTab} result={result} />
          </section>

          <div className="print:hidden mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/client-preview/listening/pre-test?reset=1"
              className="inline-flex items-center gap-2 rounded-xl border border-[#24476b] bg-white px-5 py-3 text-sm font-black text-[#24476b] transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#24476b]"
            >
              <FiRefreshCw aria-hidden="true" /> Retake full mock
            </Link>
            <Link
              to="/client-preview/mock-tests"
              className="rounded-xl bg-[#24476b] px-6 py-3 text-sm font-black text-white transition hover:bg-[#183653] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#24476b] focus-visible:ring-offset-2"
            >
              Back to mock tests
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

const ResultDetails: React.FC<{
  activeTab: ResultTab;
  result: ReturnType<typeof readFullMockResult>;
}> = ({ activeTab, result }) => {
  if (activeTab === "listening") {
    return (
      <DetailPanel
        title="Listening answer summary"
        metric={`${result.listening.correctAnswers}/${result.listening.totalQuestions} correct`}
        copy="Your saved responses were checked against the accepted preview answers across all four Listening parts."
        answers={Object.entries(result.listening.answers).slice(0, 8).map(([number, answer]) => `${number}. ${answer || "No answer"}`)}
      />
    );
  }
  if (activeTab === "reading") {
    return (
      <DetailPanel
        title="Reading answer summary"
        metric={`${result.reading.correctAnswers}/${result.reading.totalQuestions} correct`}
        copy="The score combines the three Reading passages and all question patterns in this client preview."
        answers={Object.entries(result.reading.answers).slice(0, 8).map(([id, answer]) => `${id}: ${Array.isArray(answer) ? answer.join(", ") : answer || "No answer"}`)}
      />
    );
  }
  if (activeTab === "writing") {
    const taskOneWords = countWords(result.writing.essay ?? "");
    const taskTwoWords = countWords(result.writing.taskTwoEssay ?? "");
    return (
      <DetailPanel
        title="Writing submission summary"
        metric={`Estimated band ${formatBand(result.writingBand)}`}
        copy="This client preview uses an illustrative Writing band. Production evaluation will be supplied by the scoring backend."
        answers={[`Task 1: ${taskOneWords} words`, `Task 2: ${taskTwoWords} words`]}
      />
    );
  }
  return (
    <DetailPanel
      title="Speaking response summary"
      metric={`${result.speaking.completed}/${result.speaking.total} prompts recorded`}
      copy="This preview band demonstrates the final report layout. Production scoring can replace it with examiner or AI feedback."
      answers={["Fluency & Coherence: 7.0", "Lexical Resource: 7.0", "Grammar: 6.5", "Pronunciation: 7.0"]}
    />
  );
};

const DetailPanel: React.FC<{ title: string; metric: string; copy: string; answers: string[] }> = ({ title, metric, copy, answers }) => (
  <div className="grid gap-6 p-5 sm:grid-cols-[minmax(0,1fr)_minmax(260px,0.8fr)] sm:p-7">
    <div>
      <p className="text-xs font-black uppercase tracking-[0.14em] text-[#b4434c]">{title}</p>
      <p className="mt-2 text-2xl font-black text-[#111827]">{metric}</p>
      <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600">{copy}</p>
    </div>
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <p className="text-xs font-black uppercase tracking-[0.12em] text-slate-500">Saved response snapshot</p>
      {answers.length > 0 ? (
        <ul className="mt-3 space-y-2 text-sm text-slate-700">
          {answers.map((answer, index) => <li key={`${index}-${answer}`} className="border-b border-slate-100 pb-2 last:border-0 last:pb-0">{answer}</li>)}
        </ul>
      ) : (
        <p className="mt-3 text-sm text-slate-500">No saved responses.</p>
      )}
    </div>
  </div>
);

function readFullMockResult() {
  const listening = readSessionResult<ClientListeningStoredResult>(CLIENT_LISTENING_RESULT_KEY, {
    answers: {}, correctAnswers: 0, totalQuestions: 40, bandScore: 0, durationSeconds: 0, completedAt: "",
  });
  const reading = readSessionResult<ClientReadingStoredResult>(CLIENT_READING_RESULT_KEY, {
    testNumber: 1, answers: {}, correctAnswers: 0, totalQuestions: 40, bandScore: 0, durationSeconds: 0, completedAt: "", flaggedQuestions: [],
  });
  const writing = readLocalResult<WritingStoredResult>("lexora.client-preview.writing.result.v1", {});
  const speaking = readLocalResult<SpeakingStoredResult>("lexora.client-preview.speaking.result.v1", {});
  const writingComplete = Boolean(writing.submittedAt);
  const speakingTotal = speaking.total ?? 9;
  const speakingComplete = Boolean(speaking.submittedAt);
  const writingBand = writingComplete ? 7.5 : 0;
  const speakingBand = speakingComplete ? 7 : 0;
  const scores = [listening.bandScore, reading.bandScore, writingBand, speakingBand].filter((score) => score > 0);
  const allComplete = Boolean(listening.completedAt && reading.completedAt && writingComplete && speakingComplete);
  const overallBand = allComplete && scores.length === 4 ? roundToHalf(scores.reduce((sum, score) => sum + score, 0) / 4) : undefined;
  const modules = [
    { id: "listening" as const, label: "Listening", icon: <FiHeadphones aria-hidden="true" />, band: listening.completedAt ? listening.bandScore : null, durationSeconds: listening.durationSeconds, complete: Boolean(listening.completedAt) },
    { id: "reading" as const, label: "Reading", icon: <FiBookOpen aria-hidden="true" />, band: reading.completedAt ? reading.bandScore : null, durationSeconds: reading.durationSeconds, complete: Boolean(reading.completedAt) },
    { id: "writing" as const, label: "Writing", icon: <FiPenTool aria-hidden="true" />, band: writingComplete ? writingBand : null, durationSeconds: writing.elapsedSeconds ?? 0, complete: writingComplete },
    { id: "speaking" as const, label: "Speaking", icon: <FiMic aria-hidden="true" />, band: speakingComplete ? speakingBand : null, durationSeconds: speaking.elapsedSeconds ?? 0, complete: speakingComplete },
  ];

  return {
    listening,
    reading,
    writing,
    speaking: { completed: speaking.completed ?? 0, total: speakingTotal, elapsedSeconds: speaking.elapsedSeconds ?? 0 },
    writingBand,
    overallBand,
    correctAnswers: listening.correctAnswers + reading.correctAnswers,
    totalQuestions: listening.totalQuestions + reading.totalQuestions,
    durationSeconds: listening.durationSeconds + reading.durationSeconds + (writing.elapsedSeconds ?? 0) + (speaking.elapsedSeconds ?? 0),
    modules,
  };
}

function readSessionResult<T>(key: string, fallback: T): T {
  try {
    const raw = window.sessionStorage.getItem(key);
    return raw ? ({ ...fallback, ...JSON.parse(raw) } as T) : fallback;
  } catch { return fallback; }
}

function readLocalResult<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? ({ ...fallback, ...JSON.parse(raw) } as T) : fallback;
  } catch { return fallback; }
}

function countWords(value: string): number { return value.trim().split(/\s+/).filter(Boolean).length; }
function roundToHalf(value: number): number { return Math.round(value * 2) / 2; }
function formatBand(value: number): string { return Number.isInteger(value) ? String(value) : value.toFixed(1); }
function capitalize(value: string): string { return `${value.charAt(0).toUpperCase()}${value.slice(1)}`; }
function formatDuration(totalSeconds: number): string {
  const safe = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(safe / 3600);
  const minutes = Math.floor((safe % 3600) / 60);
  const seconds = safe % 60;
  return hours > 0
    ? `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
    : `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export default ClientPreviewMockResultPage;
