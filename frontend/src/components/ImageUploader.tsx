"use client";

import { UploadCloud, CheckCircle2, Trash2, Scan, Eye, Sparkles } from "lucide-react";
import { useState } from "react";

interface ImageUploaderProps {
  value: string;
  onChange: (base64: string) => void;
}

export default function ImageUploader({ value, onChange }: ImageUploaderProps) {
  const [isScanning, setIsScanning] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsScanning(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        onChange(base64);
        setTimeout(() => setIsScanning(false), 1200);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    onChange("");
  };

  return (
    <div className="glass-card rounded-xl p-4 sm:p-5 flex flex-col h-full min-h-[340px] border border-slate-800/80 relative overflow-hidden group">
      {/* Subtle top glow line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>

      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xs font-bold text-slate-200 flex items-center gap-2 tracking-wider uppercase font-mono">
          <div className="p-1 rounded-md bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <Scan size={14} />
          </div>
          Multimodal Crop Vision
        </h2>
        {value && !isScanning && (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-emerald-950/80 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 size={11} />
            Tensor Active
          </span>
        )}
      </div>
      
      {!value ? (
        <label className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-slate-800 hover:border-emerald-500/40 rounded-lg bg-slate-900/40 hover:bg-slate-900/80 transition-all duration-300 cursor-pointer p-5 relative group/drop">
          <div className="w-12 h-12 rounded-lg bg-slate-800/70 border border-slate-700/60 flex items-center justify-center text-slate-400 group-hover/drop:text-emerald-400 group-hover/drop:border-emerald-500/40 group-hover/drop:scale-105 transition-all duration-300 mb-2.5">
            <UploadCloud size={24} />
          </div>
          <p className="text-slate-200 font-semibold text-xs text-center">
            Upload Leaf / Canopy Specimen
          </p>
          <p className="text-slate-500 text-[11px] text-center mt-0.5">
            Drag & drop or browse (JPG, PNG, WEBP)
          </p>
          <div className="mt-3 flex items-center gap-1.5 text-[10px] text-cyan-400/90 bg-cyan-950/40 border border-cyan-500/20 px-2.5 py-0.5 rounded font-mono">
            <Sparkles size={10} /> Auto Pathogen Segmentation
          </div>
          <input 
            type="file" 
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
            accept="image/png, image/jpeg, image/webp" 
            onChange={handleFileChange} 
          />
        </label>
      ) : (
        <div className="relative flex-1 rounded-lg overflow-hidden bg-slate-950 border border-slate-800 flex flex-col min-h-[220px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={value} 
            alt="Crop Specimen Preview" 
            className="w-full h-full object-cover opacity-90 absolute inset-0 transition-transform duration-500 group-hover:scale-105" 
          />

          {/* Grid lines overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>
          
          {isScanning && (
            <div className="absolute inset-0 bg-cyan-950/50 backdrop-blur-[1px] z-10 flex flex-col items-center justify-center">
              <div className="w-full h-[2px] bg-cyan-400 shadow-[0_0_15px_#22d3ee] animate-radar absolute top-0"></div>
              <div className="bg-slate-950/90 border border-cyan-500/40 px-3 py-1.5 rounded-lg text-cyan-300 font-mono text-xs flex items-center gap-2 shadow-2xl">
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></div>
                Extracting Disease Feature Vectors...
              </div>
            </div>
          )}

          {!isScanning && (
            <>
              {/* Target HUD Reticle */}
              <div className="absolute top-[28%] left-[24%] w-[48%] h-[46%] border-2 border-dashed border-emerald-400/80 rounded-lg bg-emerald-500/10 pointer-events-none transition-all duration-300 backdrop-blur-[0.5px]">
                {/* Corner markers */}
                <div className="absolute -top-1 -left-1 w-2.5 h-2.5 border-t-2 border-l-2 border-emerald-400"></div>
                <div className="absolute -top-1 -right-1 w-2.5 h-2.5 border-t-2 border-r-2 border-emerald-400"></div>
                <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 border-b-2 border-l-2 border-emerald-400"></div>
                <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 border-b-2 border-r-2 border-emerald-400"></div>
                
                <span className="absolute -top-5 left-1/2 -translate-x-1/2 bg-emerald-950/90 text-emerald-300 text-[9px] font-mono font-bold px-1.5 py-0.2 rounded border border-emerald-500/40 shadow-sm flex items-center gap-1">
                  <Eye size={9} /> DETECTED LESION
                </span>
              </div>

              {/* Action Buttons */}
              <button 
                onClick={(e) => { e.preventDefault(); clearImage(); }}
                className="absolute top-2 right-2 bg-slate-950/85 hover:bg-red-500/90 text-slate-300 hover:text-white p-1.5 rounded-lg border border-slate-700/80 hover:border-red-400 transition-all duration-200 z-20 backdrop-blur-md shadow-lg"
                title="Remove Image"
              >
                <Trash2 size={13} />
              </button>
            </>
          )}
        </div>
      )}

      {value && !isScanning && (
        <div className="mt-2.5 flex items-center justify-between bg-slate-900/80 border border-slate-800 px-3 py-2 rounded-lg">
          <div className="flex items-center gap-2 text-emerald-400 font-mono text-[11px]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Resolution: 1024x1024
          </div>
          <div className="text-[10px] font-mono text-slate-400">Tensor Ready</div>
        </div>
      )}
    </div>
  );
}
