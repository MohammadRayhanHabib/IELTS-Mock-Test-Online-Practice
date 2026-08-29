export type ReadingAnnotationScope = "passage" | "question";
export type ReadingAnnotationKind = "highlight" | "note";

export interface ReadingAnnotation {
  id: string;
  partId: string;
  scope: ReadingAnnotationScope;
  questionNumber?: number;
  start: number;
  end: number;
  text: string;
  kind: ReadingAnnotationKind;
  note?: string;
}

export interface PendingReadingSelection {
  partId: string;
  scope: ReadingAnnotationScope;
  questionNumber?: number;
  start: number;
  end: number;
  text: string;
  top: number;
  left: number;
  placement: "above" | "below";
}

/** Backend-friendly persistence boundary. Replace the local adapter only. */
export interface ReadingAnnotationRepository {
  list(attemptId: string): Promise<ReadingAnnotation[]>;
  create(attemptId: string, annotation: ReadingAnnotation): Promise<ReadingAnnotation>;
  update(attemptId: string, annotationId: string, note: string): Promise<void>;
  remove(attemptId: string, annotationId: string): Promise<void>;
}
