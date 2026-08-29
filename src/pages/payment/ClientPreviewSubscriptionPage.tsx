import React, { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { FiCheck, FiCheckCircle, FiShield, FiX } from "react-icons/fi";

type PlanId = "trial" | "monthly" | "quarterly" | "annual";

interface SubscriptionPlan {
  id: PlanId;
  name: string;
  price: string;
  cadence: string;
  badge?: string;
  highlighted?: boolean;
  features: Array<{ strong?: string; rest: string }>;
}

const PLANS: SubscriptionPlan[] = [
  {
    id: "trial",
    name: "Week-Free Trial",
    price: "$0",
    cadence: "/week",
    features: [
      { strong: "7-Day", rest: "Full Access, No Card Required" },
      { strong: "2 Essay Submissions", rest: "with AI Feedback" },
      { strong: "1 AI Speaking Test", rest: "with Feedback" },
      { rest: "Limited Listening & Reading Tests" },
      { rest: "Limited Writing Practice Tasks" },
      { rest: "Latest Speaking Topics Bank" },
      { rest: "Reading Answer Explanations & Listening Transcripts" },
    ],
  },
  {
    id: "monthly",
    name: "Monthly",
    price: "$14.9",
    cadence: "/month",
    features: [
      { strong: "31-Day", rest: "Full Access" },
      { strong: "10 Essay Submissions", rest: "with AI Feedback" },
      { strong: "200+ Listening & Reading Tests", rest: "" },
      { strong: "200+ Writing Practice Tasks", rest: "" },
      { strong: "200+ AI IELTS Speaking Tests", rest: "with Feedback" },
      { rest: "High-Scoring Writing Samples & AI Evaluation" },
      { rest: "Latest Speaking Topics Bank (Updated Quarterly)" },
      { rest: "Reading Explanations & Listening Transcripts" },
      { rest: "Priority Support" },
    ],
  },
  {
    id: "quarterly",
    name: "Quarterly",
    price: "$19.9",
    cadence: "/quarter",
    badge: "Equivalent to $6.6 / month",
    highlighted: true,
    features: [
      { strong: "92-Day", rest: "Full Access" },
      { strong: "30 Essay Submissions", rest: "with AI Feedback" },
      { strong: "200+ Listening & Reading Tests", rest: "" },
      { strong: "200+ Writing Practice Tasks", rest: "" },
      { strong: "Unlimited AI Speaking Tests", rest: "with Feedback" },
      { rest: "High-Scoring Writing Samples & AI Evaluation" },
      { rest: "Latest Speaking Topics Bank (Updated Quarterly)" },
      { rest: "Reading Explanations & Listening Transcripts" },
      { rest: "Priority Support" },
    ],
  },
  {
    id: "annual",
    name: "Annual",
    price: "$69.9",
    cadence: "/year",
    badge: "Equivalent to $5.8 / month",
    features: [
      { strong: "366-Day", rest: "Full Access" },
      { strong: "100 Essay Submissions", rest: "with AI Feedback" },
      { strong: "200+ Listening & Reading Tests", rest: "" },
      { strong: "200+ Writing Practice Tasks", rest: "" },
      { strong: "Unlimited AI Speaking Tests", rest: "with Feedback" },
      { rest: "High-Scoring Writing Samples & AI Evaluation" },
      { rest: "Latest Speaking Topics Bank + Early Access" },
      { rest: "Reading Explanations & Listening Transcripts" },
      { rest: "Priority Support" },
    ],
  },
];

const ClientPreviewSubscriptionPage: React.FC = () => {
  const [selectedPlanId, setSelectedPlanId] = useState<PlanId | null>(null);
  const [confirmedPlanId, setConfirmedPlanId] = useState<PlanId | null>(null);
  const selectedPlan = useMemo(
    () => PLANS.find((plan) => plan.id === selectedPlanId) ?? null,
    [selectedPlanId],
  );
  const confirmedPlan = useMemo(
    () => PLANS.find((plan) => plan.id === confirmedPlanId) ?? null,
    [confirmedPlanId],
  );

  const confirmPreviewPlan = () => {
    if (!selectedPlan) return;
    setConfirmedPlanId(selectedPlan.id);
    setSelectedPlanId(null);
  };

  return (
    <>
      <Helmet>
        <title>Subscription Plans – Lexora Academy</title>
      </Helmet>

      <div
        translate="no"
        data-gramm="false"
        data-gramm_editor="false"
        data-enable-grammarly="false"
        className="notranslate mx-auto max-w-[1180px] pb-12"
      >
        <header className="mb-6 border-b border-[#d9dde4] pb-5">
          <p className="text-[11px] font-black uppercase tracking-[0.16em] text-primary-600">
            Lexora Academy Membership
          </p>
          <h1 className="mt-1 text-2xl font-black tracking-[-0.025em] text-[#20222a] sm:text-[28px]">
            Choose your IELTS preparation plan
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#667085]">
            Compare access periods, practice limits, AI feedback and support.
            Choose a plan to preview the subscription flow.
          </p>
        </header>

        {confirmedPlan && (
          <div
            role="status"
            aria-live="polite"
            className="mb-5 flex items-start gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900"
          >
            <FiCheckCircle
              aria-hidden="true"
              className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600"
            />
            <span>
              <strong>{confirmedPlan.name}</strong>
              <span> selected for the client preview.</span>
            </span>
          </div>
        )}

        <section
          aria-label="Lexora subscription plans"
          className="grid items-stretch gap-4 sm:grid-cols-2 xl:grid-cols-4"
        >
          {PLANS.map((plan) => (
            <article
              key={plan.id}
              className={`relative flex min-h-[460px] flex-col rounded-xl border bg-white px-5 pb-5 pt-6 shadow-[0_3px_12px_rgba(24,32,48,0.08)] ${
                plan.highlighted
                  ? "border-[#ef5b60] ring-1 ring-[#ef5b60]/20"
                  : "border-[#d8dde5]"
              }`}
            >
              {plan.badge && (
                <span className="absolute right-3 top-0 -translate-y-1/2 rounded-md bg-[#ef5b60] px-2.5 py-1 text-[9px] font-bold text-white shadow-sm">
                  {plan.badge}
                </span>
              )}

              <h2 className="text-base font-black text-[#1f232b]">{plan.name}</h2>
              <p className="mt-3 flex items-end gap-0.5 text-[#111318]">
                <strong className="text-[30px] font-black leading-none tracking-[-0.04em]">
                  {plan.price}
                </strong>
                <span className="pb-0.5 text-[10px] font-medium text-[#596173]">
                  {plan.cadence}
                </span>
              </p>

              <ul className="mt-5 flex-1 space-y-2.5 text-[11px] leading-[1.35] text-[#343946]">
                {plan.features.map((feature, index) => (
                  <li key={`${plan.id}-${index}`} className="flex items-start gap-2">
                    <span className="mt-0.5 flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full bg-[#8881bb] text-white">
                      <FiCheck aria-hidden="true" className="h-2.5 w-2.5 stroke-[3]" />
                    </span>
                    <span className="min-w-0">
                      {feature.strong && (
                        <strong className="font-extrabold text-[#ef4f55]">
                          {feature.strong}
                        </strong>
                      )}
                      {feature.rest && <span> {feature.rest}</span>}
                    </span>
                  </li>
                ))}
              </ul>

              <button
                type="button"
                onClick={() => setSelectedPlanId(plan.id)}
                className="mt-5 h-10 w-full rounded-md bg-[#ef5b60] text-xs font-black uppercase tracking-wide text-white transition-colors hover:bg-[#d94a50] focus:outline-none focus:ring-2 focus:ring-[#ef5b60] focus:ring-offset-2"
              >
                <span>{plan.id === "trial" ? "Start free trial" : "Buy"}</span>
              </button>
            </article>
          ))}
        </section>

        <div className="mt-5 flex items-start gap-2 rounded-lg border border-[#d7dce3] bg-white px-4 py-3 text-xs leading-5 text-[#596173]">
          <FiShield aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-primary-600" />
          <p>
            This is a client-preview checkout. Selecting a plan demonstrates the
            frontend flow only; no payment is collected.
          </p>
        </div>
      </div>

      {selectedPlan && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="subscription-dialog-title"
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/45 p-4"
          onMouseDown={(event) => {
            if (event.currentTarget === event.target) setSelectedPlanId(null);
          }}
        >
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">
            <div className="flex items-start justify-between border-b border-gray-100 px-6 py-5">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.14em] text-primary-600">
                  Client Preview
                </p>
                <h2 id="subscription-dialog-title" className="mt-1 text-xl font-black text-[#20222a]">
                  Confirm {selectedPlan.name}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPlanId(null)}
                aria-label="Close plan confirmation"
                className="flex h-9 w-9 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-300"
              >
                <FiX aria-hidden="true" />
              </button>
            </div>

            <div className="px-6 py-5">
              <div className="flex items-center justify-between rounded-xl bg-[#f7f8fa] px-4 py-4">
                <div>
                  <p className="text-sm font-black text-[#20222a]">{selectedPlan.name}</p>
                  <p className="mt-1 text-xs text-[#667085]">Frontend subscription preview</p>
                </div>
                <p className="text-right">
                  <strong className="block text-2xl font-black text-[#20222a]">{selectedPlan.price}</strong>
                  <span className="text-[10px] text-[#667085]">{selectedPlan.cadence}</span>
                </p>
              </div>

              <div className="mt-4 flex items-start gap-2 text-xs leading-5 text-[#596173]">
                <FiCheckCircle aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
                No card details are required and no charge will be made in this preview.
              </div>

              <button
                type="button"
                onClick={confirmPreviewPlan}
                className="mt-5 h-11 w-full rounded-lg bg-[#ef5b60] text-sm font-black text-white hover:bg-[#d94a50] focus:outline-none focus:ring-2 focus:ring-[#ef5b60] focus:ring-offset-2"
              >
                Confirm preview selection
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ClientPreviewSubscriptionPage;
