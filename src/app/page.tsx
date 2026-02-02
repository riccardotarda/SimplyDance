import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 bg-deep-purple">
      <div className="max-w-lg text-center">
        <h1 className="font-staatliches text-5xl font-bold uppercase tracking-tight text-sticker-white md:text-6xl">
          SimplyDance
        </h1>
        <p className="mt-4 font-montserrat text-lg text-sticker-white/90">
          Impara a ballare passo dopo passo
        </p>
        <Link
          href="/lezioni"
          className="mt-10 inline-flex items-center justify-center rounded-lg bg-electric-yellow px-8 py-4 font-staatliches text-base font-bold uppercase tracking-wide text-deep-purple transition focus:outline-none focus:ring-2 focus:ring-electric-yellow focus:ring-offset-2 focus:ring-offset-deep-purple"
        >
          Inizia
        </Link>
      </div>
    </main>
  );
}
