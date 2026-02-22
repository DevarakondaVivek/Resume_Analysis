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
    let docId = 'loc-' + Date.now();

    // 1. Try Firebase
    if (db) {
        try {
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
            docId = docRef.id;
        } catch (e) {
            console.warn('Firestore save failed, falling back to local storage', e);
        }
    }

    // 2. Local Storage
    if (typeof window !== 'undefined') {
        const localRecord: AnalysisRecord = {
            id: docId,
            userId,
            resumeFileName,
            jobTitle,
            resumeText,
            jobDescription,
            matchScore: analysisResult.matchScore,
            analysisResult,
            createdAt: new Date(),
        };

        const existingStr = localStorage.getItem(`history_${userId}`);
        const existing = existingStr ? JSON.parse(existingStr) : [];
        existing.unshift(localRecord);
        localStorage.setItem(`history_${userId}`, JSON.stringify(existing));
    }

    return docId;
}

export async function getAnalysisHistory(userId: string): Promise<AnalysisRecord[]> {
    let firestoreRecords: AnalysisRecord[] = [];

    // 1. Try Firebase
    if (db) {
        try {
            const q = query(
                collection(db, ANALYSES_COLLECTION),
                where('userId', '==', userId),
                orderBy('createdAt', 'desc')
            );
            const snapshot = await getDocs(q);
            firestoreRecords = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt.toDate(),
            })) as AnalysisRecord[];
        } catch (e) {
            console.warn('Firestore read failed, falling back to local storage', e);
        }
    }

    // 2. Try Local Storage
    let localRecords: AnalysisRecord[] = [];
    if (typeof window !== 'undefined') {
        const localStr = localStorage.getItem(`history_${userId}`);
        if (localStr) {
            const parsed = JSON.parse(localStr);
            localRecords = parsed.map((item: any) => ({
                ...item,
                createdAt: new Date(item.createdAt)
            }));
        }
    }

    // 3. Merge by ID, Sort by newest
    const mergedObj: Record<string, AnalysisRecord> = {};
    [...firestoreRecords, ...localRecords].forEach(record => {
        mergedObj[record.id] = record;
    });

    return Object.values(mergedObj).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export async function deleteAnalysis(analysisId: string): Promise<void> {
    // 1. Try Firebase
    if (db) {
        try {
            await deleteDoc(doc(db, ANALYSES_COLLECTION, analysisId));
        } catch (e) {
            console.warn('Firestore delete failed.', e);
        }
    }

    // 2. Try Local Storage
    if (typeof window !== 'undefined') {
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('history_')) {
                const existingStr = localStorage.getItem(key);
                if (existingStr) {
                    const existing = JSON.parse(existingStr);
                    const filtered = existing.filter((r: any) => r.id !== analysisId);
                    if (filtered.length !== existing.length) {
                        localStorage.setItem(key, JSON.stringify(filtered));
                        break;
                    }
                }
            }
        }
    }
}
