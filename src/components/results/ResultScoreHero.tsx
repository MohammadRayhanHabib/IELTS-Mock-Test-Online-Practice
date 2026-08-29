import React from "react";
import { Award, CheckCircle2, Timer, UserRound } from "lucide-react";

interface ResultScoreHeroProps {
  candidateName: string;
  avatarUrl?: string;
  correctAnswers: number;
  totalQuestions: number;
  overallBand?: number;
  durationLabel: string;
  durationLimitLabel?: string;
  resultPending: boolean;
}

const BAND_MARKS = [9, 8.5, 8, 7.5, 7, 6.5, 6, 5.5, 5, 4.5, 4, 3.5, 3];

const ResultScoreHero: React.FC<ResultScoreHeroProps> = ({
  candidateName,
  avatarUrl,
  correctAnswers,
  totalQuestions,
  overallBand,
  durationLabel,
  durationLimitLabel = "(60:00)",
  resultPending,
}) => {
  const activeBand =
    overallBand == null
      ? null
      : BAND_MARKS.reduce((closest, mark) =>
          Math.abs(mark - overallBand) < Math.abs(closest - overallBand)
            ? mark
            : closest,
        );

  const bandValue =
    overallBand == null
      ? resultPending
        ? "Pending"
        : "—"
      : trimBand(overallBand);

  return (
    <section className="mx-auto w-full max-w-[620px] pt-[62px] text-center">
      <div className="mx-auto flex h-[52px] w-[52px] items-center justify-center overflow-hidden rounded-full bg-[#d9dcdf]">
        {avatarUrl ? (
          <img src={avatarUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <UserRound className="h-7 w-7 text-[#526d88]" />
        )}
      </div>
      <p className="mt-2 text-[12px] font-semibold text-[#59718a]">
        {candidateName}
      </p>
      <h1 className="mt-5 text-[28px] font-black tracking-[-0.03em] text-[#24476b]">
        Your score is:
      </h1>

      <div className="mx-auto mt-10 grid max-w-[520px] grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-[92px]">
        <ScoreCircle ariaLabel={`${correctAnswers} correct answers out of ${totalQuestions}`}>
          <CheckCircle2 className="h-5 w-5 text-[#18222c]" />
          <span className="mt-1 text-[11px] font-medium text-[#a4afbc]">
            Correct Answers
          </span>
          <strong className="mt-1 text-[17px] font-black text-[#2f9b54]">
            {correctAnswers}/{totalQuestions}
          </strong>
        </ScoreCircle>

        <ScoreCircle ariaLabel={`Band score ${bandValue}`}>
          <strong
            className={`max-w-[88px] leading-tight text-[#050505] ${
              bandValue === "Pending" ? "text-[14px]" : "text-[30px]"
            } font-black`}
          >
            {bandValue}
          </strong>
        </ScoreCircle>

        <ScoreCircle ariaLabel={`Time spent ${durationLabel}`}>
          <Timer className="h-6 w-6 fill-[#050505] text-[#050505]" />
          <span className="mt-1 text-[11px] font-medium text-[#a4afbc]">
            Time Spent
          </span>
          <strong className="mt-0.5 text-[17px] font-black text-[#050505]">
            {durationLabel}
          </strong>
          <span className="mt-0.5 text-[12px] font-medium text-[#8e8e8e]">
            {durationLimitLabel}
          </span>
        </ScoreCircle>
      </div>

      <div className="mx-auto mt-[62px] max-w-[620px] text-left">
        <div className="flex items-center gap-3 text-[#24476b]">
          <Award className="h-6 w-6" />
          <h2 className="text-[20px] font-black tracking-[-0.02em]">
            Band Score:
          </h2>
        </div>

        <div className="mt-3 grid grid-cols-7 items-center gap-x-2 gap-y-3 sm:grid-cols-[repeat(13,minmax(0,1fr))]">
          {BAND_MARKS.map((mark) => {
            const active = activeBand === mark;
            return (
              <span
                key={mark}
                className={`mx-auto flex h-6 min-w-7 items-center justify-center rounded-full px-2 text-[11px] font-black ${
                  active
                    ? "bg-[#2eb369] text-white"
                    : "text-[#24476b]"
                }`}
              >
                {mark}
              </span>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const ScoreCircle: React.FC<{
  ariaLabel: string;
  children: React.ReactNode;
}> = ({ ariaLabel, children }) => (
  <div
    role="group"
    aria-label={ariaLabel}
    className="mx-auto h-[106px] w-[106px] rounded-full bg-gradient-to-r from-[#7c3030] to-[#e25858] p-[4px]"
  >
    <div className="flex h-full w-full flex-col items-center justify-center rounded-full bg-white">
      {children}
    </div>
  </div>
);

function trimBand(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

export default ResultScoreHero;
