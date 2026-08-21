"use client";

import { useState } from "react";
import ImageUploader from "@/components/ImageUploader";
import TelemetryCards from "@/components/TelemetryCards";
import DecisionHub from "@/components/DecisionHub";
import FeedbackLoop from "@/components/FeedbackLoop";
import { runDiagnostic } from "@/lib/api";
import { Play, RotateCcw, Terminal } from "lucide-react";
import { useEffect } from "react";

function AgentTraceTerminal() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setStep(1), 100),
      setTimeout(() => setStep(2), 500),
      setTimeout(() => setStep(3), 1000),
      setTimeout(() => setStep(4), 1400),
      setTimeout(() => setStep(5), 1800),
      setTimeout(() => setStep(6), 2200),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const logs = [
    { s: 1, text: "[0.1s] Initializing Gemini 2.0 Flash Multimodal Vision Pipeline..." },
    { s: 2, text: "[0.4s] Processing leaf image tensor & extracting disease features..." },
    { s: 3, text: "[0.9s] Querying Open-Meteo weather microservice for coordinates..." },
    { s: 4, text: "[1.3s] EnvironmentAgent computing Soil Water Deficit & Spray Window..." },
    { s: 5, text: "[1.7s] SynthesisAgent executing cross-agent conflict resolution rules..." },
    { s: 6, text: "[2.1s] Structured Decision Card successfully synthesized." }
  ];

  return (
    <div className="h-full min-h-[400px] bg-slate-900 rounded-3xl p-6 font-mono text-sm shadow-xl flex flex-col border border-slate-700 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-500 animate-pulse"></div>
      <div className="flex items-center gap-2 mb-6 border-b border-slate-700 pb-4 text-slate-400">
        <Terminal size={18} />
        <span className="font-bold tracking-wider">AI AGENT & MULTIMODAL DEEP LEARNING STREAM</span>
      </div>
      <div className="flex flex-col gap-3 flex-1 overflow-y-auto">
        {logs.map((log) => (
          <div key={log.s} className={`transition-opacity duration-300 ${step >= log.s ? 'opacity-100' : 'opacity-0'}`}>
            <span className="text-emerald-400">{'>'}</span> <span className="text-slate-300">{log.text}</span>
          </div>
        ))}
        <div className="mt-4 flex gap-1">
          <div className="w-2 h-4 bg-emerald-500 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}
export default function Studio() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [decision, setDecision] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const defaultFarmState = {
    cropType: "Tomato",
    growthStage: "Vegetative",
    locationName: "Nashik, Maharashtra",
    locationLat: 19.9975,
    locationLon: 73.7898,
    soilMoisture: 42,
    soilPh: 6.5,
    nitrogen: 12.0,
    phosphorus: 15.0,
    potassium: 10.0,
    base64Image: ""
  };

  const [farmState, setFarmState] = useState(defaultFarmState);

  const handleReset = () => {
    setFarmState(defaultFarmState);
    setDecision(null);
    setError(null);
  };

  const loadPreset = (preset: string) => {
    if (preset === "preset-1") {
      setFarmState({ ...defaultFarmState, cropType: "Tomato", soilMoisture: 60, soilPh: 6.5 });
    } else if (preset === "preset-2") {
      setFarmState({ ...defaultFarmState, cropType: "Wheat", soilMoisture: 15, soilPh: 7.0 });
    } else if (preset === "preset-3") {
      setFarmState({ ...defaultFarmState, cropType: "Maize", soilMoisture: 40, soilPh: 6.8 });
    }
    // We intentionally do not auto-run the diagnostic here so the user can edit values first.
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
        planting_date: "2026-06-01", // Mocked for now
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
      let history = historyStr ? JSON.parse(historyStr) : [];
      
      const newEntry = {
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
    } catch (e) {
      console.error(e);
      setError("Failed to run diagnostic. Please ensure the backend is running.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 flex flex-col gap-6 max-w-7xl mx-auto w-full">
      
      {/* Preset Quick-Fill Cards */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-2">
        <h2 className="text-lg font-bold text-slate-800 mb-4">Quick-Fill Sample Scenarios</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button onClick={() => loadPreset("preset-1")} className="flex items-center justify-between text-left p-4 rounded-xl border border-emerald-100 bg-emerald-50 hover:bg-emerald-100 transition-colors group">
            <div>
              <div className="font-bold text-emerald-900">Tomato Early Blight + Storm</div>
              <div className="text-xs text-emerald-700 mt-1">Tests disease vs. weather conflict</div>
            </div>
            <Play size={16} className="text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>

          <button onClick={() => loadPreset("preset-2")} className="flex items-center justify-between text-left p-4 rounded-xl border border-amber-100 bg-amber-50 hover:bg-amber-100 transition-colors group">
            <div>
              <div className="font-bold text-amber-900">Wheat Drought Stress</div>
              <div className="text-xs text-amber-700 mt-1">Tests irrigation priority</div>
            </div>
            <Play size={16} className="text-amber-500 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>

          <button onClick={() => loadPreset("preset-3")} className="flex items-center justify-between text-left p-4 rounded-xl border border-blue-100 bg-blue-50 hover:bg-blue-100 transition-colors group">
            <div>
              <div className="font-bold text-blue-900">Maize Harvest Window</div>
              <div className="text-xs text-blue-700 mt-1">Tests market price peaking</div>
            </div>
            <Play size={16} className="text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">Diagnostic Workspace</h2>
        <div className="flex gap-3">
          <button onClick={handleReset} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 font-medium transition-colors">
            <RotateCcw size={16} /> Reset
          </button>
          <button onClick={handleRunDiagnostic} disabled={isLoading} className="flex items-center gap-2 px-6 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 font-bold shadow-md transition-all disabled:opacity-50">
            {isLoading ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div> : <Play size={16} />} 
            Run Farm Diagnosis
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 font-medium text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1">
        
        <div className="lg:col-span-3">
          <ImageUploader 
            value={farmState.base64Image} 
            onChange={(base64) => setFarmState({ ...farmState, base64Image: base64 })} 
          />
        </div>

        <div className="lg:col-span-4">
          <TelemetryCards 
            farmState={farmState} 
            setFarmState={setFarmState} 
          />
        </div>

        <div className="lg:col-span-5 relative">
          {isLoading ? (
            <AgentTraceTerminal />
          ) : !decision ? (
            <div className="h-full min-h-[400px] border-2 border-dashed border-emerald-200 rounded-3xl flex flex-col items-center justify-center text-center p-8 bg-emerald-50/50">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-emerald-400 mb-4 shadow-sm border border-emerald-100">
                <Play size={24} />
              </div>
              <h3 className="text-lg font-bold text-emerald-900 mb-2">Awaiting Data</h3>
              <p className="text-emerald-700/70 text-sm max-w-[250px]">
                Adjust the telemetry, upload an image, and click "Run Farm Diagnosis" to analyze.
              </p>
            </div>
          ) : (
            <DecisionHub decision={decision} />
          )}
        </div>
      </div>

      {decision && (
        <div className="w-full">
          <FeedbackLoop decisionId={decision.id} />
        </div>
      )}
    </div>
  );
}
