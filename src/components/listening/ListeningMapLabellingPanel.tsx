import React from "react";
import ListeningQuestionBookmark from "./ListeningQuestionBookmark";
import ListeningQuestionTypeBanner from "./ListeningQuestionTypeBanner";

type AnswerMap = Record<number, string>;

interface ListeningMapLabellingPanelProps {
  activeQuestion: number;
  answers: AnswerMap;
  bookmarkedQuestions: ReadonlySet<number>;
  onAnswerChange: (number: number, value: string) => void;
  onAnswerFocus: (number: number) => void;
  onBookmarkToggle: (number: number) => void;
  registerInput: (number: number, element: HTMLInputElement | null) => void;
}

const MAP_LABELS = ["A", "B", "C", "D", "E", "F", "G", "H", "I"] as const;

const MAP_QUESTIONS = [
  { number: 15, label: "Vegetable beds" },
  { number: 16, label: "Bee hives" },
  { number: 17, label: "Seating" },
  { number: 18, label: "Adventure playground" },
  { number: 19, label: "Sand area" },
  { number: 20, label: "Pond" },
] as const;

const ListeningMapLabellingPanel: React.FC<ListeningMapLabellingPanelProps> = ({
  activeQuestion,
  answers,
  bookmarkedQuestions,
  onAnswerChange,
  onAnswerFocus,
  onBookmarkToggle,
  registerInput,
}) => (
  <section className="max-w-[1780px] pb-16" aria-labelledby="map-labelling-heading">
    <ListeningQuestionTypeBanner code="L-10" name="Map Labelling" exampleCount={6} />
    <div className="min-w-0">
        <h2 id="map-labelling-heading" className="text-[17px] font-bold text-gray-950">
          Questions 15 - 20
        </h2>
        <div className="mt-6 space-y-2 text-[16px] text-gray-800">
          <p className="italic">Label the plan below.</p>
          <p className="italic">Choose the correct label for each place.</p>
        </div>

        <div className="mt-6 grid items-start gap-8 xl:grid-cols-[minmax(440px,0.95fr)_minmax(580px,1.05fr)]">
          <GardenPlan />

          <div className="min-w-0 overflow-x-auto">
            <table className="w-full min-w-[600px] border-collapse text-[16px]">
              <thead>
                <tr className="bg-gray-50/80">
                  <th className="w-[300px] border border-[#cfd3d7] px-4 py-3.5 text-center text-[16px] font-bold text-gray-950">
                    Column 1
                  </th>
                  {MAP_LABELS.map((label) => (
                    <th key={label} className="w-[50px] border border-[#cfd3d7] px-2 py-3.5 text-center text-[16px] font-bold text-gray-950">
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {MAP_QUESTIONS.map((question) => {
                  const isActive = activeQuestion === question.number;
                  return (
                    <tr key={question.number} className={isActive ? "bg-sky-50" : "hover:bg-gray-50/50"}>
                      <th className="border border-[#cfd3d7] px-5 py-4 text-left text-[16px] font-semibold text-gray-950">
                        <span className="inline-flex max-w-full flex-wrap items-center gap-2">
                          <span><span className="mr-2 font-bold">{question.number}.</span>{question.label}</span>
                          <ListeningQuestionBookmark
                            questionNumber={question.number}
                            bookmarked={bookmarkedQuestions.has(question.number)}
                            onToggle={onBookmarkToggle}
                            pattern="map-labelling"
                          />
                        </span>
                      </th>
                      {MAP_LABELS.map((label, labelIndex) => {
                        const isSelected = answers[question.number] === label;
                        return (
                          <td
                            key={label}
                            className={`border border-[#cfd3d7] p-0 text-center ${isSelected ? "ielts-map-selected bg-[#b5daf3]" : ""}`}
                          >
                            <label className="flex min-h-[58px] cursor-pointer items-center justify-center">
                              <input
                                ref={(element) => {
                                  if (labelIndex === 0) registerInput(question.number, element);
                                }}
                                type="radio"
                                name={`map-label-${question.number}`}
                                value={label}
                                checked={isSelected}
                                aria-label={`${question.number}. ${question.label}: ${label}`}
                                onChange={() => onAnswerChange(question.number, label)}
                                onFocus={() => onAnswerFocus(question.number)}
                                className="h-4 w-4 accent-[#1689dc]"
                              />
                            </label>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
    </div>
  </section>
);

const GardenPlan: React.FC = () => (
  <figure className="min-w-0 border border-gray-200 bg-white p-3 text-gray-900">
    <svg
      viewBox="0 0 820 700"
      role="img"
      aria-labelledby="garden-plan-title garden-plan-description"
      className="h-auto w-full"
    >
      <title id="garden-plan-title">Hadley Park Community Gardens Project</title>
      <desc id="garden-plan-description">
        A plan of a community garden with nine possible locations labelled A to I.
      </desc>

      <rect className="ielts-map-surface" width="820" height="700" />
      <text x="410" y="42" textAnchor="middle" fontSize="30" fontWeight="700" letterSpacing="1.5" fill="currentColor">
        HADLEY PARK COMMUNITY GARDENS PROJECT
      </text>

      <path className="ielts-map-water" d="M40 130 C170 80 260 112 360 98 C505 76 610 100 780 142 L780 214 C620 180 470 196 330 174 C210 154 120 174 40 150 Z" stroke="currentColor" strokeWidth="2" />
      <text x="615" y="126" fontSize="18" fontWeight="600" fill="currentColor">lake</text>
      <ellipse className="ielts-map-surface" cx="258" cy="126" rx="48" ry="32" stroke="currentColor" strokeWidth="2" />
      <text x="258" y="132" textAnchor="middle" fontSize="17" fontWeight="600" fill="currentColor">island</text>

      <path d="M35 174 Q380 260 785 188" fill="none" stroke="currentColor" strokeWidth="4" />
      <path d="M32 190 Q382 276 790 205" fill="none" stroke="currentColor" strokeWidth="2" />
      <text x="430" y="226" fontSize="18" fontWeight="600" fill="currentColor">bicycle track</text>

      <path d="M145 216 C150 310 218 312 225 410 C233 510 300 548 380 565 L380 625" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="7 6" />
      <path d="M245 245 C340 260 400 276 445 334" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="7 6" />
      <path d="M530 347 C642 345 710 350 712 430 C714 490 661 485 665 545" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="7 6" />

      <ellipse className="ielts-map-soft-surface" cx="448" cy="380" rx="90" ry="92" stroke="currentColor" strokeWidth="2" />
      {[0,1,2,3,4,5,6,7].map((index) => {
        const angle = (Math.PI * 2 * index) / 8;
        const x = 448 + Math.cos(angle) * 63;
        const y = 380 + Math.sin(angle) * 64;
        return <ellipse className="ielts-map-surface" key={index} cx={x} cy={y} rx="13" ry="18" transform={`rotate(${(index * 45) + 12} ${x} ${y})`} stroke="currentColor" strokeWidth="2" />;
      })}

      <g fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="138" cy="358" r="7" /><circle cx="151" cy="344" r="7" /><circle cx="168" cy="351" r="7" />
        <circle cx="178" cy="369" r="7" /><circle cx="164" cy="382" r="7" /><circle cx="146" cy="379" r="7" />
      </g>
      <text x="155" y="364" textAnchor="middle" fontSize="15" fontWeight="700" fill="currentColor">FRUIT</text>
      <text x="155" y="382" textAnchor="middle" fontSize="15" fontWeight="700" fill="currentColor">BUSHES</text>

      <rect className="ielts-map-surface" x="327" y="606" width="132" height="66" stroke="currentColor" strokeWidth="2" />
      <text x="393" y="645" textAnchor="middle" fontSize="18" fontWeight="700" fill="currentColor">CAR PARK</text>

      <g stroke="currentColor" strokeWidth="3">
        {[0,1,2,3,4,5,6,7].map((index) => <line key={`fence-one-${index}`} x1={246 + index * 11} y1="414" x2={246 + index * 11} y2="434" />)}
        {[0,1,2,3,4,5,6,7].map((index) => <line key={`fence-two-${index}`} x1={615 + index * 11} y1="528" x2={615 + index * 11} y2="548" />)}
      </g>

      <MapMarker label="A" x={82} y={244} />
      <MapMarker label="B" x={215} y={229} />
      <MapMarker label="C" x={620} y={255} />
      <MapMarker label="D" x={620} y={315} />
      <MapMarker label="E" x={270} y={360} />
      <MapMarker label="F" x={80} y={455} />
      <MapMarker label="G" x={310} y={445} />
      <MapMarker label="H" x={590} y={535} />
      <MapMarker label="I" x={710} y={535} />

      <g transform="translate(24 624)" fill="currentColor" fontSize="14">
        <rect className="ielts-map-surface" width="186" height="60" stroke="currentColor" strokeWidth="2" />
        <line x1="12" y1="20" x2="58" y2="20" stroke="currentColor" strokeWidth="3" strokeDasharray="3 3" />
        <text x="67" y="24" fontWeight="600">bamboo fences</text>
        <line x1="12" y1="42" x2="58" y2="42" stroke="currentColor" strokeWidth="2" strokeDasharray="7 5" />
        <text x="67" y="47" fontWeight="600">footpath</text>
      </g>
    </svg>
    <figcaption className="sr-only">Community garden map with selectable labels A through I.</figcaption>
  </figure>
);

interface MapMarkerProps {
  label: string;
  x: number;
  y: number;
}

const MapMarker: React.FC<MapMarkerProps> = ({ label, x, y }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect className="ielts-map-surface" width="54" height="38" stroke="currentColor" strokeWidth="2" />
    <text x="27" y="26" textAnchor="middle" fontSize="20" fontWeight="700" fill="currentColor">{label}</text>
  </g>
);

export default ListeningMapLabellingPanel;
