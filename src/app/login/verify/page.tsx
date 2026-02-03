"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { isSupabaseConfigured, supabase } from "@/lib/supabaseClient";
import { syncPurchaseFromSupabase } from "@/lib/purchase";

export default function LoginVerifyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"loading" | "error">("loading");

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const storedEmail =
      window.localStorage.getItem("simplydanceMagicLinkEmail") || "";
    setEmail(storedEmail);
  }, []);

  useEffect(() => {
    const verify = async () => {
      if (!isSupabaseConfigured || !supabase) {
        window.localStorage.setItem("simplydanceLoggedIn", "true");
        if (!window.localStorage.getItem("onboardingCompleted")) {
          window.localStorage.setItem("onboardingCompleted", "true");
        }
        router.replace("/lezioni");
        return;
      }

      const tokenHash = searchParams.get("token_hash");
      const type = searchParams.get("type") ?? "magiclink";

      if (tokenHash) {
        const { error } = await supabase.auth.verifyOtp({
          type: type as "magiclink",
          token_hash: tokenHash,
        });
        if (error) {
          setStatus("error");
          return;
        }
      }

      const { data } = await supabase.auth.getSession();
      const session = data.session;
      if (!session) {
        setStatus("error");
        return;
      }

      const storedName =
        window.localStorage.getItem("simplydanceUserName") || "";
      const rawAnswers = window.localStorage.getItem("onboardingAnswers");
      let onboardingLevel: string | null = null;
      let onboardingGoal: string | null = null;
      if (rawAnswers) {
        try {
          const parsed = JSON.parse(rawAnswers) as {
            level?: string;
            goal?: string;
          };
          onboardingLevel = parsed?.level ?? null;
          onboardingGoal = parsed?.goal ?? null;
        } catch {
          // ignore malformed storage
        }
      }
      if (!window.localStorage.getItem("onboardingCompleted")) {
        window.localStorage.setItem("onboardingCompleted", "true");
      }
      if (session.user.email) {
        window.localStorage.setItem("simplydanceUserEmail", session.user.email);
      }

      await supabase.from("profiles").upsert({
        id: session.user.id,
        email: session.user.email,
        name: storedName || null,
        level: onboardingLevel,
        goal: onboardingGoal,
      });

      await syncPurchaseFromSupabase();

      router.replace("/lezioni");
    };

    verify();
  }, [router, searchParams]);

  return (
    <main className="min-h-screen bg-deep-purple">
      <div className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center px-6 py-10 text-center">
        <p className="font-montserrat text-xs uppercase tracking-[0.2em] text-sticker-white/60">
          Verifica
        </p>
        <h1 className="mt-3 font-staatliches text-3xl font-bold uppercase tracking-tight text-sticker-white md:text-4xl">
          Stiamo verificando il link
        </h1>
        <p className="mt-3 max-w-md font-montserrat text-sm text-sticker-white/80 md:text-base">
          {status === "loading"
            ? "Un attimo e ti portiamo dentro al percorso."
            : "Non riesco a verificare il link. Riprovare?"}
        </p>
        {email && (
          <p className="mt-4 font-montserrat text-xs text-sticker-white/70">
            Accesso per{" "}
            <span className="font-semibold text-electric-yellow">
              {email}
            </span>
          </p>
        )}
        <Link
          href="/login"
          className="mt-8 inline-flex items-center justify-center rounded-lg border-2 border-vibrant-lilac/50 px-6 py-3 font-staatliches text-sm uppercase tracking-wide text-sticker-white/80 transition hover:border-electric-yellow/60 hover:text-sticker-white"
        >
          Torna al login
        </Link>
      </div>
    </main>
  );
}
