'use client';

import { AnalysisResult } from '@/types';
import { CheckCircle2, AlertCircle, TrendingUp, Sparkles, AlertTriangle } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function AnalysisResults({ result }: { result: AnalysisResult }) {
    const { matchScore, summary, skillGaps, optimizedBullets, strengths, suggestions } = result;

    // Determine color scheme based on score
    const getScoreConfig = (score: number) => {
        if (score >= 80) return { color: '#10B981', label: 'Excellent Match' };
        if (score >= 60) return { color: '#F59E0B', label: 'Good Match' };
        return { color: '#EF4444', label: 'Needs Optimization' };
    };

    const config = getScoreConfig(matchScore);

    // Animation for the gauge
    const [progress, setProgress] = useState(0);
    useEffect(() => {
        const timer = setTimeout(() => setProgress(matchScore), 100);
        return () => clearTimeout(timer);
    }, [matchScore]);

    // Circumference for the SVG circle (2 * Math.PI * r)
    // where r = 88 (viewBox 200, center 100, stroke 12 -> 100 - 6 = 94, let's use r=80)
    const radius = 80;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Top Section: Score & Summary */}
            <div className="glass-card p-8 bg-white flex flex-col md:flex-row items-center gap-12">
                {/* Circular Gauge */}
                <div className="gauge-container shrink-0">
                    <svg className="gauge-svg" viewBox="0 0 200 200">
                        <circle
                            className="gauge-bg"
                            cx="100" cy="100" r={radius}
                        />
                        <circle
                            className="gauge-progress"
                            cx="100" cy="100" r={radius}
                            stroke={config.color}
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                        />
                    </svg>
                    <div className="gauge-text">
                        <span className="gauge-label">Overall</span>
                        <span className="gauge-value">{progress}<span className="text-xl text-neutral-400 font-medium">/100</span></span>
                    </div>
                </div>

                <div className="space-y-4 text-center md:text-left">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold mb-3 border" style={{ backgroundColor: `${config.color}15`, color: config.color, borderColor: `${config.color}30` }}>
                            {config.label}
                        </div>
                        <h2 className="text-2xl font-bold text-neutral-900 mb-2">Analysis Summary</h2>
                        <p className="text-neutral-600 leading-relaxed text-lg">
                            {summary}
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Strengths */}
                <div className="glass-card p-6 bg-white section-strengths">
                    <h3 className="flex items-center gap-2 text-lg font-bold text-neutral-900 mb-4 pb-2 border-b border-neutral-100">
                        <CheckCircle2 className="text-emerald-500" />
                        Key Strengths
                    </h3>
                    <ul className="space-y-3">
                        {(strengths || []).map((strength, idx) => (
                            <li key={idx} className="flex gap-3 text-neutral-700">
                                <span className="text-emerald-500 mt-1 flex-shrink-0">•</span>
                                <span>{strength}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Skill Gaps */}
                <div className="glass-card p-6 bg-white section-gaps">
                    <h3 className="flex items-center gap-2 text-lg font-bold text-neutral-900 mb-4 pb-2 border-b border-neutral-100">
                        <AlertTriangle className="text-amber-500" />
                        Missing Skills & Keywords
                    </h3>
                    {(!skillGaps || skillGaps.length === 0) ? (
                        <p className="text-neutral-500 italic">No major skill gaps identified!</p>
                    ) : (
                        <div className="space-y-4">
                            {(skillGaps || []).map((gap, idx) => (
                                <div key={idx} className="flex items-start gap-3 bg-neutral-50 p-3 rounded-lg border border-neutral-100">
                                    <div className={`mt-0.5 px-2 py-0.5 rounded text-xs font-semibold shrink-0 ${gap.importance === 'high' ? 'bg-red-100 text-red-700' :
                                        gap.importance === 'medium' ? 'bg-amber-100 text-amber-700' :
                                            'bg-blue-100 text-blue-700'
                                        }`}>
                                        {gap.importance.toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-neutral-900 text-sm mb-1">{gap.skill}</p>
                                        <p className="text-neutral-600 text-sm leading-snug">{gap.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* AI Rewrites */}
            {optimizedBullets && optimizedBullets.length > 0 && (
                <div className="glass-card p-6 bg-white">
                    <h3 className="flex items-center gap-2 text-lg font-bold text-neutral-900 mb-6 pb-2 border-b border-neutral-100">
                        <Sparkles className="text-primary" />
                        AI Bullet Rewrites
                    </h3>

                    <div className="space-y-6">
                        {(optimizedBullets || []).map((bullet, idx) => (
                            <div key={idx} className="relative pl-4 border-l-2 border-neutral-200">
                                <p className="text-xs font-semibold text-primary mb-2 uppercase tracking-wide">
                                    Action Required
                                </p>
                                <p className="text-neutral-700 font-medium mb-4">{bullet.actionRequired}</p>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-100 opacity-70">
                                        <div className="text-xs font-semibold text-neutral-400 mb-2 uppercase">Original</div>
                                        <p className="text-neutral-600 text-sm line-through decoration-neutral-300">{bullet.original}</p>
                                    </div>
                                    <div className="bg-[#FFF8F8] p-4 rounded-xl border border-[#FFEAEA]">
                                        <div className="text-xs font-semibold text-primary mb-2 uppercase">Example Fix</div>
                                        <p className="text-neutral-900 font-medium text-sm">{bullet.example || bullet.optimized}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* General Advice */}
            <div className="glass-card p-6 bg-white">
                <h3 className="flex items-center gap-2 text-lg font-bold text-neutral-900 mb-4 pb-2 border-b border-neutral-100">
                    <TrendingUp className="text-blue-500" />
                    Actionable Advice
                </h3>
                <ul className="space-y-3">
                    {(suggestions || []).map((suggestion, idx) => (
                        <li key={idx} className="flex gap-3 text-neutral-700 items-start">
                            <div className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                                {idx + 1}
                            </div>
                            <span className="leading-relaxed">{suggestion}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
