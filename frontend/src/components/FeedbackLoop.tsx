import { ThumbsUp, ThumbsDown, MessageSquare, CheckCircle } from "lucide-react";
import { useState } from "react";

export default function FeedbackLoop({ decisionId }: { decisionId?: string }) {
  const [feedbackStatus, setFeedbackStatus] = useState<"IDLE" | "SUBMITTING" | "SUCCESS">("IDLE");
  const [notes, setNotes] = useState("");
  const [showNotes, setShowNotes] = useState(false);

  const submitFeedback = async (status: string) => {
    setFeedbackStatus("SUBMITTING");
    try {
      const response = await fetch("http://localhost:8000/api/v1/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          decision_id: decisionId,
          status,
          notes: notes || null
        })
      });
      if (response.ok) {
        // Update local storage history
        if (decisionId) {
          const historyStr = localStorage.getItem("agri_diagnosis_history");
          if (historyStr) {
            let history = JSON.parse(historyStr);
            history = history.map((entry: any) => 
              entry.id === decisionId ? { ...entry, status, notes } : entry
            );
            localStorage.setItem("agri_diagnosis_history", JSON.stringify(history));
          }
        }
        
        setFeedbackStatus("SUCCESS");
      } else {
        setFeedbackStatus("IDLE");
      }
    } catch (e) {
      console.error("Failed to submit feedback", e);
      setFeedbackStatus("IDLE");
    }
  };

  if (feedbackStatus === "SUCCESS") {
    return (
      <div className="bg-emerald-800 text-emerald-100 rounded-2xl p-6 shadow-sm flex items-center gap-3 justify-center border border-emerald-700">
        <CheckCircle size={24} className="text-emerald-400" />
        <h4 className="font-bold text-lg">Thank you for your feedback!</h4>
      </div>
    );
  }

  return (
    <div className="bg-slate-800 text-slate-100 rounded-2xl p-6 shadow-sm border border-slate-700 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      <div>
        <h4 className="font-bold text-lg mb-1 text-white">Was this AI decision helpful?</h4>
        <p className="text-slate-400 text-sm">Your feedback improves future recommendations.</p>
      </div>
      
      <div className="flex flex-col items-end gap-3 w-full md:w-auto">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button 
            onClick={() => submitFeedback("ACCEPTED")} 
            disabled={feedbackStatus === "SUBMITTING"}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-slate-700 hover:bg-emerald-600 px-4 py-2 rounded-lg font-bold transition-colors disabled:opacity-50 text-white"
          >
            <ThumbsUp size={18} /> Accepted
          </button>
          <button 
            onClick={() => submitFeedback("REJECTED")}
            disabled={feedbackStatus === "SUBMITTING"}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-slate-700 hover:bg-red-600 px-4 py-2 rounded-lg font-bold transition-colors disabled:opacity-50 text-white"
          >
            <ThumbsDown size={18} /> Rejected
          </button>
          <button 
            onClick={() => setShowNotes(!showNotes)}
            className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-bold transition-colors ${showNotes ? 'bg-slate-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-white'}`}
          >
            <MessageSquare size={18} /> {showNotes ? 'Close Note' : 'Add Note'}
          </button>
        </div>
        
        {showNotes && (
          <div className="w-full mt-2 flex gap-2">
            <input 
              type="text" 
              value={notes} 
              onChange={(e) => setNotes(e.target.value)} 
              placeholder="Why did you accept/reject?" 
              className="flex-1 bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
            />
          </div>
        )}
      </div>
    </div>
  );
}
