"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Leaf, LayoutDashboard, CloudRain, History } from "lucide-react";
import clsx from "clsx";

export default function Navigation() {
  const pathname = usePathname();

  const links = [
    { name: "Home", href: "/", icon: <Leaf size={18} /> },
    { name: "Studio", href: "/studio", icon: <LayoutDashboard size={18} /> },
    { name: "Market & Weather", href: "/market-weather", icon: <CloudRain size={18} /> },
    { name: "History", href: "/history", icon: <History size={18} /> },
  ];

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center gap-2">
              <div className="bg-emerald-100 p-2 rounded-xl text-emerald-600">
                <Leaf size={24} />
              </div>
              <span className="font-bold text-xl tracking-tight text-slate-800 hidden md:block">
                Agri<span className="text-emerald-600">Agent</span>
              </span>
            </div>
            <div className="hidden sm:ml-8 sm:flex sm:space-x-4">
              {links.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={clsx(
                      "inline-flex items-center gap-2 px-3 py-2 mt-3 mb-3 rounded-lg text-sm font-medium transition-colors",
                      isActive
                        ? "bg-emerald-50 text-emerald-700"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    )}
                  >
                    {link.icon}
                    {link.name}
                  </Link>
                );
              })}
            </div>
          </div>
          <div className="flex items-center">
            <div className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1.5 rounded-md flex items-center gap-2">
              v1.0 (Hackathon Prototype)
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
