import { hipHopBasics } from "@/data/hip-hop-basics";
import type { LessonModule, LessonStep } from "@/types/lesson";

const modules: Record<string, LessonModule> = {
  "hip-hop-basics": hipHopBasics,
};

export function getModuleById(moduleId: string): LessonModule | null {
  return modules[moduleId] ?? null;
}

export function getStepByNumber(
  moduleId: string,
  stepNumber: number
): LessonStep | null {
  const module = getModuleById(moduleId);
  if (!module) return null;
  return module.steps.find((s) => s.number === stepNumber) ?? null;
}
