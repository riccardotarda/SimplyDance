const STORAGE_KEY = "simplydance-progress";

export interface ProgressData {
  completedSteps: Record<string, number[]>;
}

function getProgress(): ProgressData {
  if (typeof window === "undefined") {
    return { completedSteps: {} };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { completedSteps: {} };
    const data = JSON.parse(raw) as ProgressData;
    return data.completedSteps ? data : { completedSteps: {} };
  } catch {
    return { completedSteps: {} };
  }
}

function setProgress(data: ProgressData): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // ignore
  }
}

export function markStepCompleted(moduleId: string, stepNumber: number): void {
  const data = getProgress();
  const steps = data.completedSteps[moduleId] ?? [];
  if (steps.includes(stepNumber)) return;
  data.completedSteps[moduleId] = [...steps, stepNumber].sort((a, b) => a - b);
  setProgress(data);
}

export function isStepCompleted(
  moduleId: string,
  stepNumber: number
): boolean {
  const data = getProgress();
  const steps = data.completedSteps[moduleId] ?? [];
  return steps.includes(stepNumber);
}

export function isModuleCompleted(
  moduleId: string,
  totalSteps: number
): boolean {
  if (totalSteps <= 0) return false;
  const data = getProgress();
  const steps = data.completedSteps[moduleId] ?? [];
  return steps.includes(totalSteps);
}

export function getCompletedSteps(moduleId: string): number[] {
  const data = getProgress();
  return data.completedSteps[moduleId] ?? [];
}
