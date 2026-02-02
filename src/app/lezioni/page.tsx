import Link from "next/link";
import { modulesList } from "@/data/modules";
import { ModuleCard } from "@/components/ModuleCard";

export default function LezioniPage() {
  return (
    <main className="min-h-screen bg-deep-purple">
      <div className="mx-auto max-w-2xl px-6 py-10">
        <div className="mb-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-montserrat text-sm text-sticker-white/70 transition hover:text-sticker-white"
          >
            <span aria-hidden>←</span>
            Torna alla home
          </Link>
        </div>

        <h1 className="font-staatliches text-3xl font-bold uppercase tracking-tight text-sticker-white">
          Tutti i moduli
        </h1>
        <p className="mt-2 font-montserrat text-sticker-white/80">
          Percorso in sequenza. Completa un modulo per procedere.
        </p>

        <div className="mt-10 space-y-4">
          {modulesList.map((module) => (
            <ModuleCard key={module.id} module={module} />
          ))}
        </div>
      </div>
    </main>
  );
}
