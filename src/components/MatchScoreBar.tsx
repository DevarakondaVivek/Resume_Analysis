'use client';

interface MatchScoreBarProps {
    score: number;
}

export default function MatchScoreBar({ score }: MatchScoreBarProps) {
    const getScoreColor = (score: number) => {
        if (score >= 80) return 'score-green';
        if (score >= 50) return 'score-yellow';
        return 'score-red';
    };

    const getScoreLabel = (score: number) => {
        if (score >= 80) return 'Strong Match';
        if (score >= 50) return 'Moderate Match';
        return 'Needs Improvement';
    };

    return (
        <div className="match-score-container">
            <div className="score-header">
                <h3>Resume Match Score</h3>
                <span className={`score-label ${getScoreColor(score)}`}>
                    {getScoreLabel(score)}
                </span>
            </div>
            <div className="score-bar-track">
                <div
                    className={`score-bar-fill ${getScoreColor(score)}`}
                    style={{ width: `${Math.min(score, 100)}%` }}
                />
            </div>
            <div className="score-number-container">
                <span className={`score-number ${getScoreColor(score)}`}>
                    {score}%
                </span>
            </div>
        </div>
    );
}
