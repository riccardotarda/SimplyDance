import type { Metadata } from "next";
import { Staatliches, Montserrat } from "next/font/google";
import "./globals.css";

const staatliches = Staatliches({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-staatliches",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SimplyDance - Impara a ballare",
  description: "Impara a ballare con SimplyDance",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it" className="dark">
      <body
        className={`${staatliches.variable} ${montserrat.variable} min-h-screen antialiased bg-deep-purple font-montserrat text-sticker-white`}
      >
        {children}
      </body>
    </html>
  );
}
