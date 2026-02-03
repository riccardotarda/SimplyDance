"use client";

import { useEffect, useMemo, useState } from "react";
import { modulesList } from "@/data/modules";
import { getCompletedSteps } from "@/lib/progress";

export function ModulesIntro() {
  const [name, setName] = useState("");
  const [completedTotal, setCompletedTotal] = useState(0);
  const [totalSteps, setTotalSteps] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const directName = window.localStorage.getItem("simplydanceUserName") || "";
    if (directName) {
      setName(directName);
    } else {
      const rawAnswers = window.localStorage.getItem("onboardingAnswers");
      if (rawAnswers) {
        try {
          const parsed = JSON.parse(rawAnswers) as { name?: string };
          if (parsed?.name) {
            setName(parsed.name);
          }
        } catch {
          // ignore malformed storage
        }
      }
    }

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
  }, []);

  const title = useMemo(() => {
    if (!name) {
      return "Il tuo percorso, passo dopo passo";
    }
    return `Ciao ${name}, è il tuo momento`;
  }, [name]);

  const subtitle = useMemo(() => {
    if (!name) {
      return "Sblocca un modulo alla volta e sentirai i progressi già dal primo step.";
    }
    return "Sblocca un modulo alla volta e senti i progressi già dal primo step.";
  }, [name]);

  const levelInfo = useMemo(() => {
    const remainingToComplete = Math.max(0, totalSteps - completedTotal);
    return {
      level: 1,
      label: "Wallflower",
      completed: completedTotal,
      total: totalSteps,
      remainingToComplete,
    };
  }, [completedTotal, totalSteps]);

  return (
    <>
      <h1 className="font-staatliches text-3xl font-bold uppercase tracking-tight text-sticker-white">
        {title}
      </h1>
      <p className="mt-2 font-montserrat text-sticker-white/80">{subtitle}</p>
      <div className="mt-4 flex flex-wrap items-center gap-3 rounded-2xl border-2 border-electric-yellow/50 bg-electric-yellow/10 px-4 py-3">
        <div className="flex items-center gap-3">
          <span className="font-staatliches text-xs uppercase tracking-[0.2em] text-electric-yellow">
            Livello {levelInfo.level}
          </span>
          <span className="font-montserrat text-xs text-sticker-white/90">
            {levelInfo.label}
          </span>
        </div>
        {levelInfo.total > 0 && (
          <span className="font-montserrat text-xs text-sticker-white/70">
            {levelInfo.completed}/{levelInfo.total} step
          </span>
        )}
        {levelInfo.total > 0 && levelInfo.remainingToComplete > 0 && (
          <span className="font-montserrat text-xs text-sticker-white/80">
            Mancano {levelInfo.remainingToComplete} step al completamento del
            livello 1
          </span>
        )}
        {levelInfo.total > 0 && levelInfo.remainingToComplete === 0 && (
          <span className="font-montserrat text-xs text-sticker-white/80">
            Livello 1 completato
          </span>
        )}
      </div>
    </>
  );
}
