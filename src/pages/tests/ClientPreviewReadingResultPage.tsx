import React, { useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { FiArrowRight, FiGrid, FiRotateCcw } from "react-icons/fi";
import LexoraTopNavbar from "../../components/layout/LexoraTopNavbar";
import AnswerKeyReview, {
  type ResultAnswerGroup,
} from "../../components/results/AnswerKeyReview";
import ResultScoreHero from "../../components/results/ResultScoreHero";
import {
  CLIENT_READING_RESULT_KEY,
  type ClientReadingStoredResult,
  getClientReadingAnswerDefinitions,
  normalizeReadingAnswer,
  readDefinitionAnswer,
} from "../../data/clientPreviewReadingResult";

const EMPTY_RESULT: ClientReadingStoredResult = {
  testNumber: 1,
  answers: {},
  correctAnswers: 0,
  totalQuestions: 40,
  bandScore: 3,
  durationSeconds: 0,
  completedAt: new Date(0).toISOString(),
  flaggedQuestions: [],
};

const ClientPreviewReadingResultPage: React.FC = () => {
  const navigate = useNavigate();
  const result = useMemo(readStoredResult, []);
  const definitions = useMemo(
    () => getClientReadingAnswerDefinitions(result.testNumber),
    [result.testNumber],
  );
  const answerGroups = useMemo<ResultAnswerGroup[]>(
    () =>
      ["Part 1", "Part 2", "Part 3"].map((partLabel, partIndex) => {
        const partDefinitions = definitions.filter(
          (definition) => definition.partLabel === partLabel,
        );
        const first = partIndex === 0 ? 1 : partIndex === 1 ? 14 : 27;
        const last = partIndex === 0 ? 13 : partIndex === 1 ? 26 : 40;
        return {
          label: `${partLabel}: Questions ${first} - ${last}`,
          items: partDefinitions.map((definition) => {
            const userAnswer = readDefinitionAnswer(
              definition,
              result.answers,
              definitions,
            );
            const isCorrect = definition.acceptedAnswers.some(
              (answer) =>
                normalizeReadingAnswer(answer) ===
                normalizeReadingAnswer(userAnswer),
            );
            return {
              id: `reading-preview-result-${definition.number}`,
              number: String(definition.number),
              partLabel,
              question: `${definition.questionTypeLabel}: ${definition.prompt}`,
              userAnswer,
              correctAnswer: definition.displayAnswer,
              isCorrect,
              explanation: isCorrect
                ? "Your response matches the reference answer for this preview item."
                : "Compare your response with the reference answer and return to the passage to locate the supporting detail.",
              contextTitle: definition.contextTitle,
              context: definition.context,
            };
          }),
        };
      }),
    [definitions, result],
  );

  const takeAgain = () => {
    window.sessionStorage.removeItem(CLIENT_READING_RESULT_KEY);
    navigate(`/client-preview/reading-part-1?test=${result.testNumber}&q=1`);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Helmet>
        <title>Reading Result – Lexora Academy</title>
      </Helmet>

      <LexoraTopNavbar
        title="Reading Result"
        homePath="/client-preview/mock-tests"
        profilePath="/client-preview/mock-tests"
        profileInitial="R"
      />

      <main className="mx-auto w-full max-w-[1600px] px-4 pb-14 sm:px-7">
        <ResultScoreHero
          candidateName="Client Preview"
          avatarUrl="/result-preview-avatar.svg"
          correctAnswers={result.correctAnswers}
          totalQuestions={result.totalQuestions}
          overallBand={result.bandScore}
          durationLabel={formatDuration(result.durationSeconds)}
          durationLimitLabel="(60:00)"
          resultPending={false}
        />

        <AnswerKeyReview
          title="Answer Keys:"
          groups={answerGroups}
          reviewTitle="Review & Explanations:"
          emptyMessage="No Reading answers were submitted."
          onDownload={() => window.print()}
        />

        <div className="print:hidden mt-8 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={takeAgain}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-600 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#24476b]"
          >
            <FiRotateCcw /> Take the demo again
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
            onClick={() => navigate(`/client-preview/writing?test=${result.testNumber}`)}
            className="inline-flex items-center gap-2 rounded-xl bg-[#24476b] px-5 py-3 text-sm font-black text-white transition hover:bg-[#183653] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#24476b] focus-visible:ring-offset-2"
          >
            Continue to Writing <FiArrowRight />
          </button>
        </div>
      </main>
    </div>
  );
};

function readStoredResult(): ClientReadingStoredResult {
  try {
    const raw = window.sessionStorage.getItem(CLIENT_READING_RESULT_KEY);
    if (!raw) return EMPTY_RESULT;
    const parsed = JSON.parse(raw) as Partial<ClientReadingStoredResult>;
    return {
      testNumber: parsed.testNumber ?? 1,
      answers: parsed.answers ?? {},
      correctAnswers: parsed.correctAnswers ?? 0,
      totalQuestions: parsed.totalQuestions ?? 40,
      bandScore: parsed.bandScore ?? 3,
      durationSeconds: parsed.durationSeconds ?? 0,
      completedAt: parsed.completedAt ?? new Date().toISOString(),
      flaggedQuestions: parsed.flaggedQuestions ?? [],
    };
  } catch {
    return EMPTY_RESULT;
  }
}

function formatDuration(totalSeconds: number): string {
  const safeSeconds = Math.max(0, Math.floor(totalSeconds));
  const minutes = Math.floor(safeSeconds / 60);
  const seconds = safeSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export default ClientPreviewReadingResultPage;
