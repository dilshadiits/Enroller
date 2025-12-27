'use client';

import { useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

interface AdminLayoutProps {
    children: ReactNode;
}

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    const router = useRouter();
    const pathname = usePathname();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await fetch('/api/auth/me');
                if (res.ok) {
                    const data = await res.json();
                    if (data.user.role !== 'ADMIN') {
                        router.push('/login');
                        return;
                    }
                    setUser(data.user);
                } else {
                    router.push('/login');
                }
            } catch {
                router.push('/login');
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/login');
    };

    if (loading) {
        return (
            <div className="flex-center" style={{ minHeight: '100vh' }}>
                <div className="spinner"></div>
            </div>
        );
    }

    const navLinks = [
        { href: '/admin', label: 'Dashboard', icon: '📊' },
        { href: '/admin/users', label: 'Users', icon: '👥' },
        { href: '/admin/leads', label: 'All Leads', icon: '📋' },
        { href: '/admin/payouts', label: 'Payouts', icon: '💳' },
        { href: '/admin/courses', label: 'Courses', icon: '📚' },
    ];

    return (
        <div>
            <nav className="navbar">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <button
                        className="mobile-menu-btn"
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        aria-label="Toggle menu"
                    >
                        {sidebarOpen ? '✕' : '☰'}
                    </button>
                    <Link href="/admin" className="nav-brand">Enroller</Link>
                </div>
                <div className="nav-links">
                    <span style={{ color: 'var(--text-secondary)' }}>
                        {user?.name}
                    </span>
                    <span className="badge badge-contacted">Admin</span>
                    <button onClick={handleLogout} className="btn btn-secondary btn-sm">
                        Logout
                    </button>
                </div>
                {/* Mobile logout button */}
                <button
                    onClick={handleLogout}
                    className="mobile-menu-btn"
                    style={{ display: 'none' }}
                    aria-label="Logout"
                >
                    🚪
                </button>
            </nav>

            {/* Mobile sidebar overlay */}
            <div
                className={`sidebar-overlay ${sidebarOpen ? 'active' : ''}`}
                onClick={() => setSidebarOpen(false)}
            />

            <div className="app-layout">
                <aside className={`sidebar ${sidebarOpen ? 'mobile-open' : ''}`}>
                    {navLinks.map(link => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`sidebar-link ${pathname === link.href ? 'active' : ''}`}
                            onClick={() => setSidebarOpen(false)}
                        >
                            <span>{link.icon}</span>
                            <span>{link.label}</span>
                        </Link>
                    ))}
                    {/* Mobile-only user info and logout in sidebar */}
                    <div className="mobile-sidebar-footer" style={{
                        marginTop: 'auto',
                        paddingTop: '2rem',
                        borderTop: '1px solid var(--border-color)',
                        display: 'none'
                    }}>
                        <div style={{
                            padding: '1rem',
                            color: 'var(--text-secondary)',
                            fontSize: '0.875rem'
                        }}>
                            {user?.name}
                        </div>
                        <button
                            onClick={handleLogout}
                            className="btn btn-secondary"
                            style={{ width: '100%' }}
                        >
                            Logout
                        </button>
                    </div>
                </aside>

                <main className="main-content">
                    {children}
                </main>
            </div>

            <style jsx>{`
                @media (max-width: 768px) {
                    .mobile-sidebar-footer {
                        display: block !important;
                    }
                }
            `}</style>
        </div>
    );
}

