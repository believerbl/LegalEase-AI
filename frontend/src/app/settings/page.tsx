"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Settings } from "lucide-react";
import Link from "next/link";

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-50 p-8">
      <Link href="/dashboard" className="inline-flex items-center text-sm text-neutral-400 hover:text-white mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Dashboard
      </Link>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto flex flex-col items-center justify-center text-center mt-20"
      >
        <div className="w-20 h-20 bg-neutral-900 rounded-full flex items-center justify-center mb-6">
          <Settings className="w-10 h-10 text-neutral-500" />
        </div>
        <h1 className="text-3xl font-bold mb-4">Account Settings</h1>
        <p className="text-neutral-400 max-w-md">
          Settings and preferences are currently locked for this demo version. Stay tuned for post-hackathon updates!
        </p>
      </motion.div>
    </div>
  );
}
