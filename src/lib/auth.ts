import {
    signInWithPopup,
    GoogleAuthProvider,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut as firebaseSignOut,
    updateProfile,
} from 'firebase/auth';
import { auth } from './firebase';

const googleProvider = new GoogleAuthProvider();

export async function signInWithGoogle() {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        return { user: result.user, error: null };
    } catch (error) {
        return { user: null, error: (error as Error).message };
    }
}

export async function signInWithEmail(email: string, password: string) {
    try {
        const result = await signInWithEmailAndPassword(auth, email, password);
        return { user: result.user, error: null };
    } catch (error) {
        return { user: null, error: (error as Error).message };
    }
}

export async function signUpWithEmail(email: string, password: string, displayName: string) {
    try {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(result.user, { displayName });
        return { user: result.user, error: null };
    } catch (error) {
        return { user: null, error: (error as Error).message };
    }
}

export async function signOut() {
    try {
        await firebaseSignOut(auth);
        return { error: null };
    } catch (error) {
        return { error: (error as Error).message };
    }
}
