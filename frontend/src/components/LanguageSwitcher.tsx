"use client";

import { useEffect, useState } from "react";
import { Globe } from "lucide-react";

export default function LanguageSwitcher() {
  const [currentLang, setCurrentLang] = useState("en");

  useEffect(() => {
    // Read the googtrans cookie to set the initial select value
    const match = document.cookie.match(/(?:^|; )googtrans=([^;]*)/);
    if (match) {
      const parts = match[1].split("/");
      if (parts.length > 2) {
        setCurrentLang(parts[2]);
      }
    }
  }, []);

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedLang = e.target.value;
    
    // The Google Translate cookie format is /auto/TARGET_LANG or /en/TARGET_LANG
    // Setting both the root path and domain explicitly ensures it sticks
    if (selectedLang === "en") {
      // Clear the cookie to revert to original
      document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=" + window.location.hostname + "; path=/;";
    } else {
      document.cookie = "googtrans=/en/" + selectedLang + "; path=/";
      document.cookie = "googtrans=/en/" + selectedLang + "; domain=" + window.location.hostname + "; path=/";
    }

    setCurrentLang(selectedLang);
    window.location.reload();
  };

  return (
    <div className="relative flex items-center shrink-0">
      <Globe className="absolute left-2 text-slate-400 pointer-events-none" size={16} />
      <select
        value={currentLang}
        onChange={handleLanguageChange}
        className="appearance-none bg-slate-900 border border-slate-700 hover:border-slate-500 text-slate-300 rounded-md pl-7 py-2 text-sm font-medium outline-none transition-colors cursor-pointer shadow-sm focus:ring-2 focus:ring-emerald-500/50 w-auto min-w-[110px] pr-8"
      >
        <option value="en">English</option>
        <option value="hi">हिंदी</option>
        <option value="te">తెలుగు</option>
        <option value="mr">मराठी</option>
      </select>
      <div className="absolute right-2 pointer-events-none">
        <svg className="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </div>
    </div>
  );
}
