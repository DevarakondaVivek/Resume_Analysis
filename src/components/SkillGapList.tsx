'use client';

import { SkillGap } from '@/types';
import { AlertTriangle, AlertCircle, Info } from 'lucide-react';

interface SkillGapListProps {
    skillGaps: SkillGap[];
}

export default function SkillGapList({ skillGaps }: SkillGapListProps) {
    const getIcon = (importance: string) => {
        switch (importance) {
            case 'high':
                return <AlertTriangle size={16} />;
            case 'medium':
                return <AlertCircle size={16} />;
            default:
                return <Info size={16} />;
        }
    };

    if (skillGaps.length === 0) {
        return (
            <div className="skill-gap-section">
                <h3>Skill Gap Analysis</h3>
                <div className="no-gaps">
                    <span>✅</span>
                    <p>Great news! No significant skill gaps detected.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="skill-gap-section">
            <h3>Skill Gap Analysis</h3>
            <div className="skill-gap-list">
                {skillGaps.map((gap, index) => (
                    <div key={index} className={`skill-gap-item importance-${gap.importance}`}>
                        <div className="gap-header">
                            {getIcon(gap.importance)}
                            <span className="gap-skill">{gap.skill}</span>
                            <span className={`gap-badge ${gap.importance}`}>{gap.importance}</span>
                        </div>
                        <p className="gap-description">{gap.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
