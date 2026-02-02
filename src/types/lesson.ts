/**
 * Tipi di step nel modulo:
 * - video: teoria, l'utente guarda per capire
 * - practice: in loop, l'utente ripete finché non si sente sicuro poi passa oltre
 * - performance: validazione finale di ciò che ha imparato
 */
export type StepType = "video" | "practice" | "performance";

export interface LessonStep {
  id: string;
  number: number;
  title: string;
  description: string;
  type: StepType;
  duration?: string;
  /** ID video YouTube (da URL shorts o watch). Es: OnKsMC6H29M */
  youtubeId?: string;
}

export interface LessonModule {
  id: string;
  title: string;
  steps: LessonStep[];
}

export interface ModuleSummary {
  id: string;
  number: number;
  title: string;
  description: string;
  stepCount: number;
  isPlaceholder: boolean;
}
