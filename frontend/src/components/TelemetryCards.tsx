import { Droplet, Thermometer, TrendingUp, CloudRain, MapPin, Leaf, Sprout, Navigation } from "lucide-react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function TelemetryCards({ farmState, setFarmState }: { farmState: any, setFarmState: any }) {

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let parsedValue: any = value;
    if (type === "range" || type === "number") {
      parsedValue = parseFloat(value);
    }
    setFarmState({ ...farmState, [name]: parsedValue });
  };

  const handlePredefinedLocation = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === "nashik") {
      setFarmState({ ...farmState, locationName: "Nashik, Maharashtra", locationLat: 19.9975, locationLon: 73.7898 });
    } else if (val === "punjab") {
      setFarmState({ ...farmState, locationName: "Punjab Plains", locationLat: 31.1471, locationLon: 75.3412 });
    } else if (val === "iowa") {
      setFarmState({ ...farmState, locationName: "Iowa Corn Belt", locationLat: 41.8780, locationLon: -93.0977 });
    }
  };

  const handleGPSDetect = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFarmState({
            ...farmState,
            locationName: "Current GPS Location",
            locationLat: position.coords.latitude,
            locationLon: position.coords.longitude
          });
        },
        (error) => {
          console.error("Error getting location", error);
          alert("Unable to retrieve your location. Please check browser permissions.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Farm Profile Editable Card */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-5 shadow-sm border border-emerald-100">
        <h3 className="text-sm font-semibold text-emerald-800 mb-3 flex items-center gap-2">
          <MapPin size={16} /> Farm Profile & Location
        </h3>
        
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Crop Type</label>
            <select name="cropType" value={farmState.cropType} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500">
              <option value="Tomato">Tomato</option>
              <option value="Wheat">Wheat</option>
              <option value="Maize">Maize</option>
              <option value="Rice">Rice</option>
              <option value="Cotton">Cotton</option>
              <option value="Soybean">Soybean</option>
              <option value="Potato">Potato</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Growth Stage</label>
            <select name="growthStage" value={farmState.growthStage} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500">
              <option value="Vegetative">Vegetative</option>
              <option value="Flowering">Flowering</option>
              <option value="Fruiting">Fruiting</option>
              <option value="Mature">Mature</option>
            </select>
          </div>
        </div>

        <div className="bg-emerald-50/50 p-3 rounded-xl border border-emerald-100">
          <label className="block text-xs font-medium text-emerald-800 mb-2">Location Coordinates</label>
          <div className="flex flex-col gap-2">
            <select onChange={handlePredefinedLocation} className="w-full bg-white border border-emerald-200 rounded-lg p-2 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500">
              <option value="">-- Select Predefined Hub --</option>
              <option value="nashik">Nashik, Maharashtra</option>
              <option value="punjab">Punjab Plains</option>
              <option value="iowa">Iowa Corn Belt</option>
            </select>
            
            <div className="flex gap-2">
              <input type="text" readOnly value={`${farmState.locationLat?.toFixed(4)}, ${farmState.locationLon?.toFixed(4)}`} placeholder="Lat, Lon" className="flex-1 bg-white border border-emerald-200 rounded-lg p-2 text-sm font-medium text-slate-500 cursor-not-allowed" />
              <button onClick={handleGPSDetect} className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-lg text-xs font-bold transition-colors">
                <Navigation size={14} /> GPS
              </button>
            </div>
            {farmState.locationName && (
              <div className="text-xs text-emerald-700 font-medium mt-1">Current: {farmState.locationName}</div>
            )}
          </div>
        </div>
      </div>

      {/* Soil Telemetry Editable Card */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-5 shadow-sm border border-emerald-100 flex-1">
        <h3 className="text-sm font-semibold text-emerald-800 mb-4 flex items-center gap-2">
          <Droplet size={16} /> Soil Telemetry
        </h3>
        
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-medium text-slate-500">Moisture (%)</label>
              <span className="text-sm font-bold text-blue-600">{farmState.soilMoisture}%</span>
            </div>
            <input type="range" name="soilMoisture" min="0" max="100" step="1" value={farmState.soilMoisture} onChange={handleChange} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-medium text-slate-500">Soil pH</label>
              <span className="text-sm font-bold text-amber-600">{farmState.soilPh}</span>
            </div>
            <input type="range" name="soilPh" min="4.0" max="9.0" step="0.1" value={farmState.soilPh} onChange={handleChange} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500" />
          </div>

          <div className="pt-3 border-t border-emerald-50">
            <label className="block text-xs font-medium text-slate-500 mb-2">NPK Levels (mg/kg)</label>
            <div className="flex gap-2">
              <div className="flex-1 bg-white border border-emerald-100 rounded-lg p-2 flex flex-col items-center">
                <span className="text-[10px] font-bold text-slate-400 mb-1">N</span>
                <input type="number" name="nitrogen" value={farmState.nitrogen} onChange={handleChange} className="w-full text-center bg-transparent font-bold text-emerald-900 text-sm focus:outline-none" />
              </div>
              <div className="flex-1 bg-white border border-emerald-100 rounded-lg p-2 flex flex-col items-center">
                <span className="text-[10px] font-bold text-slate-400 mb-1">P</span>
                <input type="number" name="phosphorus" value={farmState.phosphorus} onChange={handleChange} className="w-full text-center bg-transparent font-bold text-emerald-900 text-sm focus:outline-none" />
              </div>
              <div className="flex-1 bg-white border border-emerald-100 rounded-lg p-2 flex flex-col items-center">
                <span className="text-[10px] font-bold text-slate-400 mb-1">K</span>
                <input type="number" name="potassium" value={farmState.potassium} onChange={handleChange} className="w-full text-center bg-transparent font-bold text-emerald-900 text-sm focus:outline-none" />
              </div>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
}
