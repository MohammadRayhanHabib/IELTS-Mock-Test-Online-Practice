import React, { useMemo, useState } from "react";
import type {
  FullListeningPart,
  FullListeningTask,
} from "../../data/clientPreviewFullListeningMocks";
import ListeningQuestionBookmark from "./ListeningQuestionBookmark";
import ListeningQuestionTypeBanner from "./ListeningQuestionTypeBanner";

interface Props {
  part: FullListeningPart;
  activeQuestion: number;
  answers: Record<number, string>;
  onAnswer: (number: number, value: string) => void;
  onActivate: (number: number) => void;
  registerInput: (number: number, element: HTMLInputElement | null) => void;
  flaggedQuestions: Set<number>;
  onToggleFlag: (number: number) => void;
}

const ClientFullListeningPart: React.FC<Props> = ({
  part,
  activeQuestion,
  answers,
  onAnswer,
  onActivate,
  registerInput,
  flaggedQuestions,
  onToggleFlag,
}) => (
  <div className="w-full pb-36" data-listening-part={part.number}>
    <p className="sr-only">Audio context: {part.context}</p>
    <div className="space-y-16">
      {part.tasks.map((task) => (
        <TaskPanel
          key={`${task.kind}-${task.range}`}
          task={task}
          activeQuestion={activeQuestion}
          answers={answers}
          onAnswer={onAnswer}
          onActivate={onActivate}
          registerInput={registerInput}
          flaggedQuestions={flaggedQuestions}
          onToggleFlag={onToggleFlag}
        />
      ))}
    </div>
  </div>
);

interface TaskProps extends Omit<Props, "part"> {
  task: FullListeningTask;
}

