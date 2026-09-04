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
];

export const getClientPreviewMockTest = (testNumber: number) =>
  CLIENT_PREVIEW_MOCK_TESTS.find((test) => test.number === testNumber) ??
  CLIENT_PREVIEW_MOCK_TESTS[0];
