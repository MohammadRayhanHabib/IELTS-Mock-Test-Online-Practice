import React, { useEffect, useMemo, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FiCheck,
  FiClock,
  FiMic,
  FiPause,
  FiPlay,
  FiSquare,
  FiUser,
  FiVolume2,
} from "react-icons/fi";
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
import SpeakingSettings from "../../modules/speaking/components/SpeakingSettings";

type SpeakingPart = 1 | 2 | 3;
type Prompt = {
  id: string;
  part: SpeakingPart;
  topic: string;
  question: string;
  helper?: string;
};

const TEST_ONE_PROMPTS: Prompt[] = [
  { id: "p1-1", part: 1, topic: "Introduction", question: "Good morning. Can you tell me your full name, please?" },
  { id: "p1-2", part: 1, topic: "Home and accommodation", question: "What kind of place do you live in?" },
  { id: "p1-3", part: 1, topic: "Home and accommodation", question: "What do you like most about the area where you live?" },
  { id: "p1-4", part: 1, topic: "Free time", question: "What do you usually do when you have some free time?" },
  {
    id: "p2-1",
    part: 2,
    topic: "Individual long turn",
    question: "Describe a skill that you would like to learn.",
    helper: "You should say what the skill is, why you want to learn it, how you would learn it, and explain how this skill would help you.",
  },
  { id: "p3-1", part: 3, topic: "Learning new skills", question: "Why do some people find it difficult to learn a new skill?" },
  { id: "p3-2", part: 3, topic: "Learning new skills", question: "Do you think schools should teach more practical skills? Why?" },
  { id: "p3-3", part: 3, topic: "Technology and learning", question: "How has technology changed the way people learn?" },
  { id: "p3-4", part: 3, topic: "Technology and learning", question: "Which skills will be most important for young people in the future?" },
];

const PROMPTS_BY_TEST: Record<number, Prompt[]> = {
  1: TEST_ONE_PROMPTS,
  2: [
    { id: "t2-p1-1", part: 1, topic: "Study", question: "What subject are you studying, and why did you choose it?" },
    { id: "t2-p1-2", part: 1, topic: "Study", question: "Which part of your course do you enjoy most?" },
    { id: "t2-p1-3", part: 1, topic: "Neighbourhood", question: "What facilities are useful in your neighbourhood?" },
    { id: "t2-p1-4", part: 1, topic: "Neighbourhood", question: "Would you like to live there in the future?" },
    { id: "t2-p2-1", part: 2, topic: "Individual long turn", question: "Describe a community event that you enjoyed.", helper: "You should say what the event was, where and when it happened, who you attended with, and explain why you enjoyed it." },
    { id: "t2-p3-1", part: 3, topic: "Community events", question: "Why are public events important for a community?" },
    { id: "t2-p3-2", part: 3, topic: "Community events", question: "How should local events be funded?" },
    { id: "t2-p3-3", part: 3, topic: "Public space", question: "What makes a public place welcoming?" },
    { id: "t2-p3-4", part: 3, topic: "Public space", question: "Will online communities replace local ones?" },
  ],
  3: [
    { id: "t3-p1-1", part: 1, topic: "Work", question: "What kind of work would you like to do in the future?" },
    { id: "t3-p1-2", part: 1, topic: "Work", question: "Do you prefer working alone or with others?" },
    { id: "t3-p1-3", part: 1, topic: "Travel", question: "How often do you travel outside your city?" },
    { id: "t3-p1-4", part: 1, topic: "Travel", question: "What is your preferred way to travel?" },
    { id: "t3-p2-1", part: 2, topic: "Individual long turn", question: "Describe a journey that taught you something.", helper: "You should say where you went, how you travelled, what happened during the journey, and explain what you learned." },
    { id: "t3-p3-1", part: 3, topic: "Travel", question: "Why can travel change people's attitudes?" },
    { id: "t3-p3-2", part: 3, topic: "Tourism", question: "What problems can tourism create for local residents?" },
    { id: "t3-p3-3", part: 3, topic: "Technology", question: "How has technology changed business travel?" },
    { id: "t3-p3-4", part: 3, topic: "Technology", question: "Will virtual experiences reduce the need to travel?" },
  ],
  4: [
    { id: "t4-p1-1", part: 1, topic: "Culture", question: "Which cultural activities are popular where you live?" },
    { id: "t4-p1-2", part: 1, topic: "Culture", question: "Do you visit museums or exhibitions?" },
    { id: "t4-p1-3", part: 1, topic: "Environment", question: "What environmental issue concerns people in your area?" },
    { id: "t4-p1-4", part: 1, topic: "Decisions", question: "Do you make important decisions quickly?" },
    { id: "t4-p2-1", part: 2, topic: "Individual long turn", question: "Describe an important decision that had a positive result.", helper: "You should say what the decision was, when you made it, who helped you, and explain why the result was positive." },
    { id: "t4-p3-1", part: 3, topic: "Decision making", question: "Why do some people avoid difficult decisions?" },
    { id: "t4-p3-2", part: 3, topic: "Decision making", question: "Should major public decisions involve citizens?" },
    { id: "t4-p3-3", part: 3, topic: "Environment", question: "How can governments encourage greener choices?" },
    { id: "t4-p3-4", part: 3, topic: "Culture", question: "How can cultural traditions adapt without disappearing?" },
  ],
};

