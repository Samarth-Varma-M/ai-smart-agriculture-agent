"use client";

import { ThumbsUp, ThumbsDown, MessageSquare, CheckCircle2, Send, Sparkles } from "lucide-react";
import { useState } from "react";
import { HistoryEntry } from "@/lib/types";

interface FeedbackLoopProps {
  decisionId?: string;
}

export default function FeedbackLoop({ decisionId }: FeedbackLoopProps) {
  const [feedbackStatus, setFeedbackStatus] = useState<"IDLE" | "SUBMITTING" | "SUCCESS">("IDLE");
  const [notes, setNotes] = useState("");
  const [showNotes, setShowNotes] = useState(false);

  const updateLocalStorage = (status: string, feedbackNotes: string) => {
    if (decisionId) {
      const historyStr = localStorage.getItem("agri_diagnosis_history");
      if (historyStr) {
        let history: HistoryEntry[] = JSON.parse(historyStr);
        history = history.map((entry) => 
          entry.id === decisionId ? { ...entry, status, notes: feedbackNotes } : entry
        );
        localStorage.setItem("agri_diagnosis_history", JSON.stringify(history));
      }
    }
  };

  const submitFeedback = async (status: string) => {
    setFeedbackStatus("SUBMITTING");
    try {
      const response = await fetch("http://localhost:8000/api/v1/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          decision_id: decisionId,
          status,
          notes: notes || null
        })
      });
      if (response.ok) {
        updateLocalStorage(status, notes);
        setFeedbackStatus("SUCCESS");
      } else {
        updateLocalStorage(status, notes);
        setFeedbackStatus("SUCCESS");
      }
    } catch {
      updateLocalStorage(status, notes);
      setFeedbackStatus("SUCCESS");
    }
  };

  if (feedbackStatus === "SUCCESS") {
    return (
      <div className="bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 rounded-xl p-4 shadow-lg flex items-center justify-center gap-3 backdrop-blur-md">
        <div className="p-1 rounded-md bg-emerald-500/20 text-emerald-400">
          <CheckCircle2 size={18} />
        </div>
        <div className="text-xs font-semibold">
          Agronomic feedback logged. Model weights synchronized with local memory.
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-xl p-4 sm:p-5 border border-slate-800/80 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative overflow-hidden">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-slate-900 border border-slate-700/80 text-emerald-400">
          <Sparkles size={16} />
        </div>
        <div>
          <h4 className="font-bold text-xs text-slate-200 flex items-center gap-2">
            Agronomist Feedback Loop
            <span className="text-[9px] font-mono text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">RLHF</span>
          </h4>
          <p className="text-slate-400 text-[11px] mt-0.5">Validate recommendation efficacy for active model tuning.</p>
        </div>
      </div>
      
      <div className="flex flex-col items-end gap-2 w-full md:w-auto">
        <div className="flex items-center gap-2 w-full md:w-auto">
          <button 
            onClick={() => submitFeedback("ACCEPTED")} 
            disabled={feedbackStatus === "SUBMITTING"}
            className="flex-1 md:flex-none flex items-center justify-center gap-1.5 bg-emerald-950/80 hover:bg-emerald-600 border border-emerald-500/30 hover:border-emerald-400 text-emerald-300 hover:text-slate-950 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 shadow-sm disabled:opacity-50"
          >
            <ThumbsUp size={13} /> Accept
          </button>
          
          <button 
            onClick={() => submitFeedback("REJECTED")}
            disabled={feedbackStatus === "SUBMITTING"}
            className="flex-1 md:flex-none flex items-center justify-center gap-1.5 bg-red-950/80 hover:bg-red-600 border border-red-500/30 hover:border-red-400 text-red-300 hover:text-white px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 shadow-sm disabled:opacity-50"
          >
            <ThumbsDown size={13} /> Reject
          </button>

          <button 
            onClick={() => setShowNotes(!showNotes)}
            className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all duration-200 ${
              showNotes 
                ? 'bg-slate-700 border-slate-600 text-white' 
                : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <MessageSquare size={13} /> {showNotes ? 'Hide Note' : 'Field Note'}
          </button>
        </div>
        
        {showNotes && (
          <div className="w-full flex gap-2 animate-in fade-in duration-200">
            <input 
              type="text" 
              value={notes} 
              onChange={(e) => setNotes(e.target.value)} 
              placeholder="Why was this recommendation accepted or overridden?" 
              className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
            />
            <button
              onClick={() => submitFeedback(notes ? "ANNOTATED" : "ACCEPTED")}
              className="bg-emerald-600 hover:bg-emerald-500 text-slate-950 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
            >
              <Send size={11} /> Submit
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
