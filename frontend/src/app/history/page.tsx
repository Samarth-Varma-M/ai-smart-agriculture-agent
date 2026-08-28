import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/mongodb";
import History from "@/models/History";
import { History as HistoryIcon, LogIn } from "lucide-react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default async function HistoryPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return (
      <div className="min-h-screen p-4 sm:p-6 flex flex-col items-center justify-center max-w-4xl mx-auto w-full text-center">
        <div className="bg-slate-900/80 p-8 rounded-2xl border border-slate-700 max-w-md w-full shadow-xl">
          <LogIn className="mx-auto text-emerald-400 mb-4" size={48} />
          <h2 className="text-2xl font-bold text-white mb-2">Sign In Required</h2>
          <p className="text-slate-400 mb-6">You must be logged in to view your diagnostic history.</p>
          <Link
            href="/api/auth/signin"
            className="inline-block w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3 px-6 rounded-xl transition-all"
          >
            Sign In / Sign Up
          </Link>
        </div>
      </div>
    );
  }

  await dbConnect();
  // Fetch history for the logged in user, sort by latest
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const historyRecords = await History.find({ userId: (session.user as any).id })
    .sort({ createdAt: -1 })
    .lean();

  return (
    <div className="min-h-screen p-4 sm:p-6 flex flex-col gap-5 max-w-4xl mx-auto w-full">
      <div className="text-center mt-6 mb-8">
        <h1 className="text-2xl font-extrabold text-white flex items-center justify-center gap-2">
          <HistoryIcon className="text-cyan-400" />
          My Diagnostic History
        </h1>
        <p className="text-slate-400 text-sm mt-2 max-w-lg mx-auto">
          Review your past AI diagnoses and treatment plans.
        </p>
      </div>

      <div className="flex flex-col gap-6 w-full">
        {historyRecords.length === 0 ? (
          <div className="text-center bg-slate-900/50 rounded-2xl border border-slate-800 p-10 text-slate-400">
            You haven't run any diagnostics yet. 
            <br />
            <Link href="/studio" className="text-emerald-400 hover:underline mt-2 inline-block">Go to Studio</Link>
          </div>
        ) : (
          historyRecords.map((record: any) => (
            <div key={record._id.toString()} className="glass-panel p-5 rounded-xl border border-slate-700/80 shadow-lg flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-slate-800 pb-3">
                <div className="font-mono text-xs text-slate-400">
                  {new Date(record.createdAt).toLocaleString()}
                </div>
                <div className="flex gap-2 flex-wrap">
                  {record.commodity && (
                    <span className="bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded text-xs font-bold uppercase">{record.commodity}</span>
                  )}
                  {record.location && (
                    <span className="bg-cyan-500/20 text-cyan-400 px-2 py-1 rounded text-xs font-bold uppercase">{record.location}</span>
                  )}
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-6">
                {record.image && (
                  <div className="w-full md:w-48 shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={record.image} alt="Crop" className="w-full h-32 md:h-48 object-cover rounded-lg border border-slate-700" />
                  </div>
                )}
                
                <div className="flex-1 flex flex-col gap-3 min-w-0">
                  <div>
                    <h4 className="text-[10px] text-slate-500 font-mono uppercase tracking-wider mb-1">User Query</h4>
                    <p className="text-slate-200 text-sm italic border-l-2 border-slate-700 pl-3">
                      "{record.query}"
                    </p>
                  </div>
                  
                  <div className="mt-2">
                    <h4 className="text-[10px] text-emerald-400 font-mono uppercase tracking-wider mb-1 font-bold">AI Diagnosis</h4>
                    <div className="bg-slate-900/60 p-4 rounded-lg border border-slate-800 prose prose-sm prose-invert prose-emerald max-w-none">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {record.diagnosis}
                      </ReactMarkdown>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