const TaskPanel: React.FC<TaskProps> = ({
  task,
  activeQuestion,
  answers,
  onAnswer,
  onActivate,
  registerInput,
  flaggedQuestions,
  onToggleFlag,
}) => {
  const presentation = getTaskPresentation(task, taskNumbers(task)[0]);
  const numbers = taskNumbers(task);
  const first = numbers[0];

  return (
    <section className="relative w-full max-w-[1780px] pb-16">
      <ListeningQuestionTypeBanner
        code={presentation.code}
        name={presentation.name}
        exampleCount={numbers.length}
      />
      {task.kind !== "matching" ? (
        <>
          <h2 className="mt-6 text-[16px] font-bold text-gray-950">{task.range}</h2>
          <p className="mt-6 text-[16px] italic leading-7 text-gray-900">{task.instruction}</p>
        </>
      ) : null}
      {task.kind === "completion" ? (
        first >= 31 ? (
          <div className="mt-8 max-w-[1580px] text-[16px] leading-[3.35rem]">
            <h3 className="mb-4 text-center text-[16px] font-bold leading-normal text-gray-950">
              {task.title}
            </h3>
            {task.rows.map((row) => (
              <React.Fragment key={row.number}>
                <span>{row.before} </span>
                <AnswerInput
                  number={row.number}
                  active={activeQuestion === row.number}
                  value={answers[row.number] ?? ""}
                  onAnswer={onAnswer}
                  onActivate={onActivate}
                  registerInput={registerInput}
                />
                <ListeningQuestionBookmark questionNumber={row.number} bookmarked={flaggedQuestions.has(row.number)} onToggle={onToggleFlag} />
                {row.after ? <span> {row.after} </span> : null}
              </React.Fragment>
            ))}
          </div>
        ) : (
          <div className="mt-8 w-full max-w-[800px] text-[15px]">
            <h3 className="mb-5 text-center text-[17px] font-bold uppercase text-gray-950">
              {task.title}
            </h3>
            <div className="space-y-4">
              {task.rows.map((row) => (
                <div
                  key={row.number}
                  className="grid min-h-[34px] grid-cols-1 items-center gap-2 sm:grid-cols-[160px_minmax(0,1fr)] sm:gap-3"
                >
                  <span className="leading-6">{row.before}</span>
                  <span className="flex min-w-0 flex-wrap items-center gap-2 leading-6">
                    <AnswerInput
                      number={row.number}
                      active={activeQuestion === row.number}
                      value={answers[row.number] ?? ""}
                      onAnswer={onAnswer}
                      onActivate={onActivate}
                      registerInput={registerInput}
                    />
                    {row.after ? <span>{row.after}</span> : null}
                    <ListeningQuestionBookmark questionNumber={row.number} bookmarked={flaggedQuestions.has(row.number)} onToggle={onToggleFlag} />
                  </span>
                </div>
              ))}
            </div>
          </div>
        )
      ) : null}

      {task.kind === "single-choice" ? (
        <div className="mt-8 max-w-[980px]">
          <div className="space-y-11">
          {task.questions.map((question) => (
            <fieldset key={question.number} className="relative max-w-[980px]">
              <legend className="w-full pr-14 text-[16px] font-bold leading-6">
                <span className="flex w-full items-start gap-3">
                  <span className={`flex h-[25px] min-w-[38px] items-center justify-center px-1 ${activeQuestion === question.number ? "border-2 border-[#1689dc] bg-white" : "border-2 border-transparent"}`}>{question.number}</span>
                  <span className="min-w-0 flex-1 pt-0.5">{question.prompt}</span>
                </span>
              </legend>
              <ListeningQuestionBookmark questionNumber={question.number} bookmarked={flaggedQuestions.has(question.number)} onToggle={onToggleFlag} />
              <div className="ml-6 mt-4 max-w-[910px] space-y-1">
                {question.options.map((option) => {
                  const selected = answers[question.number] === option.key;
                  return (
                    <label key={option.key} className={`flex min-h-[43px] cursor-pointer items-center gap-4 px-3 text-[16px] transition-colors ${selected ? "bg-[#b5daf3]" : "hover:bg-gray-50"}`}>
                      <input className="h-4 w-4 accent-[#1689dc]" type="radio" name={`listening-${question.number}`} checked={selected} onChange={() => onAnswer(question.number, option.key)} onFocus={() => onActivate(question.number)} />
                      <span>{option.label}</span>
                    </label>
                  );
                })}
              </div>
            </fieldset>
          ))}
          </div>
        </div>
      ) : null}

      {task.kind === "matching" ? (
        <MatchingTask
          task={task}
          activeQuestion={activeQuestion}
          answers={answers}
          onAnswer={onAnswer}
          onActivate={onActivate}
          flaggedQuestions={flaggedQuestions}
          onToggleFlag={onToggleFlag}
        />
      ) : null}

      {task.kind === "map" ? (
        <div className="mt-6 grid items-start gap-8 xl:grid-cols-[minmax(440px,0.95fr)_minmax(580px,1.05fr)]">
          <div className="relative min-h-[430px] overflow-hidden border border-gray-200 bg-white p-3">
            <p className="text-center text-2xl font-black uppercase tracking-wide">{task.mapTitle}</p>
            <div className="absolute left-[8%] right-[8%] top-[28%] h-14 rounded-[50%] border-2 border-dashed border-slate-500" />
            <div className="absolute bottom-[15%] left-[14%] h-28 w-28 rounded-full border-2 border-gray-500 bg-white" />
            <div className="absolute bottom-[18%] right-[12%] h-24 w-40 border-2 border-gray-500 bg-white" />
            <div className="absolute left-[18%] right-[18%] top-[54%] border-t-2 border-dashed border-gray-500" />
            <div className="absolute inset-x-[8%] top-[32%] grid grid-cols-5 gap-4">
              {task.options.map((option) => <span key={option} className="flex h-9 items-center justify-center border border-gray-600 bg-white font-bold">{option}</span>)}
            </div>
          </div>
          <div className="min-w-0 overflow-x-auto">
            <table className="w-full min-w-[600px] border-collapse text-[16px]">
              <thead><tr className="bg-gray-50/80"><th className="w-[300px] border border-[#cfd3d7] px-4 py-3.5 text-center text-[16px] font-bold text-gray-950">Column 1</th>{task.options.map((option) => <th key={option} className="w-[50px] border border-[#cfd3d7] px-2 py-3.5 text-center text-[16px] font-bold text-gray-950">{option}</th>)}</tr></thead>
              <tbody>{task.places.map((place) => <tr key={place.number} className={activeQuestion === place.number ? "bg-sky-50" : "hover:bg-gray-50/50"}><th className="border border-[#cfd3d7] px-5 py-4 text-left text-[16px] font-semibold text-gray-950"><span className="flex items-center justify-between gap-3"><span><strong className="mr-2">{place.number}.</strong>{place.label}</span><ListeningQuestionBookmark questionNumber={place.number} bookmarked={flaggedQuestions.has(place.number)} onToggle={onToggleFlag} /></span></th>{task.options.map((option) => <td key={option} className={`border border-[#cfd3d7] p-0 text-center ${answers[place.number] === option ? "bg-[#b5daf3]" : ""}`}><label className="flex min-h-[58px] cursor-pointer items-center justify-center"><input className="h-4 w-4 accent-[#1689dc]" type="radio" name={`map-${place.number}`} checked={answers[place.number] === option} onChange={() => onAnswer(place.number, option)} onFocus={() => onActivate(place.number)} aria-label={`${place.number} ${option}`} /></label></td>)}</tr>)}</tbody>
            </table>
          </div>
        </div>
      ) : null}

    </section>
  );
};

