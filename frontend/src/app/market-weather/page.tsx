"use client";

import { CloudRain, TrendingUp, Sun, Cloud, Wind, Droplets } from "lucide-react";
import { useState } from "react";

const WEATHER_MOCKS: Record<string, any> = {
  "Nashik, Maharashtra": [
    { day: "Today", condition: "Sunny", high: 32, low: 22, rain: 0, wind: 12 },
    { day: "Tomorrow", condition: "Sunny", high: 33, low: 23, rain: 0, wind: 10 },
    { day: "Day 3", condition: "Cloudy", high: 30, low: 22, rain: 5, wind: 15 },
    { day: "Day 4", condition: "Rain", high: 28, low: 21, rain: 25, wind: 20 },
    { day: "Day 5", condition: "Rain", high: 27, low: 20, rain: 15, wind: 18 },
  ],
  "Pune, Maharashtra": [
    { day: "Today", condition: "Rain", high: 28, low: 22, rain: 12, wind: 15 },
    { day: "Tomorrow", condition: "Rain", high: 27, low: 22, rain: 18, wind: 18 },
    { day: "Day 3", condition: "Cloudy", high: 29, low: 21, rain: 4, wind: 14 },
    { day: "Day 4", condition: "Sunny", high: 31, low: 20, rain: 0, wind: 10 },
    { day: "Day 5", condition: "Sunny", high: 32, low: 20, rain: 0, wind: 8 },
  ]
};

const MARKET_MOCKS: Record<string, any> = {
  "Tomato": { price: "₹24/kg", trend: "+12%", trendDesc: "Surging", advice: "High demand. Consider harvesting early if mature." },
  "Wheat": { price: "₹22/kg", trend: "0%", trendDesc: "Stable", advice: "Prices holding steady. Harvest on normal schedule." },
  "Maize": { price: "₹18/kg", trend: "+5%", trendDesc: "Peaking", advice: "Market peaking. Harvest now to secure best rates." },
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
    <div className="min-h-screen bg-slate-50 p-6 max-w-7xl mx-auto w-full flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Live Intelligence</h1>
        <p className="text-slate-600 mt-2">Real-time weather telemetry and APMC commodity price trends.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <div className="flex-1">
          <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Region</label>
          <select value={region} onChange={e => setRegion(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="Nashik, Maharashtra">Nashik, Maharashtra</option>
            <option value="Pune, Maharashtra">Pune, Maharashtra</option>
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Target Crop</label>
          <select value={crop} onChange={e => setCrop(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="Tomato">Tomato</option>
            <option value="Wheat">Wheat</option>
            <option value="Maize">Maize</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Weather Forecast Extended Card */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 lg:col-span-2 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                <CloudRain size={20} />
              </div>
              <h3 className="font-bold text-slate-800 text-lg">5-Day Weather Forecast</h3>
            </div>
            
            <div className={`px-4 py-1.5 rounded-md font-bold text-sm border flex items-center gap-2 ${safeToSpray ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
              <Droplets size={16} /> 
              {safeToSpray ? "Safe to Spray" : "Do Not Spray (Rain Expected)"}
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 font-bold">Day</th>
                  <th className="px-6 py-4 font-bold">Condition</th>
                  <th className="px-6 py-4 font-bold">High / Low</th>
                  <th className="px-6 py-4 font-bold">Precipitation</th>
                  <th className="px-6 py-4 font-bold">Wind</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {forecast.map((dayData: any, i: number) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900">{dayData.day}</td>
                    <td className="px-6 py-4 flex items-center gap-2 font-medium">
                      {dayData.condition === 'Sunny' && <Sun size={16} className="text-amber-500"/>}
                      {dayData.condition === 'Rain' && <CloudRain size={16} className="text-blue-500"/>}
                      {dayData.condition === 'Cloudy' && <Cloud size={16} className="text-slate-500"/>}
                      {dayData.condition}
                    </td>
                    <td className="px-6 py-4">{dayData.high}° / {dayData.low}°</td>
                    <td className="px-6 py-4 font-medium text-blue-600">{dayData.rain} mm</td>
                    <td className="px-6 py-4 flex items-center gap-1 text-slate-500"><Wind size={14}/> {dayData.wind} km/h</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* APMC Market Price Card */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col">
          <div className="p-6 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="bg-emerald-100 p-2 rounded-lg text-emerald-600">
                <TrendingUp size={20} />
              </div>
              <h3 className="font-bold text-slate-800 text-lg">APMC Market Trend</h3>
            </div>
          </div>
          
          <div className="p-6 flex flex-col gap-6 flex-1">
            <div className="text-center">
              <h4 className="text-slate-500 font-bold uppercase tracking-wider text-xs mb-2">{crop} - Current Modal Price</h4>
              <div className="text-4xl font-extrabold text-slate-900">{market.price}</div>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-slate-600 font-medium">7-Day Trend</span>
              <span className={`font-bold ${market.trend.startsWith('+') ? 'text-emerald-600' : 'text-slate-600'}`}>
                {market.trend} ({market.trendDesc})
              </span>
            </div>

            <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg flex-1">
              <h4 className="text-blue-800 font-bold text-sm mb-1">AI Market Advice</h4>
              <p className="text-blue-700 text-sm">{market.advice}</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
