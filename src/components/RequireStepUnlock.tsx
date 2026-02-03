"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCompletedSteps, syncProgressFromSupabase } from "@/lib/progress";

interface RequireStepUnlockProps {
  moduleId: string;
  stepNumber: number;
  children: React.ReactNode;
}

export function RequireStepUnlock({
  moduleId,
  stepNumber,
  children,
}: RequireStepUnlockProps) {
  const router = useRouter();
  const [isAllowed, setIsAllowed] = useState(false);

  useEffect(() => {
    const check = async () => {
      await syncProgressFromSupabase();
      if (stepNumber <= 1) {
        setIsAllowed(true);
        return;
      }
      const completed = getCompletedSteps(moduleId);
      if (!completed.includes(stepNumber - 1)) {
        router.replace(`/lezioni/${moduleId}`);
        return;
      }
      setIsAllowed(true);
    };

    check();
  }, [moduleId, router, stepNumber]);

  if (!isAllowed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-deep-purple px-6">
        <p className="font-montserrat text-sm text-sticker-white/70">
          Sto controllando lo sblocco dello step...
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
