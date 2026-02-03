"use client";

import { useEffect, useMemo, useState } from "react";
import { modulesList } from "@/data/modules";
import { isModuleCompleted, syncProgressFromSupabase } from "@/lib/progress";
import { isPurchased } from "@/lib/purchase";
import { ModuleCard } from "@/components/ModuleCard";

type LockState = Record<
  string,
  { locked: boolean; reason?: "progress" | "purchase" }
>;

function buildLockState(): LockState {
  const lockState: LockState = {};
  const orderedModules = modulesList.filter((module) => !module.isPlaceholder);
  const purchased = isPurchased();

  orderedModules.forEach((module, index) => {
    if (index === 0) {
      lockState[module.id] = { locked: false };
      return;
    }
    const previousModule = orderedModules[index - 1];
    if (!purchased) {
      lockState[module.id] = { locked: true, reason: "purchase" };
      return;
    }
    lockState[module.id] = {
      locked: !isModuleCompleted(previousModule.id, previousModule.stepCount),
      reason: "progress",
    };
  });

  modulesList
    .filter((module) => module.isPlaceholder)
    .forEach((module) => {
      lockState[module.id] = { locked: true, reason: "progress" };
    });

  return lockState;
}

export function ModulesList() {
  const [lockState, setLockState] = useState<LockState>({});
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const update = async () => {
      await syncProgressFromSupabase();
      setLockState(buildLockState());
      setIsReady(true);
    };
    update();
    const onFocus = () => {
      void update();
    };
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, []);

  const items = useMemo(() => {
    if (!isReady) {
      return modulesList.map((module) => (
        <div
          key={module.id}
          className="rounded-xl border-2 border-vibrant-lilac/40 bg-zinc-900/60 p-6"
        >
          <div className="h-4 w-24 rounded bg-sticker-white/10" />
          <div className="mt-4 h-6 w-3/5 rounded bg-sticker-white/10" />
          <div className="mt-3 h-4 w-4/5 rounded bg-sticker-white/10" />
        </div>
      ));
    }
    return modulesList.map((module) => (
      <ModuleCard
        key={module.id}
        module={module}
        isLocked={lockState[module.id]?.locked}
        lockReason={lockState[module.id]?.reason}
      />
    ));
  }, [isReady, lockState]);

  return <div className="mt-10 space-y-4">{items}</div>;
}