const MATCH_OPTION_MIME = "application/x-lexora-full-listening-option";
const MATCH_SOURCE_MIME = "application/x-lexora-full-listening-source";

const MatchingTask: React.FC<{
  task: Extract<FullListeningTask, { kind: "matching" }>;
  activeQuestion: number;
  answers: Record<number, string>;
  onAnswer: (number: number, value: string) => void;
  onActivate: (number: number) => void;
  flaggedQuestions: ReadonlySet<number>;
  onToggleFlag: (number: number) => void;
}> = ({ task, activeQuestion, answers, onAnswer, onActivate, flaggedQuestions, onToggleFlag }) => {
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [dragOverQuestion, setDragOverQuestion] = useState<number | null>(null);
  const [isOverBank, setIsOverBank] = useState(false);
  const optionByKey = useMemo(
    () => new Map(task.options.map((option) => [option.key, option])),
    [task.options],
  );
  const usedKeys = useMemo(
    () => new Set(task.prompts.map(({ number }) => answers[number]).filter(Boolean)),
    [answers, task.prompts],
  );

  const placeOption = (number: number, key: string) => {
    if (!optionByKey.has(key)) return;
    task.prompts.forEach((prompt) => {
      if (prompt.number !== number && answers[prompt.number] === key) onAnswer(prompt.number, "");
    });
    onAnswer(number, key);
    onActivate(number);
    setSelectedKey(null);
  };

  return (
    <div className="mt-7 grid w-full max-w-[1420px] grid-cols-[minmax(0,1.2fr)_minmax(280px,0.8fr)] gap-8 pb-16">
      <div className="min-w-0">
        <h2 className="text-[16px] font-bold text-gray-950">{task.range}</h2>
        <p className="mt-7 text-[16px] italic leading-7 text-gray-900">{task.instruction}</p>
        <div className="mt-9 space-y-[22px]">
        {task.prompts.map((prompt) => {
          const placedKey = answers[prompt.number] ?? "";
          const placedOption = optionByKey.get(placedKey);
          return (
            <div key={prompt.number} className="grid grid-cols-[210px_minmax(0,1fr)_auto] items-center gap-4 text-[16px]">
              <button
                type="button"
                draggable={Boolean(placedOption)}
                onClick={() => selectedKey ? placeOption(prompt.number, selectedKey) : placedOption ? onAnswer(prompt.number, "") : onActivate(prompt.number)}
                onDragStart={(event) => {
                  if (!placedOption) return;
                  event.dataTransfer.setData(MATCH_OPTION_MIME, placedKey);
                  event.dataTransfer.setData(MATCH_SOURCE_MIME, String(prompt.number));
                  event.dataTransfer.effectAllowed = "move";
                }}
                onDragOver={(event) => {
                  event.preventDefault();
                  setDragOverQuestion(prompt.number);
                }}
                onDragLeave={() => setDragOverQuestion(null)}
                onDrop={(event) => {
                  event.preventDefault();
                  placeOption(prompt.number, event.dataTransfer.getData(MATCH_OPTION_MIME));
                  setDragOverQuestion(null);
                }}
                className={`min-h-[35px] w-[210px] border px-3 py-1.5 text-center text-[15px] transition-colors ${
                  placedOption
                    ? "cursor-grab border-solid border-gray-600 bg-white active:cursor-grabbing"
                    : dragOverQuestion === prompt.number
                      ? "border-dashed border-sky-600 bg-sky-50"
                      : activeQuestion === prompt.number
                        ? "border-2 border-dashed border-[#2589db] bg-white"
                        : "border-dashed border-gray-600 bg-white"
                }`}
              >
                {placedOption ? `${placedKey}. ${placedOption.label}` : <strong>{prompt.number}</strong>}
              </button>
              <span>{prompt.label}</span>
              <ListeningQuestionBookmark questionNumber={prompt.number} bookmarked={flaggedQuestions.has(prompt.number)} onToggle={onToggleFlag} />
            </div>
          );
        })}
        </div>
      </div>

      <div
        aria-label="Matching options"
        onDragOver={(event) => {
          if (!Array.from(event.dataTransfer.types).includes(MATCH_SOURCE_MIME)) return;
          event.preventDefault();
          setIsOverBank(true);
        }}
        onDragLeave={() => setIsOverBank(false)}
        onDrop={(event) => {
          event.preventDefault();
          const source = Number.parseInt(event.dataTransfer.getData(MATCH_SOURCE_MIME), 10);
          if (Number.isFinite(source)) onAnswer(source, "");
          setIsOverBank(false);
        }}
        className={`min-h-[230px] space-y-3 px-6 py-1 transition-colors ${isOverBank ? "bg-sky-50" : "bg-white"}`}
      >
        {task.options.map((option) => {
          if (usedKeys.has(option.key)) return null;
          return (
            <button
              key={option.key}
              type="button"
              draggable
              onClick={() => setSelectedKey((current) => current === option.key ? null : option.key)}
              onDragStart={(event) => {
                event.dataTransfer.setData(MATCH_OPTION_MIME, option.key);
                event.dataTransfer.effectAllowed = "move";
                setSelectedKey(option.key);
              }}
              onDragEnd={() => {
                setSelectedKey(null);
                setDragOverQuestion(null);
                setIsOverBank(false);
              }}
              className={`block w-fit cursor-grab border border-gray-600 px-5 py-1.5 text-left text-[16px] active:cursor-grabbing ${selectedKey === option.key ? "bg-sky-50 ring-2 ring-sky-500" : "bg-white"}`}
            >
              <strong>{option.key}.</strong> {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

const AnswerInput: React.FC<{
  number: number;
  value: string;
  active: boolean;
  onAnswer: (number: number, value: string) => void;
  onActivate: (number: number) => void;
  registerInput: (number: number, element: HTMLInputElement | null) => void;
}> = ({ number, value, active, onAnswer, onActivate, registerInput }) => (
  <input
    ref={(element) => registerInput(number, element)}
    type="text"
    value={value}
    placeholder={String(number)}
    aria-label={`Answer ${number}`}
    onFocus={() => onActivate(number)}
    onChange={(event) => onAnswer(number, event.target.value)}
    className={`h-[34px] w-[210px] border bg-white px-3 text-center font-semibold outline-none ${active ? "border-2 border-[#2589db]" : "border-gray-500"}`}
  />
);

function taskNumbers(task: FullListeningTask): number[] {
  if (task.kind === "completion") return task.rows.map((row) => row.number);
  if (task.kind === "single-choice") return task.questions.map((question) => question.number);
  if (task.kind === "matching") return task.prompts.map((prompt) => prompt.number);
  return task.places.map((place) => place.number);
}

function getTaskPresentation(
  task: FullListeningTask,
  firstQuestion: number,
): { code: string; name: string } {
  if (task.kind === "single-choice") {
    return { code: "L-04", name: "Multiple Choice Questions (MCQ)" };
  }
  if (task.kind === "matching") {
    return { code: "L-07", name: "Factor Matching" };
  }
  if (task.kind === "map") {
    return { code: "L-10", name: "Map Labelling" };
  }
  if (firstQuestion >= 31) {
    return { code: "L-08", name: "Summary Completion" };
  }
  return { code: "L-01", name: "Note Completion" };
}

export default ClientFullListeningPart;
