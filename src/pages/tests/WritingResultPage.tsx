import React, { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate, useParams } from "react-router-dom";
import { Award, ChevronDown, Download, UserRound } from "lucide-react";
import { FiArrowRight, FiGrid, FiRotateCcw } from "react-icons/fi";
import {
  writingApi,
  WritingTaskType,
  type IWritingModule,
  type IWritingSession,
} from "../../api/writing";
import { PageLoader } from "../../components/ui/Spinner";

const BAND_MARKS = [9, 8.5, 8, 7.5, 7, 6.5, 6, 5.5, 5, 4.5, 4, 3.5, 3];

interface WritingResultTask {
  id: string;
  label: "Task 1" | "Task 2";
  instruction: string;
  imageUrl?: string;
  essayText: string;
  sampleAnswer?: string;
  isReferenceChart?: boolean;
}

const TASK_1_INSTRUCTION = [
  "You should spend about 20 minutes on this task.",
  "The chart below shows the number of girls per 100 boys enrolled in different levels of school education.",
  "Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
  "You should write at least 150 words.",
].join("\n\n");

const TASK_2_INSTRUCTION = [
  "You should spend about 40 minutes on this task.",
  "Some people believe that capital punishment should not be used. Others, however, argue that it should be allowed for the most serious crimes.",
  "Discuss both views and give your opinion.",
  "You should write at least 250 words.",
].join("\n\n");

interface WritingResultPageProps {
  preview?: boolean;
}

const WritingResultPage: React.FC<WritingResultPageProps> = ({ preview = false }) => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const [session, setSession] = useState<IWritingSession | null>(null);
  const [module, setModule] = useState<IWritingModule | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (preview) {
      setLoading(false);
      return;
    }
    if (!sessionId?.trim()) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    const loadResult = async () => {
      try {
        const sessionResponse = await writingApi.getSession(sessionId.trim());
        const loadedSession = sessionResponse.data.data;
        const moduleResponse = await writingApi.getModule(
          loadedSession.moduleId,
        );
        if (!cancelled) {
          setSession(loadedSession);
          setModule(moduleResponse.data.data);
        }
      } catch {
        // The approved presentation fallback remains available.
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void loadResult();
    return () => {
      cancelled = true;
    };
  }, [preview, sessionId]);

  const previewResult = useMemo(
    () => (preview ? readPreviewWritingResult() : null),
    [preview],
  );

  const tasks = useMemo(
    () =>
      buildWritingTasks(
        module,
        session,
        previewResult?.essay ?? "",
        previewResult?.taskTwoEssay ?? "",
      ),
    [module, previewResult, session],
  );

  if (loading) return <PageLoader />;

  const band = session?.score ?? 7.5;
  const candidateName = "Preview Candidate";
  const avatarUrl = "/result-preview-avatar.svg";

  return (
    <>
      <Helmet>
        <title>{preview ? "Writing Preview Result" : "Writing Result"} - Lexora Academy</title>
      </Helmet>

      <main className="mx-auto w-full max-w-[760px] rounded-[18px] bg-white px-4 pb-12 shadow-[0_10px_35px_rgba(39,48,60,0.08)] sm:px-10">
        <WritingScoreSummary
          candidateName={candidateName}
          avatarUrl={avatarUrl}
          band={band}
          onDownload={() => window.print()}
        />

        <section className="mt-5 space-y-10 sm:mt-7">
          {tasks.map((task) => (
            <WritingTaskPanel key={task.id} task={task} />
          ))}
        </section>

        {preview && (
          <div className="print:hidden mt-10 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() => navigate("/client-preview/writing")}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-600 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#24476b]"
            >
              <FiRotateCcw /> Edit submission
            </button>
            <button
              type="button"
              onClick={() => navigate("/client-preview/mock-tests")}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-600 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#24476b]"
            >
              <FiGrid /> Back to mock tests
            </button>
            <button
              type="button"
              onClick={() =>
                navigate("/client-preview/speaking/booking?from=writing-result")
              }
              className="inline-flex items-center gap-2 rounded-xl bg-[#24476b] px-5 py-3 text-sm font-black text-white transition hover:bg-[#183653] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#24476b] focus-visible:ring-offset-2"
            >
              Continue to Speaking <FiArrowRight />
            </button>
          </div>
        )}
      </main>
    </>
  );
};

