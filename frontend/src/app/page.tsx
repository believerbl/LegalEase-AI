"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, FileText, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 text-slate-50 font-sans selection:bg-blue-500/30">
      <nav className="border-b border-white/10 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-6 h-6 text-blue-500" />
            <span className="font-bold text-xl tracking-tight">LegalEase AI</span>
          </div>
          <div>
            <Link 
              href="/dashboard" 
              className="text-sm font-medium hover:text-blue-400 transition-colors"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 pt-32 pb-20">
        <div className="flex flex-col items-center text-center space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center space-x-2 bg-white/5 rounded-full px-3 py-1 border border-white/10"
          >
            <span className="flex h-2 w-2 rounded-full bg-blue-500"></span>
            <span className="text-xs font-medium text-slate-300">Indian Legal Document Assistant</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl font-extrabold tracking-tight max-w-4xl leading-tight"
          >
            Understand Contracts in <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Plain English</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-slate-400 max-w-2xl"
          >
            Upload your NDAs, employment contracts, and rental agreements. Our AI agent instantly extracts clauses, assesses risks, and provides simple explanations.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Link 
              href="/dashboard"
              className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-[0_0_40px_-10px_rgba(59,130,246,0.5)] transition-all hover:scale-105 active:scale-95"
            >
              Start Analyzing Now
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-32">
          {[
            {
              icon: <FileText className="w-8 h-8 text-blue-400" />,
              title: "Instant Extraction",
              description: "Upload any PDF document. We instantly extract text and identify key clauses automatically."
            },
            {
              icon: <Zap className="w-8 h-8 text-indigo-400" />,
              title: "Plain English Explanations",
              description: "No more legal jargon. We translate complex legalese into simple, easy-to-understand summaries."
            },
            {
              icon: <ShieldCheck className="w-8 h-8 text-emerald-400" />,
              title: "Risk Scoring",
              description: "Know what you are signing. We highlight high-risk clauses and potential red flags instantly."
            }
          ].map((feature, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 + (i * 0.1) }}
              className="bg-white/5 border border-white/10 p-8 rounded-2xl hover:bg-white/10 transition-colors"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-slate-400 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}
