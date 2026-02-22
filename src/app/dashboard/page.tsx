'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import UploadZone from '@/components/UploadZone';
import AnalysisResults from '@/components/AnalysisResults';
import { analyzeResume } from '@/lib/ai';
import { extractTextFromFile } from '@/lib/parsers';
import { saveAnalysis } from '@/lib/firestore';
import { useAuth } from '@/context/AuthContext';
import { AnalysisResult } from '@/types';

export default function DashboardPage() {
    const { user } = useAuth();
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState<AnalysisResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [fileInfo, setFileInfo] = useState<{ name: string; size: number } | null>(null);

    const handleAnalyze = async (file: File, jobDescription: string) => {
        if (!user) return;

        setIsAnalyzing(true);
        setError(null);
        setFileInfo({ name: file.name, size: Math.round(file.size / 1024) });

        try {
            // 1. Extract text from the uploaded file
            const resumeText = await extractTextFromFile(file);

            // 2. Send to AI for analysis
            const aiResult = await analyzeResume(resumeText, jobDescription);
            setResult(aiResult);
            setIsAnalyzing(false); // Stop loading immediately so user sees results

            // 3. Save to History (non-blocking)
            saveAnalysis(
                user.uid,
                file.name,
                jobDescription.split('\n')[0].substring(0, 50) || 'Untitled Analysis',
                resumeText,
                jobDescription,
                aiResult
            ).catch(err => console.error('History save failed:', err));

        } catch (err: any) {
            console.error('Analysis failed:', err);
            setError(err.message || 'An unexpected error occurred during analysis.');
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight mb-2">Resume Analytics</h1>
                    <p className="text-neutral-500 text-lg">
                        Upload your resume and paste the job description to get instant feedback.
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-700 p-4 rounded-xl mb-8 border border-red-100 flex items-start gap-3">
                        <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <p>{error}</p>
                    </div>
                )}

                <div className="grid lg:grid-cols-12 gap-8">
                    {/* Left Column: Upload or Document Placeholder */}
                    <div className="lg:col-span-5 flex flex-col gap-6">
                        <div className="glass-card p-6">
                            <UploadZone onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} />
                        </div>
                    </div>

                    {/* Right Column: Results */}
                    <div className="lg:col-span-7">
                        {isAnalyzing ? (
                            <div className="glass-card h-full min-h-[500px] flex flex-col items-center justify-center p-8 text-center space-y-6">
                                <div className="w-24 h-24 border-4 border-solid border-neutral-100 border-t-[#FF4F4F] rounded-full animate-spin"></div>
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-bold text-neutral-800">Analyzing Your Resume</h3>
                                    <p className="text-neutral-500 max-w-sm">
                                        Our AI is comparing your experience against the job description to calculate your match score...
                                    </p>
                                </div>
                            </div>
                        ) : result ? (
                            <AnalysisResults result={result} />
                        ) : (
                            <div className="glass-card h-full min-h-[500px] flex flex-col items-center justify-center p-8 text-center bg-neutral-50/50 border-dashed">
                                <div className="w-20 h-20 mb-6 bg-white rounded-full flex items-center justify-center shadow-sm">
                                    <svg className="w-10 h-10 text-neutral-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold text-neutral-700 mb-2">Ready for Analysis</h3>
                                <p className="text-neutral-400 max-w-sm">
                                    Upload your documents on the left to see your match score and improvement suggestions here.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
