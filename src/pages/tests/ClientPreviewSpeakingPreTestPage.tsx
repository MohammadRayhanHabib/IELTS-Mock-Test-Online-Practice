import React, { useEffect, useMemo, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FiCheck,
  FiHeadphones,
  FiMic,
  FiPlay,
  FiShield,
  FiSquare,
} from "react-icons/fi";
import ClientListeningExamHeader from "../../components/listening/ClientListeningExamHeader";

type MicState = "idle" | "recording" | "ready" | "denied";

const ClientPreviewSpeakingPreTestPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const testNumber = useMemo(() => {
    const parsed = Number(new URLSearchParams(location.search).get("test"));
    return Number.isInteger(parsed) && parsed >= 1 && parsed <= 4 ? parsed : 1;
  }, [location.search]);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const [micState, setMicState] = useState<MicState>("idle");
  const [audioUrl, setAudioUrl] = useState("");

  useEffect(
    () => () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    },
    [audioUrl],
  );

  const testMicrophone = async () => {
    if (micState === "recording") {
      recorderRef.current?.stop();
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      chunksRef.current = [];
      const recorder = new MediaRecorder(stream);
      recorderRef.current = recorder;
      recorder.ondataavailable = (event) => {
        if (event.data.size) chunksRef.current.push(event.data);
      };
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || "audio/webm" });
        setAudioUrl((current) => {
          if (current) URL.revokeObjectURL(current);
          return URL.createObjectURL(blob);
        });
        stream.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
        setMicState("ready");
      };
      recorder.start();
      setMicState("recording");
    } catch {
      setMicState("denied");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex min-h-[680px] flex-col overflow-y-auto bg-[#f5f5f5] text-[#20252b]">
      <Helmet>
        <title>Speaking Pre-test – Lexora</title>
      </Helmet>

      <ClientListeningExamHeader mode="pretest" moduleLabel="Speaking" showAudioControls={false} />

      <main className="flex flex-1 items-center justify-center px-4 py-8 sm:px-8">
        <section className="w-full max-w-[1040px] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 px-6 py-5 sm:px-10">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#b30d2f]">Speaking mock test</p>
            <h1 className="mt-1 text-3xl font-black">Check your microphone</h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-600">
              Your answers will be recorded in the browser. Complete this short check before the 11–14 minute, three-part Speaking test begins.
            </p>
          </div>

          <div className="grid gap-0 lg:grid-cols-[1fr_390px]">
            <div className="px-6 py-7 sm:px-10">
              <h2 className="text-lg font-bold">Before you begin</h2>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <Requirement icon={<FiMic />} title="Microphone" copy="Allow browser access when prompted." />
                <Requirement icon={<FiHeadphones />} title="Quiet room" copy="Use a headset where possible." />
                <Requirement icon={<FiShield />} title="One attempt" copy="Answer naturally without a script." />
              </div>

              <div className="mt-7 rounded-xl border border-[#dedede] bg-[#fafafa] p-5">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="font-bold">Record a short sample</p>
                    <p className="mt-1 text-sm text-gray-500">Say: “My microphone is ready for the Lexora Speaking test.”</p>
                  </div>
                  <button
                    type="button"
                    onClick={testMicrophone}
                    className={`inline-flex min-h-11 items-center gap-2 rounded-md px-5 text-sm font-bold text-white ${
                      micState === "recording" ? "bg-red-600" : "bg-[#20252b]"
                    }`}
                  >
                    {micState === "recording" ? <FiSquare /> : <FiMic />}
                    {micState === "recording" ? "Stop recording" : micState === "ready" ? "Record again" : "Test microphone"}
                  </button>
                </div>

                {micState === "recording" ? (
                  <div className="mt-5 flex h-12 items-center justify-center gap-1 rounded-lg bg-white" aria-label="Microphone recording in progress">
                    {WAVEFORM.map((height, index) => (
                      <span key={index} className="w-1 animate-pulse rounded-full bg-[#dc284b]" style={{ height }} />
                    ))}
                  </div>
                ) : null}

                {micState === "ready" && audioUrl ? (
                  <div className="mt-5 flex flex-wrap items-center gap-3 rounded-lg border border-green-200 bg-green-50 p-3">
                    <FiCheck className="text-green-700" />
                    <span className="text-sm font-semibold text-green-800">Microphone sample saved</span>
                    <audio src={audioUrl} controls className="ml-auto h-9 max-w-full" aria-label="Play microphone sample" />
                  </div>
                ) : null}

                {micState === "denied" ? (
                  <p className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                    Microphone access is blocked. You may continue for UI review, but recording controls will need browser permission.
                  </p>
                ) : null}
              </div>
            </div>

            <aside className="border-t border-gray-200 bg-[#f7f8fa] px-6 py-7 lg:border-l lg:border-t-0 sm:px-8">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-gray-500">Test structure</p>
              <ol className="mt-5 space-y-4">
                <TestPart number="1" title="Introduction & interview" duration="4–5 minutes" />
                <TestPart number="2" title="Individual long turn" duration="1 minute prep + up to 2 minutes" />
                <TestPart number="3" title="Two-way discussion" duration="4–5 minutes" />
              </ol>
              <button
                type="button"
                onClick={() => navigate(`/client-preview/speaking?test=${testNumber}`)}
                className="mt-8 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-[#b30d2f] px-5 text-sm font-black text-white hover:bg-[#950a27]"
              >
                <FiPlay /> Start Speaking test
              </button>
              <button type="button" onClick={() => navigate("/client-preview/mock-tests")} className="mt-3 w-full py-2 text-sm font-semibold text-gray-500 hover:text-gray-900">
                Return to Mock Tests
              </button>
            </aside>
          </div>
        </section>
      </main>
    </div>
  );
};

const Requirement: React.FC<{ icon: React.ReactNode; title: string; copy: string }> = ({ icon, title, copy }) => (
  <div className="rounded-xl border border-gray-200 p-4">
    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-red-50 text-[#b30d2f]">{icon}</span>
    <p className="mt-3 text-sm font-bold">{title}</p>
    <p className="mt-1 text-xs leading-5 text-gray-500">{copy}</p>
  </div>
);

const TestPart: React.FC<{ number: string; title: string; duration: string }> = ({ number, title, duration }) => (
  <li className="flex gap-3">
    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#263b50] text-xs font-black text-white">{number}</span>
    <span>
      <strong className="block text-sm">{title}</strong>
      <small className="mt-0.5 block text-xs text-gray-500">{duration}</small>
    </span>
  </li>
);

const WAVEFORM = [12, 22, 17, 30, 20, 36, 24, 42, 18, 32, 15, 28, 38, 21, 31, 14, 25, 18, 34, 23];

export default ClientPreviewSpeakingPreTestPage;
