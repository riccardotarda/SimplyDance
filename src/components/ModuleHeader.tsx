import type { LessonModule } from "@/types/lesson";

interface ModuleHeaderProps {
  module: LessonModule;
}

export function ModuleHeader({ module }: ModuleHeaderProps) {
  return (
    <div className="mb-8">
      <h1 className="font-staatliches text-2xl font-bold uppercase tracking-wide text-sticker-white md:text-3xl">
        {module.title}
      </h1>
      <p className="mt-1 font-montserrat text-sticker-white/80">
        {module.steps.length} step · Ogni modulo si conclude con una performance
      </p>
    </div>
  );
}
