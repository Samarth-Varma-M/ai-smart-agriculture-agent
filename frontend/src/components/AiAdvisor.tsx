"use client";

import { useState, useRef, useEffect } from "react";
import { Camera, Upload, Mic, Volume2, Loader2, Image as ImageIcon, MapPin } from "lucide-react";
import { analyzeCropImage } from "@/app/actions/gemini";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const INDIAN_HUBS = [
  "Delhi", "Mumbai", "Bengaluru", "Chennai", "Kolkata", "Hyderabad", "Pune", "Ahmedabad",
  "Surat", "Jaipur", "Lucknow", "Kanpur", "Nagpur", "Indore", "Thane", "Bhopal", "Visakhapatnam",
  "Patna", "Vadodara", "Ghaziabad", "Ludhiana", "Agra", "Nashik", "Faridabad", "Meerut",
  "Rajkot", "Varanasi", "Srinagar", "Aurangabad", "Dhanbad", "Amritsar", "Allahabad", "Ranchi",
  "Howrah", "Coimbatore", "Jabalpur", "Gwalior", "Vijayawada", "Jodhpur", "Madurai", "Raipur",
  "Kota", "Guwahati", "Chandigarh", "Solapur", "Hubballi-Dharwad", "Guntur"
];

const CROPS = [
  "Rice", "Wheat", "Cotton", "Sugarcane", "Maize", "Soybean", "Tomato", "Potato", "Onion",
  "Groundnut", "Mango", "Banana", "Turmeric", "Chilli", "Mustard", "Millet", "Sorghum",
  "Chickpea", "Pigeon Pea", "Coconut", "Tea", "Coffee", "Rubber", "Apple", "Grapes",
  "Citrus", "Papaya", "Garlic", "Ginger", "Cabbage"
];

