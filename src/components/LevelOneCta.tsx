"use client";

import { useEffect, useMemo, useState } from "react";
import { modulesList } from "@/data/modules";
import { getCompletedSteps, syncProgressFromSupabase } from "@/lib/progress";
import { LockIcon } from "@/components/icons";

export function LevelOneCta() {
  const [completedTotal, setCompletedTotal] = useState(0);
  const [totalSteps, setTotalSteps] = useState(0);

  useEffect(() => {
    const update = async () => {
      if (typeof window === "undefined") {
        return;
      }
      await syncProgressFromSupabase();
      const trackableModules = modulesList.filter(
        (module) => !module.isPlaceholder && module.stepCount > 0
      );
      const total = trackableModules.reduce(
        (sum, module) => sum + module.stepCount,
        0
      );
      const completed = trackableModules.reduce((sum, module) => {
        const steps = getCompletedSteps(module.id);
        return sum + steps.length;
      }, 0);
      setTotalSteps(total);
      setCompletedTotal(completed);
    };

    update();
    const onFocus = () => {
      void update();
    };
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, []);

  const remaining = useMemo(
    () => Math.max(0, totalSteps - completedTotal),
    [completedTotal, totalSteps]
  );
  const isCompleted = totalSteps > 0 && remaining === 0;

  return (
    <div className="mt-10 rounded-2xl border-2 border-vibrant-lilac/50 bg-deep-purple/60 p-6">
      <p className="font-montserrat text-xs uppercase tracking-[0.2em] text-sticker-white/60">
        Livello 1
      </p>
      <h2 className="mt-3 font-staatliches text-2xl font-bold uppercase tracking-wide text-sticker-white">
        {isCompleted ? "Livello 1 completato" : "Completa il livello 1"}
      </h2>
      <p className="mt-2 font-montserrat text-sm text-sticker-white/80">
        {isCompleted
          ? "Ottimo lavoro! Nuovi livelli saranno disponibili presto."
          : "Completa tutti gli step per chiudere questo livello."}
      </p>
      {!isCompleted && totalSteps > 0 && (
        <p className="mt-2 font-montserrat text-xs text-sticker-white/70">
          Mancano {remaining} step alla fine del livello.
        </p>
      )}
      <button
        type="button"
        disabled
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl border-2 border-vibrant-lilac/50 bg-zinc-900/70 px-6 py-4 font-staatliches text-sm font-bold uppercase tracking-wide text-sticker-white/60"
      >
        <LockIcon className="h-5 w-5" />
        Prossimo livello in arrivo
      </button>
    </div>
  );
}
