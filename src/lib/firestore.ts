import {
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc,
    query,
    where,
    orderBy,
    Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import { AnalysisResult, AnalysisRecord } from '@/types';

const ANALYSES_COLLECTION = 'analyses';

export async function saveAnalysis(
    userId: string,
    resumeFileName: string,
    jobTitle: string,
    resumeText: string,
    jobDescription: string,
    analysisResult: AnalysisResult
): Promise<string> {
    if (!db) {
        console.warn('Firestore is not configured. Skipping save.');
        return 'mock-id-' + Date.now();
    }
    const docRef = await addDoc(collection(db, ANALYSES_COLLECTION), {
        userId,
        resumeFileName,
        jobTitle,
        resumeText,
        jobDescription,
        matchScore: analysisResult.matchScore,
        analysisResult,
        createdAt: Timestamp.now(),
    });
    return docRef.id;
}

export async function getAnalysisHistory(userId: string): Promise<AnalysisRecord[]> {
    if (!db) {
        console.warn('Firestore is not configured. Returning empty history.');
        return [];
    }
    const q = query(
        collection(db, ANALYSES_COLLECTION),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate(),
    })) as AnalysisRecord[];
}

export async function deleteAnalysis(analysisId: string): Promise<void> {
    if (!db) {
        console.warn('Firestore is not configured. Skipping delete.');
        return;
    }
    await deleteDoc(doc(db, ANALYSES_COLLECTION, analysisId));
}
