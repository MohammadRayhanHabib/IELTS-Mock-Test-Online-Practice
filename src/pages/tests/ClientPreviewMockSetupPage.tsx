import React, { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  FiArrowLeft,
  FiArrowRight,
  FiBatteryCharging,
  FiCheck,
  FiCommand,
  FiMousePointer,
  FiPlay,
  FiVolume2,
  FiWifi,
} from "react-icons/fi";
import ClientMockJourneyStepper from "../../components/exam/ClientMockJourneyStepper";
import ClientListeningExamHeader from "../../components/listening/ClientListeningExamHeader";
import { getClientPreviewMockTest } from "../../data/clientPreviewMockTests";

type SetupStage = "details" | "system";

type BatteryManager = {
  charging: boolean;
};

type PowerState = "checking" | "charging" | "battery" | "unavailable";

type NavigatorWithBattery = Navigator & {
  getBattery?: () => Promise<BatteryManager>;
};

const setupCompleteKey = (testNumber: number) =>
  `lexora_client_preview_setup_complete.test-${testNumber}`;

const ClientPreviewMockSetupPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const testNumber = Math.max(
    1,
    Number.parseInt(searchParams.get("test") ?? "1", 10) || 1,
  );
  const test = useMemo(() => getClientPreviewMockTest(testNumber), [testNumber]);
  const [stage, setStage] = useState<SetupStage>("details");
  const [detailsConfirmed, setDetailsConfirmed] = useState(false);
  const [soundPlayed, setSoundPlayed] = useState(false);
  const [soundWorking, setSoundWorking] = useState(false);
  const [soundUnsupported, setSoundUnsupported] = useState(false);
  const [internetWorking, setInternetWorking] = useState(
    () => typeof navigator !== "undefined" && navigator.onLine,
  );
  const [keyboardDetected, setKeyboardDetected] = useState(false);
  const [mouseDetected, setMouseDetected] = useState(false);
  const [powerState, setPowerState] = useState<PowerState>("checking");

  useEffect(() => {
    const detectKeyboard = () => setKeyboardDetected(true);
    const detectMouse = () => setMouseDetected(true);
    const updateInternet = () => setInternetWorking(navigator.onLine);
    window.addEventListener("keydown", detectKeyboard, { once: true });
    window.addEventListener("pointermove", detectMouse, { once: true });
    window.addEventListener("online", updateInternet);
    window.addEventListener("offline", updateInternet);

    const batteryNavigator = navigator as NavigatorWithBattery;
    if (batteryNavigator.getBattery) {
      void batteryNavigator
        .getBattery()
        .then((battery) =>
          setPowerState(battery.charging ? "charging" : "battery"),
        )
        .catch(() => setPowerState("unavailable"));
    } else {
      setPowerState("unavailable");
    }

    return () => {
      window.removeEventListener("keydown", detectKeyboard);
      window.removeEventListener("pointermove", detectMouse);
      window.removeEventListener("online", updateInternet);
      window.removeEventListener("offline", updateInternet);
      window.speechSynthesis?.cancel();
    };
  }, []);

  const playSoundCheck = () => {
    if (!("speechSynthesis" in window) || !("SpeechSynthesisUtterance" in window)) {
      setSoundUnsupported(true);
      setSoundPlayed(false);
      setSoundWorking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const sample = new SpeechSynthesisUtterance(
      "This is the Lexora listening sound check. If you can hear this message, your audio is working.",
    );
    sample.lang = "en-GB";
    sample.rate = 0.9;
    sample.volume = 0.8;
    sample.onstart = () => {
      setSoundUnsupported(false);
      setSoundPlayed(true);
    };
    sample.onerror = () => {
      setSoundUnsupported(true);
      setSoundPlayed(false);
      setSoundWorking(false);
    };
    window.speechSynthesis.speak(sample);
  };

  const checksComplete =
    soundWorking &&
    internetWorking &&
    keyboardDetected &&
    mouseDetected &&
    powerState !== "checking";

  const continueToInstructions = () => {
    if (!checksComplete) return;
    window.sessionStorage.setItem(setupCompleteKey(testNumber), "true");
    navigate(`/client-preview/listening/pre-test?test=${testNumber}&reset=1`);
  };

  return (
    <div className="ielts-exam-shell fixed inset-0 z-50 flex min-h-[680px] flex-col overflow-y-auto bg-[#f5f5f3] text-[#202124]">
      <Helmet>
        <title>Mock Test Setup – Lexora Academy</title>
      </Helmet>

      <ClientListeningExamHeader
        mode="pretest"
        moduleLabel="Mock Exam"
        showAudioControls={false}
      />

      <main className="mx-auto flex w-full max-w-[1180px] flex-1 flex-col px-4 py-6 sm:px-6 sm:py-8">
        <section className="border border-[#d1d4d8] bg-white px-4 py-5 sm:px-8">
          <ClientMockJourneyStepper
            currentStep={stage === "details" ? 1 : 2}
            completedThrough={stage === "details" ? 0 : 1}
          />
        </section>

        {stage === "details" ? (
          <ConfirmDetailsPanel
            testNumber={testNumber}
            testLabel={test.label}
            confirmed={detailsConfirmed}
            onConfirmedChange={setDetailsConfirmed}
            onContinue={() => setStage("system")}
          />
        ) : (
          <SystemCheckPanel
            soundWorking={soundWorking}
            internetWorking={internetWorking}
            keyboardDetected={keyboardDetected}
            mouseDetected={mouseDetected}
            powerState={powerState}
            checksComplete={checksComplete}
            onBack={() => setStage("details")}
            onPlaySound={playSoundCheck}
            onConfirmSound={() => setSoundWorking(true)}
            onRetestInternet={() => setInternetWorking(navigator.onLine)}
            onContinue={continueToInstructions}
            soundPlayed={soundPlayed}
            soundUnsupported={soundUnsupported}
          />
        )}
      </main>
    </div>
  );
};

