'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import { getAnalysisHistory, deleteAnalysis } from '@/lib/firestore';
import { useAuth } from '@/context/AuthContext';
import { AnalysisRecord } from '@/types';
import { Trash2, FileText, ChevronRight, Search, Activity } from 'lucide-react';
import Link from 'next/link';
import AnalysisResults from '@/components/AnalysisResults';

export default function HistoryPage() {
    const { user } = useAuth();
    const [history, setHistory] = useState<AnalysisRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedRecord, setSelectedRecord] = useState<AnalysisRecord | null>(null);

    useEffect(() => {
        if (!user) return;

        const fetchHistory = async () => {
            try {
                const records = await getAnalysisHistory(user.uid);
                setHistory(records);
            } catch (err: any) {
                console.error('Failed to fetch history:', err);
                setError('Could not load your analysis history. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, [user]);

    const handleDelete = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (!confirm('Are you sure you want to delete this analysis record?')) return;

        try {
            await deleteAnalysis(id);
            setHistory((prev) => prev.filter((record) => record.id !== id));
            if (selectedRecord?.id === id) {
                setSelectedRecord(null);
            }
        } catch (err) {
            console.error('Failed to delete record:', err);
            alert('Could not delete the record. Please try again.');
        }
    };

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }).format(date);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col">
                <Navbar />
                <div className="flex-1 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF4F4F]"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-3">
                        <Activity className="text-[#FF4F4F]" size={28} />
                        Your Analysis History
                    </h1>
                    <p className="text-neutral-500 text-lg">
                        Review your past resume evaluations and see how you have improved.
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-700 p-4 rounded-xl mb-8 border border-red-100">
                        {error}
                    </div>
                )}

                {!loading && history.length === 0 ? (
                    <div className="glass-card text-center p-16">
                        <div className="inline-flex w-20 h-20 items-center justify-center bg-[#FFF1F1] rounded-full text-[#FF4F4F] mb-6">
                            <Search size={32} />
                        </div>
                        <h2 className="text-2xl font-semibold mb-3 text-neutral-900">No History Found</h2>
                        <p className="text-neutral-500 mb-8 max-w-md mx-auto">
                            You haven't run any resume analyses yet. Head over to the dashboard to start optimizing your resume.
                        </p>
                        <Link href="/dashboard" className="btn btn-primary inline-flex md:w-auto px-8">
                            Go to Dashboard
                        </Link>
                    </div>
                ) : (
                    <div className="grid lg:grid-cols-12 gap-8">
                        {/* List Column */}
                        <div className={`lg:col-span-4 ${selectedRecord ? 'hidden lg:block' : 'col-span-12'}`}>
                            <div className="space-y-4">
                                {history.map((record) => (
                                    <div
                                        key={record.id}
                                        className={`glass-card p-5 cursor-pointer transition-all hover:-translate-y-1 hover:shadow-md ${selectedRecord?.id === record.id ? 'ring-2 ring-[#FF4F4F] border-transparent' : 'border-neutral-200'}`}
                                        onClick={() => setSelectedRecord(record)}
                                    >
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="flex items-center gap-2">
                                                <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center shrink-0">
                                                    <span className={`font-bold ${record.matchScore >= 80 ? 'text-emerald-500' :
                                                            record.matchScore >= 60 ? 'text-amber-500' :
                                                                'text-red-500'
                                                        }`}>
                                                        {record.matchScore}
                                                    </span>
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-neutral-900 truncate max-w-[180px]" title={record.jobTitle}>
                                                        {record.jobTitle}
                                                    </h3>
                                                    <p className="text-xs text-neutral-400">
                                                        {formatDate(record.createdAt)}
                                                    </p>
                                                </div>
                                            </div>

                                            <button
                                                onClick={(e) => handleDelete(e, record.id)}
                                                className="text-neutral-400 hover:text-red-500 p-1 bg-white rounded transition-colors"
                                                title="Delete analysis"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>

                                        <div className="flex items-center gap-2 text-sm text-neutral-500 bg-neutral-50 p-2 rounded-lg border border-neutral-100">
                                            <FileText size={14} className="shrink-0" />
                                            <span className="truncate">{record.resumeFileName}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Details Column */}
                        <div className={`lg:col-span-8 ${!selectedRecord ? 'hidden lg:block' : 'col-span-12'}`}>
                            {selectedRecord ? (
                                <div className="space-y-4">
                                    <button
                                        onClick={() => setSelectedRecord(null)}
                                        className="lg:hidden mb-4 flex items-center gap-2 text-neutral-500 font-medium"
                                    >
                                        <ChevronRight className="rotate-180" size={18} />
                                        Back to History
                                    </button>
                                    <AnalysisResults result={selectedRecord.analysisResult} />
                                </div>
                            ) : (
                                <div className="glass-card h-full min-h-[500px] flex flex-col items-center justify-center p-8 text-center bg-neutral-50/50 border-dashed hidden lg:flex">
                                    <div className="w-20 h-20 mb-6 bg-white rounded-full flex items-center justify-center shadow-sm">
                                        <FileText className="w-10 h-10 text-neutral-300" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-neutral-700 mb-2">Select an Analysis</h3>
                                    <p className="text-neutral-400 max-w-sm">
                                        Choose a record from the list on the left to view its detailed evaluation and matching scores.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
