"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Leaf, LayoutDashboard, CloudRain, History, Sparkles } from "lucide-react";
import clsx from "clsx";

export default function Navigation() {
  const pathname = usePathname();

  const links = [
    { name: "Overview", href: "/", icon: <Leaf size={15} /> },
    { name: "Decision Studio", href: "/studio", icon: <LayoutDashboard size={15} /> },
    { name: "Market & Weather", href: "/market-weather", icon: <CloudRain size={15} /> },
    { name: "Audit Logs", href: "/history", icon: <History size={15} /> },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80 shadow-lg shadow-black/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-lg blur-sm opacity-60 group-hover:opacity-100 transition duration-300"></div>
                <div className="relative bg-slate-900 p-2 rounded-lg border border-emerald-500/30 text-emerald-400">
                  <Leaf size={20} className="group-hover:rotate-12 transition-transform duration-300" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-base tracking-tight text-white flex items-center gap-1">
                  Agri<span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Agent</span>
                  <span className="text-[9px] uppercase font-mono font-bold tracking-widest text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-1 py-0.2 rounded ml-1">AI</span>
                </span>
                <span className="text-[10px] text-slate-400 font-medium tracking-wide">Multimodal Autonomous Agronomist</span>
              </div>
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-1">
              {links.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={clsx(
                      "relative inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200",
                      isActive
                        ? "bg-slate-800/90 text-emerald-400 border border-emerald-500/30 shadow-sm shadow-emerald-500/10"
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent"
                    )}
                  >
                    <span className={clsx(isActive ? "text-emerald-400" : "text-slate-500")}>
                      {link.icon}
                    </span>
                    {link.name}
                    {isActive && (
                      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-[2px] bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full"></span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right Status Indicator */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 bg-slate-900/90 border border-slate-800 px-2.5 py-1 rounded-md text-xs text-slate-300">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="font-mono text-[10px] text-slate-400">GEMINI-2.5-FLASH</span>
            </div>

            <Link
              href="/studio"
              className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 px-3 py-1.5 rounded-lg font-bold text-xs tracking-wide shadow-md shadow-emerald-500/20 hover:shadow-emerald-500/40 transition-all duration-200"
            >
              <Sparkles size={13} />
              <span>Studio</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
