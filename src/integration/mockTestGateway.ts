export type ExamModule = "listening" | "reading" | "writing" | "speaking";

export interface MockTestSummary {
  id: string;
  title: string;
  modules: ExamModule[];
  durationMinutes: number;
  status: "not_started" | "in_progress" | "completed";
}

export interface AttemptSnapshot {
  attemptId: string;
  testId: string;
  activeModule: ExamModule;
  activeQuestion: number;
  remainingSeconds: number;
  answers: Record<string, string | string[]>;
  flaggedQuestions: number[];
  notes: Record<string, string>;
}

export interface MockTestGateway {
  listTests(): Promise<MockTestSummary[]>;
  startAttempt(testId: string): Promise<AttemptSnapshot>;
  loadAttempt(attemptId: string): Promise<AttemptSnapshot>;
  autosave(
    attemptId: string,
    patch: Partial<AttemptSnapshot>,
  ): Promise<void>;
  submitModule(
    attemptId: string,
    module: ExamModule,
  ): Promise<AttemptSnapshot>;
  getResult(attemptId: string): Promise<unknown>;
  createSpeakingBooking(input: {
    attemptId: string;
    startsAt: string;
  }): Promise<{ bookingId: string }>;
  uploadSpeakingAudio(input: {
    attemptId: string;
    part: 1 | 2 | 3;
    questionId: string;
    audio: Blob;
  }): Promise<{ recordingId: string }>;
}
