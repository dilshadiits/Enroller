'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
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
        <div>
            {error && (
                <div className="alert alert-error" style={{ marginBottom: '1rem' }}>{error}</div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="email" style={{ color: '#44403c' }}>Email Address</label>
                    <input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        style={{
                            background: 'white',
                            border: '1px solid #d6d3d1',
                            color: '#1c1917'
                        }}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="password" style={{ color: '#44403c' }}>Password</label>
                    <input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                        style={{
                            background: 'white',
                            border: '1px solid #d6d3d1',
                            color: '#1c1917'
                        }}
                    />
                </div>

                <button
                    type="submit"
                    className="btn btn-primary ripple"
                    style={{
                        width: '100%',
                        padding: '1rem',
                        marginTop: '0.5rem'
                    }}
                    disabled={loading}
                >
                    {loading ? 'Signing in...' : 'Sign In →'}
                </button>
            </form>


        </div>
    );
}
