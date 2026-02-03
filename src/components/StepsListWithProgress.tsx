"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { LessonStepCard } from "./LessonStepCard";
import { getCompletedSteps, syncProgressFromSupabase } from "@/lib/progress";
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
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const update = async () => {
      await syncProgressFromSupabase();
      setCompletedSteps(getCompletedSteps(moduleId));
      setIsReady(true);
    };
    update();
    const onFocus = () => {
      void update();
    };
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [moduleId]);

  if (!isReady) {
    return (
      <div className="space-y-4">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className="rounded-xl border-2 border-vibrant-lilac/40 bg-zinc-900/60 p-5"
          >
            <div className="h-4 w-20 rounded bg-sticker-white/10" />
            <div className="mt-4 h-5 w-2/3 rounded bg-sticker-white/10" />
            <div className="mt-3 h-4 w-4/5 rounded bg-sticker-white/10" />
            <div className="mt-4 h-3 w-1/2 rounded bg-sticker-white/10" />
            {index < steps.length - 1 && (
              <div className="mt-5 h-3 w-3/4 rounded bg-sticker-white/10" />
            )}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-0">
      {steps.map((step, index) => {
        const completed = completedSteps.includes(step.number);
        const unlocked =
          step.number === 1 || completedSteps.includes(step.number - 1);
        if (unlocked) {
          return (
            <Link
              key={step.id}
              href={`/lezioni/${moduleId}/step/${step.number}`}
              className="block cursor-pointer"
            >
              <LessonStepCard
                step={step}
                isLast={index === steps.length - 1}
                completed={completed}
              />
            </Link>
          );
        }
        return (
          <div key={step.id} className="block">
            <LessonStepCard
              step={step}
              isLast={index === steps.length - 1}
              completed={completed}
              locked
            />
          </div>
        );
      })}
    </div>
  );
}
