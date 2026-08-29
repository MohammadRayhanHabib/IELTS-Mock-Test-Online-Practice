import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import {
  FiBarChart2,
  FiCheck,
  FiClock,
  FiDownload,
  FiMessageCircle,
  FiMic,
  FiRefreshCw,
} from "react-icons/fi";

type StoredResult = {
  completed?: number;
  total?: number;
  elapsedSeconds?: number;
};

const ClientPreviewSpeakingResultPage: React.FC = () => {
  const result = readResult();
  const completion = Math.min(result.total, result.completed);

  return (
    <>
      <Helmet><title>Speaking Result – Lexora</title></Helmet>
      <main className="mx-auto max-w-[980px] pb-10 pt-4 text-[#24435f]">
        <section className="text-center">
          <img src="/result-preview-avatar.svg" alt="Preview candidate" className="mx-auto h-16 w-16 rounded-full" />
          <p className="mt-2 text-sm font-semibold text-[#5e7a91]">John Bush</p>
          <h1 className="mt-2 text-3xl font-black">Your Speaking score is:</h1>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-14">
            <ScoreCircle icon={<FiCheck />} label="Responses" value={`${completion}/${result.total}`} accent="text-green-700" />
            <ScoreCircle icon={<FiMic />} label="Speaking band" value="7.0" large />
            <ScoreCircle icon={<FiClock />} label="Time spent" value={formatTime(result.elapsedSeconds)} hint="(14:00)" />
          </div>
        </section>

        <section className="mx-auto mt-12 max-w-[760px]">
          <div className="flex items-center gap-3"><FiBarChart2 className="h-7 w-7" /><h2 className="text-xl font-black">Band Score:</h2></div>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs font-bold">
            {[9, 8.5, 8, 7.5, 7, 6.5, 6, 5.5, 5, 4.5, 4, 3.5, 3].map((band) => <span key={band} className={band === 7 ? "rounded-full bg-[#2db474] px-4 py-2 text-white" : "px-2 py-2"}>{band}</span>)}
          </div>
        </section>

        <section className="mx-auto mt-14 max-w-[760px]">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3"><FiMessageCircle className="h-7 w-7" /><h2 className="text-xl font-black">Speaking feedback:</h2></div>
            <button type="button" onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-semibold text-gray-600 shadow"><FiDownload /> Download</button>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <FeedbackCard title="Fluency & Coherence" band="7.0" copy="Develops answers clearly and maintains a natural pace, with occasional hesitation while organising longer ideas." />
            <FeedbackCard title="Lexical Resource" band="7.0" copy="Uses a flexible range of vocabulary and paraphrases effectively across familiar and abstract topics." />
            <FeedbackCard title="Grammar" band="6.5" copy="Uses both simple and complex structures. A few errors appear, but meaning remains clear throughout." />
            <FeedbackCard title="Pronunciation" band="7.0" copy="Speech is easy to understand, with generally effective stress, rhythm and intonation." />
          </div>

          <div className="mt-5 rounded-2xl border-l-4 border-[#2db474] bg-white p-5 shadow-sm">
            <p className="font-black text-[#24435f]">Next step</p>
            <p className="mt-2 text-sm leading-6 text-gray-600">Practise extending Part 3 answers with one clear reason and a specific example. The score shown here is realistic preview data; production scoring will use submitted recordings from the backend.</p>
          </div>

          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link to="/client-preview/speaking/pre-test" className="inline-flex items-center gap-2 rounded-lg border border-[#24435f] bg-white px-5 py-3 text-sm font-bold"><FiRefreshCw /> Retake Speaking</Link>
            <Link to="/client-preview/mock-tests" className="rounded-lg bg-[#24435f] px-6 py-3 text-sm font-bold text-white">Back to Mock Tests</Link>
          </div>
        </section>
      </main>
    </>
  );
};

const ScoreCircle: React.FC<{ icon: React.ReactNode; label: string; value: string; hint?: string; accent?: string; large?: boolean }> = ({ icon, label, value, hint, accent = "", large = false }) => (
  <div className={`flex h-32 w-32 flex-col items-center justify-center rounded-full border-[5px] border-[#963838] bg-white ${large ? "scale-105" : ""}`}>
    <span className="text-xl text-black">{icon}</span><span className="mt-1 text-xs text-gray-400">{label}</span><strong className={`mt-1 text-xl text-black ${accent}`}>{value}</strong>{hint ? <small className="text-xs text-gray-400">{hint}</small> : null}
  </div>
);

const FeedbackCard: React.FC<{ title: string; band: string; copy: string }> = ({ title, band, copy }) => (
  <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"><div className="flex items-center justify-between gap-3"><h3 className="font-black">{title}</h3><span className="rounded-full bg-[#2db474] px-3 py-1 text-xs font-black text-white">Band {band}</span></div><p className="mt-3 text-sm leading-6 text-gray-600">{copy}</p></article>
);

function readResult(): Required<StoredResult> {
  try {
    const parsed = JSON.parse(window.localStorage.getItem("lexora.client-preview.speaking.result.v1") ?? "{}") as StoredResult;
    return { completed: parsed.completed ?? 0, total: parsed.total ?? 9, elapsedSeconds: parsed.elapsedSeconds ?? 0 };
  } catch { return { completed: 0, total: 9, elapsedSeconds: 0 }; }
}

function formatTime(seconds: number): string { const safe = Math.max(0, Math.floor(seconds)); return `${String(Math.floor(safe / 60)).padStart(2, "0")}:${String(safe % 60).padStart(2, "0")}`; }

export default ClientPreviewSpeakingResultPage;
