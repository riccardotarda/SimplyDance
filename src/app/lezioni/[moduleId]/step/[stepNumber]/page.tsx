/* eslint-disable @next/next/no-assign-module-variable */
import { notFound } from "next/navigation";
import { getModuleById, getStepByNumber } from "@/lib/modules";
import { StepPlayer } from "@/components/StepPlayer";
import { RequireAuth } from "@/components/RequireAuth";
import { RequireModuleUnlock } from "@/components/RequireModuleUnlock";
import { RequireStepUnlock } from "@/components/RequireStepUnlock";

interface StepPageProps {
  params: Promise<{ moduleId: string; stepNumber: string }>;
}

export default async function StepPage({ params }: StepPageProps) {
  const { moduleId, stepNumber: stepNumberStr } = await params;
  const stepNumber = parseInt(stepNumberStr, 10);

  if (Number.isNaN(stepNumber) || stepNumber < 1) {
    notFound();
  }

  const lesson = getModuleById(moduleId);
  const step = getStepByNumber(moduleId, stepNumber);

  if (!lesson || !step) {
    notFound();
  }

  return (
    <RequireAuth>
      <RequireModuleUnlock moduleId={moduleId}>
        <RequireStepUnlock moduleId={moduleId} stepNumber={step.number}>
          <StepPlayer
            moduleId={moduleId}
            moduleTitle={lesson.title}
            step={step}
            totalSteps={lesson.steps.length}
          />
        </RequireStepUnlock>
      </RequireModuleUnlock>
    </RequireAuth>
  );
}
