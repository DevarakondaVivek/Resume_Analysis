'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, History, LogOut, Sparkles } from 'lucide-react';

export default function Navbar() {
    const { user, signOut } = useAuth();
    const pathname = usePathname();

    if (!user) return null;

    return (
        <nav className="navbar">
            <div className="navbar-inner">
                <Link href="/dashboard" className="navbar-brand">
                    <Sparkles size={24} />
                    <span>AI Powered Resume Analysis</span>
                </Link>

                <div className="navbar-links">
                    <Link
                        href="/dashboard"
                        className={`nav-link ${pathname === '/dashboard' ? 'active' : ''}`}
                    >
                        <LayoutDashboard size={18} />
                        <span>Dashboard</span>
                    </Link>
                    <Link
                        href="/history"
                        className={`nav-link ${pathname === '/history' ? 'active' : ''}`}
                    >
                        <History size={18} />
                        <span>History</span>
                    </Link>
                </div>

                <div className="navbar-user">
                    <div className="user-avatar">
                        {user.photoURL ? (
                            <img src={user.photoURL} alt={user.displayName || 'User'} />
                        ) : (
                            <span>{(user.displayName || user.email || 'U')[0].toUpperCase()}</span>
                        )}
                    </div>
                    <span className="user-name">{user.displayName || user.email}</span>
                    <button className="btn btn-ghost" onClick={signOut} title="Sign Out">
                        <LogOut size={18} />
                    </button>
                </div>
            </div>
        </nav>
    );
}
