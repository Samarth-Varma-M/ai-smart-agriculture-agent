import { UploadCloud, CheckCircle2, Trash2 } from "lucide-react";
import { useState } from "react";

export default function ImageUploader({ value, onChange }: { value: string, onChange: (base64: string) => void }) {
  const [isScanning, setIsScanning] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsScanning(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        onChange(base64);
        setTimeout(() => setIsScanning(false), 1000);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    onChange("");
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col h-full min-h-[300px]">
      <h2 className="text-lg font-semibold mb-4 text-slate-800 flex items-center gap-2">
        <UploadCloud className="text-blue-500" /> Crop Vision
      </h2>
      
      {!value ? (
        <label className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer p-6 relative">
          <UploadCloud size={48} className="text-slate-400 mb-4" />
          <p className="text-slate-600 font-medium text-center">Drag & drop crop image here</p>
          <p className="text-slate-400 text-sm text-center mt-1">or click to browse files</p>
          <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" accept="image/png, image/jpeg, image/webp" onChange={handleFileChange} />
        </label>
      ) : (
        <div className="relative flex-1 rounded-xl overflow-hidden bg-slate-900 group min-h-[200px] flex flex-col">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="Crop Preview" className="w-full h-full object-cover opacity-80 absolute inset-0" />
          
          {isScanning && (
            <div className="absolute inset-0 bg-blue-500/20 z-10">
              <div className="w-full h-1 bg-blue-400 animate-pulse absolute top-1/2 shadow-[0_0_15px_rgba(59,130,246,0.8)]"></div>
            </div>
          )}

          {!isScanning && (
            <>
              {/* Mock Bounding Box */}
              <div className="absolute top-[30%] left-[25%] w-[40%] h-[40%] border-2 border-red-500 rounded-lg bg-red-500/20 transition-all duration-500 z-10">
                <span className="absolute -top-6 left-0 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded shadow-sm">Target Area</span>
              </div>
              <button 
                onClick={(e) => { e.preventDefault(); clearImage(); }}
                className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-md hover:bg-red-600 transition-colors z-20 shadow-md"
                title="Remove Image"
              >
                <Trash2 size={16} />
              </button>
            </>
          )}
        </div>
      )}

      {value && !isScanning && (
        <div className="mt-4 flex items-center justify-between bg-green-50 px-4 py-3 rounded-lg border border-green-100">
          <div className="flex items-center gap-2 text-green-700 font-medium text-sm">
             <CheckCircle2 size={16} /> Image Loaded
          </div>
          <div className="text-green-600 font-bold text-xs">Ready for Analysis</div>
        </div>
      )}
    </div>
  );
}
