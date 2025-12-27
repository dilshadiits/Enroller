'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Lead {
    id: string;
    status: string;
    createdAt: string;
}

interface Payout {
    id: string;
    status: string;
    totalAmount: number;
}

interface User {
    id: string;
    role: string;
}

export default function AdminDashboard() {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [payouts, setPayouts] = useState<Payout[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [leadsRes, payoutsRes, usersRes] = await Promise.all([
                fetch('/api/leads'),
                fetch('/api/payouts'),
                fetch('/api/users'),
            ]);

            if (leadsRes.ok) {
                const data = await leadsRes.json();
                setLeads(data.leads);
            }

            if (payoutsRes.ok) {
                const data = await payoutsRes.json();
                setPayouts(data.payouts);
            }

            if (usersRes.ok) {
                const data = await usersRes.json();
                setUsers(data.users);
            }
        } catch (err) {
            console.error('Failed to fetch data:', err);
        } finally {
            setLoading(false);
        }
    };

    const getStatusCount = (status: string) =>
        leads.filter(l => l.status === status).length;

    const pendingPayouts = payouts.filter(p => p.status === 'REQUESTED');
    const pendingPayoutTotal = pendingPayouts.reduce((sum, p) => sum + p.totalAmount, 0);

    const agentCount = users.filter(u => u.role === 'AGENT').length;
    const centerCount = users.filter(u => u.role === 'CENTER').length;

    if (loading) {
        return (
            <div className="flex-center" style={{ padding: '4rem' }}>
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className="fade-in">
            <div className="page-header">
                <h1 className="page-title">Admin Dashboard</h1>
                <p className="page-subtitle">System overview and management</p>
            </div>

            {/* Main Stats */}
            <div className="grid grid-4" style={{ marginBottom: 'var(--spacing-xl)' }}>
                <div className="stat-card">
                    <div className="stat-value">{leads.length}</div>
                    <div className="stat-label">Total Leads</div>
                </div>
                <div className="stat-card">
                    <div className="stat-value" style={{ color: 'var(--primary-light)' }}>{agentCount}</div>
                    <div className="stat-label">Active Agents</div>
                </div>
                <div className="stat-card">
                    <div className="stat-value" style={{ color: 'var(--secondary)' }}>{centerCount}</div>
                    <div className="stat-label">Training Centers</div>
                </div>
                <div className="stat-card">
                    <div className="stat-value" style={{ color: 'var(--accent)' }}>
                        {pendingPayouts.length}
                    </div>
                    <div className="stat-label">Pending Payouts</div>
                </div>
            </div>

            {/* Pending Payouts Alert */}
            {pendingPayouts.length > 0 && (
                <div className="alert alert-warning" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span>
                        ⚠️ You have <strong>{pendingPayouts.length} payout requests</strong> totaling <strong>₹{pendingPayoutTotal.toLocaleString()}</strong>
                    </span>
                    <Link href="/admin/payouts" className="btn btn-primary btn-sm">
                        Review Payouts
                    </Link>
                </div>
            )}

            <div className="grid-dashboard">
                {/* Lead Pipeline */}
                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">Lead Pipeline</h3>
                        <Link href="/admin/leads" className="btn btn-secondary btn-sm">View All</Link>
                    </div>

                    <div className="grid grid-3" style={{ gap: 'var(--spacing-md)' }}>
                        <div style={{
                            padding: 'var(--spacing-md)',
                            background: 'rgba(99, 102, 241, 0.1)',
                            borderRadius: 'var(--radius-md)',
                            textAlign: 'center'
                        }}>
                            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary-light)' }}>
                                {getStatusCount('NEW')}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>NEW</div>
                        </div>

                        <div style={{
                            padding: 'var(--spacing-md)',
                            background: 'rgba(245, 158, 11, 0.1)',
                            borderRadius: 'var(--radius-md)',
                            textAlign: 'center'
                        }}>
                            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--accent)' }}>
                                {getStatusCount('CONTACTED') + getStatusCount('INTERESTED')}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>IN PROGRESS</div>
                        </div>

                        <div style={{
                            padding: 'var(--spacing-md)',
                            background: 'rgba(16, 185, 129, 0.1)',
                            borderRadius: 'var(--radius-md)',
                            textAlign: 'center'
                        }}>
                            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--secondary)' }}>
                                {getStatusCount('ENROLLED') + getStatusCount('CLOSED')}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>CONVERTED</div>
                        </div>
                    </div>

                    <div style={{ marginTop: 'var(--spacing-lg)' }}>
                        <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: 'var(--spacing-sm)' }}>
                            Conversion Rate
                        </div>
                        <div className="progress-bar" style={{ height: '12px' }}>
                            <div
                                className="progress-fill"
                                style={{
                                    width: leads.length > 0
                                        ? `${((getStatusCount('ENROLLED') + getStatusCount('CLOSED')) / leads.length) * 100}%`
                                        : '0%'
                                }}
                            />
                        </div>
                        <div style={{ textAlign: 'right', marginTop: 'var(--spacing-xs)', fontSize: '0.875rem', fontWeight: 600 }}>
                            {leads.length > 0
                                ? (((getStatusCount('ENROLLED') + getStatusCount('CLOSED')) / leads.length) * 100).toFixed(1)
                                : 0}%
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="card">
                    <h3 className="card-title" style={{ marginBottom: 'var(--spacing-lg)' }}>Quick Actions</h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                        <Link href="/admin/users" className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>
                            👥 Manage Users
                        </Link>
                        <Link href="/admin/payouts" className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>
                            💳 Process Payouts
                        </Link>
                        <Link href="/admin/courses" className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>
                            📚 Manage Courses
                        </Link>
                        <Link href="/admin/leads" className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>
                            📋 View All Leads
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
