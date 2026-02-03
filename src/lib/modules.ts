import { hipHopBasics } from "@/data/hip-hop-basics";
import { grooveStarter } from "@/data/groove-starter";
import { bodyControl } from "@/data/body-control";
import { styleBuilder } from "@/data/style-builder";
import type { LessonModule, LessonStep } from "@/types/lesson";

const modules: Record<string, LessonModule> = {
  "hip-hop-basics": hipHopBasics,
  "modulo-2": grooveStarter,
  "modulo-3": bodyControl,
  "modulo-4": styleBuilder,
};

export function getModuleById(moduleId: string): LessonModule | null {
  return modules[moduleId] ?? null;
}

export function getStepByNumber(
  moduleId: string,
  stepNumber: number
): LessonStep | null {
  const lessonModule = getModuleById(moduleId);
  if (!lessonModule) return null;
  return lessonModule.steps.find((s) => s.number === stepNumber) ?? null;
}

export function getAllModules(): LessonModule[] {
  return Object.values(modules);
}
