import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "AgriAgent AI | Multimodal Farm Intelligence & Decision Studio",
  description: "Enterprise multimodal AI decision engine resolving crop telemetry, satellite weather, vision diagnostics, and commodity market conflicts.",
  other: {
    "color-scheme": "dark",
    "darkreader-lock": "true",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth" suppressHydrationWarning>
      <head>
        <meta name="color-scheme" content="dark" />
        <meta name="darkreader-lock" content="true" />
      </head>
      <body 
        className={`${inter.variable} font-sans bg-[#090d16] text-slate-100 min-h-screen flex flex-col antialiased selection:bg-emerald-500/30 selection:text-emerald-300`}
        suppressHydrationWarning
      >
        <Navigation />
        <main className="flex-1 flex flex-col relative z-10">
          {children}
        </main>
      </body>
    </html>
  );
}
