"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/lezioni", label: "Home" },
  { href: "/passi", label: "Passi" },
  { href: "/performance", label: "Performance" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 border-t-2 border-vibrant-lilac/60 bg-deep-purple/95 px-4 py-3 backdrop-blur-sm">
      <div className="mx-auto flex max-w-2xl items-center justify-between gap-2">
        {items.map((item) => {
          const isActive = pathname?.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={`flex-1 rounded-xl px-3 py-2 text-center font-staatliches text-xs uppercase tracking-wide transition ${
                isActive
                  ? "border-2 border-electric-yellow bg-electric-yellow/10 text-electric-yellow"
                  : "border-2 border-transparent text-sticker-white/70 hover:text-sticker-white"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
