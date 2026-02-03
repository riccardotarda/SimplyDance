"use client";

import Link from "next/link";
import { RequireAuth } from "@/components/RequireAuth";
import { BottomNav } from "@/components/BottomNav";
import { LearningLibrary } from "@/components/LearningLibrary";

export default function PerformancePage() {
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
            Performance
          </h1>
          <p className="mt-2 font-montserrat text-sticker-white/80">
            Le coreografie finali da ripassare quando vuoi.
          </p>

          <LearningLibrary mode="performance" />
        </div>
        <BottomNav />
      </main>
    </RequireAuth>
  );
}
