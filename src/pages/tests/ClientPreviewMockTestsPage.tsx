import React, { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  FiSearch,
} from "react-icons/fi";
import {
  CLIENT_PREVIEW_MOCK_TESTS,
} from "../../data/clientPreviewMockTests";
import { ExamSummary, MockTestCard, RequirementsStrip, UpdatesStrip } from "../../modules/mock-tests/components";

const ClientPreviewMockTestsPage: React.FC = () => {
  const [query, setQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"latest" | "oldest">("latest");
  const visibleTests = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const matches = CLIENT_PREVIEW_MOCK_TESTS.filter((test) =>
      [
        `mock test ${test.number}`,
        `mock test ${String(test.number).padStart(2, "0")}`,
        test.label,
        test.focus,
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery),
    );
    return sortOrder === "latest" ? matches : [...matches].reverse();
  }, [query, sortOrder]);

  return (
    <>
      <Helmet><title>IELTS Mock Tests – Lexora Academy</title></Helmet>
      <div className="mx-auto w-full max-w-[1380px] pb-12 text-[#111827]">
        <ExamSummary />
        <RequirementsStrip />
        <UpdatesStrip />

        <section aria-labelledby="mock-tests-heading" className="mt-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 id="mock-tests-heading" className="text-xl font-black tracking-[-0.025em] text-[#151b29]">Mock Tests</h2>
              <p className="mt-0.5 text-[11px] font-medium text-[#667085]">Choose a complete exam and begin with the guided pre-test workflow.</p>
            </div>
            <div className="flex w-full gap-2 sm:w-auto">
              <label className="relative min-w-0 flex-1 sm:w-[230px] sm:flex-none">
                <span className="sr-only">Search mock tests</span>
                <FiSearch aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#8b93a1]" />
                <input
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search test..."
                  className="h-10 w-full rounded-lg border border-[#d9dde5] bg-white pl-9 pr-3 text-xs font-medium outline-none placeholder:text-[#6b7280] focus:border-[#ff6a7c] focus:ring-2 focus:ring-[#ff6a7c]/20"
                />
              </label>
              <label>
                <span className="sr-only">Sort mock tests</span>
                <select
                  value={sortOrder}
                  onChange={(event) => setSortOrder(event.target.value as "latest" | "oldest")}
                  className="h-10 rounded-lg border border-[#d9dde5] bg-white px-3 text-xs font-bold text-[#4b5565] outline-none focus:border-[#ff6a7c] focus:ring-2 focus:ring-[#ff6a7c]/20"
                >
                  <option value="latest">Latest</option>
                  <option value="oldest">Oldest</option>
                </select>
              </label>
            </div>
          </div>
          <p className="sr-only" aria-live="polite">{visibleTests.length} mock {visibleTests.length === 1 ? "test" : "tests"} shown</p>

          {visibleTests.length > 0 ? (
            <div className="mt-3 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {visibleTests.map((test) => <MockTestCard key={test.number} test={test} />)}
            </div>
          ) : (
            <div className="mt-4 border border-dashed border-[#cfd5df] bg-white px-6 py-12 text-center">
              <p className="text-sm font-bold text-[#323846]">No matching test found</p>
              <p className="mt-1 text-xs text-[#6b7280]">Try a test number or one of the Academic mix names.</p>
            </div>
          )}
        </section>
      </div>
    </>
  );
};

export default ClientPreviewMockTestsPage;