const EXAM_DURATION_SECONDS = 14 * 60;
const NOTES_KEY = "lexora.client-preview.speaking.notes.v1";

const ClientPreviewSpeakingPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const testNumber = useMemo(() => {
    const parsed = Number(new URLSearchParams(location.search).get("test"));
    return Number.isInteger(parsed) && parsed >= 1 && parsed <= 4 ? parsed : 1;
  }, [location.search]);
  const prompts = PROMPTS_BY_TEST[testNumber] ?? TEST_ONE_PROMPTS;
  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<number | null>(null);
  const recordingSecondsRef = useRef(0);
  const [promptIndex, setPromptIndex] = useState(0);
  const [remainingSeconds, setRemainingSeconds] = useState(EXAM_DURATION_SECONDS);
  const [examPaused, setExamPaused] = useState(false);
  const [recordingPrompt, setRecordingPrompt] = useState<string | null>(null);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [recordings, setRecordings] = useState<Record<string, { url: string; duration: number }>>({});
  const [micError, setMicError] = useState("");
  const [promptPlaying, setPromptPlaying] = useState(false);
  const [prepSeconds, setPrepSeconds] = useState(60);
  const [part2Phase, setPart2Phase] = useState<"prep" | "answer">("prep");
  const notesKey = `${NOTES_KEY}.test-${testNumber}`;
  const [notes, setNotes] = useState(() => window.localStorage.getItem(notesKey) ?? "");
  const [showNotes, setShowNotes] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [optionsView, setOptionsView] = useState<ClientExamOptionsView | null>(null);
  const [contrastMode, setContrastMode] = useState<ClientExamContrastMode>("black-on-white");
  const [textSize, setTextSize] = useState<ClientExamTextSize>("base");
  const prompt = prompts[promptIndex];

  const partPrompts = useMemo(() => prompts.filter((item) => item.part === prompt.part), [prompt.part, prompts]);
  const partPromptIndex = partPrompts.findIndex((item) => item.id === prompt.id);

  useEffect(() => {
    if (examPaused) return;
    const timer = window.setInterval(() => setRemainingSeconds((current) => Math.max(0, current - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [examPaused]);

  useEffect(() => {
    if (prompt.part !== 2 || part2Phase !== "prep" || examPaused || prepSeconds <= 0) return;
    const timer = window.setInterval(() => setPrepSeconds((current) => Math.max(0, current - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [examPaused, part2Phase, prepSeconds, prompt.part]);

  useEffect(() => {
    if (prepSeconds === 0 && prompt.part === 2 && part2Phase === "prep") setPart2Phase("answer");
  }, [part2Phase, prepSeconds, prompt.part]);

  useEffect(() => {
    window.localStorage.setItem(notesKey, notes);
  }, [notes, notesKey]);

  useEffect(
    () => () => {
      window.speechSynthesis?.cancel();
      if (recordingTimerRef.current) window.clearInterval(recordingTimerRef.current);
      if (recorderRef.current?.state !== "inactive") recorderRef.current?.stop();
      streamRef.current?.getTracks().forEach((track) => track.stop());
    },
    [],
  );

  const playPrompt = () => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(prompt.question);
    utterance.lang = "en-GB";
    utterance.rate = 0.92;
    utterance.onstart = () => setPromptPlaying(true);
    utterance.onend = () => setPromptPlaying(false);
    utterance.onerror = () => setPromptPlaying(false);
    window.speechSynthesis.speak(utterance);
  };

  const startRecording = async () => {
    if (prompt.part === 2 && part2Phase === "prep") setPart2Phase("answer");
    setMicError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      chunksRef.current = [];
      const recorder = new MediaRecorder(stream);
      recorderRef.current = recorder;
      const promptId = prompt.id;
      recorder.ondataavailable = (event) => {
        if (event.data.size) chunksRef.current.push(event.data);
      };
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || "audio/webm" });
        const url = URL.createObjectURL(blob);
        setRecordings((current) => {
          const previous = current[promptId];
          if (previous?.url) URL.revokeObjectURL(previous.url);
          return { ...current, [promptId]: { url, duration: recordingSecondsRef.current } };
        });
        stream.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
        setRecordingPrompt(null);
      };
      recorder.start();
      recordingSecondsRef.current = 0;
      setRecordingSeconds(0);
      setRecordingPrompt(prompt.id);
      recordingTimerRef.current = window.setInterval(() => {
        recordingSecondsRef.current += 1;
        setRecordingSeconds(recordingSecondsRef.current);
      }, 1000);
    } catch {
      setMicError("Microphone access is required to record this answer. Allow access in the browser, then try again.");
    }
  };

  const stopRecording = () => {
    if (recordingTimerRef.current) {
      window.clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
    if (recorderRef.current && recorderRef.current.state !== "inactive") recorderRef.current.stop();
  };

  const moveTo = (nextIndex: number) => {
    if (recordingPrompt) stopRecording();
    window.speechSynthesis?.cancel();
    setPromptPlaying(false);
    setPromptIndex(Math.max(0, Math.min(prompts.length - 1, nextIndex)));
  };

  const submitSpeaking = () => {
    if (recordingPrompt) stopRecording();
    const completed = Object.keys(recordings).length + (recordingPrompt ? 1 : 0);
    window.localStorage.setItem(
      "lexora.client-preview.speaking.result.v1",
      JSON.stringify({ testNumber, completed, total: prompts.length, elapsedSeconds: EXAM_DURATION_SECONDS - remainingSeconds, submittedAt: Date.now() }),
    );
    navigate(`/client-preview/results?test=${testNumber}`);
  };

  return (
    <div data-ielts-contrast={contrastMode} data-ielts-text-size={textSize} className="ielts-exam-shell fixed inset-0 z-50 flex min-h-[680px] flex-col overflow-hidden bg-white text-[#171717]">
      <Helmet><title>Speaking Test – Lexora</title></Helmet>
      <PreviewExamModeGate enabled />
      <ClientListeningExamHeader
        moduleLabel="Speaking"
        showAudioControls={false}
        isPaused={examPaused}
        remainingSeconds={remainingSeconds}
        onPauseToggle={() => setExamPaused((current) => !current)}
        onSubmit={() => setShowSubmitConfirm(true)}
        onSaveExit={() => navigate("/client-preview/mock-tests")}
        onOpenSettings={() => { setShowNotes(false); setOptionsView(null); setShowSettings((current) => !current); }}
        onOpenOptions={() => { setShowSettings(false); setShowNotes(false); setOptionsView("menu"); }}
        onOpenNotes={() => { setShowSettings(false); setOptionsView(null); setShowNotes((current) => !current); }}
      />

      {showSettings ? <SpeakingSettings textSize={textSize} onTextSize={setTextSize} /> : null}
      {optionsView ? (
        <ClientExamOptionsOverlay
          view={optionsView}
          contrastMode={contrastMode}
          textSize={textSize}
          onViewChange={setOptionsView}
          onClose={() => setOptionsView(null)}
          onSubmit={() => { setOptionsView(null); setShowSubmitConfirm(true); }}
          onContrastChange={setContrastMode}
          onTextSizeChange={setTextSize}
        />
      ) : null}
      {showNotes ? <ClientExamNotesDrawer moduleLabel="Speaking" value={notes} onChange={setNotes} onClose={() => setShowNotes(false)} /> : null}

      {examPaused ? (
        <div className="absolute inset-0 z-[70] flex items-center justify-center bg-black/60 px-4">
          <section className="w-full max-w-sm rounded-xl bg-white p-8 text-center text-gray-900 shadow-2xl">
            <FiPause className="mx-auto h-7 w-7" />
            <h2 className="mt-3 text-2xl font-bold">Speaking test paused</h2>
            <p className="mt-2 text-sm leading-6 text-gray-600">The test timer and cue-card preparation timer are paused.</p>
            <button type="button" onClick={() => setExamPaused(false)} className="mt-6 rounded-md bg-gray-900 px-7 py-3 text-sm font-bold text-white">Resume test</button>
          </section>
        </div>
      ) : null}

      <section className={`flex min-h-0 flex-1 overflow-hidden transition-[margin] duration-200 ${showNotes ? "sm:mr-[350px]" : ""}`}>
        <article className="ielts-speaking-preview-content ielts-reading-scrollbar flex w-[42%] min-w-[360px] flex-col overflow-y-auto border-r-[8px] border-[#e5e7eb] bg-[#f7f7f7] px-6 py-6 lg:px-10">
          <div className="mx-auto flex w-full max-w-[520px] flex-1 flex-col items-center justify-center">
            <p className="text-xs font-bold uppercase tracking-[0.17em] text-gray-500">Virtual examiner</p>
            <div className="relative mt-5 flex h-44 w-44 items-center justify-center rounded-full border-[7px] border-white bg-gradient-to-br from-[#d9e2e8] to-[#9aaebc] shadow-xl">
              <FiUser className="h-24 w-24 text-[#263b50]" />
              {promptPlaying ? <span className="absolute -bottom-2 rounded-full bg-[#b30d2f] px-4 py-1.5 text-xs font-bold text-white">Examiner is speaking…</span> : null}
            </div>
            <h2 className="mt-7 text-xl font-black">Alex · IELTS examiner</h2>
            <p className="mt-2 max-w-sm text-center text-sm leading-6 text-gray-500">Listen to each examiner question, then record one clear answer. Your saved response can be replayed before you continue.</p>
            <button type="button" onClick={playPrompt} className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-md border border-gray-800 bg-white px-5 text-sm font-bold text-gray-900 hover:bg-gray-100">
              {promptPlaying ? <FiVolume2 /> : <FiPlay />} {promptPlaying ? "Playing question" : "Play examiner question"}
            </button>
          </div>
        </article>

        <main className="ielts-speaking-preview-content ielts-reading-scrollbar flex min-w-0 flex-1 flex-col overflow-y-auto bg-white px-6 py-6 lg:px-10">
          <div className="mx-auto flex w-full max-w-[840px] flex-1 flex-col">
            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-gray-200 pb-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#b30d2f]">Speaking Part {prompt.part}</p>
                <h1 className="mt-1 text-2xl font-black">{PART_TITLES[prompt.part]}</h1>
              </div>
              <span className="rounded-full border border-gray-300 px-3 py-1 text-xs font-semibold">Question {partPromptIndex + 1} of {partPrompts.length}</span>
            </div>

            <section className="py-7">
              <p className="text-sm font-bold text-gray-500">{prompt.topic}</p>
              <h2 className="mt-3 max-w-3xl text-[24px] font-bold leading-9">{prompt.question}</h2>
              {prompt.helper ? (
                <div className="mt-5 max-w-3xl border-l-4 border-[#b30d2f] bg-[#f8f5f5] px-5 py-4 text-[15px] leading-7">
                  {prompt.helper.split(", and ").map((line, index) => <p key={index}>{index === 0 ? line : `and ${line}`}</p>)}
                </div>
              ) : null}

              {prompt.part === 2 ? (
                <div className="mt-5 flex flex-wrap items-center gap-3 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                  <FiClock />
                  <strong>{part2Phase === "prep" ? "Preparation time" : "Speaking time"}</strong>
                  {part2Phase === "prep" ? <span className="font-mono text-lg font-black">{formatTime(prepSeconds)}</span> : <span>You may speak for up to 2 minutes.</span>}
                  {part2Phase === "prep" ? <button type="button" onClick={() => setPart2Phase("answer")} className="ml-auto rounded bg-amber-900 px-3 py-1.5 text-xs font-bold text-white">I'm ready</button> : null}
                </div>
              ) : null}
            </section>

            <section className="mt-auto rounded-xl border border-gray-300 bg-[#fafafa] p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <button
                  type="button"
                  onClick={recordingPrompt === prompt.id ? stopRecording : startRecording}
                  disabled={Boolean(recordingPrompt && recordingPrompt !== prompt.id)}
                  className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-xl text-white shadow-md disabled:opacity-40 ${recordingPrompt === prompt.id ? "bg-red-600" : "bg-[#b30d2f]"}`}
                  aria-label={recordingPrompt === prompt.id ? "Stop recording" : "Start recording"}
                >
                  {recordingPrompt === prompt.id ? <FiSquare /> : <FiMic />}
                </button>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-bold">{recordingPrompt === prompt.id ? "Recording your answer…" : recordings[prompt.id] ? "Answer recorded" : "Ready to record"}</p>
                    <span className="font-mono text-sm font-bold">{recordingPrompt === prompt.id ? formatTime(recordingSeconds) : recordings[prompt.id] ? formatTime(recordings[prompt.id].duration) : "00:00"}</span>
                  </div>
                  <div className="mt-3 flex h-11 items-center justify-center gap-1 overflow-hidden rounded bg-white px-3">
                    {WAVEFORM.map((height, index) => <span key={index} className={`w-1 rounded-full ${recordingPrompt === prompt.id ? "animate-pulse bg-[#dc284b]" : "bg-gray-300"}`} style={{ height }} />)}
                  </div>
                </div>
              </div>
              {micError ? <p className="mt-3 text-sm font-medium text-red-700">{micError}</p> : null}
              {recordings[prompt.id] && recordingPrompt !== prompt.id ? (
                <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-gray-200 pt-4">
                  <FiCheck className="text-green-700" />
                  <span className="text-sm font-semibold text-green-800">Saved in this preview session</span>
                  <audio controls src={recordings[prompt.id].url} className="ml-auto h-9 max-w-full" aria-label={`Play answer for ${prompt.topic}`} />
                </div>
              ) : null}
            </section>

          </div>
        </main>
      </section>

      <ClientExamNavigationButtons
        className="fixed bottom-[168px] right-6 z-40"
        onPrevious={() => moveTo(promptIndex - 1)}
        onNext={() =>
          promptIndex === prompts.length - 1
            ? setShowSubmitConfirm(true)
            : moveTo(promptIndex + 1)
        }
        hasPrevious={promptIndex > 0}
        hasNext
        previousLabel="Previous prompt"
        nextLabel={
          promptIndex === prompts.length - 1
            ? "Review and submit speaking test"
            : "Next prompt"
        }
      />

      <ClientExamSectionFooter
        activeItem={promptIndex + 1}
        itemNoun="Question"
        onItemSelect={(item) => moveTo(item - 1)}
        sections={([1, 2, 3] as SpeakingPart[]).map((part) => ({
          label: `Part ${part}`,
          items: prompts.map((_, index) => index + 1).filter(
            (item) => prompts[item - 1].part === part,
          ),
          completedItems: prompts.map((item, index) =>
            recordings[item.id] ? index + 1 : 0,
          ).filter(Boolean),
        }))}
        showNavigationArrows={false}
        onPreviousItem={() => moveTo(promptIndex - 1)}
        onNextItem={() =>
          promptIndex === prompts.length - 1
            ? setShowSubmitConfirm(true)
            : moveTo(promptIndex + 1)
        }
        hasPrevious={promptIndex > 0}
        hasNext={promptIndex < prompts.length - 1}
      />

      {showSubmitConfirm ? (
        <div className="absolute inset-0 z-[90] flex items-center justify-center bg-black/50 px-4">
          <section role="dialog" aria-modal="true" className="w-full max-w-md rounded-xl bg-white p-7 text-gray-900 shadow-2xl">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-green-50 text-green-700"><FiCheck /></div>
            <h2 className="mt-4 text-xl font-bold">Submit Speaking test?</h2>
            <p className="mt-2 text-sm leading-6 text-gray-600">{Object.keys(recordings).length} of {prompts.length} responses have been recorded. Submitting opens the client-preview score and feedback page.</p>
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={() => setShowSubmitConfirm(false)} className="rounded border border-gray-300 px-4 py-2 text-sm font-semibold">Review answers</button>
              <button type="button" onClick={submitSpeaking} className="rounded bg-gray-900 px-4 py-2 text-sm font-semibold text-white">Submit test</button>
            </div>
          </section>
        </div>
      ) : null}
    </div>
  );
};

const PART_TITLES: Record<SpeakingPart, string> = { 1: "Introduction & interview", 2: "Individual long turn", 3: "Two-way discussion" };
const WAVEFORM = [12, 22, 17, 30, 20, 36, 24, 42, 18, 32, 15, 28, 38, 21, 31, 14, 25, 18, 34, 23, 16, 29, 19, 12, 27, 34, 18, 23];
function formatTime(seconds: number): string { const safe = Math.max(0, Math.floor(seconds)); return `${String(Math.floor(safe / 60)).padStart(2, "0")}:${String(safe % 60).padStart(2, "0")}`; }

export default ClientPreviewSpeakingPage;
