"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { modulesList } from "@/data/modules";
import { isModuleCompleted } from "@/lib/progress";
import { isPurchased } from "@/lib/purchase";

interface RequireModuleUnlockProps {
  moduleId: string;
  children: React.ReactNode;
}

export function RequireModuleUnlock({
  moduleId,
  children,
}: RequireModuleUnlockProps) {
  const router = useRouter();
  const [isAllowed, setIsAllowed] = useState(false);

  const orderedModules = useMemo(
    () => modulesList.filter((module) => !module.isPlaceholder),
    []
  );

  useEffect(() => {
    const index = orderedModules.findIndex((module) => module.id === moduleId);
    if (index <= 0) {
      setIsAllowed(true);
      return;
    }
    if (!isPurchased()) {
      router.replace("/sblocca");
      return;
    }
    const previous = orderedModules[index - 1];
    const unlocked = isModuleCompleted(previous.id, previous.stepCount);
    if (!unlocked) {
      router.replace("/lezioni");
      return;
    }
    setIsAllowed(true);
  }, [moduleId, orderedModules, router]);

  if (!isAllowed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-deep-purple px-6">
        <p className="font-montserrat text-sm text-sticker-white/70">
          Sto verificando lo sblocco del modulo...
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
