"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { LessonStepCard } from "./LessonStepCard";
import { getCompletedSteps } from "@/lib/progress";
import type { LessonStep } from "@/types/lesson";

interface StepsListWithProgressProps {
  moduleId: string;
  steps: LessonStep[];
}

export function StepsListWithProgress({
  moduleId,
  steps,
}: StepsListWithProgressProps) {
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  useEffect(() => {
    setCompletedSteps(getCompletedSteps(moduleId));
  }, [moduleId]);

  return (
    <div className="space-y-0">
      {steps.map((step, index) => (
        <Link
          key={step.id}
          href={`/lezioni/${moduleId}/step/${step.number}`}
          className="block cursor-pointer"
        >
          <LessonStepCard
            step={step}
            isLast={index === steps.length - 1}
            completed={completedSteps.includes(step.number)}
          />
        </Link>
      ))}
    </div>
  );
}
