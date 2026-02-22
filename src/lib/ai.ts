import { AnalysisResult } from '@/types';

export async function analyzeResume(
    resumeText: string,
    jobDescription: string
): Promise<AnalysisResult> {
    const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText, jobDescription }),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to analyze resume. Please try again.');
    }

    const data = await response.json();
    return data as AnalysisResult;
}
