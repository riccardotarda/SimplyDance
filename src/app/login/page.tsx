"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { isSupabaseConfigured, supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [isSent, setIsSent] = useState(false);
  const [onboardingName, setOnboardingName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const canSubmit = email.trim().length > 0;

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    if (isSupabaseConfigured && supabase) {
      supabase.auth.getSession().then(({ data }) => {
        if (data.session) {
          router.replace("/lezioni");
          return;
        }
        setIsChecking(false);
      });
    } else {
      const isLoggedIn =
        window.localStorage.getItem("simplydanceLoggedIn") === "true";
      if (isLoggedIn) {
        router.replace("/lezioni");
        return;
      }
      setIsChecking(false);
    }
    const rawAnswers = window.localStorage.getItem("onboardingAnswers");
    if (rawAnswers) {
      try {
        const parsed = JSON.parse(rawAnswers) as { name?: string };
        if (parsed?.name) {
          setOnboardingName(parsed.name);
        }
      } catch {
        // ignore malformed storage
      }
    }
  }, [router]);

  const greeting = useMemo(() => {
    if (!onboardingName) {
      return "Inizia con la tua email";
    }
    return `Ciao ${onboardingName}, iniziamo con la tua email`;
  }, [onboardingName]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit || isSubmitting) {
      return;
    }
    setIsSubmitting(true);
    setErrorMessage("");
    if (typeof window !== "undefined") {
      window.localStorage.setItem("simplydanceUserEmail", email.trim());
      window.localStorage.setItem("simplydanceMagicLinkEmail", email.trim());
      window.localStorage.setItem(
        "simplydanceMagicLinkSentAt",
        new Date().toISOString()
      );
    }
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          emailRedirectTo: `${window.location.origin}/login/verify`,
        },
      });
      if (error) {
        setErrorMessage(
          "Non riesco a inviare il link. Riprova tra poco o controlla lo spam."
        );
        setIsSubmitting(false);
        return;
      }
      setIsSubmitting(false);
      setIsSent(true);
      return;
    }
    if (typeof window !== "undefined") {
      window.localStorage.setItem("simplydanceLoggedIn", "true");
    }
    setIsSubmitting(false);
    setIsSent(true);
  };

  if (isChecking) {
    return (
      <main className="min-h-screen bg-deep-purple">
        <div className="mx-auto flex min-h-screen max-w-2xl items-center justify-center px-6 py-10">
          <p className="font-montserrat text-sm text-sticker-white/70">
            Verifico il tuo accesso...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-deep-purple">
      <div className="mx-auto flex min-h-screen max-w-2xl flex-col px-6 py-10">
        <div className="mb-10 flex items-center justify-between gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-montserrat text-sm text-sticker-white/70 transition hover:text-sticker-white"
          >
            <span aria-hidden>←</span>
            Torna alla home
          </Link>
        </div>

        <div className="rounded-2xl border-2 border-vibrant-lilac/40 bg-zinc-900/70 p-6 md:p-8">
          <p className="font-montserrat text-xs uppercase tracking-[0.2em] text-sticker-white/60">
            Registrazione
          </p>
          <h1 className="mt-3 font-staatliches text-3xl font-bold uppercase tracking-tight text-sticker-white md:text-4xl">
            {greeting}
          </h1>
          <p className="mt-3 font-montserrat text-sm text-sticker-white/80 md:text-base">
            Accedi o registrati con la tua email per salvare i progressi e
            riprendere sempre dal tuo ultimo passo.
          </p>
          {!isSupabaseConfigured && (
            <p className="mt-3 rounded-xl border-2 border-vibrant-lilac/40 bg-deep-purple/60 px-4 py-3 font-montserrat text-xs text-sticker-white/70">
              Configura Supabase per inviare i magic link reali. Per ora il
              login è in modalità demo.
            </p>
          )}

          {!isSent ? (
            <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
              <label className="block">
                <span className="font-montserrat text-xs text-sticker-white/70">
                  Email
                </span>
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="mt-2 w-full rounded-xl border-2 border-vibrant-lilac/50 bg-deep-purple/60 px-4 py-3 font-montserrat text-sm text-sticker-white outline-none transition focus:border-electric-yellow"
                  placeholder="tu@semplice.com"
                />
              </label>

              <button
                type="submit"
                disabled={!canSubmit || isSubmitting}
                className="inline-flex w-full items-center justify-center rounded-lg bg-electric-yellow px-6 py-3 font-staatliches text-sm font-bold uppercase tracking-wide text-deep-purple transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? "Invio link..." : "Mandami il link"}
              </button>
              {errorMessage && (
                <p className="font-montserrat text-xs text-red-200">
                  {errorMessage}
                </p>
              )}
            </form>
          ) : (
            <div className="mt-8 space-y-4">
              <div className="rounded-xl border-2 border-electric-yellow/60 bg-electric-yellow/10 px-5 py-4">
                <p className="font-montserrat text-sm text-sticker-white">
                  Ti abbiamo inviato un link di accesso a{" "}
                  <span className="font-semibold text-electric-yellow">
                    {email}
                  </span>
                  .
                </p>
                <p className="mt-2 font-montserrat text-xs text-sticker-white/70">
                  Aprilo per entrare subito nel percorso.
                </p>
              </div>

              <button
                type="button"
                onClick={() => router.push("/login/verify")}
                className="inline-flex w-full items-center justify-center rounded-lg bg-electric-yellow px-6 py-3 font-staatliches text-sm font-bold uppercase tracking-wide text-deep-purple transition hover:brightness-110"
              >
                Ho cliccato il link
              </button>

              <button
                type="button"
                onClick={() => setIsSent(false)}
                className="inline-flex w-full items-center justify-center rounded-lg border-2 border-vibrant-lilac/50 px-6 py-3 font-staatliches text-sm uppercase tracking-wide text-sticker-white/80 transition hover:border-electric-yellow/60 hover:text-sticker-white"
              >
                Cambia email
              </button>
            </div>
          )}

          <p className="mt-6 font-montserrat text-xs text-sticker-white/70">
            Ti basta l&apos;email, niente password: ti teniamo al sicuro con un
            link rapido (in arrivo).
          </p>
        </div>
      </div>
    </main>
  );
}
