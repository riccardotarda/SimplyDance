import type { LessonStep } from "@/types/lesson";

const typeLabels: Record<LessonStep["type"], string> = {
  video: "Video",
  practice: "Pratica",
  performance: "Performance",
  passo: "Passo",
};

const typeStyles: Record<LessonStep["type"], string> = {
  video: "border-electric-yellow/60 bg-electric-yellow/20 text-electric-yellow",
  practice:
    "border-vibrant-lilac/60 bg-vibrant-lilac/20 text-vibrant-lilac",
  performance:
    "border-vibrant-lilac bg-vibrant-lilac/30 text-sticker-white",
  passo: "border-electric-yellow bg-electric-yellow/20 text-electric-yellow",
};

const behaviorHints: Record<LessonStep["type"], string> = {
  video: "Guarda per capire la teoria",
  practice: "In loop · Ripeti finché non ti senti sicuro, poi passa oltre",
  performance: "Valida ciò che hai imparato",
  passo: "Sblocca un passo e aggiungilo alla tua libreria",
};

interface LessonStepCardProps {
  step: LessonStep;
  isLast?: boolean;
  completed?: boolean;
  locked?: boolean;
}

export function LessonStepCard({
  step,
  isLast = false,
  completed = false,
  locked = false,
}: LessonStepCardProps) {
  return (
    <div className="relative flex gap-5">
      {!isLast && (
        <div
          className="absolute left-5 top-14 bottom-0 w-0.5 bg-vibrant-lilac/60"
          aria-hidden
        />
      )}
      <div
        className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-vibrant-lilac bg-zinc-900 font-staatliches text-sm font-bold text-electric-yellow"
        aria-hidden
      >
        {step.number}
      </div>
      <div className="flex-1 pb-10">
        <div
          className={`rounded-xl border-2 border-vibrant-lilac bg-zinc-900/80 p-5 transition ${
            locked ? "opacity-60" : "hover:border-electric-yellow/50"
          }`}
        >
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex rounded-md border-2 px-2 py-0.5 font-montserrat text-xs font-semibold ${typeStyles[step.type]}`}
            >
              {typeLabels[step.type]}
            </span>
            {locked && (
              <span className="inline-flex rounded-md border-2 border-vibrant-lilac/60 bg-deep-purple/60 px-2 py-0.5 font-montserrat text-xs font-semibold text-sticker-white/60">
                Bloccato
              </span>
            )}
            {completed && (
              <span className="inline-flex rounded-md border-2 border-electric-yellow bg-electric-yellow/20 px-2 py-0.5 font-montserrat text-xs font-semibold text-electric-yellow">
                Completato
              </span>
            )}
            {step.duration && (
              <span className="font-montserrat text-xs text-sticker-white/60">
                {step.duration}
              </span>
            )}
          </div>
          <h3 className="font-staatliches text-lg font-bold uppercase tracking-wide text-sticker-white">
            {step.title}
          </h3>
          <p className="mt-1 font-montserrat text-sm text-sticker-white/80">
            {step.description}
          </p>
          <p className="mt-2 font-montserrat text-xs text-sticker-white/60">
            {locked
              ? "Completa lo step precedente per sbloccarlo."
              : behaviorHints[step.type]}
          </p>
        </div>
      </div>
    </div>
  );
}
