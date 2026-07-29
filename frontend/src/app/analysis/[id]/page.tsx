"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { ArrowLeft, Download, ShieldAlert, CheckCircle, Info, Loader2 } from "lucide-react";
import axios from "axios";

export default function AnalysisPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
        const res = await axios.get(`${apiUrl}/analysis/${resolvedParams.id}`);
        setData(res.data);
        setLoading(false);
      } catch (err: any) {
        setError(err.response?.data?.detail || "Failed to load analysis");
        setLoading(false);
      }
    };
    
    fetchAnalysis();
  }, [resolvedParams.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-400">
        <Loader2 className="w-12 h-12 animate-spin mb-4 text-blue-500" />
        <p className="text-lg">Loading AI analysis...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
        <ShieldAlert className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Analysis Not Found</h2>
        <p className="text-slate-400 mb-6">{error}</p>
        <Link href="/dashboard" className="text-blue-400 hover:text-blue-300">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const { analysis, clauses } = data;
  const isHighRisk = analysis.risk_score >= 7;
  const isMediumRisk = analysis.risk_score >= 4 && analysis.risk_score < 7;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 selection:bg-blue-500/30 pb-20">
      <header className="border-b border-white/10 bg-slate-900/50 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center text-sm font-medium text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
          <button className="flex items-center text-sm font-medium bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors">
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 pt-8">
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Legal Document Analysis</h1>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 bg-slate-900 border border-white/10 rounded-2xl p-6">
              <h3 className="text-sm font-medium text-slate-400 mb-2 uppercase tracking-wider">AI Summary</h3>
              <p className="text-lg leading-relaxed text-slate-200">
                {analysis.summary}
              </p>
            </div>
            
            <div className={`border rounded-2xl p-6 flex flex-col items-center justify-center text-center ${
              isHighRisk ? "bg-red-500/10 border-red-500/30" : 
              isMediumRisk ? "bg-yellow-500/10 border-yellow-500/30" : 
              "bg-emerald-500/10 border-emerald-500/30"
            }`}>
              <h3 className="text-sm font-medium text-slate-400 mb-2 uppercase tracking-wider">Overall Risk Score</h3>
              <div className="flex items-baseline space-x-1">
                <span className={`text-6xl font-bold ${
                  isHighRisk ? "text-red-400" : 
                  isMediumRisk ? "text-yellow-400" : 
                  "text-emerald-400"
                }`}>
                  {analysis.risk_score}
                </span>
                <span className="text-xl text-slate-500">/10</span>
              </div>
              <p className="mt-3 text-sm text-slate-300 font-medium">
                {isHighRisk ? "High Risk - Review Carefully" : 
                 isMediumRisk ? "Moderate Risk - Proceed with Caution" : 
                 "Low Risk - Standard Terms"}
              </p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            Extracted Clauses 
            <span className="ml-3 text-sm font-medium bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full">
              {clauses.length} found
            </span>
          </h2>
          
          <div className="space-y-4">
            {clauses.map((clause: any) => (
              <div key={clause.id} className="bg-slate-900 border border-white/10 rounded-xl p-6 hover:border-white/20 transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold">{clause.title}</h3>
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full uppercase tracking-wider ${
                    clause.risk_level.toLowerCase() === 'high' ? "bg-red-500/20 text-red-400" :
                    clause.risk_level.toLowerCase() === 'medium' ? "bg-yellow-500/20 text-yellow-400" :
                    "bg-emerald-500/20 text-emerald-400"
                  }`}>
                    {clause.risk_level} Risk
                  </span>
                </div>
                
                <div className="bg-slate-950 p-4 rounded-lg flex items-start space-x-3">
                  <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-blue-400 mb-1">Plain English Explanation</h4>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      {clause.explanation}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
