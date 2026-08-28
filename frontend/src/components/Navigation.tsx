"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Leaf, LayoutDashboard, CloudRain, History, Sparkles, User, LogOut, ChevronDown, Menu, X } from "lucide-react";
import clsx from "clsx";
import { useState } from "react";
import AccessibilityControls from "./AccessibilityControls";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Navigation() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const links = [
    { name: "Overview", href: "/", icon: <Leaf size={15} /> },
    { name: "Decision Studio", href: "/studio", icon: <LayoutDashboard size={15} /> },
    { name: "Market & Weather", href: "/market-weather", icon: <CloudRain size={15} /> },
    { name: "Audit Logs", href: "/history", icon: <History size={15} /> },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 shadow-md">
      <div className="w-full mx-auto px-4 md:px-8">
        <div className="flex flex-wrap justify-between items-center min-h-[64px] py-2 w-full">
          {/* Logo & Brand */}
          <div className="flex items-center gap-6 shrink-0">
            <Link href="/" className="flex items-center gap-3 group shrink-0">
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

          {/* Right Status Indicator & Controls */}
          <div className="flex items-center gap-4">
            <AccessibilityControls />
            <LanguageSwitcher />

            {session ? (
              <div className="relative shrink-0">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center justify-center gap-2 bg-slate-900 border border-emerald-500/30 hover:border-emerald-500/50 text-slate-200 px-4 py-2 text-sm font-medium rounded-md transition-all duration-300 hover:scale-105 active:scale-95 shadow-md break-words whitespace-normal"
                >
                  <User size={14} className="text-emerald-400" />
                  <span className="hidden sm:inline">{session.user?.name || "Profile"}</span>
                  <ChevronDown size={14} className="text-slate-400" />
                </button>
                
                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-700 rounded-xl shadow-xl overflow-hidden py-1 z-50">
                    <div className="px-4 py-2 border-b border-slate-800">
                      <p className="text-xs font-bold text-white truncate">{session.user?.name}</p>
                      <p className="text-[10px] text-slate-400 truncate">{session.user?.email}</p>
                    </div>
                    <Link
                      href="/history"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs text-slate-300 hover:text-emerald-400 hover:bg-slate-800/50 transition-colors"
                    >
                      <History size={14} /> My History
                    </Link>
                    <button
                      onClick={() => {
                        setProfileOpen(false);
                        signOut();
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-xs text-red-400 hover:text-red-300 hover:bg-slate-800/50 transition-colors text-left"
                    >
                      <LogOut size={14} /> Log Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-3 shrink-0">
                <Link
                  href="/login"
                  className="flex items-center justify-center bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/30 px-4 py-2 text-sm font-medium rounded-md transition-all duration-300 hover:scale-105 active:scale-95 shadow-md break-words whitespace-normal"
                >
                  Sign In
                </Link>
              </div>
            )}

            <Link
              href="/studio"
              className="hidden md:flex items-center justify-center gap-1.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 px-4 py-2 text-sm font-medium rounded-md transition-all duration-300 hover:scale-105 active:scale-95 shadow-md shadow-emerald-500/20 hover:shadow-emerald-500/40 tracking-wide break-words whitespace-normal shrink-0"
            >
              <Sparkles size={13} />
              <span>Studio</span>
            </Link>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-400 hover:text-white transition-colors"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 py-4 flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            {links.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={clsx(
                  "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all",
                  pathname === link.href
                    ? "bg-slate-800/90 text-emerald-400 border border-emerald-500/30"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                )}
              >
                {link.icon}
                {link.name}
              </Link>
            ))}
            <Link
              href="/studio"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 mt-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 px-4 py-2 text-sm font-medium rounded-md transition-all duration-300 hover:scale-105 active:scale-95 shadow-md"
            >
              <Sparkles size={16} />
              <span>Launch Studio</span>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
