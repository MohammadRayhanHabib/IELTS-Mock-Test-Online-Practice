import React, { useEffect, useMemo, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  FiArrowRight,
  FiCheck,
  FiChevronDown,
  FiPause,
  FiPlay,
  FiVolume2,
  FiX,
} from "react-icons/fi";
import {
  CLIENT_LISTENING_RESULT_KEY,
  CLIENT_LISTENING_STARTED_KEY,
  playClientListeningNarration,
} from "../../data/clientPreviewListening";
import { CLIENT_READING_RESULT_KEY } from "../../data/clientPreviewReadingResult";
import { getClientPreviewMockTest } from "../../data/clientPreviewMockTests";
import ClientListeningExamHeader from "../../components/listening/ClientListeningExamHeader";
import ClientExamOptionsOverlay, {
  ClientExamContrastMode,
  ClientExamOptionsView,
  ClientExamTextSize,
} from "../../components/exam/ClientExamOptionsOverlay";

type ModuleId = "listening" | "reading" | "writing";
type Screen = "overview" | "pretest-video";
type ModuleReadinessConfig = {
  id: ModuleId;
  title: string;
  timing: string;
  information: string;
  destination: string;
};

type ModuleCompletion = Record<ModuleId, boolean>;

const pretestCompleteKey = (testNumber: number) =>
  `lexora_client_preview_pretest_complete.test-${testNumber}`;
const moduleConfirmationKey = (testNumber: number) =>
  `lexora_client_preview_module_confirmations.test-${testNumber}`;

const readModuleCompletion = (testNumber: number): ModuleCompletion => {
  const fallback = { listening: false, reading: false, writing: false };
  if (typeof window === "undefined") return fallback;

  try {
    const listening = JSON.parse(
      window.sessionStorage.getItem(CLIENT_LISTENING_RESULT_KEY) ?? "{}",
    ) as { completedAt?: string; testNumber?: number };
    const reading = JSON.parse(
      window.sessionStorage.getItem(CLIENT_READING_RESULT_KEY) ?? "{}",
    ) as { completedAt?: string; testNumber?: number };
    const writing = JSON.parse(
      window.localStorage.getItem("lexora.client-preview.writing.result.v1") ??
        "{}",
    ) as { submittedAt?: number; testNumber?: number };

    const resultMatchesTest = (resultTestNumber?: number) =>
      resultTestNumber === testNumber ||
      (testNumber === 1 && resultTestNumber == null);

    return {
      listening:
        Boolean(listening.completedAt) && resultMatchesTest(listening.testNumber),
      reading:
        Boolean(reading.completedAt) && resultMatchesTest(reading.testNumber),
      writing:
        Boolean(writing.submittedAt) && resultMatchesTest(writing.testNumber),
    };
  } catch {
    return fallback;
  }
};

const MODULES: Array<{
  id: ModuleId;
  title: string;
  timing: string;
  information: string;
}> = [
  {
    id: "listening",
    title: "Listening",
    timing: "30 minutes",
    information:
      "In the Listening test, you will hear four recordings and answer 40 questions. Each recording is played once only.",
  },
  {
    id: "reading",
    title: "Reading",
    timing: "1 hour",
    information:
      "In the Academic Reading test, you will read three passages and answer 40 questions within 60 minutes.",
  },
  {
    id: "writing",
    title: "Writing",
    timing: "1 hour",
    information:
      "In the Academic Writing test, you will complete Task 1 and Task 2. Manage your time across both tasks.",
  },
];

const readStoredConfirmations = (
  testNumber: number,
): Record<ModuleId, boolean> => {
  const fallback = { listening: false, reading: false, writing: false };
  if (typeof window === "undefined") return fallback;

  try {
    return {
      ...fallback,
      ...JSON.parse(
        window.sessionStorage.getItem(moduleConfirmationKey(testNumber)) ?? "{}",
      ),
    };
  } catch {
    return fallback;
  }
};

const formatPlaybackTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(remainder).padStart(2, "0")}`;
};

const ClientPreviewListeningPreTestPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const resetRequested = searchParams.get("reset") === "1";
  const testNumber = Math.max(
    1,
    Number.parseInt(searchParams.get("test") ?? "1", 10) || 1,
  );
  const testConfig = useMemo(
    () => getClientPreviewMockTest(testNumber),
    [testNumber],
  );
  const requestedListeningPattern = searchParams.get("pattern");
  const modules = useMemo(
    () =>
      MODULES.map((module) => {
        const destination =
          module.id === "listening"
            ? testNumber === 1 && !requestedListeningPattern
              ? "/client-preview/listening?autoplay=1"
              : `/client-preview/listening?autoplay=1&test=${testNumber}${
                  requestedListeningPattern
                    ? `&pattern=${encodeURIComponent(requestedListeningPattern)}`
                    : ""
                }`
            : module.id === "reading"
              ? testConfig.modulePaths.READING
              : testConfig.modulePaths.WRITING;

        return { ...module, destination };
      }),
    [requestedListeningPattern, testConfig, testNumber],
  );
  const [screen, setScreen] = useState<Screen>("overview");
  const [pretestComplete, setPretestComplete] = useState(() =>
    resetRequested
      ? false
      : window.sessionStorage.getItem(pretestCompleteKey(testNumber)) === "true",
  );
  const [pretestAcknowledged, setPretestAcknowledged] = useState(false);
  const [expandedModule, setExpandedModule] = useState<ModuleId | null>(null);
  const [confirmedModules, setConfirmedModules] =
    useState<Record<ModuleId, boolean>>(() =>
      resetRequested
        ? { listening: false, reading: false, writing: false }
        : readStoredConfirmations(testNumber),
    );
  const completedModules = useMemo(
    () => readModuleCompletion(testNumber),
    [testNumber],
  );
  const [contrastMode, setContrastMode] =
    useState<ClientExamContrastMode>("black-on-white");
  const [textSize, setTextSize] = useState<ClientExamTextSize>("base");
  const [optionsView, setOptionsView] =
    useState<ClientExamOptionsView | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    if (!resetRequested) return;
    window.sessionStorage.removeItem(pretestCompleteKey(testNumber));
    window.sessionStorage.removeItem(moduleConfirmationKey(testNumber));
    window.sessionStorage.removeItem(CLIENT_LISTENING_RESULT_KEY);
    window.sessionStorage.removeItem(CLIENT_READING_RESULT_KEY);
    window.localStorage.removeItem("lexora.client-preview.writing.result.v1");
    window.localStorage.removeItem("lexora.client-preview.speaking.result.v1");
    window.localStorage.removeItem("lexora.client-preview.writing.essay.v1");
    window.localStorage.removeItem("lexora.client-preview.writing.essay.task-two.v1");
    const patternQuery = requestedListeningPattern
      ? `&pattern=${encodeURIComponent(requestedListeningPattern)}`
      : "";
    navigate(
      `/client-preview/listening/pre-test?test=${testNumber}${patternQuery}`,
      { replace: true },
    );
  }, [navigate, requestedListeningPattern, resetRequested, testNumber]);

  useEffect(() => {
    return () => window.speechSynthesis?.cancel();
  }, []);

  const completePretest = () => {
    if (!pretestAcknowledged) return;
    window.sessionStorage.setItem(pretestCompleteKey(testNumber), "true");
    setPretestComplete(true);
    setScreen("overview");
  };

  const confirmModule = (moduleId: ModuleId) => {
    const next = { ...confirmedModules, [moduleId]: true };
    setConfirmedModules(next);
    window.sessionStorage.setItem(
      moduleConfirmationKey(testNumber),
      JSON.stringify(next),
    );
    setExpandedModule(null);
  };

  const startModule = (moduleId: ModuleId, destination: string) => {
    if (moduleId === "listening") {
      window.speechSynthesis?.cancel();
      window.sessionStorage.removeItem(CLIENT_LISTENING_RESULT_KEY);
      window.sessionStorage.setItem(CLIENT_LISTENING_STARTED_KEY, String(Date.now()));
      playClientListeningNarration();
    }
    navigate(destination);
  };

  return (
    <div
      data-ielts-contrast={contrastMode}
      data-ielts-text-size={textSize}
      className="ielts-exam-shell fixed inset-0 z-50 flex min-h-[680px] flex-col overflow-y-auto bg-white text-[#222]"
    >
      <Helmet>
        <title>IELTS Mock Test Preparation – Lexora Academy</title>
      </Helmet>

      <ClientListeningExamHeader
        mode="pretest"
        moduleLabel="Mock Exam"
        showAudioControls={false}
        onOpenSettings={() => {
          setOptionsView(null);
          setShowSettings((current) => !current);
        }}
        onOpenOptions={() => {
          setShowSettings(false);
          setOptionsView("menu");
        }}
      />

      {showSettings ? (
        <SettingsPopover
          textSize={textSize}
          onTextSizeChange={setTextSize}
          onClose={() => setShowSettings(false)}
        />
      ) : null}

      {optionsView ? (
        <ClientExamOptionsOverlay
          view={optionsView}
          contrastMode={contrastMode}
          textSize={textSize}
          onViewChange={setOptionsView}
          onClose={() => setOptionsView(null)}
          onSubmit={() => setOptionsView(null)}
          onContrastChange={setContrastMode}
          onTextSizeChange={setTextSize}
        />
      ) : null}

      <main className="mx-auto w-full max-w-[1200px] flex-1 px-4 py-5 sm:px-6 sm:py-7">
        <section aria-label="Mock test preparation status" className="space-y-4">
          <PretestCard
            complete={pretestComplete}
            onOpen={() => setScreen("pretest-video")}
          />

          {modules.map((module, index) => {
            const previousModule = modules[index - 1];
            const available =
              index === 0 || completedModules[previousModule.id];

            return (
              <ModuleReadinessCard
                key={module.id}
                module={module}
                pretestComplete={pretestComplete}
                complete={completedModules[module.id]}
                available={available}
                availableAfter={previousModule?.title}
                expanded={expandedModule === module.id}
                confirmed={confirmedModules[module.id]}
                onToggle={() =>
                  setExpandedModule((current) =>
                    current === module.id ? null : module.id,
                  )
                }
                onConfirm={() => confirmModule(module.id)}
                onStart={() => startModule(module.id, module.destination)}
              />
            );
          })}
        </section>
      </main>

      {screen === "pretest-video" ? (
        <PretestVideoScreen
          acknowledged={pretestAcknowledged}
          onAcknowledgedChange={setPretestAcknowledged}
          onClose={() => setScreen("overview")}
          onNext={completePretest}
        />
      ) : null}
    </div>
  );
};

const PretestCard: React.FC<{
  complete: boolean;
  onOpen: () => void;
}> = ({ complete, onOpen }) => (
  <article className="border border-[#c8c8c8] bg-white px-3 py-4 sm:px-4">
    <div className="flex items-start justify-between gap-4">
      <div>
        <h1 className="text-[25px] font-bold leading-tight">Pre-test checks</h1>
        {complete ? <p className="mt-5 text-sm text-[#43a400]">Complete</p> : null}
      </div>
      {complete ? (
        <FiCheck
          aria-label="Pre test complete"
          className="mt-2 h-12 w-12 stroke-[4] text-[#43a400]"
        />
      ) : null}
    </div>

    {!complete ? (
      <div
        role="button"
        tabIndex={0}
        onClick={onOpen}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            onOpen();
          }
        }}
        className="mx-auto mt-5 block w-full max-w-[700px] cursor-pointer text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#168bd2] focus-visible:ring-offset-2"
        aria-label="Open the pre-test instructional video"
      >
        <InstructionPlayer compact onPlayRequest={onOpen} />
      </div>
    ) : null}
  </article>
);

const ModuleReadinessCard: React.FC<{
  module: ModuleReadinessConfig;
  pretestComplete: boolean;
  complete: boolean;
  available: boolean;
  availableAfter?: string;
  expanded: boolean;
  confirmed: boolean;
  onToggle: () => void;
  onConfirm: () => void;
  onStart: () => void;
}> = ({
  module,
  pretestComplete,
  complete,
  available,
  availableAfter,
  expanded,
  confirmed,
  onToggle,
  onConfirm,
  onStart,
}) => (
  <article className="border border-[#c8c8c8] bg-white px-3 py-4 sm:px-4">
    <div className="flex items-start justify-between gap-4">
      <div>
        <h2 className="text-[24px] font-bold leading-tight">{module.title}</h2>
        <p
          className={`mt-5 text-sm ${
            complete
              ? "text-[#43a400]"
              : available
                ? "text-[#ff2d22]"
                : "text-[#6d7278]"
          }`}
        >
          {complete
            ? "Completed"
            : available
              ? "Not completed"
              : `Available after ${availableAfter ?? "the previous module"}`}
        </p>
      </div>
      {complete ? (
        <FiCheck
          aria-label={`${module.title} complete`}
          className="mt-2 h-12 w-12 stroke-[4] text-[#43a400]"
        />
      ) : null}
    </div>
    <p className="mt-5 text-base">Timing: {module.timing}</p>

    {pretestComplete && available && !complete ? (
      <div className="mt-7">
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={expanded}
          className="flex min-h-[58px] w-full items-center gap-4 border border-[#c8c8c8] bg-white px-4 text-left transition-colors hover:bg-[#fafafa] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#168bd2] focus-visible:ring-inset"
        >
          <FiChevronDown
            aria-hidden="true"
            className={`h-5 w-5 shrink-0 stroke-[3] transition-transform ${
              expanded ? "rotate-180" : ""
            }`}
          />
          <span className="text-sm">Test information</span>
          <span
            className={`text-sm ${confirmed ? "text-[#43a400]" : "text-[#ff2d22]"}`}
          >
            {confirmed ? "Confirmed" : "Not confirmed"}
          </span>
        </button>

        {expanded && !confirmed ? (
          <div className="border-x border-b border-[#c8c8c8] bg-[#f7f7f7] px-4 py-5 sm:px-8">
            <div className="mx-auto max-w-[700px]">
              <InstructionPlayer
                compact
                moduleTitle={module.title}
                supportingText={module.information}
              />
              <h3 className="mt-4 text-[22px] font-bold">Ready?</h3>
              <p className="mt-3 text-sm">
                Please confirm after you fully understand the content of this video.
              </p>
              <button
                type="button"
                onClick={onConfirm}
                className="mt-4 inline-flex min-h-10 items-center gap-3 bg-[#303030] px-4 text-sm font-semibold text-white hover:bg-black focus:outline-none focus-visible:ring-2 focus-visible:ring-[#168bd2] focus-visible:ring-offset-2"
              >
                <FiCheck aria-hidden="true" />
                I confirm
              </button>
            </div>
          </div>
        ) : null}

        {confirmed ? (
          <button
            type="button"
            onClick={onStart}
            className="mt-4 inline-flex min-h-[48px] items-center gap-4 bg-black px-5 text-sm font-semibold text-white hover:bg-[#252525] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#168bd2] focus-visible:ring-offset-2"
          >
            <FiArrowRight aria-hidden="true" className="h-5 w-5" />
            Start IELTS Online {module.title}
          </button>
        ) : null}
      </div>
    ) : null}
  </article>
);

const PretestVideoScreen: React.FC<{
  acknowledged: boolean;
  onAcknowledgedChange: (value: boolean) => void;
  onClose: () => void;
  onNext: () => void;
}> = ({ acknowledged, onAcknowledgedChange, onClose, onNext }) => (
  <section
    role="dialog"
    aria-modal="true"
    aria-labelledby="pretest-video-title"
    className="fixed inset-0 z-[70] overflow-y-auto bg-white"
  >
    <button
      type="button"
      onClick={onClose}
      aria-label="Close pre-test instructions"
      className="fixed right-5 top-4 z-10 flex h-10 w-10 items-center justify-center text-[#666] hover:bg-[#f2f2f2] hover:text-black focus:outline-none focus-visible:ring-2 focus-visible:ring-[#168bd2]"
    >
      <FiX aria-hidden="true" className="h-5 w-5" />
    </button>

    <div className="min-h-screen px-4 py-[86px] sm:px-8 lg:px-[50px]">
      <h2 id="pretest-video-title" className="sr-only">
        Pre-test instructional video
      </h2>
      <div className="max-w-[1002px]">
        <InstructionPlayer />
        <p className="mt-3 text-base">
          Please confirm after you fully understand the content of this video
        </p>
        <label className="mt-3 inline-flex cursor-pointer items-center gap-2 text-base">
          <input
            type="radio"
            name="pretest-understood"
            checked={acknowledged}
            onChange={() => onAcknowledgedChange(true)}
            className="h-4 w-4 accent-[#168bd2]"
          />
          <span>Yes</span>
        </label>
      </div>

      <button
        type="button"
        onClick={onNext}
        disabled={!acknowledged}
        className="fixed bottom-[calc(24px+env(safe-area-inset-bottom))] right-8 min-h-10 min-w-[120px] bg-[#303030] px-8 text-base font-medium text-white hover:bg-black disabled:cursor-not-allowed disabled:bg-[#bcbcbc] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#168bd2] focus-visible:ring-offset-2 sm:right-[84px]"
      >
        NEXT
      </button>
    </div>
  </section>
);

const InstructionPlayer: React.FC<{
  compact?: boolean;
  moduleTitle?: string;
  supportingText?: string;
  onPlayRequest?: () => void;
}> = ({ compact = false, moduleTitle, supportingText, onPlayRequest }) => {
  const duration = moduleTitle ? 60 : 105;
  const [currentTime, setCurrentTime] = useState(0);
  const [playing, setPlaying] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const narration = useMemo(
    () =>
      supportingText ??
      "On the actual IELTS computer-delivered test, this is an instructional video demonstrating how to use the new system. Review the tips carefully before continuing.",
    [supportingText],
  );

  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => {
      setCurrentTime((value) => {
        if (value >= duration - 1) {
          setPlaying(false);
          return duration;
        }
        return value + 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [duration, playing]);

  useEffect(
    () => () => {
      if (utteranceRef.current) window.speechSynthesis?.cancel();
    },
    [],
  );

  const togglePlayback = (event: React.MouseEvent) => {
    event.stopPropagation();

    if (!playing && onPlayRequest) {
      onPlayRequest();
      return;
    }

    if (playing) {
      window.speechSynthesis?.pause();
      setPlaying(false);
      return;
    }

    if (currentTime >= duration) setCurrentTime(0);
    if (window.speechSynthesis?.paused) {
      window.speechSynthesis.resume();
    } else if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(narration);
      utterance.lang = "en-GB";
      utterance.rate = 0.88;
      utterance.onend = () => setPlaying(false);
      utterance.onerror = () => setPlaying(false);
      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    }
    setPlaying(true);
  };

  const progress = Math.min(100, (currentTime / duration) * 100);

  return (
    <div className="border border-[#d6dce0] bg-white">
      <div
        className={`flex flex-col justify-center px-[9%] ${
          compact ? "min-h-[300px] py-10" : "min-h-[496px] py-14"
        }`}
      >
        <div className="max-w-[650px] text-[#303030]">
          <p
            className={`font-bold leading-[1.16] ${
              compact ? "text-[22px]" : "text-[29px] sm:text-[31px]"
            }`}
          >
            On the actual IELTS computer-delivered test, this is an instructional
            video demonstrating how to use the new system.
          </p>
          <h3 className="mt-8 text-[20px] font-bold">Tips:</h3>
          <ul className="mt-2 list-disc space-y-2 pl-5 text-[14px] font-semibold leading-relaxed">
            <li>Click the play button in the bottom-left corner to start playback.</li>
            <li>Use the player volume control and the page volume control as needed.</li>
            <li className="text-[#d00000]">
              In the actual IELTS computer-based test, you must wait for the video
              to finish before confirming.
            </li>
            <li>
              This is a mock exam, so you may confirm directly when you are ready.
            </li>
          </ul>
          {supportingText ? (
            <p className="mt-5 text-[14px] font-medium leading-relaxed">
              {supportingText}
            </p>
          ) : null}
        </div>
      </div>
      <div className="flex h-[28px] items-center gap-2 bg-[#dfe3e7] px-1.5 text-[11px] text-[#333]">
        <button
          type="button"
          onClick={togglePlayback}
          aria-label={playing ? "Pause instructional video" : "Play instructional video"}
          className="flex h-6 w-6 items-center justify-center hover:bg-[#cbd0d5] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#168bd2]"
        >
          {playing ? <FiPause /> : <FiPlay className="fill-current" />}
        </button>
        <div className="h-1 flex-1 bg-[#c3c8cd]" aria-hidden="true">
          <div className="h-full bg-[#555]" style={{ width: `${progress}%` }} />
        </div>
        <span className="tabular-nums">
          {formatPlaybackTime(currentTime)} / {formatPlaybackTime(duration)}
        </span>
        <FiVolume2 aria-hidden="true" className="h-4 w-4" />
      </div>
    </div>
  );
};

const SettingsPopover: React.FC<{
  textSize: ClientExamTextSize;
  onTextSizeChange: (value: ClientExamTextSize) => void;
  onClose: () => void;
}> = ({ textSize, onTextSizeChange, onClose }) => (
  <section className="absolute right-6 top-[52px] z-50 w-56 border border-gray-300 bg-white p-4 shadow-xl">
    <h2 className="text-sm font-bold text-gray-900">Settings</h2>
    <p className="mb-2 mt-3 text-xs text-gray-600">Font size</p>
    <div className="flex gap-2">
      {(["base", "lg", "xl"] as const).map((size) => (
        <button
          key={size}
          type="button"
          onClick={() => onTextSizeChange(size)}
          className={`flex-1 border py-1.5 text-xs font-semibold ${
            textSize === size
              ? "border-black bg-black text-white"
              : "border-gray-300 bg-white text-gray-800 hover:bg-gray-50"
          }`}
        >
          {size === "base" ? "A" : size === "lg" ? "A+" : "A++"}
        </button>
      ))}
    </div>
    <button
      type="button"
      onClick={onClose}
      className="mt-4 w-full py-1 text-xs font-semibold text-gray-500 hover:text-black"
    >
      Close
    </button>
  </section>
);

export default ClientPreviewListeningPreTestPage;