const WritingScoreSummary: React.FC<{
  candidateName: string;
  avatarUrl?: string;
  band: number;
  onDownload: () => void;
}> = ({ candidateName, avatarUrl, band, onDownload }) => {
  const activeBand = BAND_MARKS.reduce((closest, mark) =>
    Math.abs(mark - band) < Math.abs(closest - band) ? mark : closest,
  );

  return (
    <section className="pt-[58px] text-center">
      <div className="mx-auto flex h-[46px] w-[46px] items-center justify-center overflow-hidden rounded-full bg-[#d9dcdf]">
        {avatarUrl ? (
          <img src={avatarUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <UserRound className="h-6 w-6 text-[#526d88]" />
        )}
      </div>
      <p className="mt-2 text-[11px] font-semibold text-[#59718a]">
        {candidateName}
      </p>
      <h1 className="mt-4 text-[26px] font-black tracking-[-0.03em] text-[#24476b]">
        Your score is:
      </h1>

      <div className="mt-10 text-left">
        <div className="flex items-center gap-3 text-[#24476b]">
          <Award className="h-6 w-6" strokeWidth={1.8} />
          <h2 className="text-[18px] font-black">Band Score:</h2>
        </div>

        <div className="mt-3 grid grid-cols-7 items-center gap-x-2 gap-y-3 sm:grid-cols-[repeat(13,minmax(0,1fr))]">
          {BAND_MARKS.map((mark) => (
            <span
              key={mark}
              className={`mx-auto flex h-6 min-w-7 items-center justify-center rounded-full px-2 text-[11px] font-black ${
                activeBand === mark
                  ? "bg-[#2eb369] text-white"
                  : "text-[#24476b]"
              }`}
            >
              {mark}
            </span>
          ))}
        </div>

        <div className="mt-8 flex justify-end">
          <button
            type="button"
            onClick={onDownload}
            className="print:hidden inline-flex items-center gap-2 rounded-full bg-[#f3f3f3] px-3.5 py-2 text-[12px] font-semibold text-[#5c5c5c] transition hover:bg-[#e9e9e9]"
          >
            <Download className="h-4 w-4" />
            Download
          </button>
        </div>
      </div>
    </section>
  );
};

const WritingTaskPanel: React.FC<{ task: WritingResultTask }> = ({ task }) => {
  const [questionOpen, setQuestionOpen] = useState(true);
  const [answerOpen, setAnswerOpen] = useState(true);

  return (
    <article>
      <div className="inline-flex h-10 min-w-[104px] items-center justify-center rounded-t-md bg-[#24476b] px-6 text-[18px] font-black text-white">
        {task.label}
      </div>

      <section>
        <SectionHeader
          title="Question"
          open={questionOpen}
          onToggle={() => setQuestionOpen((value) => !value)}
        />
        {questionOpen && (
          <div
            className={`bg-[#e3edf7] px-5 py-5 text-[#526b84] sm:px-7 ${
              task.label === "Task 1" ? "min-h-[390px]" : "min-h-[160px]"
            }`}
          >
            <p className="whitespace-pre-line text-[11px] leading-[1.55]">
              {task.instruction}
            </p>

            {task.imageUrl ? (
              <img
                src={task.imageUrl}
                alt={`${task.label} question`}
                className="mx-auto mt-7 max-h-[260px] max-w-full object-contain"
              />
            ) : (
              task.isReferenceChart && (
                <div className="mx-auto mt-7 max-w-[410px] bg-white p-3">
                  <WritingReferenceChart />
                </div>
              )
            )}
          </div>
        )}
      </section>

      <section className="relative mt-[96px]">
        <SectionHeader
          title="Answer"
          open={answerOpen}
          onToggle={() => setAnswerOpen((value) => !value)}
        />
        <span className="absolute left-full top-2 ml-1 whitespace-nowrap bg-[#e7e7e7] px-2 py-1 text-[10px] font-medium text-[#484848]">
          Sample Answer
        </span>
        {answerOpen && (
          <div className="min-h-[350px] border border-[#f1b56f] bg-white p-5 text-[12px] leading-6 text-[#4e5963]">
            {task.essayText || task.sampleAnswer || ""}
          </div>
        )}
      </section>
    </article>
  );
};

const SectionHeader: React.FC<{
  title: string;
  open: boolean;
  onToggle: () => void;
}> = ({ title, open, onToggle }) => (
  <button
    type="button"
    onClick={onToggle}
    aria-expanded={open}
    className="flex h-10 w-full items-center justify-between bg-[#4a1111] px-5 text-left text-[14px] font-black text-white"
  >
    {title}
    <ChevronDown
      className={`h-4 w-4 text-[#24476b] transition-transform ${
        open ? "rotate-180" : ""
      }`}
    />
  </button>
);

const WritingReferenceChart: React.FC = () => {
  const groups = [
    {
      title: "Primary education",
      bars: [
        { label: "Developing", first: 83, second: 87 },
        { label: "Developed", first: 95, second: 96 },
      ],
    },
    {
      title: "Secondary education",
      bars: [
        { label: "Developing", first: 72, second: 82 },
        { label: "Developed", first: 98, second: 99 },
      ],
    },
    {
      title: "Tertiary education",
      bars: [
        { label: "Developing", first: 66, second: 75 },
        { label: "Developed", first: 105, second: 112 },
      ],
    },
  ];

  return (
    <svg
      viewBox="0 0 600 280"
      role="img"
      aria-label="Girls per 100 boys enrolled in primary, secondary and tertiary education"
      className="h-auto w-full"
    >
      <title>
        Girls per 100 boys enrolled in different levels of education
      </title>
      {[0, 20, 40, 60, 80, 100, 120].map((tick) => {
        const y = 220 - tick * 1.55;
        return (
          <g key={tick}>
            <line
              x1="42"
              x2="582"
              y1={y}
              y2={y}
              stroke="#cfd8df"
              strokeWidth="1"
            />
            <text
              x="32"
              y={y + 4}
              textAnchor="end"
              fontSize="10"
              fill="#465866"
            >
              {tick}
            </text>
          </g>
        );
      })}
      {groups.map((group, groupIndex) => {
        const groupX = 68 + groupIndex * 176;
        return (
          <g key={group.title}>
            <text
              x={groupX + 72}
              y="14"
              textAnchor="middle"
              fontSize="11"
              fontWeight="700"
              fill="#30475a"
            >
              {group.title}
            </text>
            {group.bars.map((bar, barIndex) => {
              const x = groupX + barIndex * 74;
              const firstHeight = bar.first * 1.55;
              const secondHeight = bar.second * 1.55;
              return (
                <g key={bar.label}>
                  <rect
                    x={x}
                    y={220 - firstHeight}
                    width="27"
                    height={firstHeight}
                    fill="#377fc1"
                  />
                  <rect
                    x={x + 28}
                    y={220 - secondHeight}
                    width="27"
                    height={secondHeight}
                    fill="#c53c3c"
                  />
                  <text
                    x={x + 13.5}
                    y={216 - firstHeight}
                    textAnchor="middle"
                    fontSize="9"
                    fill="#30475a"
                  >
                    {bar.first}
                  </text>
                  <text
                    x={x + 41.5}
                    y={216 - secondHeight}
                    textAnchor="middle"
                    fontSize="9"
                    fill="#30475a"
                  >
                    {bar.second}
                  </text>
                  <text
                    x={x + 27}
                    y="240"
                    textAnchor="middle"
                    fontSize="9"
                    fill="#465866"
                  >
                    {bar.label}
                  </text>
                </g>
              );
            })}
          </g>
        );
      })}
      <g transform="translate(214 260)">
        <rect width="12" height="12" fill="#377fc1" />
        <text x="18" y="10" fontSize="9" fill="#465866">
          1990
        </text>
        <rect x="70" width="12" height="12" fill="#c53c3c" />
        <text x="88" y="10" fontSize="9" fill="#465866">
          1998
        </text>
        <line x1="140" x2="156" y1="6" y2="6" stroke="#5aa13c" strokeWidth="3" />
        <text x="162" y="10" fontSize="9" fill="#465866">
          Target
        </text>
      </g>
    </svg>
  );
};

function buildWritingTasks(
  module: IWritingModule | null,
  session: IWritingSession | null,
  previewEssay = "",
  previewTaskTwoEssay = "",
): WritingResultTask[] {
  const actualTask = module
    ? {
        id: module._id,
        label:
          module.taskType === WritingTaskType.TASK2
            ? ("Task 2" as const)
            : ("Task 1" as const),
        instruction: module.instruction,
        imageUrl: module.imageUrl,
        essayText: session?.essayText?.trim() ?? "",
        sampleAnswer: session?.feedback,
        isReferenceChart:
          module.taskType === WritingTaskType.TASK1 && !module.imageUrl,
      }
    : null;

  const task1: WritingResultTask =
    actualTask?.label === "Task 1"
      ? actualTask
      : {
          id: "writing-preview-task-1",
          label: "Task 1",
          instruction: TASK_1_INSTRUCTION,
          essayText: previewEssay,
          isReferenceChart: true,
        };

  const task2: WritingResultTask =
    actualTask?.label === "Task 2"
      ? actualTask
      : {
          id: "writing-preview-task-2",
          label: "Task 2",
          instruction: TASK_2_INSTRUCTION,
          essayText: previewTaskTwoEssay,
        };

  return [task1, task2];
}

interface PreviewWritingResult {
  essay: string;
  taskTwoEssay: string;
  elapsedSeconds: number;
}

function readPreviewWritingResult(): PreviewWritingResult {
  const fallback: PreviewWritingResult = {
    essay:
      window.localStorage.getItem("lexora.client-preview.writing.essay.v1") ??
      "",
    taskTwoEssay:
      window.localStorage.getItem(
        "lexora.client-preview.writing.essay.task-two.v1",
      ) ?? "",
    elapsedSeconds: 0,
  };

  try {
    const raw = window.localStorage.getItem(
      "lexora.client-preview.writing.result.v1",
    );
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as Partial<PreviewWritingResult>;
    return {
      essay: parsed.essay ?? fallback.essay,
      taskTwoEssay: parsed.taskTwoEssay ?? fallback.taskTwoEssay,
      elapsedSeconds: parsed.elapsedSeconds ?? 0,
    };
  } catch {
    return fallback;
  }
}

export default WritingResultPage;
