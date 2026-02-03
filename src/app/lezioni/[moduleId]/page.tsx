import Link from "next/link";
import { notFound } from "next/navigation";
import { getModuleById } from "@/lib/modules";
import { ModuleHeader } from "@/components/ModuleHeader";
import { StepsListWithProgress } from "@/components/StepsListWithProgress";
import { RequireAuth } from "@/components/RequireAuth";
import { RequireModuleUnlock } from "@/components/RequireModuleUnlock";

interface ModulePageProps {
  params: Promise<{ moduleId: string }>;
}

export default async function ModulePage({ params }: ModulePageProps) {
  const { moduleId } = await params;
  const lesson = getModuleById(moduleId);

  if (!lesson) {
    notFound();
  }

  return (
    <RequireAuth>
      <RequireModuleUnlock moduleId={moduleId}>
        <main className="min-h-screen bg-deep-purple">
          <div className="mx-auto max-w-2xl px-6 pb-28 pt-10">
            <div className="mb-10">
              <Link
                href="/lezioni"
                className="inline-flex items-center gap-2 font-montserrat text-sm text-sticker-white/70 transition hover:text-sticker-white"
              >
                <span aria-hidden>←</span>
                Tutti i moduli
              </Link>
            </div>

            <p className="mb-2 font-staatliches text-sm font-bold uppercase tracking-wider text-electric-yellow">
              Percorso · Livello 1
            </p>

            <ModuleHeader module={lesson} />

            <StepsListWithProgress moduleId={moduleId} steps={lesson.steps} />
          </div>

          <div
            className="sticky bottom-0 left-0 right-0 z-10 border-t-2 border-vibrant-lilac bg-deep-purple/95 px-4 py-4 backdrop-blur-sm"
            style={{
              paddingBottom: "max(env(safe-area-inset-bottom), 1rem)",
            }}
          >
            <div className="mx-auto max-w-2xl">
              <Link
                href={`/lezioni/${moduleId}/step/1`}
                className="inline-flex w-full items-center justify-center rounded-xl border-2 border-electric-yellow bg-electric-yellow px-6 py-4 font-staatliches text-base font-bold uppercase tracking-wide text-deep-purple transition focus:outline-none focus:ring-2 focus:ring-electric-yellow focus:ring-offset-2 focus:ring-offset-deep-purple"
              >
                Inizia da Step 1
              </Link>
            </div>
          </div>
        </main>
      </RequireModuleUnlock>
    </RequireAuth>
  );
}
