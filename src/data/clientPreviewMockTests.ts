export type ClientPreviewModule =
  | "LISTENING"
  | "READING"
  | "WRITING"
  | "SPEAKING";

export interface ClientPreviewMockTestConfig {
  number: number;
  label: string;
  focus: string;
  startPath: string;
  progressModule?: ClientPreviewModule;
  modulePaths: Record<ClientPreviewModule, string>;
  questionMix: Record<ClientPreviewModule, string>;
}

const testPath = (path: string, testNumber: number, query = "") =>
  `${path}?test=${testNumber}${query ? `&${query}` : ""}`;

export const CLIENT_PREVIEW_MOCK_TESTS: ClientPreviewMockTestConfig[] = [
  {
    number: 1,
    label: "Foundation mix",
    focus: "All four modules · guided client demo",
    startPath: "/client-preview/mock-test/setup?test=1",
    progressModule: "LISTENING",
    modulePaths: {
      LISTENING: "/client-preview/listening/pre-test",
      READING: "/client-preview/reading-part-1",
      WRITING: "/client-preview/writing",
      SPEAKING: "/client-preview/speaking/booking",
    },
    questionMix: {
      LISTENING: "Notes, tables, MCQ and short answers",
      READING: "All 18 reading question types",
      WRITING: "Academic Task 1 and Task 2",
      SPEAKING: "Booking, equipment check and three parts",
    },
  },
  {
    number: 2,
    label: "Academic mix A",
    focus: "Full 40-question Listening and Reading flow",
    startPath: "/client-preview/mock-test/setup?test=2",
    progressModule: "READING",
    modulePaths: {
      LISTENING: testPath(
        "/client-preview/listening/pre-test",
        2,
      ),
      READING: testPath("/client-preview/reading-part-1", 2, "q=1"),
      WRITING: testPath("/client-preview/writing", 2),
      SPEAKING: testPath("/client-preview/speaking/booking", 2),
    },
    questionMix: {
      LISTENING: "Table and sentence completion lead",
      READING: "Headings, information and completion",
      WRITING: "Chart report and discussion essay",
      SPEAKING: "Study, community and future plans",
    },
  },
  {
    number: 3,
    label: "Academic mix B",
    focus: "Visual labelling and matching emphasis",
    startPath: "/client-preview/mock-test/setup?test=3",
    modulePaths: {
      LISTENING: testPath(
        "/client-preview/listening/pre-test",
        3,
      ),
      READING: testPath("/client-preview/reading-part-1", 3, "q=1"),
      WRITING: testPath("/client-preview/writing", 3),
      SPEAKING: testPath("/client-preview/speaking/booking", 3),
    },
    questionMix: {
      LISTENING: "Map labelling, MCQ and factor matching",
      READING: "Sentence endings, diagrams and summaries",
      WRITING: "Process report and opinion essay",
      SPEAKING: "Work, travel and technology",
    },
  },
  {
    number: 4,
    label: "Academic mix C",
    focus: "Advanced inference and classification mix",
    startPath: "/client-preview/mock-test/setup?test=4",
    modulePaths: {
      LISTENING: testPath(
        "/client-preview/listening/pre-test",
        4,
      ),
      READING: testPath("/client-preview/reading-part-1", 4, "q=1"),
      WRITING: testPath("/client-preview/writing", 4),
      SPEAKING: testPath("/client-preview/speaking/booking", 4),
    },
    questionMix: {
      LISTENING: "List matching, summary and flow chart",
      READING: "Clued summary, classification and MCQ",
      WRITING: "Mixed data report and problem solution",
      SPEAKING: "Culture, environment and decision making",
    },
  },
];

export const getClientPreviewMockTest = (testNumber: number) =>
  CLIENT_PREVIEW_MOCK_TESTS.find((test) => test.number === testNumber) ??
  CLIENT_PREVIEW_MOCK_TESTS[0];
