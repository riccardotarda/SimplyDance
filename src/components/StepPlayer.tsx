"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  PauseIcon,
  RepeatIcon,
  BackToListIcon,
  ChevronLeftIcon,
  VolumeOffIcon,
  VolumeOnIcon,
} from "./icons";
import type { LessonStep } from "@/types/lesson";
import { markStepCompleted } from "@/lib/progress";

declare global {
  interface Window {
    YT?: { Player: new (el: HTMLElement, opts: YTPlayerOptions) => YTPlayer };
    onYouTubeIframeAPIReady?: () => void;
  }
}

interface YTPlayerOptions {
  videoId?: string;
  playerVars?: Record<string, number | string>;
  events?: {
    onReady?: (event: { target: YTPlayer }) => void;
    onStateChange?: (event: { data: number }) => void;
  };
}

interface YTPlayer {
  mute: () => void;
  unMute: () => void;
  seekTo: (seconds: number, allowSeekAhead?: boolean) => void;
  playVideo: () => void;
  destroy: () => void;
}

interface StepPlayerProps {
  moduleId: string;
  moduleTitle: string;
  step: LessonStep;
  totalSteps: number;
}

export function StepPlayer({
  moduleId,
  moduleTitle,
  step,
  totalSteps,
}: StepPlayerProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [performanceCompleted, setPerformanceCompleted] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YTPlayer | null>(null);

  const isPerformance = step.type === "performance";

  // Segna step completato quando la performance è completata (congratulazioni)
  useEffect(() => {
    if (performanceCompleted && isPerformance) {
      markStepCompleted(moduleId, step.number);
    }
  }, [performanceCompleted, isPerformance, moduleId, step.number]);

  // Reset overlay "video finito" quando si cambia step
  useEffect(() => {
    setVideoEnded(false);
  }, [step.number]);

  // YouTube IFrame API: carica script e crea player quando c'è youtubeId
  useEffect(() => {
    if (!step.youtubeId || !playerContainerRef.current) return;

    const createPlayer = () => {
      if (!playerContainerRef.current || !window.YT?.Player) return;
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
      const player = new window.YT.Player(playerContainerRef.current, {
        videoId: step.youtubeId,
        playerVars: {
          autoplay: 1,
          mute: 0,
          controls: 0,
          rel: 0,
          modestbranding: 1,
          playsinline: 1,
        },
        events: {
          onStateChange: (event: { data: number }) => {
            // YT.PlayerState.ENDED = 0 (video finito)
            if (event.data === 0) {
              if (step.type === "performance") {
                setPerformanceCompleted(true);
              } else {
                setVideoEnded(true);
              }
            }
          },
        },
      });
      playerRef.current = player;
    };

    if (window.YT?.Player) {
      createPlayer();
    } else {
      const prev = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        prev?.();
        createPlayer();
      };
      if (!document.getElementById("youtube-iframe-api")) {
        const script = document.createElement("script");
        script.id = "youtube-iframe-api";
        script.src = "https://www.youtube.com/iframe_api";
        script.async = true;
        document.head.appendChild(script);
      }
    }

    return () => {
      playerRef.current?.destroy();
      playerRef.current = null;
    };
  }, [step.youtubeId, step.type]);

  const nextStepNumber = step.number < totalSteps ? step.number + 1 : null;
  const nextStepUrl = nextStepNumber
    ? `/lezioni/${moduleId}/step/${nextStepNumber}`
    : null;

  const prevStepNumber = step.number > 1 ? step.number - 1 : null;
  const prevStepUrl = prevStepNumber
    ? `/lezioni/${moduleId}/step/${prevStepNumber}`
    : `/lezioni/${moduleId}`;

  const progressPercent = (step.number / totalSteps) * 100;

  return (
    <div className="relative h-screen w-full overflow-hidden bg-deep-purple">
      {/* Performance: overlay congratulazioni sopra il video (copre "watch again" di YouTube) */}
      {isPerformance && performanceCompleted && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-deep-purple px-6 py-10">
          <p className="mb-8 max-w-sm text-center font-staatliches text-xl font-bold uppercase tracking-wide text-sticker-white">
            Congratulazioni per aver completato il modulo {moduleTitle}
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <a
              href={`/lezioni/${moduleId}/step/${step.number}`}
              className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-vibrant-lilac bg-vibrant-lilac/20 px-6 py-3 font-montserrat text-sm font-semibold text-sticker-white transition hover:bg-vibrant-lilac/40 focus:outline-none focus:ring-2 focus:ring-vibrant-lilac focus:ring-offset-2 focus:ring-offset-deep-purple"
            >
              <RepeatIcon className="h-5 w-5" />
              Ripeti la performance
            </a>
            <Link
              href="/lezioni"
              className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-electric-yellow bg-electric-yellow px-6 py-3 font-staatliches text-sm font-bold uppercase tracking-wide text-deep-purple transition focus:outline-none focus:ring-2 focus:ring-electric-yellow focus:ring-offset-2 focus:ring-offset-deep-purple"
            >
              Passa al prossimo modulo
            </Link>
          </div>
        </div>
      )}


      {/* Video a tutto schermo: YouTube (IFrame API) o placeholder */}
      <div className="absolute inset-0 bg-deep-purple">
        {step.youtubeId ? (
          <div
            ref={playerContainerRef}
            className="h-full w-full [&_iframe]:h-full [&_iframe]:w-full [&_iframe]:object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="font-montserrat text-sticker-white/60">Video</span>
            {isPerformance && (
              <button
                type="button"
                onClick={() => setPerformanceCompleted(true)}
                className="absolute bottom-24 left-1/2 -translate-x-1/2 rounded-xl border-2 border-vibrant-lilac bg-vibrant-lilac/30 px-4 py-2 font-montserrat text-sm font-semibold text-sticker-white backdrop-blur-sm"
              >
                Fine video
              </button>
            )}
          </div>
        )}
      </div>

      {/* Overlay centro quando il video è finito: Ripeti + Avanti */}
      {videoEnded && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-6 bg-deep-purple/90 px-6">
          <div className="flex flex-col items-center gap-6 sm:flex-row">
            <button
              type="button"
              onClick={() => {
                playerRef.current?.seekTo(0, true);
                playerRef.current?.playVideo();
                setVideoEnded(false);
              }}
              className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-vibrant-lilac bg-vibrant-lilac/30 text-sticker-white backdrop-blur-sm transition hover:bg-vibrant-lilac/50 focus:outline-none focus:ring-2 focus:ring-vibrant-lilac focus:ring-offset-2 focus:ring-offset-deep-purple"
              aria-label="Ripeti video"
            >
              <RepeatIcon className="h-8 w-8" />
            </button>
            <Link
              href={nextStepUrl ?? `/lezioni/${moduleId}`}
              onClick={() => markStepCompleted(moduleId, step.number)}
              className="rounded-xl border-2 border-electric-yellow bg-electric-yellow px-8 py-4 font-staatliches text-base font-bold uppercase tracking-wide text-deep-purple transition focus:outline-none focus:ring-2 focus:ring-electric-yellow focus:ring-offset-2 focus:ring-offset-deep-purple"
            >
              Avanti
            </Link>
          </div>
        </div>
      )}

      {/* Overlay in alto: gradiente + titolo + barra progressi (nascosto quando video finito) */}
      {!videoEnded && (
      <header
        className="absolute left-0 right-0 top-0 z-20 bg-gradient-to-b from-deep-purple/90 to-transparent pt-[env(safe-area-inset-top)] px-4 pb-6"
        style={{ paddingTop: "max(env(safe-area-inset-top), 0.75rem)" }}
      >
        <div className="flex items-center justify-between gap-3 pt-2 pl-12 pr-0">
          <h1 className="min-w-0 truncate font-staatliches text-base font-bold uppercase tracking-wide text-sticker-white drop-shadow-sm">
            Step {step.number} · {step.title}
          </h1>
          <span className="shrink-0 font-montserrat text-xs text-sticker-white/80">
            {step.number}/{totalSteps}
          </span>
        </div>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full border-2 border-vibrant-lilac/50 bg-sticker-white/20">
          <div
            className="h-full rounded-full bg-electric-yellow transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
            role="progressbar"
            aria-valuenow={step.number}
            aria-valuemin={1}
            aria-valuemax={totalSteps}
            aria-label={`Step ${step.number} di ${totalSteps}`}
          />
        </div>
      </header>
      )}

      {/* Pulsante Pausa in alto a sinistra (nascosto quando video finito) */}
      {!videoEnded && (
      <button
        type="button"
        onClick={() => setMenuOpen((o) => !o)}
        className="absolute left-4 top-4 z-30 flex h-11 w-11 items-center justify-center rounded-full border-2 border-vibrant-lilac/60 bg-deep-purple/80 text-sticker-white backdrop-blur-sm transition hover:bg-vibrant-lilac/40 focus:outline-none focus:ring-2 focus:ring-electric-yellow focus:ring-offset-2 focus:ring-offset-deep-purple"
        style={{ top: "max(env(safe-area-inset-top), 1rem)" }}
        aria-label={menuOpen ? "Chiudi menu" : "Pausa"}
      >
        <PauseIcon />
      </button>
      )}

      {/* Pulsante Audio (nascosto quando video finito) */}
      {!videoEnded && step.youtubeId && (
        <button
          type="button"
          onClick={() => {
            if (playerRef.current) {
              if (isMuted) {
                playerRef.current.unMute();
                setIsMuted(false);
              } else {
                playerRef.current.mute();
                setIsMuted(true);
              }
            }
          }}
          className="absolute right-4 top-4 z-30 flex h-11 w-11 items-center justify-center rounded-full border-2 border-vibrant-lilac/60 bg-deep-purple/80 text-sticker-white backdrop-blur-sm transition hover:bg-vibrant-lilac/40 focus:outline-none focus:ring-2 focus:ring-electric-yellow focus:ring-offset-2 focus:ring-offset-deep-purple"
          style={{ top: "max(env(safe-area-inset-top), 1rem)" }}
          aria-label={isMuted ? "Attiva audio" : "Disattiva audio"}
        >
          {isMuted ? (
            <VolumeOffIcon className="h-6 w-6" />
          ) : (
            <VolumeOnIcon className="h-6 w-6" />
          )}
        </button>
      )}

      {/* Menu pausa */}
      {menuOpen && (
        <>
          <button
            type="button"
            onClick={() => setMenuOpen(false)}
            className="fixed inset-0 z-40 bg-black/50"
            aria-label="Chiudi menu"
          />
          <div
            className="absolute left-4 top-20 z-50 flex flex-col gap-1 rounded-xl border-2 border-vibrant-lilac bg-deep-purple/95 p-2 backdrop-blur-md"
            style={{ top: "calc(max(env(safe-area-inset-top), 1rem) + 3.5rem)" }}
          >
            <Link
              href={`/lezioni/${moduleId}/step/${step.number}`}
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-3 rounded-lg px-3 py-3 font-montserrat text-left text-sm font-semibold text-sticker-white transition hover:bg-vibrant-lilac/30"
            >
              <RepeatIcon className="h-5 w-5 shrink-0" />
              Ripeti
            </Link>
            <Link
              href={`/lezioni/${moduleId}`}
              className="flex items-center gap-3 rounded-lg px-3 py-3 font-montserrat text-left text-sm font-semibold text-sticker-white transition hover:bg-vibrant-lilac/30"
            >
              <BackToListIcon className="h-5 w-5 shrink-0" />
              Torna alla lista degli step
            </Link>
          </div>
        </>
      )}

      {/* Overlay in basso: gradiente + pulsanti (nascosto quando video finito) */}
      {!videoEnded && (
      <div
        className="absolute bottom-0 left-0 right-0 z-20 flex items-center justify-between bg-gradient-to-t from-deep-purple/90 to-transparent px-4 py-4 pb-[env(safe-area-inset-bottom)]"
        style={{
          paddingBottom: "max(env(safe-area-inset-bottom), 1rem)",
        }}
      >
        {prevStepNumber ? (
          <Link
            href={prevStepUrl}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-vibrant-lilac/60 bg-deep-purple/80 text-sticker-white backdrop-blur-sm transition hover:bg-vibrant-lilac/40 focus:outline-none focus:ring-2 focus:ring-electric-yellow focus:ring-offset-2 focus:ring-offset-deep-purple"
            aria-label="Step precedente"
          >
            <ChevronLeftIcon />
          </Link>
        ) : (
          <Link
            href={`/lezioni/${moduleId}`}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-vibrant-lilac/60 bg-deep-purple/80 text-sticker-white backdrop-blur-sm transition hover:bg-vibrant-lilac/40 focus:outline-none focus:ring-2 focus:ring-electric-yellow focus:ring-offset-2 focus:ring-offset-deep-purple"
            aria-label="Torna alla lista step"
          >
            <ChevronLeftIcon />
          </Link>
        )}

        {isPerformance ? (
          <div className="w-14 shrink-0" aria-hidden />
        ) : (
          <Link
            href={nextStepUrl ?? `/lezioni/${moduleId}`}
            onClick={() => markStepCompleted(moduleId, step.number)}
            className="rounded-xl border-2 border-electric-yellow bg-electric-yellow px-6 py-3 font-staatliches text-sm font-bold uppercase tracking-wide text-deep-purple transition focus:outline-none focus:ring-2 focus:ring-electric-yellow focus:ring-offset-2 focus:ring-offset-deep-purple"
          >
            {step.type === "video" ? "Salta" : "Avanti"}
          </Link>
        )}
      </div>
      )}
    </div>
  );
}
