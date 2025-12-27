'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Login failed');
            }

            // Redirect based on role
            switch (data.user.role) {
                case 'ADMIN':
                    router.push('/admin');
                    break;
                case 'AGENT':
                    router.push('/agent');
                    break;
                case 'CENTER':
                    router.push('/center');
                    break;
                default:
                    router.push('/');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <nav className="navbar">
                <Link href="/" className="nav-brand">Enroller</Link>
            </nav>

            <main className="container flex-center" style={{ flex: 1 }}>
                <div className="card fade-in rainbow-glow" style={{
                    maxWidth: '440px',
                    width: '100%',
                    position: 'relative',
                    overflow: 'visible'
                }}>
                    {/* Decorative glow */}
                    <div style={{
                        position: 'absolute',
                        top: '-50%',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '300px',
                        height: '300px',
                        background: 'radial-gradient(circle, rgba(124, 58, 237, 0.3) 0%, transparent 70%)',
                        pointerEvents: 'none',
                        zIndex: -1
                    }} />

                    <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-xl)' }}>
                        <div style={{
                            width: '60px',
                            height: '60px',
                            background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
                            borderRadius: '1rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto var(--spacing-lg)',
                            fontSize: '1.5rem',
                            boxShadow: '0 0 40px rgba(124, 58, 237, 0.4)'
                        }}>
                            🔐
                        </div>
                        <h1 style={{
                            marginBottom: 'var(--spacing-sm)',
                            background: 'linear-gradient(135deg, var(--text-primary) 0%, var(--primary-light) 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text'
                        }}>Welcome Back</h1>
                        <p>Sign in to your account</p>
                    </div>

                    {error && (
                        <div className="alert alert-error">{error}</div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="email">Email Address</label>
                            <input
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary ripple"
                            style={{ width: '100%', marginTop: 'var(--spacing-md)', padding: '1rem' }}
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="flex-center gap-sm">
                                    <span className="spinner" style={{ width: '20px', height: '20px' }}></span>
                                    Signing in...
                                </span>
                            ) : (
                                'Sign In →'
                            )}
                        </button>
                    </form>

                    {/* Contact admin for account */}
                    <div style={{ textAlign: 'center', marginTop: 'var(--spacing-xl)' }}>
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                            Need an account? Contact your administrator.
                        </p>
                    </div>

                    {/* Demo credentials */}
                    <div style={{
                        marginTop: 'var(--spacing-xl)',
                        padding: 'var(--spacing-lg)',
                        background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.1) 0%, rgba(6, 182, 212, 0.05) 100%)',
                        borderRadius: 'var(--radius-lg)',
                        border: '1px solid rgba(124, 58, 237, 0.2)'
                    }}>
                        <p style={{ fontWeight: 700, marginBottom: 'var(--spacing-md)', color: 'var(--primary-light)', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            ✨ Demo Accounts
                        </p>
                        <div style={{ display: 'grid', gap: 'var(--spacing-sm)', fontSize: '0.875rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: 'var(--text-muted)' }}>Admin:</span>
                                <span style={{ color: 'var(--text-primary)' }}>admin@edman.com</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: 'var(--text-muted)' }}>Agent:</span>
                                <span style={{ color: 'var(--text-primary)' }}>agent@edman.com</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: 'var(--text-muted)' }}>Center:</span>
                                <span style={{ color: 'var(--text-primary)' }}>center@edman.com</span>
                            </div>
                            <div style={{ marginTop: 'var(--spacing-sm)', paddingTop: 'var(--spacing-sm)', borderTop: '1px solid var(--border-color)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: 'var(--text-muted)' }}>Password:</span>
                                    <code style={{
                                        background: 'rgba(16, 185, 129, 0.2)',
                                        padding: '0.25rem 0.5rem',
                                        borderRadius: '0.25rem',
                                        color: 'var(--success-light)',
                                        fontFamily: 'monospace'
                                    }}>admin123</code>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
