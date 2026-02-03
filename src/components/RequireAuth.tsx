"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isSupabaseConfigured, supabase } from "@/lib/supabaseClient";
import { syncPurchaseFromSupabase } from "@/lib/purchase";
import { syncProgressFromSupabase } from "@/lib/progress";

interface RequireAuthProps {
  children: React.ReactNode;
}

export function RequireAuth({ children }: RequireAuthProps) {
  const router = useRouter();
  const [isAllowed, setIsAllowed] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const fallback = () => {
      const loggedIn =
        typeof window !== "undefined" &&
        window.localStorage.getItem("simplydanceLoggedIn") === "true";
      if (!loggedIn) {
        router.replace("/login");
        return;
      }
      setIsAllowed(true);
      setIsChecking(false);
    };

    if (!isSupabaseConfigured || !supabase) {
      fallback();
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        router.replace("/login");
        return;
      }
      syncPurchaseFromSupabase();
      syncProgressFromSupabase();
      setIsAllowed(true);
      setIsChecking(false);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!session) {
          router.replace("/login");
          return;
        }
        setIsAllowed(true);
        setIsChecking(false);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [router]);

  if (!isAllowed || isChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-deep-purple px-6">
        <p className="font-montserrat text-sm text-sticker-white/70">
          Ti portiamo dentro al percorso...
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
