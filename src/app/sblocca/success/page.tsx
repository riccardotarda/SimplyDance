"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { RequireAuth } from "@/components/RequireAuth";
import { markPurchased, syncPurchaseFromSupabase } from "@/lib/purchase";
import { isSupabaseConfigured, supabase } from "@/lib/supabaseClient";

export default function UnlockSuccessPage() {
  const router = useRouter();
  const [status, setStatus] = useState<"checking" | "done">("checking");
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const check = async () => {
      if (isSupabaseConfigured && supabase) {
        const { data } = await supabase.auth.getSession();
        const session = data.session;
        if (session) {
          await supabase.from("purchases").upsert({
            user_id: session.user.id,
            product: "lifetime",
            status: "active",
          });
        }
      }
      markPurchased();
      await syncPurchaseFromSupabase();
      setStatus("done");
      setIsReady(true);
    };
    check();
  }, [router]);

  return (
    <RequireAuth>
      <main className="min-h-screen bg-deep-purple noise-bg">
        <div className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center px-6 py-10 text-center">
          <p className="font-montserrat text-xs uppercase tracking-[0.2em] text-sticker-white/60">
            Lifetime Access
          </p>
          <h1 className="mt-3 font-staatliches text-3xl font-bold uppercase tracking-tight text-sticker-white md:text-4xl">
            SEI UNA LEGGENDA.
          </h1>
          <p className="mt-3 max-w-md font-montserrat text-sm text-sticker-white/80 md:text-base">
            {status === "checking"
              ? "Sto verificando il tuo accesso..."
              : "Accesso completo attivo. I moduli avanzati ti aspettano."}
          </p>
          <div className="mt-8 rounded-2xl border-2 border-electric-yellow/60 bg-electric-yellow/10 px-6 py-4">
            <p className="font-montserrat text-sm text-sticker-white">
              Paghi una volta, balli per sempre.
            </p>
          </div>
          <Link
            href="/lezioni"
            className="mt-8 inline-flex items-center justify-center rounded-2xl bg-electric-yellow px-6 py-4 font-staatliches text-base font-bold uppercase tracking-wide text-deep-purple transition hover:brightness-110"
          >
            {isReady ? "Conferma ed entra nei moduli" : "Sto preparando..."}
          </Link>
        </div>
      </main>
    </RequireAuth>
  );
}