export default function AiAdvisor() {
  const [image, setImage] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [weather, setWeather] = useState("");
  const [commodity, setCommodity] = useState("");
  const [soilPh, setSoilPh] = useState("");
  const [npkLevels, setNpkLevels] = useState("");
  const [soilType, setSoilType] = useState("");
  const [irrigation, setIrrigation] = useState("");
  
  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [diagnosis, setDiagnosis] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Fetch Weather when location loses focus or is selected
  const fetchWeather = async (loc: string) => {
    if (!loc) return;
    try {
      const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
      if (!apiKey) {
        setWeather("Temperature: 32°C, Humidity: 65%, Conditions: Sunny (Mock)");
        return;
      }
      const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${loc},in&appid=${apiKey}&units=metric`);
      if (!res.ok) throw new Error("Weather API failed");
      const data = await res.json();
      setWeather(`Temperature: ${data.main.temp}°C, Humidity: ${data.main.humidity}%, Conditions: ${data.weather[0].main}`);
    } catch (e) {
      setWeather("Temperature: 30°C, Humidity: 70%, Conditions: Cloudy (Mock Fallback)");
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setDiagnosis(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const startVoiceInput = () => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }
    
    // @ts-expect-error: Web Speech API
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsRecording(true);
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setQuery((prev) => (prev ? prev + " " + transcript : transcript));
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      setIsRecording(false);
      alert("Microphone access denied or not found. Please click the lock icon in your browser URL bar to allow microphone permissions.");
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.start();
  };

  const playTTS = (text: string) => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    // Strip markdown formatting for cleaner TTS
    const cleanText = text.replace(/[*#_`]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = "en-US";
    window.speechSynthesis.speak(utterance);
  };

  const handleAnalyze = async () => {
    if (!image || !query) {
      setError("Please provide both an image and a problem description (REQUIRED).");
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setDiagnosis(null);
    
    // We pass "English" as the language parameter.
    // The google translate widget handles translations automatically.
    const result = await analyzeCropImage(
      image, query, "English", soilPh, npkLevels, location, weather, commodity, soilType, irrigation
    );
    
    if (result.error) {
      setError(result.error);
    } else if (result.text) {
      setDiagnosis(result.text);
    }

    setIsAnalyzing(false);
  };

  return (
    <div className="glass-panel p-4 sm:p-6 rounded-2xl flex flex-col gap-6 w-full max-w-2xl mx-auto mt-4 sm:mt-8 border border-slate-700/80 shadow-2xl shadow-emerald-900/20">
      
      <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-3 border-b border-slate-800 pb-4">
        <div className="bg-emerald-500/20 p-2 rounded-lg text-emerald-400">
          <ImageIcon size={24} />
        </div>
        <h2 className="text-xl font-extrabold text-white text-center sm:text-left">AI Agronomist Advisor</h2>
      </div>

      {/* Required section: Image and Description */}
      <div className="flex flex-col gap-4">
        <h3 className="text-emerald-400 font-bold uppercase tracking-wider text-xs border-b border-emerald-500/20 pb-2">Step 1: The Problem (REQUIRED)</h3>
        
        {/* Image Preview Area */}
        <div className="relative w-full min-h-[16rem] h-auto bg-slate-900/50 rounded-xl border-2 border-dashed border-slate-700 flex flex-col items-center justify-center overflow-hidden break-words whitespace-normal p-4">
          {image ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={image} alt="Crop" className="w-full h-full object-cover" />
          ) : (
            <div className="text-slate-500 flex flex-col items-center gap-2">
              <ImageIcon size={48} className="opacity-50" />
              <p className="font-medium text-sm">No Image Selected</p>
            </div>
          )}
        </div>

        {/* Inputs (Giant Touch Targets) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input type="file" accept="image/*" capture="environment" className="hidden" ref={cameraInputRef} onChange={handleImageUpload} />
          <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageUpload} />
          
          <button onClick={() => cameraInputRef.current?.click()} className="bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 px-5 py-2.5 text-sm font-medium rounded-full transition-all duration-300 hover:scale-105 active:scale-95 shadow-md flex items-center justify-center gap-2">
            <Camera size={24} className="text-emerald-400" />
            <span>Take Photo</span>
          </button>

          <button onClick={() => fileInputRef.current?.click()} className="bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 px-5 py-2.5 text-sm font-medium rounded-full transition-all duration-300 hover:scale-105 active:scale-95 shadow-md flex items-center justify-center gap-2">
            <Upload size={24} className="text-cyan-400" />
            <span>Upload Image</span>
          </button>
        </div>

        {/* Text/Voice Input */}
        <div className="relative mt-2">
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Describe the problem, symptoms, or ask a question..."
            className="w-full bg-slate-900/80 border border-slate-700 rounded-xl p-4 pr-16 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all resize-none min-h-[6rem] h-auto break-words whitespace-normal"
          />
          <button
            onClick={startVoiceInput}
            className={`absolute bottom-3 right-3 p-3 rounded-xl transition-all ${
              isRecording 
                ? "bg-red-500/20 text-red-500 border border-red-500/50 animate-pulse" 
                : "bg-slate-800 text-slate-400 hover:text-emerald-400 hover:bg-slate-700 border border-slate-700"
            }`}
            title="Speak symptoms"
          >
            <Mic size={24} />
          </button>
        </div>
      </div>

      {/* Optional Context Section */}
      <div className="flex flex-col gap-4 mt-2">
        <h3 className="text-cyan-400 font-bold uppercase tracking-wider text-xs border-b border-cyan-500/20 pb-2">Step 2: Field Context (OPTIONAL)</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Location / Weather */}
          <div className="flex flex-col gap-1 relative">
            <label className="text-[10px] font-mono font-medium text-slate-400 uppercase tracking-wider">Location / City</label>
            <div className="relative">
              <MapPin size={16} className="absolute left-3 top-3 text-slate-500" />
              <input 
                type="text" 
                list="indian-hubs"
                value={location} 
                onChange={(e) => setLocation(e.target.value)} 
                onBlur={(e) => fetchWeather(e.target.value)}
                placeholder="Select city..." 
                className="w-full bg-slate-900 border border-slate-700/80 rounded-lg pl-9 pr-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-cyan-500 transition-colors"
              />
              <datalist id="indian-hubs">
                {INDIAN_HUBS.map(hub => <option key={hub} value={hub} />)}
              </datalist>
            </div>
            {weather && <div className="text-[10px] text-cyan-400 mt-1">{weather}</div>}
          </div>

          {/* Target Commodity */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-mono font-medium text-slate-400 uppercase tracking-wider">Target Commodity</label>
            <select
              value={commodity}
              onChange={(e) => setCommodity(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-cyan-500 transition-colors appearance-none"
            >
              <option value="">Select Crop...</option>
              {CROPS.map(crop => <option key={crop} value={crop}>{crop}</option>)}
            </select>
          </div>

          {/* Soil Type */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-mono font-medium text-slate-400 uppercase tracking-wider">Soil Type</label>
            <select
              value={soilType}
              onChange={(e) => setSoilType(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-cyan-500 transition-colors appearance-none"
            >
              <option value="">Unknown</option>
              <option value="Alluvial">Alluvial</option>
              <option value="Black (Regur)">Black (Regur)</option>
              <option value="Red/Yellow">Red/Yellow</option>
              <option value="Laterite">Laterite</option>
              <option value="Arid/Desert">Arid/Desert</option>
              <option value="Saline/Alkaline">Saline/Alkaline</option>
            </select>
          </div>

          {/* Irrigation Method */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-mono font-medium text-slate-400 uppercase tracking-wider">Irrigation Method</label>
            <select
              value={irrigation}
              onChange={(e) => setIrrigation(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-cyan-500 transition-colors appearance-none"
            >
              <option value="">Unknown</option>
              <option value="Drip">Drip</option>
              <option value="Sprinkler">Sprinkler</option>
              <option value="Flood">Flood/Surface</option>
              <option value="Rainfed">Rainfed</option>
            </select>
          </div>

          {/* Soil pH */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-mono font-medium text-slate-400 uppercase tracking-wider">Soil pH</label>
            <input 
              type="text" 
              value={soilPh} 
              onChange={(e) => setSoilPh(e.target.value)} 
              placeholder="e.g. 6.5" 
              className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>

          {/* NPK */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-mono font-medium text-slate-400 uppercase tracking-wider">NPK Levels</label>
            <input 
              type="text" 
              value={npkLevels} 
              onChange={(e) => setNpkLevels(e.target.value)} 
              placeholder="e.g. 20-20-20" 
              className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={handleAnalyze}
        disabled={!image || !query || isAnalyzing}
        className={`w-full px-5 py-2.5 mt-2 text-sm font-medium rounded-full transition-all duration-300 hover:scale-105 active:scale-95 shadow-md flex items-center justify-center gap-2 ${
          !image || !query || isAnalyzing
            ? "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700 hover:scale-100 active:scale-100"
            : "bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 hover:from-emerald-400 hover:to-teal-500 shadow-emerald-500/25"
        }`}
      >
        {isAnalyzing ? (
          <>
            <Loader2 size={24} className="animate-spin" />
            Analyzing telemetry & imagery...
          </>
        ) : (
          "Run Diagnostics"
        )}
      </button>

      {/* Error Output */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl text-sm font-medium">
          {error}
        </div>
      )}

      {/* Diagnosis Output */}
      {diagnosis && (
        <div className="bg-slate-900/80 border border-emerald-500/30 rounded-xl p-5 relative mt-4 shadow-inner">
          <button
            onClick={() => playTTS(diagnosis)}
            className="absolute top-4 right-4 p-2.5 bg-slate-800 hover:bg-emerald-500/20 text-emerald-400 rounded-lg border border-slate-700 hover:border-emerald-500/50 transition-all shadow-md active:scale-95 z-10"
            title="Read Aloud"
          >
            <Volume2 size={24} />
          </button>
          <div className="text-emerald-300 font-mono text-xs mb-3 font-bold uppercase tracking-widest">AI Diagnosis</div>
          <div className="prose prose-sm sm:prose-base prose-invert prose-emerald max-w-none pr-8">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {diagnosis}
            </ReactMarkdown>
          </div>
        </div>
      )}

    </div>
  );
}
