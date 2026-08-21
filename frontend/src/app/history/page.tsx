"use client";

import { History as HistoryIcon, Search, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import DecisionHub from "@/components/DecisionHub";

const SEED_DATA = [
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
      reasoning_trace: "High humidity and upcoming storm increase blight risk significantly. Immediate fungicidal application is recommended.",
      organic_alternative: "Apply Neem Oil emulsion (5ml/L) immediately if chemical fungicide is unavailable.",
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
    notes: "Can't wait, soil too dry.",
    decision: {
      primary_action: "DELAY_IRRIGATION",
      urgency: "MEDIUM",
      conflict_warnings: [{ message: "Rain expected in 24h. Irrigating now will waste water." }],
      reasoning_trace: "Forecast predicts 18mm rain in 24h. Delaying irrigation saves water and prevents root rot.",
      organic_alternative: null,
      estimated_cost_impact: "Moderate Savings",
      cited_metrics: {}
    }
  }
];

export default function HistoryPage() {
  const [history, setHistory] = useState<any[]>([]);
  const [selectedDecision, setSelectedDecision] = useState<any | null>(null);

  useEffect(() => {
    const historyStr = localStorage.getItem("agri_diagnosis_history");
    if (historyStr) {
      setHistory(JSON.parse(historyStr));
    } else {
      // Seed data on first load
      localStorage.setItem("agri_diagnosis_history", JSON.stringify(SEED_DATA));
      setHistory(SEED_DATA);
    }
  }, []);

  const clearHistory = () => {
    localStorage.removeItem("agri_diagnosis_history");
    setHistory([]);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 max-w-7xl mx-auto w-full flex flex-col gap-8 relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Audit History</h1>
          <p className="text-slate-600 mt-2">Immutable log of AI recommendations and farmer decisions.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Search logs..." 
              className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 w-full md:w-64"
            />
          </div>
          <button 
            onClick={clearHistory}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-red-600 font-medium rounded-lg hover:bg-red-50 transition-colors"
          >
            <Trash2 size={16} /> Clear
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
          <div className="bg-emerald-100 p-2 rounded-lg text-emerald-800">
            <HistoryIcon size={20} />
          </div>
          <h3 className="font-bold text-slate-800 text-lg">Diagnostic Logs</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 font-bold">Date & Time</th>
                <th className="px-6 py-4 font-bold">Crop</th>
                <th className="px-6 py-4 font-bold">Action Taken</th>
                <th className="px-6 py-4 font-bold">Urgency</th>
                <th className="px-6 py-4 font-bold">Farmer Decision</th>
                <th className="px-6 py-4 font-bold">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {history.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    No diagnostic history found.
                  </td>
                </tr>
              ) : (
                history.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900">{log.date}</td>
                    <td className="px-6 py-4">{log.crop}</td>
                    <td className="px-6 py-4 font-medium text-slate-800 max-w-[250px] truncate">{log.action}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-md text-xs font-bold border ${
                        log.urgency === 'HIGH' || log.urgency === 'CRITICAL' ? 'bg-red-50 text-red-700 border-red-100' :
                        log.urgency === 'MEDIUM' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                        'bg-emerald-50 text-emerald-700 border-emerald-100'
                      }`}>
                        {log.urgency}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className={`px-2.5 py-1 rounded-md text-xs font-bold w-fit ${
                          log.status === 'ACCEPTED' ? 'bg-emerald-100 text-emerald-800' :
                          log.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                          'bg-slate-100 text-slate-600'
                        }`}>
                          {log.status}
                        </span>
                        {log.notes && <span className="text-xs text-slate-500 italic max-w-[150px] truncate">"{log.notes}"</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => setSelectedDecision(log.decision)}
                        className="text-emerald-600 font-bold hover:text-emerald-800 hover:underline"
                      >
                        View Card
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
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-4 border-b border-slate-100 bg-slate-50">
              <h3 className="font-bold text-slate-800">Archived Decision Card</h3>
              <button 
                onClick={() => setSelectedDecision(null)}
                className="p-2 hover:bg-slate-200 rounded-full transition-colors"
              >
                <X size={20} className="text-slate-500" />
              </button>
            </div>
            <div className="overflow-y-auto p-4 bg-slate-100">
              <DecisionHub decision={selectedDecision} />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
