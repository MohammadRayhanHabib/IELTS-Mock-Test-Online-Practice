import React, { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useLocation, useNavigate } from "react-router-dom";
import { FiCheck, FiPause, FiPlay, FiRotateCcw } from "react-icons/fi";
import ClientExamNavigationButtons from "../../components/exam/ClientExamNavigationButtons";
import PreviewExamModeGate from "../../components/exam/PreviewExamModeGate";
import ClientExamSectionFooter from "../../components/exam/ClientExamSectionFooter";
import ClientExamNotesDrawer from "../../components/exam/ClientExamNotesDrawer";
import ClientExamOptionsOverlay, {
  type ClientExamContrastMode,
  type ClientExamOptionsView,
  type ClientExamTextSize,
} from "../../components/exam/ClientExamOptionsOverlay";
import ClientListeningExamHeader from "../../components/listening/ClientListeningExamHeader";
import WritingTaskOneVisual from "../../modules/writing/components/WritingTaskOneVisual";

const WRITING_DURATION_SECONDS = 60 * 60;
const DRAFT_KEY = "lexora.client-preview.writing.essay.v1";
const TASK_TWO_DRAFT_KEY = "lexora.client-preview.writing.essay.task-two.v1";
const NOTES_KEY = "lexora.client-preview.writing.notes.v1";

const WRITING_PROMPTS: Record<
  number,
  { taskOne: string; taskTwo: string; taskTwoInstruction: string }
> = {
  1: {
    taskOne: "The chart and table below show the results of a survey of library users at a university.",
    taskTwo: "Some people believe that capital punishment should not be used. Others argue that it should be allowed for the most serious crimes.",
    taskTwoInstruction: "Discuss both views and give your own opinion.",
  },
  2: {
    taskOne: "The charts below compare household energy use and greenhouse-gas emissions in two countries.",
    taskTwo: "Some people think universities should focus on practical employment skills, while others believe academic knowledge is more important.",
    taskTwoInstruction: "Discuss both views and give your own opinion.",
  },
  3: {
    taskOne: "The diagram below shows how discarded glass bottles are collected and recycled into new products.",
    taskTwo: "More employees are now working from home rather than travelling to a workplace every day.",
    taskTwoInstruction: "Do the advantages of this development outweigh the disadvantages?",
  },
  4: {
    taskOne: "The table and charts below show changes in public transport use in three cities between 2005 and 2025.",
    taskTwo: "Many cities are becoming less affordable for young adults and essential workers.",
    taskTwoInstruction: "What problems does this cause, and what measures could be taken to address them?",
  },
};

const ClientPreviewWritingPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const testNumber = useMemo(() => {
    const parsed = Number(new URLSearchParams(location.search).get("test"));
    return Number.isInteger(parsed) && parsed >= 1 && parsed <= 4 ? parsed : 1;
  }, [location.search]);
  const writingPrompt = WRITING_PROMPTS[testNumber] ?? WRITING_PROMPTS[1];
  const draftKey = testNumber === 1 ? DRAFT_KEY : `${DRAFT_KEY}.test-${testNumber}`;
  const taskTwoDraftKey = testNumber === 1 ? TASK_TWO_DRAFT_KEY : `${TASK_TWO_DRAFT_KEY}.test-${testNumber}`;
  const notesKey = testNumber === 1 ? NOTES_KEY : `${NOTES_KEY}.test-${testNumber}`;
  const [essay, setEssay] = useState(() => window.localStorage.getItem(draftKey) ?? "");
  const [taskTwoEssay, setTaskTwoEssay] = useState(() => window.localStorage.getItem(taskTwoDraftKey) ?? "");
  const [activeTask, setActiveTask] = useState<1 | 2>(1);
  const [notes, setNotes] = useState(() => window.localStorage.getItem(notesKey) ?? "");
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [timerRunning, setTimerRunning] = useState(true);
  const [examPaused, setExamPaused] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [saved, setSaved] = useState(false);
  const [optionsView, setOptionsView] = useState<ClientExamOptionsView | null>(null);
  const [contrastMode, setContrastMode] = useState<ClientExamContrastMode>("black-on-white");
  const [textSize, setTextSize] = useState<ClientExamTextSize>("base");

  useEffect(() => {
    if (!timerRunning || examPaused || elapsedSeconds >= WRITING_DURATION_SECONDS) return;
    const timer = window.setInterval(() => {
      setElapsedSeconds((current) => Math.min(WRITING_DURATION_SECONDS, current + 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [elapsedSeconds, examPaused, timerRunning]);

  useEffect(() => {
    window.localStorage.setItem(notesKey, notes);
  }, [notes, notesKey]);

  const activeEssay = activeTask === 1 ? essay : taskTwoEssay;
  const wordCount = useMemo(
    () => activeEssay.trim().split(/\s+/).filter(Boolean).length,
    [activeEssay],
  );

  const saveDraft = () => {
    window.localStorage.setItem(draftKey, essay);
    window.localStorage.setItem(taskTwoDraftKey, taskTwoEssay);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1800);
  };

  const submitWriting = () => {
    window.localStorage.setItem(draftKey, essay);
    window.localStorage.setItem(taskTwoDraftKey, taskTwoEssay);
    window.localStorage.setItem(
      "lexora.client-preview.writing.result.v1",
      JSON.stringify({ testNumber, essay, taskTwoEssay, elapsedSeconds, wordCount, submittedAt: Date.now() }),
    );
    navigate(
      `/client-preview/speaking/booking?from=full-mock&test=${testNumber}`,
    );
  };

  const toggleExamPause = () => {
    setExamPaused((current) => !current);
  };

  return (
    <div
      data-ielts-contrast={contrastMode}
      data-ielts-text-size={textSize}
      className="ielts-exam-shell fixed inset-0 z-50 flex min-h-[680px] flex-col overflow-hidden bg-white text-[#171717]"
    >
      <Helmet>
        <title>Writing Test – Lexora</title>
      </Helmet>
      <PreviewExamModeGate enabled requireFullscreen={false} />

      <ClientListeningExamHeader
        moduleLabel="Writing"
        showAudioControls={false}
        isPaused={examPaused}
        remainingSeconds={Math.max(0, WRITING_DURATION_SECONDS - elapsedSeconds)}
        onPauseToggle={toggleExamPause}
        onSubmit={() => setShowSubmitConfirm(true)}
        onSaveExit={() => {
          saveDraft();
          navigate("/client-preview/mock-tests");
        }}
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
        <section className="absolute right-20 top-[58px] z-50 w-56 rounded-xl border border-gray-200 bg-white p-4 text-gray-900 shadow-lg">
          <h2 className="text-sm font-semibold">Settings</h2>
          <p className="mb-2 mt-3 text-xs text-gray-500">Text size</p>
          <div className="flex gap-2">
            {(["base", "lg", "xl"] as const).map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => setTextSize(size)}
                className={`flex-1 rounded border py-1.5 text-xs ${
                  textSize === size
                    ? "border-gray-900 bg-gray-900 text-white"
                    : "border-gray-300 bg-white text-gray-700"
                }`}
              >
                {size === "base" ? "A" : size === "lg" ? "A+" : "A++"}
              </button>
            ))}
          </div>
        </section>
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
          moduleLabel="Writing"
          value={notes}
          onChange={setNotes}
          onClose={() => setShowNotes(false)}
        />
      ) : null}

      {examPaused ? (
        <div className="absolute inset-0 z-[70] flex items-center justify-center bg-black/60 px-4">
          <section className="w-full max-w-sm rounded-xl bg-white p-8 text-center text-gray-900 shadow-2xl">
            <FiPause className="mx-auto h-7 w-7" />
            <h2 className="mt-3 text-2xl font-bold">Exam Paused</h2>
            <p className="mt-2 text-sm leading-6 text-gray-600">Your essay and private notes remain available.</p>
            <button type="button" onClick={toggleExamPause} className="mt-6 rounded-md bg-gray-900 px-7 py-3 text-sm font-bold text-white">
              Resume Exam
            </button>
          </section>
        </div>
      ) : null}

      <section className={`flex min-h-0 flex-1 overflow-hidden transition-[margin] duration-200 ${showNotes ? "sm:mr-[350px]" : ""}`}>
        <article className="ielts-writing-preview-content ielts-reading-scrollbar w-[48%] overflow-y-auto border-r-[8px] border-[#e5e7eb] bg-white px-5 py-5 lg:px-8">
          <h1 className="text-[21px] font-black">WRITING TASK {activeTask}</h1>
          <p className="mt-4 text-[16px]">You should spend about {activeTask === 1 ? 20 : 40} minutes on this task.</p>

          <div className="mt-4 max-w-[650px] border-2 border-gray-700 px-5 py-3 text-[16px] font-bold italic leading-5">
            {activeTask === 1 ? (
              <>
                <p>{writingPrompt.taskOne}</p>
                <p className="mt-5">Summarise the information by selecting and reporting the main features, and make comparisons where relevant.</p>
              </>
            ) : (
              <>
                <p>{writingPrompt.taskTwo}</p>
                <p className="mt-5">{writingPrompt.taskTwoInstruction}</p>
              </>
            )}
          </div>

          <p className="mt-4 text-[16px]">Write at least {activeTask === 1 ? 150 : 250} words.</p>
          {activeTask === 1 ? <WritingTaskOneVisual testNumber={testNumber} /> : null}
        </article>

        <section className="ielts-writing-preview-content flex min-w-0 flex-1 flex-col bg-white p-4 pb-[92px] lg:p-6 lg:pb-[92px]">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-serif text-[20px] font-bold">User Essay</h2>
            <div className="flex items-center gap-2 text-[12px]">
              <button type="button" onClick={() => setElapsedSeconds(0)} aria-label="Reset timer" className="flex h-8 w-8 items-center justify-center rounded bg-[#ff4d4f] text-white">
                <FiRotateCcw />
              </button>
              <button type="button" onClick={() => setTimerRunning((current) => !current)} aria-label={timerRunning ? "Pause timer" : "Start timer"} className="flex h-8 w-8 items-center justify-center rounded bg-[#ff4d4f] text-white">
                {timerRunning ? <FiPause /> : <FiPlay />}
              </button>
              <span>Duration: {formatTime(elapsedSeconds)}/60:00</span>
            </div>
          </div>

          <textarea
            value={activeEssay}
            onChange={(event) => activeTask === 1 ? setEssay(event.target.value) : setTaskTwoEssay(event.target.value)}
            placeholder="Type your essay here. Use the top buttons to start/pause/reset the timer, and the bottom buttons to save or submit for evaluation"
            spellCheck
            className="mt-4 min-h-0 flex-1 resize-none border border-gray-300 bg-white p-4 text-[16px] leading-7 text-gray-950 outline-none focus:border-[#ff4d4f]"
          />

          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm">Word count: <strong>{wordCount}</strong> <span className={wordCount >= (activeTask === 1 ? 150 : 250) ? "text-green-700" : "text-gray-500"}>/ {activeTask === 1 ? 150 : 250} minimum</span></p>
            <div className="flex items-center gap-2">
              {saved ? <span className="mr-2 text-xs font-semibold text-green-700">Draft saved</span> : null}
              <button type="button" onClick={saveDraft} className="min-w-20 rounded bg-[#ff4d4f] px-5 py-2 text-sm font-semibold text-white hover:bg-[#e83e40]">Save</button>
              <button type="button" onClick={() => setShowSubmitConfirm(true)} className="rounded bg-[#ff4d4f] px-5 py-2 text-sm font-semibold text-white hover:bg-[#e83e40]">AI Evaluation</button>
            </div>
          </div>
        </section>
      </section>

      <ClientExamNavigationButtons
        className="fixed bottom-[168px] right-6 z-40"
        onPrevious={() => setActiveTask(1)}
        onNext={() => setActiveTask(2)}
        hasPrevious={activeTask > 1}
        hasNext={activeTask < 2}
        previousLabel="Previous task"
        nextLabel="Next task"
      />

      <ClientExamSectionFooter
        activeItem={activeTask}
        itemNoun="Task"
        onItemSelect={(item) => setActiveTask(item === 2 ? 2 : 1)}
        sections={[
          {
            label: "Task 1 (Report)",
            items: [1],
            completedItems: essay.trim().length > 30 ? [1] : [],
          },
          {
            label: "Task 2 (Essay)",
            items: [2],
            completedItems: taskTwoEssay.trim().length > 30 ? [2] : [],
          },
        ]}
        showNavigationArrows={false}
        onPreviousItem={() => setActiveTask(1)}
        onNextItem={() => setActiveTask(2)}
        hasPrevious={activeTask === 2}
        hasNext={activeTask === 1}
      />
      {showSubmitConfirm ? (
        <div className="absolute inset-0 z-[90] flex items-center justify-center bg-black/50 px-4">
          <section role="dialog" aria-modal="true" className="w-full max-w-md rounded-xl bg-white p-7 text-gray-900 shadow-2xl">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-green-50 text-green-700"><FiCheck /></div>
            <h2 className="mt-4 text-xl font-bold">Submit Writing Test?</h2>
            <p className="mt-2 text-sm leading-6 text-gray-600">Your Writing responses will be saved. The Speaking booking calendar will open next so you can choose a session.</p>
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={() => setShowSubmitConfirm(false)} className="rounded border border-gray-300 px-4 py-2 text-sm font-semibold">Keep writing</button>
              <button type="button" onClick={submitWriting} className="rounded bg-gray-900 px-4 py-2 text-sm font-semibold text-white">Submit &amp; continue</button>
            </div>
          </section>
        </div>
      ) : null}
    </div>
  );
};

function formatTime(seconds: number): string {
  const safe = Math.max(0, Math.floor(seconds));
  return `${String(Math.floor(safe / 60)).padStart(2, "0")}:${String(safe % 60).padStart(2, "0")}`;
}

export default ClientPreviewWritingPage;
