"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type OnboardingAnswers = {
  name: string;
  level: string;
  goal: string;
};

const levelOptions = [
  "Mai ballato in vita mia",
  "Ho provato qualche volta, ma sono arrugginito",
  "Ho già delle basi e voglio spaccare",
];

const goalOptions = [
  "Imparare coreografie da mostrare agli amici e alle serate",
  "Fare movimento e divertirmi",
  "Sbloccare la coordinazione e non sentirmi un pezzo di legno",
];

export default function OnboardingPage() {
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<OnboardingAnswers>({
    name: "",
    level: "",
    goal: "",
  });

  const steps = useMemo(
    () => [
      {
        id: "level",
        eyebrow: "Step 1 · Il livello",
        title: "Da che punto parti?",
        helper:
          "Normalizziamo il punto zero: scegli la frase che ti descrive meglio.",
        options: levelOptions,
        value: answers.level,
        onSelect: (value: string) =>
          setAnswers((prev) => ({ ...prev, level: value })),
      },
      {
        id: "goal",
        eyebrow: "Step 2 · L'obiettivo",
        title: "Cosa vuoi ottenere?",
        helper: "Così possiamo consigliarti il percorso giusto.",
        options: goalOptions,
        value: answers.goal,
        onSelect: (value: string) =>
          setAnswers((prev) => ({ ...prev, goal: value })),
      },
      {
        id: "name",
        eyebrow: "Step 3 · Il tuo nome",
        title: "Come possiamo chiamarti?",
        helper: "Così rendiamo il percorso più personale.",
        value: answers.name,
        onSelect: (value: string) =>
          setAnswers((prev) => ({ ...prev, name: value })),
      },
      {
        id: "validation",
        eyebrow: "Step 4 · La validazione",
        title: "SEI NEL POSTO GIUSTO.",
        helper:
          "Il 90% dei nostri ballerini ha iniziato da zero. Abbiamo scomposto ogni movimento in pezzi così piccoli che è impossibile non impararli. Non serve talento, serve solo il tuo groove.",
      },
    ],
    [answers.goal, answers.level, answers.name]
  );

  const isFinalStep = stepIndex === steps.length - 1;
  const currentStep = steps[stepIndex];
  const isChoiceStep =
    currentStep.id === "level" || currentStep.id === "goal";
  const isNameStep = currentStep.id === "name";

  const canContinue =
    !isChoiceStep ||
    (currentStep.id === "level" && answers.level) ||
    (currentStep.id === "goal" && answers.goal) ||
    (currentStep.id === "name" && answers.name.trim().length > 0);

  const handleNext = () => {
    if (!canContinue) {
      return;
    }
    setStepIndex((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handleBack = () => {
    setStepIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleFinish = () => {
    if (typeof window === "undefined") {
      return;
    }
    const payload = {
      ...answers,
      completedAt: new Date().toISOString(),
    };
    window.localStorage.setItem("onboardingAnswers", JSON.stringify(payload));
    window.localStorage.setItem("onboardingCompleted", "true");
  };

  return (
    <main className="min-h-screen bg-deep-purple">
      <div className="mx-auto flex min-h-screen max-w-2xl flex-col px-6 py-10">
        <div className="mb-10 flex items-center justify-between gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-montserrat text-sm text-sticker-white/70 transition hover:text-sticker-white"
          >
            <span aria-hidden>←</span>
            Torna alla home
          </Link>
          <span className="font-montserrat text-xs text-sticker-white/70">
            4 semplici passaggi
          </span>
        </div>

        <div className="mb-6 flex items-center gap-2">
          {steps.map((step, index) => (
            <span
              key={step.id}
              className={`h-1.5 flex-1 rounded-full ${
                index <= stepIndex
                  ? "bg-electric-yellow"
                  : "bg-sticker-white/20"
              }`}
            />
          ))}
        </div>

        <div className="rounded-2xl border-2 border-vibrant-lilac/40 bg-zinc-900/70 p-6 md:p-8">
          <p className="font-montserrat text-xs uppercase tracking-[0.2em] text-sticker-white/60">
            {currentStep.eyebrow}
          </p>
          <h1 className="mt-3 font-staatliches text-3xl font-bold uppercase tracking-tight text-sticker-white md:text-4xl">
            {currentStep.title}
          </h1>
          <p className="mt-3 font-montserrat text-sm text-sticker-white/80 md:text-base">
            {currentStep.helper}
          </p>

          {isChoiceStep && (
            <div className="mt-6 space-y-3">
              {currentStep.options?.map((option) => {
                const isSelected = option === currentStep.value;
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => currentStep.onSelect?.(option)}
                    className={`w-full rounded-xl border-2 px-5 py-4 text-left font-montserrat text-sm transition md:text-base ${
                      isSelected
                        ? "border-electric-yellow bg-electric-yellow/10 text-sticker-white"
                        : "border-vibrant-lilac/50 bg-deep-purple/60 text-sticker-white/80 hover:border-electric-yellow/50"
                    }`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          )}

          {isNameStep && (
            <div className="mt-6">
              <label className="block">
                <span className="font-montserrat text-xs text-sticker-white/70">
                  Nome
                </span>
                <input
                  type="text"
                  name="name"
                  autoComplete="given-name"
                  value={answers.name}
                  onChange={(event) =>
                    setAnswers((prev) => ({
                      ...prev,
                      name: event.target.value,
                    }))
                  }
                  className="mt-2 w-full rounded-xl border-2 border-vibrant-lilac/50 bg-deep-purple/60 px-4 py-3 font-montserrat text-sm text-sticker-white outline-none transition focus:border-electric-yellow"
                  placeholder="Es. Vale"
                />
              </label>
            </div>
          )}

          {isFinalStep && (
            <div className="mt-8 rounded-xl border-2 border-electric-yellow/60 bg-electric-yellow/10 px-5 py-4">
              <p className="font-montserrat text-sm text-sticker-white">
                Sei pronto a partire: crea il tuo accesso per sbloccare i moduli.
              </p>
              <p className="mt-3 font-montserrat text-xs text-sticker-white/80">
                Hai già un account?{" "}
                <Link
                  href="/login"
                  className="font-semibold text-electric-yellow hover:text-electric-yellow/80"
                >
                  Accedi
                </Link>
              </p>
            </div>
          )}
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
          <button
            type="button"
            onClick={handleBack}
            disabled={stepIndex === 0}
            className="inline-flex items-center justify-center rounded-lg border-2 border-vibrant-lilac/50 px-5 py-3 font-staatliches text-sm uppercase tracking-wide text-sticker-white/70 transition hover:border-electric-yellow/60 hover:text-sticker-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            Indietro
          </button>

          {!isFinalStep ? (
            <button
              type="button"
              onClick={handleNext}
              disabled={!canContinue}
              className="inline-flex items-center justify-center rounded-lg bg-electric-yellow px-6 py-3 font-staatliches text-sm font-bold uppercase tracking-wide text-deep-purple transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Continua
            </button>
          ) : (
            <Link
              href="/login"
              onClick={handleFinish}
              className="inline-flex items-center justify-center rounded-lg bg-electric-yellow px-6 py-3 font-staatliches text-sm font-bold uppercase tracking-wide text-deep-purple transition hover:brightness-110"
            >
              Crea il tuo accesso
            </Link>
          )}
        </div>
      </div>
    </main>
  );
}
