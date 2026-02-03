"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { ModuleSummary } from "@/types/lesson";
import { isModuleCompleted } from "@/lib/progress";

interface ModuleCardProps {
  module: ModuleSummary;
  isLocked?: boolean;
  lockReason?: "progress" | "purchase";
}

export function ModuleCard({
  module,
  isLocked = false,
  lockReason = "progress",
}: ModuleCardProps) {
  const [completed, setCompleted] = useState(false);
  const isPlaceholder = module.isPlaceholder || isLocked;

  useEffect(() => {
    setCompleted(isModuleCompleted(module.id, module.stepCount));
  }, [module.id, module.stepCount]);

  useEffect(() => {
    const onFocus = () => {
      setCompleted(isModuleCompleted(module.id, module.stepCount));
    };
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [module.id, module.stepCount]);

  const content = (
    <div
      className={`relative rounded-xl border-2 p-6 transition ${
        isPlaceholder
          ? "cursor-default border-vibrant-lilac/40 bg-deep-purple/60 opacity-70"
          : "border-vibrant-lilac bg-zinc-900/80 hover:border-electric-yellow/60 hover:bg-zinc-900"
      }`}
    >
      <div className="mb-4 flex items-center gap-4">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 text-sm font-bold ${
            isPlaceholder
              ? "border-vibrant-lilac/50 bg-deep-purple/80 text-sticker-white/50"
              : "border-electric-yellow bg-electric-yellow/20 font-staatliches text-electric-yellow"
          }`}
        >
          {module.number}
        </div>
        {isPlaceholder && (
          <span className="rounded-md border-2 border-vibrant-lilac/50 bg-deep-purple/80 px-2.5 py-0.5 font-montserrat text-xs font-medium text-sticker-white/50">
            {module.isPlaceholder
              ? "Prossimamente"
              : lockReason === "purchase"
              ? "Premium"
              : "Bloccato"}
          </span>
        )}
        {!isPlaceholder && completed && (
          <span className="rounded-md border-2 border-electric-yellow bg-electric-yellow/20 px-2.5 py-0.5 font-montserrat text-xs font-semibold text-electric-yellow">
            Completato
          </span>
        )}
      </div>

      <h2 className="font-staatliches text-xl font-bold uppercase tracking-wide text-sticker-white">
        {module.title}
      </h2>
      <p className="mt-2 font-montserrat text-sm text-sticker-white/80">
        {module.description}
      </p>

      {!isPlaceholder && module.stepCount > 0 && (
        <p className="mt-3 font-montserrat text-xs text-sticker-white/60">
          {module.stepCount} step
        </p>
      )}

      {!isPlaceholder && (
        <span className="mt-4 inline-flex items-center gap-1.5 font-montserrat text-sm font-semibold text-electric-yellow">
          Apri modulo
          <span aria-hidden>→</span>
        </span>
      )}
      {isLocked && (
        <div className="mt-4 space-y-2">
          <p className="font-montserrat text-xs text-sticker-white/60">
            {lockReason === "purchase"
              ? "Sblocca l'accesso completo con un acquisto singolo."
              : "Completa il modulo precedente per sbloccarlo."}
          </p>
          {lockReason === "purchase" && (
            <Link
              href="/sblocca"
              className="inline-flex items-center gap-1.5 font-montserrat text-xs font-semibold text-electric-yellow"
            >
              Sblocca tutto
              <span aria-hidden>→</span>
            </Link>
          )}
        </div>
      )}
    </div>
  );

  if (isPlaceholder) {
    return <div className="block">{content}</div>;
  }

  return (
    <Link href={`/lezioni/${module.id}`} className="block">
      {content}
    </Link>
  );
}
