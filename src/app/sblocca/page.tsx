"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { RequireAuth } from "@/components/RequireAuth";
import { isPurchased, syncPurchaseFromSupabase } from "@/lib/purchase";
import { isSupabaseConfigured, supabase } from "@/lib/supabaseClient";

export default function UnlockPage() {
  const router = useRouter();
  const [purchased, setPurchased] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const check = async () => {
      if (isSupabaseConfigured && supabase) {
        await syncPurchaseFromSupabase();
      }
      const current = isPurchased();
      setPurchased(current);
      setIsChecking(false);
      if (current) {
        router.replace("/lezioni");
      }
    };
    check();
  }, []);

  const handlePurchase = async () => {
    setErrorMessage("");
    setIsLoading(true);
    if (!isSupabaseConfigured || !supabase) {
      setErrorMessage("Login non disponibile. Riprova tra poco.");
      setIsLoading(false);
      return;
    }
    const { data } = await supabase.auth.getSession();
    const session = data.session;
    if (!session) {
      setErrorMessage("Devi accedere prima di sbloccare.");
      setIsLoading(false);
      return;
    }
    const response = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: session.user.id }),
    });
    let payload: { url?: string; error?: string } = {};
    try {
      payload = (await response.json()) as { url?: string; error?: string };
    } catch {
      payload = {};
    }
    if (!response.ok || !payload.url) {
      setErrorMessage(payload.error ?? "Non riesco a creare il checkout.");
      setIsLoading(false);
      return;
    }
    window.location.href = payload.url;
  };

  return (
    <RequireAuth>
      <main className="min-h-screen bg-deep-purple noise-bg">
        <div className="mx-auto flex min-h-screen max-w-2xl flex-col px-6 py-10">
          <div className="mb-10">
            <Link
              href="/lezioni"
              className="inline-flex items-center gap-2 font-montserrat text-sm text-sticker-white/70 transition hover:text-sticker-white"
            >
              <span aria-hidden>←</span>
              Torna ai moduli
            </Link>
          </div>

          {isChecking ? (
            <div className="rounded-2xl border-2 border-vibrant-lilac/40 bg-zinc-900/70 p-6 md:p-8">
              <p className="font-montserrat text-sm text-sticker-white/70">
                Sto verificando il tuo accesso...
              </p>
            </div>
          ) : (
          <div className="rounded-2xl border-2 border-vibrant-lilac/40 bg-zinc-900/70 p-6 md:p-8">
            <p className="font-montserrat text-xs uppercase tracking-[0.2em] text-sticker-white/60">
              Lifetime Access
            </p>
            <h1 className="mt-3 font-staatliches text-3xl font-bold uppercase tracking-tight text-sticker-white md:text-4xl">
              DIVENTA UNA LEGGENDA. PER SEMPRE.
            </h1>
            <p className="mt-3 font-montserrat text-sm text-sticker-white/80 md:text-base">
              Sblocca l'intero percorso SimplyDance. Niente abbonamenti, niente
              costi nascosti.
            </p>

            <div className="mt-8 grid gap-3">
              {[
                "Tutti i Moduli Presenti: The Ground, Flow, Stage.",
                "Tutte le Coreografie Future: ogni nuova canzone sara tua.",
                "Aggiornamenti a Vita: l'app cresce, il tuo accesso resta.",
                "Download Offline: balla dove vuoi (feature promessa).",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-xl border-2 border-vibrant-lilac/60 bg-deep-purple/70 px-4 py-3"
                >
                  <p className="font-montserrat text-sm text-sticker-white">
                    ✅ {item}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-xl border-2 border-electric-yellow/60 bg-electric-yellow/10 px-5 py-4">
              <p className="font-montserrat text-xs uppercase tracking-[0.2em] text-sticker-white/70">
                Prezzo originale
              </p>
              <p className="mt-2 font-montserrat text-lg text-sticker-white/70 line-through">
                €99,00
              </p>
              <p className="mt-4 font-montserrat text-xs uppercase tracking-[0.2em] text-electric-yellow">
                Sconto lancio (70%)
              </p>
              <p className="mt-2 font-staatliches text-3xl font-bold text-electric-yellow">
                €27,99
              </p>
              <p className="mt-3 font-montserrat text-xs text-sticker-white/70">
                Paghi una volta, balli per sempre.
              </p>
            </div>

            <div className="mt-8 grid gap-4">
              {purchased ? (
                <Link
                  href="/lezioni"
                  className="inline-flex w-full items-center justify-center rounded-2xl bg-electric-yellow px-6 py-4 font-staatliches text-base font-bold uppercase tracking-wide text-deep-purple transition hover:brightness-110"
                >
                  Accesso gia attivo
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={handlePurchase}
                  disabled={isLoading}
                  className="cta-pulse inline-flex w-full items-center justify-center rounded-2xl bg-electric-yellow px-6 py-4 font-staatliches text-base font-bold uppercase tracking-wide text-deep-purple transition hover:brightness-110 disabled:opacity-70"
                >
                  {isLoading ? "Apro il pagamento..." : "Sblocca ora"}
                </button>
              )}
              {errorMessage && (
                <p className="text-center font-montserrat text-xs text-red-200">
                  {errorMessage}
                </p>
              )}
              <p className="text-center font-montserrat text-xs text-sticker-white/70">
                Unisciti a +500 ballerini che hanno gia scelto il percorso
                completo.
              </p>
              <Link
                href="/lezioni"
                className="inline-flex w-full items-center justify-center rounded-lg border-2 border-vibrant-lilac/50 px-6 py-3 font-staatliches text-sm uppercase tracking-wide text-sticker-white/80 transition hover:border-electric-yellow/60 hover:text-sticker-white"
              >
                Continuerò con il livello 1
              </Link>
            </div>
          </div>
          )}
        </div>
      </main>
    </RequireAuth>
  );
}
