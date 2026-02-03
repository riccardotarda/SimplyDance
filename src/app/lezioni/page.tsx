import Link from "next/link";
import { RequireAuth } from "@/components/RequireAuth";
import { GearIcon } from "@/components/icons";
import { ModulesIntro } from "@/components/ModulesIntro";
import { LevelOneCta } from "@/components/LevelOneCta";
import { ModulesList } from "@/components/ModulesList";
import { BottomNav } from "@/components/BottomNav";

export default function LezioniPage() {
  return (
    <RequireAuth>
      <main className="min-h-screen bg-deep-purple pb-28">
        <div className="mx-auto max-w-2xl px-6 pt-10">
          <div className="mb-10 flex items-start justify-between gap-6">
            <div className="min-w-0">
              <ModulesIntro />
            </div>
            <Link
              href="/impostazioni"
              aria-label="Impostazioni"
              className="inline-flex items-center justify-center rounded-full border-2 border-vibrant-lilac/50 p-2 text-sticker-white/70 transition hover:border-electric-yellow/60 hover:text-sticker-white"
            >
              <GearIcon className="h-5 w-5" />
            </Link>
          </div>

          <ModulesList />
          <LevelOneCta />
        </div>
        <BottomNav />
      </main>
    </RequireAuth>
  );
}
