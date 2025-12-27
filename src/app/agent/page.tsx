'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Lead {
    id: string;
    studentName: string;
    status: string;
    createdAt: string;
    course?: { name: string };
}

interface CommissionTotals {
    total: number;
    pending: number;
    paid: number;
}

export default function AgentDashboard() {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [commissionTotals, setCommissionTotals] = useState<CommissionTotals>({ total: 0, pending: 0, paid: 0 });
    const [loading, setLoading] = useState(true);
    const [agentId, setAgentId] = useState('');
    const [origin, setOrigin] = useState('');

    useEffect(() => {
        setOrigin(window.location.origin);
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [leadsRes, commissionsRes, meRes] = await Promise.all([
                fetch('/api/leads'),
                fetch('/api/commissions'),
                fetch('/api/auth/me'),
            ]);

            if (leadsRes.ok) {
                const leadsData = await leadsRes.json();
                setLeads(leadsData.leads);
            }

            if (commissionsRes.ok) {
                const commissionsData = await commissionsRes.json();
                setCommissionTotals(commissionsData.totals);
            }

            if (meRes.ok) {
                const meData = await meRes.json();
                setAgentId(meData.user.id);
            }
        } catch (err) {
            console.error('Failed to fetch data:', err);
        } finally {
            setLoading(false);
        }
    };

    const getStatusCount = (status: string) =>
        leads.filter(l => l.status === status).length;

    const copyLink = () => {
        const link = `${window.location.origin}/collect/${agentId}`;
        navigator.clipboard.writeText(link);
        alert('Link copied to clipboard!');
    };

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
                <h1 className="page-title">Agent Dashboard</h1>
                <p className="page-subtitle">Track your leads and earnings</p>
            </div>

            {/* Referral Link */}
            <div className="card" style={{ marginBottom: 'var(--spacing-xl)', borderLeft: '3px solid var(--primary)' }}>
                <div className="flex-between" style={{ flexWrap: 'wrap', gap: 'var(--spacing-md)' }}>
                    <div>
                        <h4 style={{ marginBottom: 'var(--spacing-sm)' }}>Your Referral Link</h4>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                            Share this link to collect leads
                        </p>
                    </div>
                    <div className="url-input-group">
                        <input
                            type="text"
                            value={agentId && origin ? `${origin}/collect/${agentId}` : ''}
                            readOnly
                            style={{ maxWidth: '400px' }}
                        />
                        <button onClick={copyLink} className="btn btn-primary btn-sm">
                            📋 Copy
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-4" style={{ marginBottom: 'var(--spacing-xl)' }}>
                <div className="stat-card">
                    <div className="stat-value">{leads.length}</div>
                    <div className="stat-label">Total Leads</div>
                </div>
                <div className="stat-card">
                    <div className="stat-value" style={{ color: 'var(--primary-light)' }}>
                        {getStatusCount('NEW') + getStatusCount('CONTACTED') + getStatusCount('INTERESTED')}
                    </div>
                    <div className="stat-label">Active Leads</div>
                </div>
                <div className="stat-card">
                    <div className="stat-value" style={{ color: 'var(--secondary)' }}>
                        {getStatusCount('ENROLLED') + getStatusCount('CLOSED')}
                    </div>
                    <div className="stat-label">Conversions</div>
                </div>
                <div className="stat-card">
                    <div className="stat-value">₹{commissionTotals.total.toLocaleString()}</div>
                    <div className="stat-label">Total Earnings</div>
                </div>
            </div>

            {/* Commission Overview */}
            <div className="grid grid-3" style={{ marginBottom: 'var(--spacing-xl)' }}>
                <div className="card" style={{ borderTop: '3px solid var(--accent)' }}>
                    <h4 style={{ color: 'var(--accent)', marginBottom: 'var(--spacing-sm)' }}>Pending</h4>
                    <div className="commission-amount">₹{commissionTotals.pending.toLocaleString()}</div>
                    <p style={{ fontSize: '0.875rem', marginTop: 'var(--spacing-sm)' }}>Awaiting payout</p>
                </div>
                <div className="card" style={{ borderTop: '3px solid var(--secondary)' }}>
                    <h4 style={{ color: 'var(--secondary)', marginBottom: 'var(--spacing-sm)' }}>Paid</h4>
                    <div className="commission-amount" style={{ color: 'var(--secondary)' }}>
                        ₹{commissionTotals.paid.toLocaleString()}
                    </div>
                    <p style={{ fontSize: '0.875rem', marginTop: 'var(--spacing-sm)' }}>Successfully withdrawn</p>
                </div>
                <div className="card" style={{ borderTop: '3px solid var(--primary)' }}>
                    <Link href="/agent/commissions" className="btn btn-primary" style={{ width: '100%' }}>
                        💰 Request Payout
                    </Link>
                </div>
            </div>

            {/* Recent Leads */}
            <div className="card">
                <div className="card-header">
                    <h3 className="card-title">Recent Leads</h3>
                    <Link href="/agent/leads" className="btn btn-secondary btn-sm">View All</Link>
                </div>

                {leads.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-state-icon">👥</div>
                        <p>No leads yet. Share your referral link to start collecting!</p>
                        <Link href="/agent/collect" className="btn btn-primary" style={{ marginTop: 'var(--spacing-lg)' }}>
                            ➕ Add Your First Lead
                        </Link>
                    </div>
                ) : (
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Student Name</th>
                                    <th>Course</th>
                                    <th>Status</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {leads.slice(0, 5).map(lead => (
                                    <tr key={lead.id}>
                                        <td style={{ fontWeight: 500 }}>{lead.studentName}</td>
                                        <td>{lead.course?.name || 'N/A'}</td>
                                        <td>
                                            <span className={`badge badge-${lead.status.toLowerCase()}`}>
                                                {lead.status}
                                            </span>
                                        </td>
                                        <td style={{ color: 'var(--text-muted)' }}>
                                            {new Date(lead.createdAt).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
