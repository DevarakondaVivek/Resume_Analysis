'use client';

import { AnalysisResult } from '@/types';
import MatchScoreBar from './MatchScoreBar';
import SkillGapList from './SkillGapList';
import BulletOptimizer from './BulletOptimizer';
import { CheckCircle, TrendingUp } from 'lucide-react';

interface AnalysisDashboardProps {
    result: AnalysisResult;
    resumeText: string;
}

export default function AnalysisDashboard({ result, resumeText }: AnalysisDashboardProps) {
    return (
        <div className="analysis-dashboard">
            <div className="analysis-left">
                <div className="glass-card resume-preview">
                    <h3>Resume Content</h3>
                    <div className="resume-text">
                        {resumeText.split('\n').map((line, i) => (
                            <p key={i}>{line || '\u00A0'}</p>
                        ))}
                    </div>
                </div>
            </div>

            <div className="analysis-right">
                <div className="glass-card">
                    <MatchScoreBar score={result.matchScore} />
                </div>

                <div className="glass-card">
                    <p className="analysis-summary">{result.summary}</p>
                </div>

                {result.strengths && result.strengths.length > 0 && (
                    <div className="glass-card strengths-section">
                        <h3>
                            <CheckCircle size={20} />
                            Strengths
                        </h3>
                        <ul className="strengths-list">
                            {result.strengths.map((strength, i) => (
                                <li key={i}>{strength}</li>
                            ))}
                        </ul>
                    </div>
                )}

                <div className="glass-card">
                    <SkillGapList skillGaps={result.skillGaps} />
                </div>

                <div className="glass-card">
                    <BulletOptimizer bullets={result.optimizedBullets} />
                </div>

                {result.suggestions && result.suggestions.length > 0 && (
                    <div className="glass-card suggestions-section">
                        <h3>
                            <TrendingUp size={20} />
                            Actionable Suggestions
                        </h3>
                        <ul className="suggestions-list">
                            {result.suggestions.map((suggestion, i) => (
                                <li key={i}>{suggestion}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}