const ConfirmDetailsPanel: React.FC<{
  testNumber: number;
  testLabel: string;
  confirmed: boolean;
  onConfirmedChange: (value: boolean) => void;
  onContinue: () => void;
}> = ({
  testNumber,
  testLabel,
  confirmed,
  onConfirmedChange,
  onContinue,
}) => (
  <section className="mt-5 border border-[#c9ccd1] bg-white p-5 sm:p-8">
    <h1 className="text-2xl font-bold tracking-[-0.02em]">Confirm your test details</h1>
    <p className="mt-2 max-w-[70ch] text-sm leading-6 text-[#5f6368]">
      Check the information below before starting the equipment test. These details
      will remain attached to this client-preview attempt.
    </p>

    <dl className="mt-7 divide-y divide-[#e1e3e6] border-y border-[#e1e3e6]">
      <DetailRow label="Candidate number" value="48887345" />
      <DetailRow label="Exam" value="IELTS Academic" />
      <DetailRow label="Mock test" value={`Test ${testNumber} · ${testLabel}`} />
      <DetailRow
        label="Modules"
        value="Listening · Reading · Writing · Speaking"
      />
      <DetailRow label="Scheduled duration" value="Approximately 2 hours 44 minutes" />
    </dl>

    <label className="mt-6 flex cursor-pointer items-start gap-3 text-sm leading-6">
      <input
        type="checkbox"
        checked={confirmed}
        onChange={(event) => onConfirmedChange(event.target.checked)}
        className="mt-1 h-4 w-4 accent-[#202124]"
      />
      <span>I confirm that the test and candidate details shown above are correct.</span>
    </label>

    <div className="mt-8 flex justify-end">
      <button
        type="button"
        onClick={onContinue}
        disabled={!confirmed}
        className="inline-flex min-h-11 items-center gap-3 bg-[#202124] px-6 text-sm font-semibold text-white hover:bg-black disabled:cursor-not-allowed disabled:bg-[#b9bcc0] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#168bd2] focus-visible:ring-offset-2"
      >
        Continue to system check
        <FiArrowRight aria-hidden="true" />
      </button>
    </div>
  </section>
);

const DetailRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="grid gap-1 py-4 sm:grid-cols-[210px_minmax(0,1fr)] sm:gap-6">
    <dt className="text-sm font-semibold text-[#5f6368]">{label}</dt>
    <dd className="text-sm font-semibold text-[#202124]">{value}</dd>
  </div>
);

