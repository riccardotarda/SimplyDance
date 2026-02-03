const iconClass = "h-6 w-6";

export function PauseIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className ?? iconClass}
      fill="currentColor"
      viewBox="0 0 24 24"
      aria-hidden
    >
      <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
    </svg>
  );
}

export function RepeatIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className ?? iconClass}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
      />
    </svg>
  );
}

export function BackToListIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className ?? iconClass}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 6h16M4 10h16M4 14h16M4 18h16"
      />
    </svg>
  );
}

export function ChevronLeftIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className ?? iconClass}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 19l-7-7 7-7"
      />
    </svg>
  );
}

export function VolumeOffIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className ?? iconClass}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
      />
    </svg>
  );
}

export function VolumeOnIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className ?? iconClass}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15.536 8.464a5 5 0 010 7.072M11.293 4.707a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
      />
    </svg>
  );
}

export function GearIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className ?? iconClass}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M11.983 2.25a1.5 1.5 0 011.48 1.253l.246 1.48a6.908 6.908 0 011.812.754l1.339-.734a1.5 1.5 0 012.026.549l.75 1.299a1.5 1.5 0 01-.366 1.952l-1.217.937c.086.486.086.986 0 1.472l1.217.937a1.5 1.5 0 01.366 1.952l-.75 1.299a1.5 1.5 0 01-2.026.549l-1.339-.734a6.908 6.908 0 01-1.812.754l-.246 1.48a1.5 1.5 0 01-1.48 1.253h-1.5a1.5 1.5 0 01-1.48-1.253l-.246-1.48a6.908 6.908 0 01-1.812-.754l-1.339.734a1.5 1.5 0 01-2.026-.549l-.75-1.299a1.5 1.5 0 01.366-1.952l1.217-.937a6.736 6.736 0 010-1.472l-1.217-.937a1.5 1.5 0 01-.366-1.952l.75-1.299a1.5 1.5 0 012.026-.549l1.339.734a6.908 6.908 0 011.812-.754l.246-1.48a1.5 1.5 0 011.48-1.253h1.5z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 15.25a3.25 3.25 0 100-6.5 3.25 3.25 0 000 6.5z"
      />
    </svg>
  );
}

export function LockIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className ?? iconClass}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M7 10V8a5 5 0 1110 0v2"
      />
      <rect
        x="5"
        y="10"
        width="14"
        height="10"
        rx="2"
        ry="2"
        strokeWidth={2}
      />
    </svg>
  );
}
