"use client";

import { CloudRain, TrendingUp, Sun, Cloud, Wind, Activity, ShieldCheck, ShieldAlert, Sparkles, ArrowUpRight } from "lucide-react";
import { useState } from "react";
import { WeatherDay, MarketCommodity } from "@/lib/types";

const WEATHER_MOCKS: Record<string, WeatherDay[]> = {
  "Nashik, Maharashtra": [
    { day: "Today", condition: "Sunny", high: 32, low: 22, rain: 0, wind: 12, humidity: 48 },
    { day: "Tomorrow", condition: "Sunny", high: 33, low: 23, rain: 0, wind: 10, humidity: 52 },
    { day: "Day 3", condition: "Cloudy", high: 30, low: 22, rain: 5, wind: 15, humidity: 68 },
    { day: "Day 4", condition: "Rain", high: 28, low: 21, rain: 25, wind: 20, humidity: 88 },
    { day: "Day 5", condition: "Rain", high: 27, low: 20, rain: 15, wind: 18, humidity: 82 },
  ],
  "Pune, Maharashtra": [
    { day: "Today", condition: "Rain", high: 28, low: 22, rain: 12, wind: 15, humidity: 85 },
    { day: "Tomorrow", condition: "Rain", high: 27, low: 22, rain: 18, wind: 18, humidity: 90 },
    { day: "Day 3", condition: "Cloudy", high: 29, low: 21, rain: 4, wind: 14, humidity: 70 },
    { day: "Day 4", condition: "Sunny", high: 31, low: 20, rain: 0, wind: 10, humidity: 50 },
    { day: "Day 5", condition: "Sunny", high: 32, low: 20, rain: 0, wind: 8, humidity: 46 },
  ]
};

const MARKET_MOCKS: Record<string, MarketCommodity> = {
  "Tomato": { price: "₹2,400/qtl", retailPrice: "₹24/kg", trend: "+12.4%", trendDesc: "Surging", direction: "up", advice: "High wholesale mandi demand. Consider harvesting early if mature.", arrivals: "450 tonnes/day" },
  "Wheat": { price: "₹2,275/qtl", retailPrice: "₹22.7/kg", trend: "+0.8%", trendDesc: "Steady", direction: "flat", advice: "Prices holding steady near MSP. Harvest on scheduled cycle.", arrivals: "1,200 tonnes/day" },
  "Maize": { price: "₹1,850/qtl", retailPrice: "₹18.5/kg", trend: "+6.2%", trendDesc: "Peaking", direction: "up", advice: "Market peaking due to poultry feed demand. Liquidate harvest now.", arrivals: "680 tonnes/day" },
};

