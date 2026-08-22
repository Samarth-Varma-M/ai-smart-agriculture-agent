"use client";

import { Droplet, MapPin, Navigation, Gauge, Layers, Sparkles, Compass } from "lucide-react";
import { FarmState } from "@/lib/types";

interface TelemetryCardsProps {
  farmState: FarmState;
  setFarmState: React.Dispatch<React.SetStateAction<FarmState>>;
}

export default function TelemetryCards({ farmState, setFarmState }: TelemetryCardsProps) {

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    let parsedValue: string | number = value;
    if (type === "range" || type === "number") {
      parsedValue = parseFloat(value);
    }
    setFarmState(prev => ({ ...prev, [name]: parsedValue }));
  };

  const handleGPSDetect = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFarmState(prev => ({
            ...prev,
            locationName: "Detected GPS Coordinates",
            locationLat: parseFloat(position.coords.latitude.toFixed(4)),
            locationLon: parseFloat(position.coords.longitude.toFixed(4))
          }));
        },
        (error) => {
          console.error("Error getting location", error);
          alert("Unable to retrieve your GPS location. Please check browser permissions.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Farm Profile Editable Card */}
      <div className="glass-card rounded-xl p-4 sm:p-5 border border-slate-800/80 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent"></div>

        <h3 className="text-xs font-bold text-slate-200 mb-3 flex items-center gap-2 uppercase tracking-wider font-mono">
          <div className="p-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <MapPin size={14} />
          </div>
          Crop & Geospatial Configuration
        </h3>
        
        <div className="grid grid-cols-2 gap-2.5 mb-3">
          <div>
            <label className="block text-[10px] font-mono font-medium text-slate-400 mb-1 uppercase tracking-wider">Crop Variety</label>
            <select 
              name="cropType" 
              value={farmState.cropType} 
              onChange={handleChange} 
              className="w-full bg-slate-900/90 border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors cursor-pointer"
            >
              <option value="Tomato">Tomato (Solanum lycopersicum)</option>
              <option value="Wheat">Wheat (Triticum aestivum)</option>
              <option value="Maize">Maize / Corn (Zea mays)</option>
              <option value="Rice">Rice (Oryza sativa)</option>
              <option value="Cotton">Cotton (Gossypium)</option>
              <option value="Soybean">Soybean (Glycine max)</option>
              <option value="Potato">Potato (Solanum tuberosum)</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-mono font-medium text-slate-400 mb-1 uppercase tracking-wider">Growth Stage</label>
            <select 
              name="growthStage" 
              value={farmState.growthStage} 
              onChange={handleChange} 
              className="w-full bg-slate-900/90 border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors cursor-pointer"
            >
              <option value="Vegetative">Vegetative (Early growth)</option>
              <option value="Flowering">Flowering / Anthesis</option>
              <option value="Fruiting">Fruiting / Grain Fill</option>
              <option value="Mature">Mature / Ripening</option>
            </select>
          </div>
        </div>

        {/* GPS Coordinates Only - Dropdown removed */}
        <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800 space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-[10px] font-mono font-medium text-slate-400 uppercase flex items-center gap-1.5">
              <Compass size={12} className="text-emerald-400" /> GPS Geolocation Telemetry
            </label>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-1.5 py-0.5 rounded">
              {farmState.locationName || "Active GPS Fix"}
            </span>
          </div>

          <div className="flex gap-2">
            <div className="flex-1 flex items-center bg-slate-950 border border-slate-700/80 rounded-lg px-2.5 py-1.5">
              <span className="text-[10px] font-mono text-slate-500 mr-2">LAT/LON:</span>
              <input 
                type="text" 
                readOnly 
                value={`${farmState.locationLat?.toFixed(4)}°, ${farmState.locationLon?.toFixed(4)}°`} 
                className="w-full bg-transparent text-xs font-mono text-slate-300 focus:outline-none cursor-default" 
              />
            </div>
            <button 
              onClick={handleGPSDetect} 
              className="flex items-center gap-1.5 bg-emerald-600/20 hover:bg-emerald-600/35 text-emerald-400 border border-emerald-500/40 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all shadow-sm"
              title="Detect GPS coordinates from device hardware"
            >
              <Navigation size={12} className="animate-pulse" />
              <span>Detect GPS</span>
            </button>
          </div>
        </div>
      </div>

      {/* Soil Telemetry Editable Card */}
      <div className="glass-card rounded-xl p-4 sm:p-5 border border-slate-800/80 flex-1 flex flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>

        <div>
          <h3 className="text-xs font-bold text-slate-200 mb-3 flex items-center gap-2 uppercase tracking-wider font-mono">
            <div className="p-1 rounded-md bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <Gauge size={14} />
            </div>
            Soil Telemetry & Mineral Assay
          </h3>
          
          <div className="space-y-3">
            {/* Moisture Slider */}
            <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
              <div className="flex justify-between items-center mb-1.5">
                <div className="flex items-center gap-1.5">
                  <Droplet size={13} className="text-cyan-400" />
                  <label className="text-xs font-semibold text-slate-300">Volumetric Water Content</label>
                </div>
                <div className="flex items-center gap-1 font-mono">
                  <span className="text-xs font-bold text-cyan-400">{farmState.soilMoisture}%</span>
                  <span className="text-[10px] text-slate-500">
                    {farmState.soilMoisture < 30 ? "(Deficit)" : farmState.soilMoisture > 70 ? "(Saturated)" : "(Optimal)"}
                  </span>
                </div>
              </div>
              <input 
                type="range" 
                name="soilMoisture" 
                min="0" 
                max="100" 
                step="1" 
                value={farmState.soilMoisture} 
                onChange={handleChange} 
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer" 
              />
            </div>
            
            {/* Soil pH Slider */}
            <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
              <div className="flex justify-between items-center mb-1.5">
                <div className="flex items-center gap-1.5">
                  <Layers size={13} className="text-amber-400" />
                  <label className="text-xs font-semibold text-slate-300">Soil Acidity Index</label>
                </div>
                <div className="flex items-center gap-1 font-mono">
                  <span className="text-xs font-bold text-amber-400">{farmState.soilPh} pH</span>
                  <span className="text-[10px] text-slate-500">
                    {farmState.soilPh < 6.0 ? "(Acidic)" : farmState.soilPh > 7.5 ? "(Alkaline)" : "(Balanced)"}
                  </span>
                </div>
              </div>
              <input 
                type="range" 
                name="soilPh" 
                min="4.0" 
                max="9.0" 
                step="0.1" 
                value={farmState.soilPh} 
                onChange={handleChange} 
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer" 
              />
            </div>
          </div>
        </div>

        {/* N-P-K Nutrients */}
        <div className="mt-3 pt-2.5 border-t border-slate-800">
          <div className="flex justify-between items-center mb-2">
            <label className="text-[10px] font-mono font-medium text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Sparkles size={10} className="text-emerald-400" /> Macronutrient Assay (mg/kg)
            </label>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-slate-900/90 border border-emerald-500/30 rounded-lg p-2 flex flex-col items-center">
              <div className="flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-400 uppercase mb-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> N
              </div>
              <input 
                type="number" 
                name="nitrogen" 
                value={farmState.nitrogen} 
                onChange={handleChange} 
                className="w-full text-center bg-transparent font-mono font-bold text-white text-sm focus:outline-none focus:text-emerald-300" 
              />
            </div>

            <div className="bg-slate-900/90 border border-cyan-500/30 rounded-lg p-2 flex flex-col items-center">
              <div className="flex items-center gap-1 text-[10px] font-mono font-bold text-cyan-400 uppercase mb-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span> P
              </div>
              <input 
                type="number" 
                name="phosphorus" 
                value={farmState.phosphorus} 
                onChange={handleChange} 
                className="w-full text-center bg-transparent font-mono font-bold text-white text-sm focus:outline-none focus:text-cyan-300" 
              />
            </div>

            <div className="bg-slate-900/90 border border-amber-500/30 rounded-lg p-2 flex flex-col items-center">
              <div className="flex items-center gap-1 text-[10px] font-mono font-bold text-amber-400 uppercase mb-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span> K
              </div>
              <input 
                type="number" 
                name="potassium" 
                value={farmState.potassium} 
                onChange={handleChange} 
                className="w-full text-center bg-transparent font-mono font-bold text-white text-sm focus:outline-none focus:text-amber-300" 
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
