import React, { useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { FiArrowRight, FiGrid, FiRotateCcw } from "react-icons/fi";
import AnswerKeyReview, {
  ResultAnswerGroup,
} from "../../components/results/AnswerKeyReview";
import ResultScoreHero from "../../components/results/ResultScoreHero";
import LexoraTopNavbar from "../../components/layout/LexoraTopNavbar";
import {
  CLIENT_LIST_MATCHING_ANSWER_DEFINITIONS,
  CLIENT_MAP_LABELLING_ANSWER_DEFINITIONS,
  CLIENT_LISTENING_ANSWER_DEFINITIONS,
  CLIENT_LISTENING_RESULT_KEY,
  ClientListeningAnswerDefinition,
  ClientListeningStoredResult,
  normalizeListeningAnswer,
} from "../../data/clientPreviewListening";

const EMPTY_RESULT: ClientListeningStoredResult = {
  answers: {},
  correctAnswers: 0,
  totalQuestions: 40,
  bandScore: 0,
  durationSeconds: 0,
  completedAt: new Date(0).toISOString(),
};

const ClientPreviewListeningResultPage: React.FC = () => {
  const navigate = useNavigate();
  const result = useMemo(readStoredResult, []);

  const answerGroups = useMemo<ResultAnswerGroup[]>(
    () => {
      const definitions = CLIENT_LISTENING_ANSWER_DEFINITIONS.map(
        (definition) =>
          (result.partTwoPattern === "list-matching" ||
            result.partTwoPattern === "map-labelling") &&
          definition.number >= 11 &&
          definition.number <= 14
            ? CLIENT_LIST_MATCHING_ANSWER_DEFINITIONS.find(
                (alternative) => alternative.number === definition.number,
              ) ?? definition
            : result.partTwoPattern === "map-labelling" &&
                definition.number >= 15 &&
                definition.number <= 20
              ? CLIENT_MAP_LABELLING_ANSWER_DEFINITIONS.find(
                  (alternative) => alternative.number === definition.number,
                ) ?? definition
              : definition,
      );

      return [
      createAnswerGroup(
        "Part 1: Questions 1 - 10",
        "Part 1",
        definitions.filter(
          (definition) => definition.number <= 10,
        ),
        result,
      ),
      createAnswerGroup(
        "Part 2: Questions 11 - 20",
        "Part 2",
        definitions.filter(
          (definition) =>
            definition.number >= 11 && definition.number <= 20,
        ),
        result,
      ),
      createAnswerGroup(
        "Part 3: Questions 21 - 30",
        "Part 3",
        definitions.filter(
          (definition) =>
            definition.number >= 21 && definition.number <= 30,
        ),
        result,
      ),
      createAnswerGroup(
        "Part 4: Questions 31 - 40",
        "Part 4",
        definitions.filter(
          (definition) => definition.number >= 31,
        ),
        result,
      ),
      ];
    },
    [result],
  );

  const takeAgain = () => {
    window.sessionStorage.removeItem(CLIENT_LISTENING_RESULT_KEY);
    navigate("/client-preview/listening/pre-test");
  };

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Helmet>
        <title>Listening Result – Lexora Academy</title>
      </Helmet>

      <LexoraTopNavbar
        title="Listening Result"
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
          durationLimitLabel="(30:00)"
          resultPending={false}
        />

        <AnswerKeyReview
          title="Answer Keys:"
          groups={answerGroups}
          reviewTitle="Review & Explanations:"
          emptyMessage="No Listening answers were submitted."
          showAudioPlaceholder
          onDownload={() => window.print()}
        />

        <div className="print:hidden mt-8 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={takeAgain}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-600 transition hover:bg-slate-50"
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
            onClick={() => navigate("/client-preview/reading-part-1")}
            className="inline-flex items-center gap-2 rounded-xl bg-[#24476b] px-5 py-3 text-sm font-black text-white transition hover:bg-[#183653] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#24476b] focus-visible:ring-offset-2"
          >
            Continue to Reading <FiArrowRight />
          </button>
        </div>
      </main>
    </div>
  );
};

function createAnswerGroup(
  label: string,
  partLabel: string,
  definitions: ClientListeningAnswerDefinition[],
  result: ClientListeningStoredResult,
): ResultAnswerGroup {
  const firstQuestionNumber = definitions[0]?.number ?? 1;
  const isBusTourGroup = firstQuestionNumber >= 11 && firstQuestionNumber <= 20;
  const isListMatchingGroup =
    result.partTwoPattern === "list-matching" &&
    firstQuestionNumber >= 11 &&
    firstQuestionNumber <= 20;
  const isMapLabellingGroup =
    result.partTwoPattern === "map-labelling" &&
    firstQuestionNumber >= 11 &&
    firstQuestionNumber <= 20;
  const isComputerSystemGroup = firstQuestionNumber >= 21;
  const isSeaLifeGroup = firstQuestionNumber >= 31;

  return {
    label,
    items: definitions.map((definition) => {
      const userAnswer = result.answers[definition.number] ?? "";
      const isCorrect = definition.acceptedAnswers.some(
        (answer) =>
          normalizeListeningAnswer(answer) ===
          normalizeListeningAnswer(userAnswer),
      );

      return {
        id: `listening-preview-result-${definition.number}`,
        number: String(definition.number),
        partLabel,
        question: definition.prompt,
        userAnswer,
        correctAnswer: definition.displayAnswer,
        isCorrect,
        explanation: isCorrect
          ? "Your answer matches an accepted form for this gap."
          : "Check the wording and word limit, then compare it with the answer shown.",
        contextTitle: isSeaLifeGroup
          ? "Sea Life Centre"
          : isComputerSystemGroup
          ? "College Computer System"
          : isListMatchingGroup
            ? "Volunteer Group A"
          : isMapLabellingGroup
            ? "Hadley Park Community Gardens Project"
          : isBusTourGroup
            ? "Pacton-on-Sea Bus Tour"
            : "Preston Park Run",
        context: isSeaLifeGroup
          ? "The speaker gives visitor information about the Sea Life Centre, including its former name, attractions, feeding time, VIP tickets, special events and conservation activities."
          : isComputerSystemGroup
          ? "Dave Hadley and Randhir discuss problems with the college computer system and plans for timetabling software and staff training."
          : isListMatchingGroup
            ? "The speaker explains the tasks allocated to Volunteer Group A and the items those volunteers should bring. Questions 15–20 continue with the Pacton-on-Sea bus tour."
          : isMapLabellingGroup
            ? "The speaker explains the Volunteer Group A choices, then describes the labelled locations on the Hadley Park Community Gardens plan."
          : isBusTourGroup
            ? "The speaker describes the locations and sights at four stops on the Pacton-on-Sea bus tour."
            : "The speaker explains the Preston Park Run arrangements, including the start point, time, distance, registration, cost and volunteering contact details.",
      };
    }),
  };
}

function readStoredResult(): ClientListeningStoredResult {
  try {
    const raw = window.sessionStorage.getItem(CLIENT_LISTENING_RESULT_KEY);
    if (!raw) return EMPTY_RESULT;
    const parsed = JSON.parse(raw) as Partial<ClientListeningStoredResult>;
    return {
      answers: parsed.answers ?? {},
      correctAnswers: parsed.correctAnswers ?? 0,
      totalQuestions: parsed.totalQuestions ?? 40,
      bandScore: parsed.bandScore ?? 0,
      durationSeconds: parsed.durationSeconds ?? 0,
      completedAt: parsed.completedAt ?? new Date().toISOString(),
      partTwoPattern: parsed.partTwoPattern,
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

export default ClientPreviewListeningResultPage;
