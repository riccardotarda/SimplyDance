import { notFound } from "next/navigation";
import { getModuleById, getStepByNumber } from "@/lib/modules";
import { StepPlayer } from "@/components/StepPlayer";

interface StepPageProps {
  params: Promise<{ moduleId: string; stepNumber: string }>;
}

export default async function StepPage({ params }: StepPageProps) {
  const { moduleId, stepNumber: stepNumberStr } = await params;
  const stepNumber = parseInt(stepNumberStr, 10);

  if (Number.isNaN(stepNumber) || stepNumber < 1) {
    notFound();
  }

  const lessonModule = getModuleById(moduleId);
  const step = getStepByNumber(moduleId, stepNumber);

  if (!lessonModule || !step) {
    notFound();
  }

  return (
    <StepPlayer
      moduleId={moduleId}
      moduleTitle={lessonModule.title}
      step={step}
      totalSteps={lessonModule.steps.length}
    />
  );
}
