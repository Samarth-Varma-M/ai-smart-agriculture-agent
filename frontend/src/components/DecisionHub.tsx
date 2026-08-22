"use client";

import { AlertTriangle, ShieldCheck, Zap, Info, Beaker, Sparkles, CheckCircle2, Activity } from "lucide-react";
import { useState } from "react";
import { DecisionResult } from "@/lib/types";

interface DecisionHubProps {
  decision: DecisionResult;
}

export default function DecisionHub({ decision }: DecisionHubProps) {
  const [useOrganic, setUseOrganic] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});

  if (!decision) {
    return null;
  }

  const { primary_action, urgency, conflict_warnings, reasoning_trace, organic_alternative } = decision;

  const urgencyStyles: Record<string, { badge: string; glow: string; text: string }> = {
    LOW: {
      badge: "bg-emerald-950/80 text-emerald-300 border-emerald-500/40",
      glow: "from-emerald-500/20 via-transparent to-transparent",
      text: "text-emerald-400"
    },
    MEDIUM: {
      badge: "bg-cyan-950/80 text-cyan-300 border-cyan-500/40",
      glow: "from-cyan-500/20 via-transparent to-transparent",
      text: "text-cyan-400"
    },
    HIGH: {
      badge: "bg-amber-950/80 text-amber-300 border-amber-500/40",
      glow: "from-amber-500/20 via-transparent to-transparent",
      text: "text-amber-400"
    },
    CRITICAL: {
      badge: "bg-red-950/90 text-red-300 border-red-500/50 animate-pulse",
      glow: "from-red-500/25 via-transparent to-transparent",
      text: "text-red-400"
    },
  };

  const currentUrgency = urgencyStyles[urgency] || urgencyStyles.LOW;
  const actionText = useOrganic && organic_alternative ? "ORGANIC BIO-REMEDIATION PROTOCOL" : primary_action?.replace(/_/g, " ");

  const toggleStep = (index: number) => {
    setCompletedSteps(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const actionSteps = [
    "Acknowledge conflict avoidance & synchronize with field team",
    "Calibrate spray / irrigation hardware to recommended dosage",
    "Log execution timestamp in digital agronomy audit log"
  ];

  return (
    <div className="glass-card rounded-xl border border-slate-700/80 shadow-2xl h-full flex flex-col relative overflow-hidden">
      {/* Dynamic urgency ambient top glow */}
      <div className={`absolute -top-24 -right-24 w-72 h-72 rounded-full bg-gradient-to-br ${currentUrgency.glow} blur-3xl pointer-events-none`}></div>
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-emerald-500 via-cyan-400 to-indigo-500"></div>

      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between relative z-10 space-y-4">
        
        {/* Header Badges & Remedy Switcher */}
        <div>
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <div className={`px-2.5 py-1 rounded-md text-xs font-mono font-bold border flex items-center gap-1.5 shadow-sm ${currentUrgency.badge}`}>
              <Zap size={13} className={currentUrgency.text} />
              <span>URGENCY: {urgency}</span>
            </div>
            
            {organic_alternative && (
              <div className="flex items-center gap-1 bg-slate-900/90 border border-slate-700/80 p-0.5 rounded-lg">
                <button 
                  onClick={() => setUseOrganic(false)} 
                  className={`px-2.5 py-1 rounded text-xs font-bold transition-all duration-200 flex items-center gap-1.5 ${!useOrganic ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  <Beaker size={11}/> Chemical
                </button>
                <button 
                  onClick={() => setUseOrganic(true)} 
                  className={`px-2.5 py-1 rounded text-xs font-bold transition-all duration-200 flex items-center gap-1.5 ${useOrganic ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  <ShieldCheck size={11}/> Organic
                </button>
              </div>
            )}
          </div>

          <div className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-semibold mb-1 flex items-center gap-1.5">
            <Sparkles size={11} /> Autonomous Synthesis Directive
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight leading-snug uppercase font-sans">
            {actionText}
          </h2>
        </div>

        {/* Conflict Alert Banner */}
        {conflict_warnings && conflict_warnings.length > 0 && !useOrganic && (
          <div className="bg-red-950/40 border border-red-500/40 rounded-lg p-3.5 shadow-lg backdrop-blur-md relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500 animate-pulse"></div>
            <div className="flex items-start gap-2.5 pl-1">
              <div className="p-1.5 rounded-md bg-red-900/50 border border-red-500/40 text-red-400 shrink-0">
                <AlertTriangle size={15} />
              </div>
              <div>
                <h4 className="text-red-300 font-bold text-xs uppercase tracking-wider font-mono">
                  Cross-Domain Conflict Overridden
                </h4>
                <p className="text-red-200/90 text-xs mt-0.5 leading-relaxed">
                  {conflict_warnings[0].message}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* AI Reasoning Trace */}
        <div className="space-y-1.5">
          <h4 className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Info size={13} className="text-cyan-400" /> Multimodal Reasoning Synthesis
          </h4>
          <div className="bg-slate-900/70 border border-slate-800/90 p-3.5 rounded-lg text-slate-300 text-xs leading-relaxed shadow-inner">
            {useOrganic && organic_alternative ? organic_alternative : reasoning_trace}
          </div>
        </div>

        {/* Action Plan Checklist */}
        <div className="space-y-2">
          <h4 className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Activity size={13} className="text-emerald-400" /> Operational Execution Plan
            </span>
            <span className="text-[10px] text-slate-500 lowercase font-normal">
              click to acknowledge
            </span>
          </h4>
          
          <div className="space-y-1.5">
            {actionSteps.map((step, idx) => {
              const isChecked = !!completedSteps[idx];
              return (
                <button
                  key={idx}
                  onClick={() => toggleStep(idx)}
                  className={`w-full text-left flex items-center gap-2.5 p-2.5 rounded-lg border transition-all duration-200 ${
                    isChecked 
                      ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300 shadow-sm' 
                      : 'bg-slate-900/50 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  <div className={`w-4 h-4 rounded flex items-center justify-center border transition-colors ${
                    isChecked 
                      ? 'bg-emerald-500 border-emerald-400 text-slate-950' 
                      : 'border-slate-600 text-transparent'
                  }`}>
                    <CheckCircle2 size={12} />
                  </div>
                  <span className={`text-xs font-medium ${isChecked ? 'line-through opacity-80' : ''}`}>
                    {step}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
