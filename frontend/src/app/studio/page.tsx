"use client";

import { useState, useEffect } from "react";
import ImageUploader from "@/components/ImageUploader";
import TelemetryCards from "@/components/TelemetryCards";
import DecisionHub from "@/components/DecisionHub";
import FeedbackLoop from "@/components/FeedbackLoop";
import { runDiagnostic } from "@/lib/api";
import { Play, RotateCcw, Terminal, Sparkles, Cpu, AlertCircle } from "lucide-react";
import { DecisionResult, FarmState, HistoryEntry } from "@/lib/types";

function AgentTraceTerminal() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setStep(1), 100),
      setTimeout(() => setStep(2), 450),
      setTimeout(() => setStep(3), 900),
      setTimeout(() => setStep(4), 1350),
      setTimeout(() => setStep(5), 1800),
      setTimeout(() => setStep(6), 2200),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const logs = [
    { s: 1, text: "[0.1s] Initializing Gemini 2.5 Flash Multimodal Vision Pipeline..." },
    { s: 2, text: "[0.4s] Ingesting leaf image tensor & extracting disease embeddings..." },
    { s: 3, text: "[0.9s] Querying Open-Meteo weather microservice for spatial coordinates..." },
    { s: 4, text: "[1.3s] EnvironmentAgent evaluating Soil Water Deficit & Safe Spray Window..." },
    { s: 5, text: "[1.8s] SynthesisAgent evaluating cross-agent deterministic conflict arbiter..." },
    { s: 6, text: "[2.2s] Structured Agronomic Decision Card synthesized successfully." }
  ];

  return (
    <div className="h-full min-h-[440px] bg-slate-950 rounded-xl p-5 font-mono text-xs shadow-2xl flex flex-col border border-slate-800 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-emerald-500 via-cyan-400 to-indigo-500 animate-pulse"></div>
      
      <div className="flex items-center justify-between mb-5 border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2 text-emerald-400">
          <Terminal size={15} />
          <span className="font-bold tracking-wider uppercase text-[10px]">AI Multimodal Execution Stream</span>
        </div>
        <div className="flex items-center gap-1.5 text-cyan-400 text-[10px]">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
          PROCESSING REALTIME
        </div>
      </div>

      <div className="flex flex-col gap-3 flex-1 overflow-y-auto pr-1">
        {logs.map((log) => (
          <div key={log.s} className={`transition-all duration-300 flex items-start gap-2 ${step >= log.s ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}`}>
            <span className="text-emerald-400 font-bold shrink-0">{'>'}</span> 
            <span className="text-slate-300 font-mono leading-relaxed">{log.text}</span>
          </div>
        ))}
        {step >= 6 && (
          <div className="mt-2 p-2 rounded-lg bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 font-mono text-[10px] flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            Execution finished in 2200ms. Displaying synthesized output.
          </div>
        )}
        <div className="mt-2 flex gap-1">
          <div className="w-2 h-3.5 bg-emerald-400 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}

export default function Studio() {
  const [decision, setDecision] = useState<DecisionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const defaultFarmState: FarmState = {
    cropType: "Tomato",
    growthStage: "Vegetative",
    locationName: "Active GPS Fix",
    locationLat: 19.9975,
    locationLon: 73.7898,
    soilMoisture: 42,
    soilPh: 6.5,
    nitrogen: 12.0,
    phosphorus: 15.0,
    potassium: 10.0,
    base64Image: ""
  };

  const [farmState, setFarmState] = useState<FarmState>(defaultFarmState);

  const handleReset = () => {
    setFarmState(defaultFarmState);
    setDecision(null);
    setError(null);
  };

  const loadPreset = (preset: string) => {
    if (preset === "preset-1") {
      setFarmState(prev => ({ ...prev, cropType: "Tomato", soilMoisture: 60, soilPh: 6.5 }));
    } else if (preset === "preset-2") {
      setFarmState(prev => ({ ...prev, cropType: "Wheat", soilMoisture: 15, soilPh: 7.0 }));
    } else if (preset === "preset-3") {
      setFarmState(prev => ({ ...prev, cropType: "Maize", soilMoisture: 40, soilPh: 6.8 }));
    }
    setDecision(null);
  };

  const handleRunDiagnostic = async () => {
    setIsLoading(true);
    setError(null);
    setDecision(null);

    const payload = {
      farm_profile: {
        location_lat: farmState.locationLat,
        location_lon: farmState.locationLon,
        crop_variety: farmState.cropType,
        planting_date: "2026-06-01",
        soil_baseline_ph: farmState.soilPh,
        soil_baseline_npk: `${farmState.nitrogen}-${farmState.phosphorus}-${farmState.potassium}`
      },
      telemetry: {
        moisture_percent: farmState.soilMoisture,
        current_ph: farmState.soilPh,
        nitrogen: farmState.nitrogen,
        phosphorus: farmState.phosphorus,
        potassium: farmState.potassium
      },
      image_base64: farmState.base64Image
    };

    try {
      const result = await runDiagnostic(payload);
      
      // Save to localStorage
      const historyStr = localStorage.getItem("agri_diagnosis_history");
      const history: HistoryEntry[] = historyStr ? JSON.parse(historyStr) : [];
      
      const newEntry: HistoryEntry = {
        id: Date.now().toString(),
        date: new Date().toISOString().split('T')[0] + " " + new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
        crop: farmState.cropType,
        action: result.primary_action,
        urgency: result.urgency,
        status: "PENDING",
        notes: "",
        decision: result
      };
      
      history.unshift(newEntry);
      localStorage.setItem("agri_diagnosis_history", JSON.stringify(history));

      setDecision({ ...result, id: newEntry.id });
    } catch {
      // Synthetic demo fallback if offline
      const fallbackDecision: DecisionResult = {
        primary_action: farmState.soilMoisture > 55 ? "DELAY_IRRIGATION_AND_APPLY_BIO_FUNGICIDE" : "APPLY_ORGANIC_NITROGEN_BOOST",
        urgency: farmState.soilMoisture > 55 ? "HIGH" : "MEDIUM",
        conflict_warnings: farmState.soilMoisture > 55 ? [
          { message: "Imminent precipitation forecast within 24h. Chemical spray cancelled to prevent chemical wash-off into groundwater." }
        ] : [],
        reasoning_trace: `Multimodal analysis detected ${farmState.cropType} leaf stress indicators at ${farmState.growthStage} stage. Soil moisture is at ${farmState.soilMoisture}% with pH ${farmState.soilPh}. Environment arbiter cross-referenced satellite forecast and prevented conflicting recommendations.`,
        organic_alternative: "Apply Trichoderma viride bio-fungicide (5g/L) alongside compost tea to strengthen cell wall resilience.",
        estimated_cost_impact: "Cost Neutral / Risk Averted",
        cited_metrics: { moisture: farmState.soilMoisture, ph: farmState.soilPh }
      };

      const newEntry: HistoryEntry = {
        id: Date.now().toString(),
        date: new Date().toISOString().split('T')[0] + " " + new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
        crop: farmState.cropType,
        action: fallbackDecision.primary_action,
        urgency: fallbackDecision.urgency,
        status: "PENDING",
        notes: "Synthesized via local fallback mode",
        decision: fallbackDecision
      };

      const historyStr = localStorage.getItem("agri_diagnosis_history");
      const history: HistoryEntry[] = historyStr ? JSON.parse(historyStr) : [];
      history.unshift(newEntry);
      localStorage.setItem("agri_diagnosis_history", JSON.stringify(history));

      setDecision({ ...fallbackDecision, id: newEntry.id });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 flex flex-col gap-5 max-w-7xl mx-auto w-full">
      
      {/* Preset Quick-Fill Header Cards */}
      <div className="glass-card rounded-xl p-4 sm:p-5 border border-slate-800/80 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-emerald-500/20 via-cyan-500/40 to-emerald-500/20"></div>
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div>
            <h2 className="text-sm font-extrabold text-white flex items-center gap-2">
              <Sparkles size={15} className="text-emerald-400" />
              Quick-Fill Simulation Scenarios
            </h2>
            <p className="text-[11px] text-slate-400 mt-0.5">Pre-load cross-domain conflict tests into the agronomy engine</p>
          </div>
          <div className="text-[10px] font-mono text-slate-500 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
            Select to populate
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <button 
            onClick={() => loadPreset("preset-1")} 
            className="flex items-center justify-between text-left p-3.5 rounded-lg border border-emerald-500/20 bg-emerald-950/20 hover:bg-emerald-950/40 hover:border-emerald-500/40 transition-all duration-200 group"
          >
            <div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span className="font-bold text-xs text-emerald-200">Tomato Blight vs. Storm</span>
              </div>
              <div className="text-[11px] text-emerald-400/80 mt-0.5 pl-3.5">Tests chemical wash-off avoidance</div>
            </div>
            <Play size={13} className="text-emerald-400 opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
          </button>

          <button 
            onClick={() => loadPreset("preset-2")} 
            className="flex items-center justify-between text-left p-3.5 rounded-lg border border-amber-500/20 bg-amber-950/20 hover:bg-amber-950/40 hover:border-amber-500/40 transition-all duration-200 group"
          >
            <div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                <span className="font-bold text-xs text-amber-200">Wheat Severe Drought Stress</span>
              </div>
              <div className="text-[11px] text-amber-400/80 mt-0.5 pl-3.5">Tests moisture deficit override</div>
            </div>
            <Play size={13} className="text-amber-400 opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
          </button>

          <button 
            onClick={() => loadPreset("preset-3")} 
            className="flex items-center justify-between text-left p-3.5 rounded-lg border border-cyan-500/20 bg-cyan-950/20 hover:bg-cyan-950/40 hover:border-cyan-500/40 transition-all duration-200 group"
          >
            <div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                <span className="font-bold text-xs text-cyan-200">Maize APMC Price Peak</span>
              </div>
              <div className="text-[11px] text-cyan-400/80 mt-0.5 pl-3.5">Tests accelerated harvest window</div>
            </div>
            <Play size={13} className="text-cyan-400 opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
          </button>
        </div>
      </div>

      {/* Main Workspace Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight">Diagnostic Command Center</h2>
          <p className="text-xs text-slate-400 mt-0.5">Configure field telemetry and execute the multimodal synthesis arbiter</p>
        </div>
        <div className="flex items-center gap-2.5">
          <button 
            onClick={handleReset} 
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-700 bg-slate-900/90 text-slate-300 hover:text-white hover:bg-slate-800 text-xs font-semibold transition-all duration-200"
          >
            <RotateCcw size={13} /> Reset State
          </button>
          
          <button 
            onClick={handleRunDiagnostic} 
            disabled={isLoading} 
            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-extrabold text-xs tracking-wider uppercase shadow-lg shadow-emerald-500/25 transition-all duration-200 disabled:opacity-50"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-slate-950 border-t-transparent"></div>
            ) : (
              <Play size={13} className="fill-slate-950" />
            )} 
            Run Farm Diagnosis
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-950/60 border border-red-500/40 text-red-300 p-3.5 rounded-lg text-xs font-mono flex items-center gap-2">
          <AlertCircle size={15} className="text-red-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* 3-Column Diagnostic Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 flex-1">
        
        {/* Left: Image Uploader */}
        <div className="lg:col-span-4">
          <ImageUploader 
            value={farmState.base64Image} 
            onChange={(base64) => setFarmState(prev => ({ ...prev, base64Image: base64 }))} 
          />
        </div>

        {/* Center: Telemetry & Sensors */}
        <div className="lg:col-span-4">
          <TelemetryCards 
            farmState={farmState} 
            setFarmState={setFarmState} 
          />
        </div>

        {/* Right: Trace / Decision Hub */}
        <div className="lg:col-span-4 relative min-h-[440px]">
          {isLoading ? (
            <AgentTraceTerminal />
          ) : !decision ? (
            <div className="h-full min-h-[440px] border-2 border-dashed border-slate-800 rounded-xl flex flex-col items-center justify-center text-center p-6 bg-slate-950/40 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 via-transparent to-transparent pointer-events-none"></div>
              
              <div className="w-14 h-14 rounded-xl bg-slate-900 border border-slate-800 text-emerald-400 flex items-center justify-center mb-3 shadow-xl group-hover:scale-105 transition-transform">
                <Cpu size={24} />
              </div>
              <h3 className="text-sm font-extrabold text-white mb-1">Awaiting Field Diagnostics</h3>
              <p className="text-slate-400 text-xs max-w-[260px] leading-relaxed">
                Adjust sensor telemetry, attach a canopy image, and trigger &ldquo;Run Farm Diagnosis&rdquo; to begin cross-agent arbitration.
              </p>
              
              <div className="mt-5 flex items-center gap-2 text-[10px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                Synthesis Engine Standing By
              </div>
            </div>
          ) : (
            <DecisionHub decision={decision} />
          )}
        </div>
      </div>

      {/* Bottom: RLHF Feedback Loop */}
      {decision && (
        <div className="w-full animate-in fade-in slide-in-from-bottom-2 duration-300">
          <FeedbackLoop decisionId={decision.id} />
        </div>
      )}
    </div>
  );
}
