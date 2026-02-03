"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { modulesList } from "@/data/modules";
import { getAllModules } from "@/lib/lessons";
import {
  getCompletedSteps,
  isModuleCompleted,
  syncProgressFromSupabase,
} from "@/lib/progress";
import { isPurchased } from "@/lib/purchase";

type LibraryMode = "passi" | "performance";

type LibraryItem = {
  id: string;
  moduleId: string;
  moduleTitle: string;
  stepNumber: number;
  title: string;
  type: "video" | "practice" | "performance" | "passo";
  completed: boolean;
};

const typeLabel: Record<LibraryItem["type"], string> = {
  video: "Video",
  practice: "Pratica",
  performance: "Performance",
  passo: "Passo",
};

export function LearningLibrary({ mode }: { mode: LibraryMode }) {
  const [unlockedModules, setUnlockedModules] = useState<string[]>([]);
  const [completedMap, setCompletedMap] = useState<Record<string, number[]>>(
    {}
  );
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const update = () => {
      const orderedModules = modulesList.filter((module) => !module.isPlaceholder);
      const purchased = isPurchased();
      const unlocked: string[] = [];

      orderedModules.forEach((module, index) => {
        if (index === 0) {
          unlocked.push(module.id);
          return;
        }
        if (!purchased) {
          return;
        }
        const previous = orderedModules[index - 1];
        if (isModuleCompleted(previous.id, previous.stepCount)) {
          unlocked.push(module.id);
        }
      });

      const map: Record<string, number[]> = {};
      unlocked.forEach((moduleId) => {
        map[moduleId] = getCompletedSteps(moduleId);
      });

      setUnlockedModules(unlocked);
      setCompletedMap(map);
      setIsReady(true);
    };

    const syncAndUpdate = async () => {
      await syncProgressFromSupabase();
      update();
    };

    syncAndUpdate();
    window.addEventListener("focus", update);
    return () => window.removeEventListener("focus", update);
  }, []);

  const items = useMemo(() => {
    const modules = getAllModules();
    const filteredModules = modules.filter((module) =>
      unlockedModules.includes(module.id)
    );
    const collection: LibraryItem[] = [];

    filteredModules.forEach((module) => {
      module.steps.forEach((step) => {
        const isPerformance = step.type === "performance";
        const isPasso = step.type === "passo";
        const completed = completedMap[module.id]?.includes(step.number) ?? false;
        if (mode === "passi" && (!isPasso || !completed)) return;
        if (mode === "performance" && (!isPerformance || !completed)) return;
        collection.push({
          id: `${module.id}-${step.id}`,
          moduleId: module.id,
          moduleTitle: module.title,
          stepNumber: step.number,
          title: step.title,
          type: step.type,
          completed,
        });
      });
    });

    return collection;
  }, [completedMap, mode, unlockedModules]);

  if (!isReady) {
    return (
      <div className="mt-10 space-y-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={`skeleton-${index}`}
            className="rounded-xl border-2 border-vibrant-lilac/40 bg-zinc-900/60 p-5"
          >
            <div className="h-4 w-24 rounded bg-sticker-white/10" />
            <div className="mt-4 h-5 w-3/5 rounded bg-sticker-white/10" />
            <div className="mt-3 h-4 w-4/5 rounded bg-sticker-white/10" />
          </div>
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mt-10 rounded-2xl border-2 border-vibrant-lilac/40 bg-zinc-900/70 p-6 text-center">
        <p className="font-montserrat text-sm text-sticker-white/80">
          {mode === "passi"
            ? "Completa un modulo che sblocca un passo per vederlo qui."
            : "Completa una performance per rivederla qui."}
        </p>
      </div>
    );
  }

  return (
    <div className="mt-10 space-y-4">
      {items.map((item) => (
        <Link
          key={item.id}
          href={`/lezioni/${item.moduleId}/step/${item.stepNumber}`}
          className="block rounded-xl border-2 border-vibrant-lilac bg-zinc-900/80 p-5 transition hover:border-electric-yellow/50"
        >
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span className="inline-flex rounded-md border-2 border-vibrant-lilac/60 bg-vibrant-lilac/20 px-2 py-0.5 font-montserrat text-xs font-semibold text-vibrant-lilac">
              {typeLabel[item.type]}
            </span>
            {item.completed && (
              <span className="inline-flex rounded-md border-2 border-electric-yellow bg-electric-yellow/20 px-2 py-0.5 font-montserrat text-xs font-semibold text-electric-yellow">
                Completato
              </span>
            )}
            <span className="font-montserrat text-xs text-sticker-white/60">
              {item.moduleTitle} · Step {item.stepNumber}
            </span>
          </div>
          <h3 className="font-staatliches text-lg font-bold uppercase tracking-wide text-sticker-white">
            {item.title}
          </h3>
        </Link>
      ))}
    </div>
  );
}
