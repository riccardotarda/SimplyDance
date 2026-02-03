"use client";

import Link from "next/link";
import { RequireAuth } from "@/components/RequireAuth";
import { BottomNav } from "@/components/BottomNav";
import { LearningLibrary } from "@/components/LearningLibrary";

export default function PassiPage() {
  return (
    <RequireAuth>
      <main className="min-h-screen bg-deep-purple pb-28">
        <div className="mx-auto max-w-2xl px-6 pt-10">
          <div className="mb-6 flex items-center justify-between gap-4">
            <Link
              href="/lezioni"
              className="inline-flex items-center gap-2 font-montserrat text-sm text-sticker-white/70 transition hover:text-sticker-white"
            >
              <span aria-hidden>←</span>
              Moduli
            </Link>
          </div>

          <h1 className="font-staatliches text-3xl font-bold uppercase tracking-tight text-sticker-white">
            I tuoi passi
          </h1>
          <p className="mt-2 font-montserrat text-sticker-white/80">
            Qui trovi i movimenti che hai sbloccato, da ripetere quando vuoi.
          </p>

          <LearningLibrary mode="passi" />
        </div>
        <BottomNav />
      </main>
    </RequireAuth>
  );
}
