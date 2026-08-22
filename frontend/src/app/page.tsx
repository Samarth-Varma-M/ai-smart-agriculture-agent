import Link from "next/link";
import { ArrowRight, BrainCircuit, CloudLightning, ShieldAlert, LineChart, Activity, CheckCircle2 } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-transparent">
      {/* Hero Section */}
      <section className="relative pt-16 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Ambient background glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-emerald-600/15 via-cyan-500/15 to-transparent rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-6xl mx-auto flex flex-col items-center text-center relative z-10">
          
          {/* Top Engine Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-slate-900/90 border border-emerald-500/30 text-emerald-300 text-xs font-mono mb-6 shadow-lg shadow-emerald-950/40 backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
            <span>NEXT-GEN AGRI DECISION SYNTHESIS AGENT</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6 max-w-4xl leading-[1.15]">
            Resolve Complex Farm Conflicts with{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
              Autonomous AI
            </span>
          </h1>

          <p className="text-sm sm:text-lg text-slate-300 max-w-2xl mb-8 leading-relaxed font-normal">
            A multimodal decision intelligence system synthesizing leaf vision diagnostics, IoT telemetry, satellite weather forecasts, and APMC commodity pricing to eliminate costly farming errors.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <Link 
              href="/studio" 
              className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 px-6 py-3.5 rounded-lg font-extrabold text-sm tracking-wide shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/35 transition-all duration-300 flex items-center justify-center gap-2 group"
            >
              <span>Launch Decision Studio</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/market-weather"
              className="w-full sm:w-auto bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 hover:border-slate-600 text-slate-200 px-6 py-3.5 rounded-lg font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Activity size={16} className="text-cyan-400" />
              <span>Live Market & Weather</span>
            </Link>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-12 w-full max-w-4xl">
            <div className="glass-card p-3.5 rounded-lg border border-slate-800/80 text-left">
              <div className="text-[11px] font-mono text-slate-400 uppercase">Cross-Agent Rules</div>
              <div className="text-xl font-extrabold text-emerald-400 mt-1">100%</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Conflict Avoidance Guarantee</div>
            </div>
            
            <div className="glass-card p-3.5 rounded-lg border border-slate-800/80 text-left">
              <div className="text-[11px] font-mono text-slate-400 uppercase">Vision Latency</div>
              <div className="text-xl font-extrabold text-cyan-400 mt-1">&lt; 1.2s</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Gemini Multimodal Tensor</div>
            </div>

            <div className="glass-card p-3.5 rounded-lg border border-slate-800/80 text-left">
              <div className="text-[11px] font-mono text-slate-400 uppercase">Telemetry Sensors</div>
              <div className="text-xl font-extrabold text-teal-400 mt-1">In-Situ</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Soil Moisture, pH & NPK</div>
            </div>

            <div className="glass-card p-3.5 rounded-lg border border-slate-800/80 text-left">
              <div className="text-[11px] font-mono text-slate-400 uppercase">Remediation</div>
              <div className="text-xl font-extrabold text-amber-400 mt-1">Dual Mode</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Chemical & Bio-Organic</div>
            </div>
          </div>

        </div>
      </section>

      {/* Architecture & Workflow Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 relative border-t border-slate-800/60 bg-slate-950/40">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="text-xs font-mono text-emerald-400 uppercase tracking-widest font-bold mb-2">
              Autonomous Agent Architecture
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Four Specialized Intelligence Layers
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-2">
              Independent micro-agents synthesize disparate sensory inputs into a coherent, risk-free agronomic strategy.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            
            {/* Step 1 */}
            <div className="glass-card glass-card-hover p-5 rounded-xl border border-slate-800 flex flex-col justify-between group">
              <div>
                <div className="w-10 h-10 rounded-lg bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <LineChart size={20} />
                </div>
                <div className="text-[11px] font-mono text-emerald-400 font-bold mb-1">LAYER 01</div>
                <h3 className="font-bold text-base text-white mb-1.5">Soil & IoT Telemetry</h3>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Streams real-time volumetric soil water content, pH acidity levels, and active N-P-K mineral assays.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center gap-1 text-[10px] font-mono text-slate-500">
                <CheckCircle2 size={11} className="text-emerald-500" /> Continuous Calibration
              </div>
            </div>

            {/* Step 2 */}
            <div className="glass-card glass-card-hover p-5 rounded-xl border border-slate-800 flex flex-col justify-between group">
              <div>
                <div className="w-10 h-10 rounded-lg bg-cyan-950/80 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <BrainCircuit size={20} />
                </div>
                <div className="text-[11px] font-mono text-cyan-400 font-bold mb-1">LAYER 02</div>
                <h3 className="font-bold text-base text-white mb-1.5">Multimodal Vision</h3>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Deep-learning canopy inspection detects early blight, powdery mildew, pest infestations, and maturity stages.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center gap-1 text-[10px] font-mono text-slate-500">
                <CheckCircle2 size={11} className="text-cyan-500" /> Gemini Vision Engine
              </div>
            </div>

            {/* Step 3 */}
            <div className="glass-card glass-card-hover p-5 rounded-xl border border-slate-800 flex flex-col justify-between group">
              <div>
                <div className="w-10 h-10 rounded-lg bg-blue-950/80 border border-blue-500/30 text-blue-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <CloudLightning size={20} />
                </div>
                <div className="text-[11px] font-mono text-blue-400 font-bold mb-1">LAYER 03</div>
                <h3 className="font-bold text-base text-white mb-1.5">Atmosphere & Market</h3>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Queries 5-day Open-Meteo precipitation models and APMC wholesale mandi price curves for optimal harvest windows.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center gap-1 text-[10px] font-mono text-slate-500">
                <CheckCircle2 size={11} className="text-blue-500" /> APMC Real-time Feeds
              </div>
            </div>

            {/* Step 4 */}
            <div className="glass-card glass-card-hover p-5 rounded-xl border border-slate-800 flex flex-col justify-between group">
              <div>
                <div className="w-10 h-10 rounded-lg bg-amber-950/80 border border-amber-500/30 text-amber-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <ShieldAlert size={20} />
                </div>
                <div className="text-[11px] font-mono text-amber-400 font-bold mb-1">LAYER 04</div>
                <h3 className="font-bold text-base text-white mb-1.5">Synthesis & Conflict Arbiter</h3>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Overrides dangerous advice (e.g. spraying right before heavy rainfall or watering saturated roots) to protect yield.
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center gap-1 text-[10px] font-mono text-slate-500">
                <CheckCircle2 size={11} className="text-amber-500" /> Deterministic Arbiter
              </div>
            </div>

          </div>

          {/* CTA Banner */}
          <div className="mt-12 glass-card p-6 sm:p-7 rounded-xl border border-emerald-500/30 bg-gradient-to-r from-emerald-950/40 via-slate-900/60 to-cyan-950/40 flex flex-col sm:flex-row items-center justify-between gap-5">
            <div>
              <h3 className="text-xl font-extrabold text-white">Ready to test agronomic scenarios?</h3>
              <p className="text-slate-400 text-xs mt-1">Load sample crop crises or upload custom field telemetry.</p>
            </div>
            <Link 
              href="/studio"
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-5 py-2.5 rounded-lg font-extrabold text-xs tracking-wide shadow-md shadow-emerald-500/20 transition-all duration-200 shrink-0"
            >
              Open Studio Workspace →
            </Link>
          </div>

        </div>
      </section>
    </div>
  );
}
