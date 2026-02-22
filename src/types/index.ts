export interface AnalysisResult {
  matchScore: number;
  summary: string;
  skillGaps: SkillGap[];
  optimizedBullets: OptimizedBullet[];
  strengths: string[];
  suggestions: string[];
}

export interface SkillGap {
  skill: string;
  importance: 'high' | 'medium' | 'low';
  description: string;
}

export interface OptimizedBullet {
  original: string;
  actionRequired: string;
  example?: string;
  optimized?: string; // Kept for backwards compatibility with old records
  improvement?: string; // Kept for backwards compatibility with old records
}

export interface AnalysisRecord {
  id: string;
  userId: string;
  resumeFileName: string;
  jobTitle: string;
  matchScore: number;
  analysisResult: AnalysisResult;
  createdAt: Date;
  resumeText: string;
  jobDescription: string;
}

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}
