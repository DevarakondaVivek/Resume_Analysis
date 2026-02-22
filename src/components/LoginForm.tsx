'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { LogIn, Mail, Lock, User, Chrome, AlertCircle } from 'lucide-react';

export default function LoginForm() {
    const { signInWithGoogle, signInWithEmail, signUpWithEmail } = useAuth();
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleGoogleSignIn = async () => {
        setLoading(true);
        setError(null);
        const result = await signInWithGoogle();
        if (result.error) setError(result.error);
        setLoading(false);
    };

    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        let result;
        if (isSignUp) {
            result = await signUpWithEmail(email, password, displayName);
        } else {
            result = await signInWithEmail(email, password);
        }

        if (result.error) setError(result.error);
        setLoading(false);
    };

    if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY || process.env.NEXT_PUBLIC_FIREBASE_API_KEY === 'your_api_key') {
        return (
            <div className="login-card p-6 text-center space-y-4">
                <div className="inline-flex w-16 h-16 bg-amber-50 rounded-full items-center justify-center text-amber-500 mb-2">
                    <AlertCircle size={32} />
                </div>
                <h2 className="text-xl font-bold text-neutral-900">Setup Required</h2>
                <p className="text-neutral-600 text-sm">
                    Firebase is not configured. Please add your Firebase credentials to the <code className="bg-neutral-100 px-1 py-0.5 rounded text-red-500">.env.local</code> file to enable authentication.
                </p>
            </div>
        );
    }

    return (
        <div className="login-card">
            <div className="login-header">
                <div className="login-icon">
                    <LogIn size={28} />
                </div>
                <h2>{isSignUp ? 'Create Account' : 'Welcome Back'}</h2>
                <p>{isSignUp ? 'Start optimizing your resume today' : 'Sign in to continue your analysis'}</p>
            </div>

            <button
                className="btn btn-google"
                onClick={handleGoogleSignIn}
                disabled={loading}
            >
                <Chrome size={20} />
                Continue with Google
            </button>

            <div className="divider">
                <span>or</span>
            </div>

            <form onSubmit={handleEmailSubmit} className="login-form">
                {isSignUp && (
                    <div className="input-group">
                        <User size={18} className="input-icon" />
                        <input
                            type="text"
                            placeholder="Full Name"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            required
                        />
                    </div>
                )}

                <div className="input-group">
                    <Mail size={18} className="input-icon" />
                    <input
                        type="email"
                        placeholder="Email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className="input-group">
                    <Lock size={18} className="input-icon" />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={6}
                    />
                </div>

                {error && <div className="error-message">{error}</div>}

                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Please wait...' : isSignUp ? 'Create Account' : 'Sign In'}
                </button>
            </form>

            <p className="toggle-auth">
                {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                <button
                    type="button"
                    className="link-btn"
                    onClick={() => {
                        setIsSignUp(!isSignUp);
                        setError(null);
                    }}
                >
                    {isSignUp ? 'Sign In' : 'Sign Up'}
                </button>
            </p>
        </div>
    );
}
