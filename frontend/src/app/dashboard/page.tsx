"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UploadCloud, File, AlertCircle, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";

export default function DashboardUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile?.type === "application/pdf") {
      setFile(droppedFile);
      setError(null);
    } else {
      setError("Please upload a PDF file.");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile?.type === "application/pdf") {
      setFile(selectedFile);
      setError(null);
    } else if (selectedFile) {
      setError("Please upload a PDF file.");
    }
  };

  const handleUploadAndAnalyze = async () => {
    if (!file) return;
    
    setIsUploading(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append("file", file);
      
      // Upload document
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const uploadRes = await axios.post(`${apiUrl}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      
      const docId = uploadRes.data.document_id;
      
      // Start analysis
      const analyzeRes = await axios.post(`${apiUrl}/analyze`, {
        document_id: docId
      });
      
      // Navigate to analysis page
      router.push(`/analysis/${analyzeRes.data.document_id}`);
      
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.detail || "An error occurred during processing.");
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Analyze Document</h1>
        <p className="text-slate-400">Upload a legal document to extract clauses and identify risks.</p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-900 border border-white/10 rounded-2xl p-8"
      >
        <div 
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-12 text-center transition-all ${
            file ? "border-blue-500/50 bg-blue-500/5" : "border-slate-700 hover:border-slate-500 hover:bg-slate-800/50"
          }`}
        >
          {file ? (
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center mb-4">
                <File className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-medium text-slate-200">{file.name}</h3>
              <p className="text-sm text-slate-400 mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              
              <button 
                onClick={() => setFile(null)}
                className="mt-4 text-sm text-red-400 hover:text-red-300 transition-colors"
                disabled={isUploading}
              >
                Remove file
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-slate-800 text-slate-400 rounded-full flex items-center justify-center mb-4">
                <UploadCloud className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-medium text-slate-200">Drag & drop your PDF here</h3>
              <p className="text-sm text-slate-400 mt-1 mb-6">Or browse your files</p>
              
              <label className="cursor-pointer bg-white/10 hover:bg-white/15 text-white px-6 py-2.5 rounded-lg font-medium transition-colors">
                Browse Files
                <input 
                  type="file" 
                  className="hidden" 
                  accept="application/pdf"
                  onChange={handleFileChange}
                />
              </label>
            </div>
          )}
        </div>

        {error && (
          <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start space-x-3 text-red-400">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        <div className="mt-8 flex justify-end">
          <button
            onClick={handleUploadAndAnalyze}
            disabled={!file || isUploading}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg font-medium transition-colors"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Processing AI...</span>
              </>
            ) : (
              <span>Analyze Document</span>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
