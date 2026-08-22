"use client";

import { History as HistoryIcon, Search, Trash2, X, Sparkles, FileText, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import DecisionHub from "@/components/DecisionHub";
import { DecisionResult, HistoryEntry } from "@/lib/types";

const SEED_DATA: HistoryEntry[] = [
  {
    id: "seed-1",
    date: "2026-08-20 14:30",
    crop: "Tomato",
    action: "APPLY_FUNGICIDE (Chlorothalonil) 2g/L",
    urgency: "HIGH",
    status: "ACCEPTED",
    notes: "Applied before the storm.",
    decision: {
      primary_action: "APPLY_FUNGICIDE",
      urgency: "HIGH",
      conflict_warnings: [],
      reasoning_trace: "High ambient relative humidity and an approaching cloud system significantly elevated early blight spore germination risk. Targeted fungicidal application was approved.",
      organic_alternative: "Apply cold-pressed Neem Oil emulsion (5ml/L) immediately if chemical fungicide is unavailable.",
      estimated_cost_impact: "Minimal",
      cited_metrics: {}
    }
  },
  {
    id: "seed-2",
    date: "2026-08-19 09:15",
    crop: "Wheat",
    action: "DELAY_IRRIGATION",
    urgency: "MEDIUM",
    status: "REJECTED",
    notes: "Overridden: Soil root zone too dry for scheduled germination window.",
    decision: {
      primary_action: "DELAY_IRRIGATION",
      urgency: "MEDIUM",
      conflict_warnings: [{ message: "Heavy rainfall forecasted within 24h. Immediate irrigation risks nutrient leaching and water waste." }],
      reasoning_trace: "Precipitation models forecasted 18mm rain within 24 hours. Delaying irrigation saves water allocation and prevents root rot saturation.",
      organic_alternative: null,
      estimated_cost_impact: "Moderate Water Savings",
      cited_metrics: {}
    }
  }
];

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [selectedDecision, setSelectedDecision] = useState<DecisionResult | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const historyStr = localStorage.getItem("agri_diagnosis_history");
    if (historyStr) {
      setHistory(JSON.parse(historyStr));
    } else {
      localStorage.setItem("agri_diagnosis_history", JSON.stringify(SEED_DATA));
      setHistory(SEED_DATA);
    }
  }, []);

  const clearHistory = () => {
    localStorage.removeItem("agri_diagnosis_history");
    setHistory([]);
  };

  const filteredHistory = history.filter(item => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.crop?.toLowerCase().includes(q) ||
      item.action?.toLowerCase().includes(q) ||
      item.status?.toLowerCase().includes(q) ||
      item.date?.toLowerCase().includes(q) ||
      (item.notes && item.notes.toLowerCase().includes(q))
    );
  });

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full flex flex-col gap-5 relative">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-emerald-400 text-xs font-mono mb-1.5">
            <HistoryIcon size={12} />
            <span>IMMUTABLE AUDIT LOGS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Agronomic Decision Ledger</h1>
          <p className="text-slate-400 text-xs mt-0.5">Complete historical record of AI synthesis recommendations and operator actions.</p>
        </div>
        
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search audit trail..." 
              className="pl-8 pr-3 py-1.5 border border-slate-700/80 rounded-lg text-xs bg-slate-900/90 text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 w-full md:w-56 transition-colors"
            />
          </div>
          <button 
            onClick={clearHistory}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 border border-red-500/30 text-red-400 hover:bg-red-950/40 text-xs font-bold rounded-lg transition-colors"
          >
            <Trash2 size={13} /> Clear Ledger
          </button>
        </div>
      </div>

      {/* Table Card */}
      <div className="glass-card rounded-xl border border-slate-800 overflow-hidden flex flex-col shadow-2xl">
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-emerald-950/80 border border-emerald-500/30 text-emerald-400">
              <FileText size={16} />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-sm sm:text-base">Recorded Telemetry & Diagnostic Events</h3>
              <p className="text-[10px] text-slate-400">Showing {filteredHistory.length} ledger entries</p>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="text-[10px] text-slate-400 uppercase font-mono bg-slate-900/80 border-b border-slate-800">
              <tr>
                <th className="px-5 py-3 font-bold">Timestamp</th>
                <th className="px-5 py-3 font-bold">Crop Variety</th>
                <th className="px-5 py-3 font-bold">Primary Directive</th>
                <th className="px-5 py-3 font-bold">Urgency</th>
                <th className="px-5 py-3 font-bold">Operator Verdict</th>
                <th className="px-5 py-3 font-bold text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-xs font-mono">
              {filteredHistory.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-slate-500">
                    No diagnostic history found matching current filter.
                  </td>
                </tr>
              ) : (
                filteredHistory.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-900/50 transition-colors">
                    <td className="px-5 py-3.5 font-sans font-medium text-slate-400">{log.date}</td>
                    <td className="px-5 py-3.5 font-sans font-bold text-white">{log.crop}</td>
                    <td className="px-5 py-3.5 font-mono text-emerald-300 max-w-[260px] truncate">{log.action}</td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                        log.urgency === 'HIGH' || log.urgency === 'CRITICAL' ? 'bg-red-950/80 text-red-300 border-red-500/40' :
                        log.urgency === 'MEDIUM' ? 'bg-amber-950/80 text-amber-300 border-amber-500/40' :
                        'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
                      }`}>
                        {log.urgency}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex flex-col gap-0.5">
                        <span className={`px-2 py-0.2 rounded text-[10px] font-bold w-fit border ${
                          log.status === 'ACCEPTED' ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40' :
                          log.status === 'REJECTED' ? 'bg-red-950/80 text-red-300 border-red-500/40' :
                          'bg-slate-900 text-slate-400 border-slate-700'
                        }`}>
                          {log.status}
                        </span>
                        {log.notes && <span className="text-[10px] text-slate-500 italic max-w-[180px] truncate font-sans">&ldquo;{log.notes}&rdquo;</span>}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button 
                        onClick={() => setSelectedDecision(log.decision)}
                        className="inline-flex items-center gap-1 text-xs font-bold text-cyan-400 hover:text-cyan-300 hover:underline"
                      >
                        <span>Inspect</span>
                        <ArrowRight size={11} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Decision Card Modal Overlay */}
      {selectedDecision && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="glass-card bg-slate-950/95 border border-slate-700/80 rounded-xl max-w-3xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-4 border-b border-slate-800 bg-slate-900/90">
              <div className="flex items-center gap-2">
                <Sparkles size={15} className="text-emerald-400" />
                <h3 className="font-extrabold text-white text-xs sm:text-sm">Archived Decision Snapshot</h3>
              </div>
              <button 
                onClick={() => setSelectedDecision(null)}
                className="p-1 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>
            <div className="overflow-y-auto p-4 sm:p-5 bg-slate-950/50">
              <DecisionHub decision={selectedDecision} />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
