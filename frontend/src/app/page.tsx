import Link from "next/link";
import { ArrowRight, BrainCircuit, CloudLightning, ShieldAlert, LineChart } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-slate-900 text-white py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
            Resolve Farm Conflicts with <span className="text-blue-400">AI</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mb-10 leading-relaxed">
            A multimodal decision agent that analyzes crop health, local weather, and market prices simultaneously to prevent costly farming mistakes.
          </p>
          <Link href="/studio" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-bold text-lg transition-colors flex items-center gap-2">
            Launch Decision Studio <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-16">How the Agent Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Step 1 */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-slate-100 text-slate-700 rounded-md flex items-center justify-center mb-6">
                <LineChart size={24} />
              </div>
              <h3 className="font-bold text-lg mb-2 text-slate-900">1. Field Data</h3>
              <p className="text-slate-600 text-sm">Input live telemetry including soil moisture, pH, and NPK levels.</p>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-slate-100 text-slate-700 rounded-md flex items-center justify-center mb-6">
                <BrainCircuit size={24} />
              </div>
              <h3 className="font-bold text-lg mb-2 text-slate-900">2. Crop Vision</h3>
              <p className="text-slate-600 text-sm">Upload a photo. Our Vision Agent detects diseases and maturity.</p>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-slate-100 text-slate-700 rounded-md flex items-center justify-center mb-6">
                <CloudLightning size={24} />
              </div>
              <h3 className="font-bold text-lg mb-2 text-slate-900">3. Cross Analysis</h3>
              <p className="text-slate-600 text-sm">Agents check 5-day weather forecasts and live market prices.</p>
            </div>

            {/* Step 4 */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-slate-100 text-slate-700 rounded-md flex items-center justify-center mb-6">
                <ShieldAlert size={24} />
              </div>
              <h3 className="font-bold text-lg mb-2 text-slate-900">4. Conflict Resolver</h3>
              <p className="text-slate-600 text-sm">The Synthesis Agent overrides conflicting advice to prevent mistakes.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