const SystemCheckPanel: React.FC<{
  soundWorking: boolean;
  soundPlayed: boolean;
  soundUnsupported: boolean;
  internetWorking: boolean;
  keyboardDetected: boolean;
  mouseDetected: boolean;
  powerState: PowerState;
  checksComplete: boolean;
  onBack: () => void;
  onPlaySound: () => void;
  onConfirmSound: () => void;
  onRetestInternet: () => void;
  onContinue: () => void;
}> = ({
  soundWorking,
  soundPlayed,
  soundUnsupported,
  internetWorking,
  keyboardDetected,
  mouseDetected,
  powerState,
  checksComplete,
  onBack,
  onPlaySound,
  onConfirmSound,
  onRetestInternet,
  onContinue,
}) => (
  <section className="mt-5 border border-[#c9ccd1] bg-white p-5 sm:p-8">
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-[-0.02em]">System check</h1>
        <p className="mt-2 max-w-[70ch] text-sm leading-6 text-[#5f6368]">
          Complete each check before opening the exam instructions. Move the mouse
          and press any keyboard key to confirm both input devices.
        </p>
      </div>
      <span className="text-xs font-semibold text-[#5f6368]">
        {[
          soundWorking,
          internetWorking,
          keyboardDetected,
          mouseDetected,
          powerState !== "checking",
        ].filter(Boolean).length}{" "}
        of 5 checks passed
      </span>
    </div>

    <div className="mt-7 divide-y divide-[#e1e3e6] border-y border-[#e1e3e6]">
      <CheckRow
        icon={<FiVolume2 />}
        title="Sound check"
        detail="Play the sample and confirm that browser audio is available."
        passed={soundWorking}
        pendingLabel={
          soundUnsupported
            ? "Audio unavailable"
            : soundPlayed
              ? "Awaiting confirmation"
              : "Not tested"
        }
        pendingTone={soundUnsupported ? "error" : "warning"}
        action={
          <div className="flex flex-wrap justify-end gap-2">
            <button
              type="button"
              onClick={onPlaySound}
              className="inline-flex min-h-9 items-center gap-2 border border-[#aeb3b9] bg-white px-3 text-xs font-semibold hover:bg-[#f4f4f4] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#168bd2]"
            >
              <FiPlay aria-hidden="true" /> {soundPlayed ? "Play again" : "Play sample"}
            </button>
            {soundPlayed && !soundWorking ? (
              <button
                type="button"
                onClick={onConfirmSound}
                className="inline-flex min-h-9 items-center gap-2 bg-[#202124] px-3 text-xs font-semibold text-white hover:bg-black focus:outline-none focus-visible:ring-2 focus-visible:ring-[#168bd2]"
              >
                <FiCheck aria-hidden="true" /> I heard it
              </button>
            ) : null}
          </div>
        }
      />
      <CheckRow
        icon={<FiWifi />}
        title="Internet connection"
        detail="Required to keep the attempt connected and save progress."
        passed={internetWorking}
        pendingLabel="Offline"
        action={
          <button
            type="button"
            onClick={onRetestInternet}
            className="min-h-9 border border-[#aeb3b9] bg-white px-3 text-xs font-semibold hover:bg-[#f4f4f4] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#168bd2]"
          >
            Test connection
          </button>
        }
      />
      <CheckRow
        icon={<FiCommand />}
        title="Keyboard check"
        detail="Press any key while this page is open."
        passed={keyboardDetected}
        pendingLabel="Waiting for a key"
      />
      <CheckRow
        icon={<FiMousePointer />}
        title="Mouse or trackpad"
        detail="Move your pointer anywhere on the page."
        passed={mouseDetected}
        pendingLabel="Waiting for movement"
      />
      <CheckRow
        icon={<FiBatteryCharging />}
        title="Power check"
        detail="A connected charger is recommended for the full mock test."
        passed={powerState === "charging" || powerState === "battery"}
        pendingLabel={
          powerState === "checking"
            ? "Checking power"
            : "Status unavailable in this browser"
        }
        pendingTone="neutral"
        passedLabel={powerState === "charging" ? "Charging" : "Battery detected"}
      />
    </div>

    <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex min-h-11 items-center gap-2 border border-[#aeb3b9] bg-white px-5 text-sm font-semibold hover:bg-[#f4f4f4] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#168bd2]"
      >
        <FiArrowLeft aria-hidden="true" /> Back
      </button>
      <button
        type="button"
        onClick={onContinue}
        disabled={!checksComplete}
        className="inline-flex min-h-11 items-center gap-3 bg-[#202124] px-6 text-sm font-semibold text-white hover:bg-black disabled:cursor-not-allowed disabled:bg-[#b9bcc0] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#168bd2] focus-visible:ring-offset-2"
      >
        Continue to exam instructions
        <FiArrowRight aria-hidden="true" />
      </button>
    </div>
  </section>
);

const CheckRow: React.FC<{
  icon: React.ReactNode;
  title: string;
  detail: string;
  passed: boolean;
  pendingLabel: string;
  pendingTone?: "warning" | "error" | "neutral";
  passedLabel?: string;
  action?: React.ReactNode;
}> = ({
  icon,
  title,
  detail,
  passed,
  pendingLabel,
  pendingTone = "warning",
  passedLabel = "Working",
  action,
}) => (
  <div className="grid items-center gap-4 py-4 sm:grid-cols-[42px_minmax(0,1fr)_150px_auto]">
    <span
      aria-hidden="true"
      className="flex h-10 w-10 items-center justify-center text-xl text-[#30343a]"
    >
      {icon}
    </span>
    <span>
      <strong className="block text-sm">{title}</strong>
      <span className="mt-0.5 block text-xs leading-5 text-[#6a6f76]">{detail}</span>
    </span>
    <span
      role="status"
      aria-live="polite"
      className={`inline-flex w-fit items-center gap-2 text-xs font-semibold ${
        passed
          ? "text-[#207a34]"
          : pendingTone === "error"
            ? "text-[#b3261e]"
            : pendingTone === "neutral"
              ? "text-[#5f6368]"
              : "text-[#9a4e00]"
      }`}
    >
      {passed ? <FiCheck aria-hidden="true" /> : null}
      {passed ? passedLabel : pendingLabel}
    </span>
    <span className="sm:justify-self-end">{action}</span>
  </div>
);

export default ClientPreviewMockSetupPage;
