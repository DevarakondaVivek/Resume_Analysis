'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { signInWithGoogle, signInWithEmail, signUpWithEmail, signOut } from '@/lib/auth';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    signInWithGoogle: () => Promise<{ error: string | null }>;
    signInWithEmail: (email: string, password: string) => Promise<{ error: string | null }>;
    signUpWithEmail: (email: string, password: string, displayName: string) => Promise<{ error: string | null }>;
    signOut: () => Promise<{ error: string | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!auth) {
            setLoading(false);
            return;
        }

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const handleSignInWithGoogle = async () => {
        const result = await signInWithGoogle();
        return { error: result.error };
    };

    const handleSignInWithEmail = async (email: string, password: string) => {
        const result = await signInWithEmail(email, password);
        return { error: result.error };
    };

    const handleSignUpWithEmail = async (email: string, password: string, displayName: string) => {
        const result = await signUpWithEmail(email, password, displayName);
        return { error: result.error };
    };

    const handleSignOut = async () => {
        const result = await signOut();
        return result;
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                signInWithGoogle: handleSignInWithGoogle,
                signInWithEmail: handleSignInWithEmail,
                signUpWithEmail: handleSignUpWithEmail,
                signOut: handleSignOut,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