export default function MarketWeather() {
  const [region, setRegion] = useState("Nashik, Maharashtra");
  const [crop, setCrop] = useState("Tomato");

  const forecast = WEATHER_MOCKS[region] || WEATHER_MOCKS["Nashik, Maharashtra"];
  const market = MARKET_MOCKS[crop] || MARKET_MOCKS["Tomato"];
  
  // Calculate spray window based on next 48 hours rain
  const next48hRain = forecast[0].rain + forecast[1].rain;
  const safeToSpray = next48hRain < 5;

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full flex flex-col gap-5">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-cyan-400 text-xs font-mono mb-1.5">
            <Activity size={12} />
            <span>REAL-TIME MACRO FEEDS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Environmental & Market Intelligence</h1>
          <p className="text-slate-400 text-xs mt-0.5">Satellite precipitation models and APMC commodity price fluctuations.</p>
        </div>
      </div>

      {/* Selectors Bar */}
      <div className="glass-card p-3.5 sm:p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row gap-3.5">
        <div className="flex-1">
          <label className="block text-[10px] font-mono font-medium text-slate-400 mb-1 uppercase tracking-wider">Meteorological Station</label>
          <select 
            value={region} 
            onChange={e => setRegion(e.target.value)} 
            className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-2 text-xs font-semibold text-slate-200 focus:outline-none focus:border-cyan-500 transition-colors cursor-pointer"
          >
            <option value="Nashik, Maharashtra">Nashik, Maharashtra (Horticulture Hub)</option>
            <option value="Pune, Maharashtra">Pune, Maharashtra (Western Ghats)</option>
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-[10px] font-mono font-medium text-slate-400 mb-1 uppercase tracking-wider">Target Commodity</label>
          <select 
            value={crop} 
            onChange={e => setCrop(e.target.value)} 
            className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-2 text-xs font-semibold text-slate-200 focus:outline-none focus:border-cyan-500 transition-colors cursor-pointer"
          >
            <option value="Tomato">Tomato (Hybrid Fresh)</option>
            <option value="Wheat">Wheat (Sharbati / Durum)</option>
            <option value="Maize">Maize (Feed Grade)</option>
          </select>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Weather Forecast Extended Card */}
        <div className="glass-card rounded-xl border border-slate-800 lg:col-span-8 overflow-hidden flex flex-col justify-between">
          <div>
            <div className="p-5 border-b border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-cyan-950/80 border border-cyan-500/30 text-cyan-400">
                  <CloudRain size={18} />
                </div>
                <div>
                  <h3 className="font-extrabold text-white text-base">5-Day Meteorological Forecast</h3>
                  <p className="text-[11px] text-slate-400">Open-Meteo High Resolution NWP Model</p>
                </div>
              </div>
              
              <div className={`px-3 py-1 rounded-md text-xs font-mono font-bold border flex items-center gap-1.5 ${
                safeToSpray 
                  ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40' 
                  : 'bg-red-950/80 text-red-300 border-red-500/40 animate-pulse'
              }`}>
                {safeToSpray ? <ShieldCheck size={13} className="text-emerald-400" /> : <ShieldAlert size={13} className="text-red-400" />}
                {safeToSpray ? "Spray Window Optimal (<5mm rain)" : "Spray Risk: Imminent Rain"}
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="text-[10px] text-slate-400 font-mono uppercase bg-slate-900/80 border-b border-slate-800">
                  <tr>
                    <th className="px-5 py-3 font-bold">Day</th>
                    <th className="px-5 py-3 font-bold">Atmosphere</th>
                    <th className="px-5 py-3 font-bold">Temperature</th>
                    <th className="px-5 py-3 font-bold">Precipitation</th>
                    <th className="px-5 py-3 font-bold">Wind Speed</th>
                    <th className="px-5 py-3 font-bold">RH %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 font-mono text-xs">
                  {forecast.map((dayData, i: number) => (
                    <tr key={i} className="hover:bg-slate-900/60 transition-colors">
                      <td className="px-5 py-3.5 font-sans font-bold text-white">{dayData.day}</td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1.5 font-sans font-medium text-slate-200">
                          {dayData.condition === 'Sunny' && <Sun size={15} className="text-amber-400 shrink-0"/>}
                          {dayData.condition === 'Rain' && <CloudRain size={15} className="text-cyan-400 shrink-0"/>}
                          {dayData.condition === 'Cloudy' && <Cloud size={15} className="text-slate-400 shrink-0"/>}
                          <span>{dayData.condition}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-slate-100 font-bold">{dayData.high}°</span>
                        <span className="text-slate-500 ml-1">/ {dayData.low}°C</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={dayData.rain > 0 ? "text-cyan-400 font-bold" : "text-slate-500"}>
                          {dayData.rain} mm
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-slate-400 flex items-center gap-1">
                        <Wind size={12} className="text-slate-500" /> {dayData.wind} km/h
                      </td>
                      <td className="px-5 py-3.5 text-slate-400">
                        {dayData.humidity}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="p-3.5 bg-slate-900/60 border-t border-slate-800 text-[10px] font-mono text-slate-400 flex items-center justify-between">
            <span>Model Refresh: Hourly</span>
            <span className="text-cyan-400">Atmospheric Pressure: 1013.2 hPa</span>
          </div>
        </div>

        {/* APMC Market Price Card */}
        <div className="glass-card rounded-xl border border-slate-800 lg:col-span-4 flex flex-col justify-between overflow-hidden relative">
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-emerald-500/20 via-emerald-400 to-transparent"></div>

          <div>
            <div className="p-5 border-b border-slate-800/80">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-emerald-950/80 border border-emerald-500/30 text-emerald-400">
                  <TrendingUp size={18} />
                </div>
                <div>
                  <h3 className="font-extrabold text-white text-base">APMC Mandi Ticker</h3>
                  <p className="text-[11px] text-slate-400">Agmarknet Price Discovery Feed</p>
                </div>
              </div>
            </div>
            
            <div className="p-5 flex flex-col gap-4">
              <div className="bg-slate-900/80 p-4 rounded-lg border border-slate-800 text-center relative overflow-hidden">
                <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-0.5">
                  {crop} — Modal Wholesale Price
                </div>
                <div className="text-3xl font-extrabold text-white font-mono tracking-tight my-1.5">
                  {market.price}
                </div>
                <div className="text-[11px] font-mono text-emerald-400">
                  Retail Equivalent: ~{market.retailPrice}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-800">
                  <div className="text-[9px] font-mono text-slate-400 uppercase">7-Day Delta</div>
                  <div className="flex items-center gap-1 mt-0.5 font-mono font-bold text-xs text-emerald-400">
                    <ArrowUpRight size={13} />
                    <span>{market.trend}</span>
                  </div>
                </div>

                <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-800">
                  <div className="text-[9px] font-mono text-slate-400 uppercase">Daily Mandi Arrivals</div>
                  <div className="font-mono font-bold text-xs text-slate-200 mt-0.5">
                    {market.arrivals}
                  </div>
                </div>
              </div>

              <div className="bg-emerald-950/30 border border-emerald-500/30 p-3.5 rounded-lg">
                <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-emerald-400 uppercase mb-1">
                  <Sparkles size={12} /> AI Commodity Guidance
                </div>
                <p className="text-slate-300 text-xs leading-relaxed">
                  {market.advice}
                </p>
              </div>
            </div>
          </div>

          <div className="p-3.5 bg-slate-900/60 border-t border-slate-800 text-[10px] font-mono text-slate-400 flex items-center justify-between">
            <span>Trading Window: Active</span>
            <span className="text-emerald-400">Settlement: T+0 Cash</span>
          </div>
        </div>

      </div>
    </div>
  );
}
