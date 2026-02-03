"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { RequireAuth } from "@/components/RequireAuth";
import { clearPurchase, isPurchased } from "@/lib/purchase";
import { isSupabaseConfigured, supabase } from "@/lib/supabaseClient";

type StoredOnboarding = {
  name?: string;
  level?: string;
  goal?: string;
};

export default function SettingsPage() {
  const router = useRouter();
  const [draftName, setDraftName] = useState("");
  const [email, setEmail] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [purchased, setPurchased] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      if (typeof window === "undefined") {
        return;
      }
      const storedEmail =
        window.localStorage.getItem("simplydanceUserEmail") || "";
      setEmail(storedEmail);

      const rawAnswers = window.localStorage.getItem("onboardingAnswers");
      if (rawAnswers) {
        try {
          const parsed = JSON.parse(rawAnswers) as StoredOnboarding;
          if (parsed?.name) {
            setDraftName(parsed.name);
          }
        } catch {
          // ignore malformed storage
        }
      }

      if (isSupabaseConfigured && supabase) {
        const { data: userData } = await supabase.auth.getUser();
        const user = userData.user;
        if (user) {
          const { data } = await supabase
            .from("profiles")
            .select("name,email")
            .eq("id", user.id)
            .maybeSingle();
          if (data?.name) {
            setDraftName(data.name);
          }
          if (data?.email) {
            setEmail(data.email);
          }
        }
      }

      setPurchased(isPurchased());
      setIsLoading(false);
    };

    void loadProfile();
  }, []);

  const handleSaveName = async () => {
    if (typeof window === "undefined") {
      return;
    }
    const trimmed = draftName.trim();
    setSaveError("");
    setIsSaved(true);

    const rawAnswers = window.localStorage.getItem("onboardingAnswers");
    let payload: StoredOnboarding = {};
    if (rawAnswers) {
      try {
        payload = JSON.parse(rawAnswers) as StoredOnboarding;
      } catch {
        payload = {};
      }
    }
    payload.name = trimmed;
    window.localStorage.setItem("onboardingAnswers", JSON.stringify(payload));
    window.localStorage.setItem("simplydanceUserName", trimmed);

    if (isSupabaseConfigured && supabase) {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData.user;
      if (user) {
        const { error } = await supabase.from("profiles").upsert(
          {
            id: user.id,
            name: trimmed || null,
            email: user.email ?? null,
          },
          { onConflict: "id" }
        );
        if (error) {
          setSaveError(
            "Non riesco a salvare il nome. Riprova tra poco."
          );
        }
      }
    }

    window.setTimeout(() => setIsSaved(false), 2000);
  };

  const handleRedoOnboarding = () => {
    if (typeof window === "undefined") {
      return;
    }
    window.localStorage.removeItem("onboardingCompleted");
    router.push("/onboarding");
  };

  const handleLogout = async () => {
    if (typeof window === "undefined") {
      return;
    }
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    window.localStorage.removeItem("simplydanceLoggedIn");
    router.replace("/login");
  };

  return (
    <RequireAuth>
      <main className="min-h-screen bg-deep-purple">
        <div className="mx-auto flex min-h-screen max-w-2xl flex-col px-6 py-10">
          <div className="mb-10 flex items-center justify-between gap-4">
            <Link
              href="/lezioni"
              className="inline-flex items-center gap-2 font-montserrat text-sm text-sticker-white/70 transition hover:text-sticker-white"
            >
              <span aria-hidden>←</span>
              Torna alle lezioni
            </Link>
          </div>

          <div className="rounded-2xl border-2 border-vibrant-lilac/40 bg-zinc-900/70 p-6 md:p-8">
            <p className="font-montserrat text-xs uppercase tracking-[0.2em] text-sticker-white/60">
              Impostazioni
            </p>
            <h1 className="mt-3 font-staatliches text-3xl font-bold uppercase tracking-tight text-sticker-white md:text-4xl">
              Il tuo profilo
            </h1>
            <p className="mt-3 font-montserrat text-sm text-sticker-white/80 md:text-base">
              Gestisci i tuoi dati e il percorso di onboarding.
            </p>

            {isLoading ? (
              <div className="mt-8 space-y-4">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={`profile-skeleton-${index}`}
                    className="rounded-xl border-2 border-vibrant-lilac/40 bg-deep-purple/60 px-5 py-4"
                  >
                    <div className="h-3 w-20 rounded bg-sticker-white/10" />
                    <div className="mt-3 h-4 w-2/3 rounded bg-sticker-white/10" />
                  </div>
                ))}
              </div>
            ) : (
            <div className="mt-8 space-y-4">
              <div className="rounded-xl border-2 border-vibrant-lilac/50 bg-deep-purple/60 px-5 py-4">
                <p className="font-montserrat text-xs uppercase tracking-[0.2em] text-sticker-white/60">
                  Nome
                </p>
                <div className="mt-3 flex flex-col gap-3">
                  <input
                    type="text"
                    name="name"
                    autoComplete="given-name"
                    value={draftName}
                    onChange={(event) => setDraftName(event.target.value)}
                    className="w-full rounded-xl border-2 border-vibrant-lilac/50 bg-deep-purple/80 px-4 py-3 font-montserrat text-sm text-sticker-white outline-none transition focus:border-electric-yellow"
                    placeholder="Come vuoi farti chiamare?"
                  />
                  <div className="flex items-center justify-between gap-4">
                    <button
                      type="button"
                      onClick={handleSaveName}
                      className="inline-flex items-center justify-center rounded-lg bg-electric-yellow px-5 py-2 font-staatliches text-xs font-bold uppercase tracking-wide text-deep-purple transition hover:brightness-110"
                    >
                      Salva nome
                    </button>
                    {isSaved && (
                      <span className="font-montserrat text-xs text-electric-yellow">
                        Salvato!
                      </span>
                    )}
                  </div>
                  {saveError && (
                    <p className="font-montserrat text-xs text-red-200">
                      {saveError}
                    </p>
                  )}
                </div>
              </div>

              <div className="rounded-xl border-2 border-vibrant-lilac/50 bg-deep-purple/60 px-5 py-4">
                <p className="font-montserrat text-xs uppercase tracking-[0.2em] text-sticker-white/60">
                  Email
                </p>
                <p className="mt-2 font-montserrat text-sm text-sticker-white">
                  {email || "Non impostata"}
                </p>
              </div>

              <div className="rounded-xl border-2 border-vibrant-lilac/50 bg-deep-purple/60 px-5 py-4">
                <p className="font-montserrat text-xs uppercase tracking-[0.2em] text-sticker-white/60">
                  Accesso
                </p>
                <p className="mt-2 font-montserrat text-sm text-sticker-white">
                  {purchased ? "Sblocco completo attivo" : "Livello 1 gratuito"}
                </p>
                {!purchased && (
                  <Link
                    href="/sblocca"
                    className="mt-3 inline-flex items-center gap-1.5 font-montserrat text-xs font-semibold text-electric-yellow"
                  >
                    Sblocca tutto
                    <span aria-hidden>→</span>
                  </Link>
                )}
                {purchased && (
                  <button
                    type="button"
                    onClick={() => {
                      clearPurchase();
                      setPurchased(false);
                    }}
                    className="mt-3 inline-flex items-center gap-1.5 font-montserrat text-xs font-semibold text-sticker-white/70"
                  >
                    Rimuovi sblocco
                  </button>
                )}
              </div>
            </div>
            )}

            <div className="mt-8 grid gap-3">
              <button
                type="button"
                onClick={handleRedoOnboarding}
                className="inline-flex w-full items-center justify-center rounded-lg border-2 border-vibrant-lilac/50 px-6 py-3 font-staatliches text-sm uppercase tracking-wide text-sticker-white/80 transition hover:border-electric-yellow/60 hover:text-sticker-white"
              >
                Rifai onboarding
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex w-full items-center justify-center rounded-lg bg-electric-yellow px-6 py-3 font-staatliches text-sm font-bold uppercase tracking-wide text-deep-purple transition hover:brightness-110"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </main>
    </RequireAuth>
  );
}
