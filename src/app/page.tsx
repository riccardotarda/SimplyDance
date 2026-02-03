"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { isSupabaseConfigured, supabase } from "@/lib/supabaseClient";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (isSupabaseConfigured && supabase) {
      supabase.auth.getSession().then(({ data }) => {
        setIsLoggedIn(Boolean(data.session));
      });
      return;
    }
    const fallback =
      typeof window !== "undefined" &&
      window.localStorage.getItem("simplydanceLoggedIn") === "true";
    setIsLoggedIn(fallback);
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 bg-deep-purple">
      <div className="max-w-lg text-center">
        <h1 className="font-staatliches text-5xl font-bold uppercase tracking-tight text-sticker-white md:text-6xl">
          SimplyDance
        </h1>
        <p className="mt-4 font-montserrat text-lg text-sticker-white/90">
          Impara a ballare passo dopo passo
        </p>

        {isLoggedIn ? (
          <Link
            href="/lezioni"
            className="mt-10 inline-flex items-center justify-center rounded-lg bg-electric-yellow px-8 py-4 font-staatliches text-base font-bold uppercase tracking-wide text-deep-purple transition focus:outline-none focus:ring-2 focus:ring-electric-yellow focus:ring-offset-2 focus:ring-offset-deep-purple"
          >
            Vai ai moduli
          </Link>
        ) : (
          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-lg border-2 border-vibrant-lilac/60 px-8 py-4 font-staatliches text-base font-bold uppercase tracking-wide text-sticker-white/80 transition hover:border-electric-yellow/60 hover:text-sticker-white"
            >
              Accedi
            </Link>
            <Link
              href="/onboarding"
              className="inline-flex items-center justify-center rounded-lg bg-electric-yellow px-8 py-4 font-staatliches text-base font-bold uppercase tracking-wide text-deep-purple transition focus:outline-none focus:ring-2 focus:ring-electric-yellow focus:ring-offset-2 focus:ring-offset-deep-purple"
            >
              Inizia
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
