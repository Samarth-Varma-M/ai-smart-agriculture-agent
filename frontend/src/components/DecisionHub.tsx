import { AlertTriangle, ShieldCheck, Zap, Info, CheckSquare, Beaker } from "lucide-react";
import { useState } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function DecisionHub({ decision }: { decision: any }) {
  const [useOrganic, setUseOrganic] = useState(false);

  if (!decision) {
    return null;
  }

  const { primary_action, urgency, conflict_warnings, reasoning_trace, organic_alternative } = decision;

  const urgencyColors: any = {
    LOW: "bg-slate-100 text-slate-700 border-slate-200",
    MEDIUM: "bg-blue-100 text-blue-700 border-blue-200",
    HIGH: "bg-orange-100 text-orange-700 border-orange-200",
    CRITICAL: "bg-red-100 text-red-700 border-red-200 animate-pulse",
  };

  const actionText = useOrganic && organic_alternative ? "ORGANIC REMEDIATION" : primary_action?.replace(/_/g, " ");

  return (
    <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl shadow-emerald-900/10 border border-emerald-100 h-full overflow-hidden flex flex-col relative">
      <div className="p-8 pb-6 flex-1">
        <div className="flex justify-between items-start mb-6">
          <div className={`px-4 py-1.5 rounded-full text-sm font-bold border flex items-center gap-2 ${urgencyColors[urgency] || urgencyColors.LOW}`}>
            <Zap size={16} /> URGENCY: {urgency}
          </div>
          
          {organic_alternative && (
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 p-1 rounded-full">
              <button 
                onClick={() => setUseOrganic(false)} 
                className={`px-3 py-1 rounded-full text-xs font-bold transition-colors flex items-center gap-1 ${!useOrganic ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                <Beaker size={12}/> Chemical
              </button>
              <button 
                onClick={() => setUseOrganic(true)} 
                className={`px-3 py-1 rounded-full text-xs font-bold transition-colors flex items-center gap-1 ${useOrganic ? 'bg-green-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                <ShieldCheck size={12}/> Organic
              </button>
            </div>
          )}
        </div>

        <h2 className="text-4xl font-extrabold text-slate-800 mb-4 tracking-tight leading-tight">
          {actionText}
        </h2>

        {/* Conflict Alert */}
        {conflict_warnings && conflict_warnings.length > 0 && !useOrganic && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-xl mb-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="text-red-500 shrink-0 mt-0.5" size={20} />
              <div>
                <h4 className="text-red-800 font-bold text-sm">CRITICAL CONFLICT AVOIDED</h4>
                <p className="text-red-700 text-sm mt-1">{conflict_warnings[0].message}</p>
              </div>
            </div>
          </div>
        )}

        <div className="mb-6">
          <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
            <Info size={16} /> AI Reasoning Trace
          </h4>
          <p className="text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100 text-sm">
            {useOrganic && organic_alternative ? organic_alternative : reasoning_trace}
          </p>
        </div>

        <div className="space-y-3">
          <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Action Plan</h4>
          <div className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-xl">
            <CheckSquare className="text-slate-400" />
            <span className="font-medium text-slate-700">Acknowledge Alert & Notify Team</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-xl">
            <CheckSquare className="text-slate-400" />
            <span className="font-medium text-slate-700">Prepare required materials</span>
          </div>
        </div>
      </div>
    </div>
  );
}
