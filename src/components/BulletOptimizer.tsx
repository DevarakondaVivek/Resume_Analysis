'use client';

import { OptimizedBullet } from '@/types';
import { ArrowRight, Lightbulb } from 'lucide-react';

interface BulletOptimizerProps {
    bullets: OptimizedBullet[];
}

export default function BulletOptimizer({ bullets }: BulletOptimizerProps) {
    if (bullets.length === 0) {
        return (
            <div className="bullet-section">
                <h3>
                    <Lightbulb size={20} />
                    Bullet Point Optimizer
                </h3>
                <p className="no-bullets">No bullet points to optimize at this time.</p>
            </div>
        );
    }

    return (
        <div className="bullet-section">
            <h3>
                <Lightbulb size={20} />
                Bullet Point Optimizer
            </h3>
            <div className="bullet-list">
                {bullets.map((bullet, index) => (
                    <div key={index} className="bullet-item">
                        <div className="bullet-comparison">
                            <div className="bullet-original">
                                <span className="bullet-label">Original</span>
                                <p>{bullet.original}</p>
                            </div>
                            <div className="bullet-arrow">
                                <ArrowRight size={20} />
                            </div>
                            <div className="bullet-optimized">
                                <span className="bullet-label">Optimized</span>
                                <p>{bullet.optimized}</p>
                            </div>
                        </div>
                        <div className="bullet-improvement">
                            <span>💡</span>
                            <p>{bullet.improvement}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
