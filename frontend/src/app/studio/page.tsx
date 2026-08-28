"use client";

import AiAdvisor from "@/components/AiAdvisor";
import { Sparkles } from "lucide-react";

export default function Studio() {
  return (
    <div className="min-h-screen p-4 sm:p-6 flex flex-col gap-5 max-w-4xl mx-auto w-full">
      <div className="text-center mt-6 mb-4">
        <h1 className="text-2xl font-extrabold text-white flex items-center justify-center gap-2">
          <Sparkles className="text-emerald-400" />
          Decision Studio
        </h1>
        <p className="text-slate-400 text-sm mt-2 max-w-lg mx-auto">
          Upload an image of your crop and describe the symptoms. Our multimodal AI will instantly provide a diagnosis and treatment plan.
        </p>
      </div>

      <AiAdvisor />
    </div>
  );
}
