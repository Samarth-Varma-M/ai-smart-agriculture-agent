"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerUser } from "@/app/actions/auth";
import Link from "next/link";
import { Loader2, Leaf, User, Mail, Lock } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await registerUser(formData);

    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      router.push("/login?registered=true");
    }
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 flex items-center justify-center relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-full max-h-[800px] bg-gradient-to-tr from-emerald-900/20 to-cyan-900/20 blur-3xl -z-10 rounded-full pointer-events-none"></div>

      <div className="glass-panel w-full max-w-md p-8 rounded-3xl border border-slate-700/80 shadow-2xl shadow-emerald-900/20">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-slate-900 p-3 rounded-2xl border border-emerald-500/30 text-emerald-400 mb-4 shadow-lg shadow-emerald-500/10">
            <Leaf size={32} />
          </div>
          <h1 className="text-3xl font-extrabold text-white text-center tracking-tight">Create Account</h1>
          <p className="text-slate-400 text-sm mt-2 text-center">Join AgriAgent AI for personalized diagnostics.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="relative">
            <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              name="name"
              required
              placeholder="Full Name"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3.5 pl-11 pr-4 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
            />
          </div>

          <div className="relative">
            <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="email"
              name="email"
              required
              placeholder="Email Address"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3.5 pl-11 pr-4 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
            />
          </div>

          <div className="relative">
            <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="password"
              name="password"
              required
              placeholder="Password"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3.5 pl-11 pr-4 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-extrabold py-4 rounded-xl shadow-lg shadow-emerald-500/25 active:scale-[0.98] transition-all flex justify-center items-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : "Sign Up"}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-slate-400">
          Already have an account?{" "}
          <Link href="/login" className="text-emerald-400 hover:text-emerald-300 font-bold hover:underline transition-all">
            Log in here
          </Link>
        </div>
      </div>
    </div>
  );
}
