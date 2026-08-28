"use client";

import { useAccessibility } from "@/lib/accessibility";
import { Sun, SunMoon } from "lucide-react";

export default function AccessibilityControls() {
  const { sunlightMode, setSunlightMode } = useAccessibility();

  return (
    <button
      onClick={() => setSunlightMode(!sunlightMode)}
      className={`flex items-center justify-center w-10 h-10 rounded-md transition-colors shrink-0 ${
        sunlightMode
          ? "bg-amber-400 text-black border-2 border-black"
          : "text-amber-400 hover:bg-slate-800"
      }`}
      title="Sunlight Mode"
    >
      {sunlightMode ? <Sun size={20} /> : <SunMoon size={20} />}
    </button>
  );
}
