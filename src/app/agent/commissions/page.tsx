'use client';

import { useState, useEffect } from 'react';

interface Commission {
    id: string;
    amount: number;
    status: string;
    createdAt: string;
    lead?: { id: string; studentName: string };
    course?: { name: string; fee: number };
}

interface Payout {
    id: string;
    totalAmount: number;
    status: string;
    requestedAt: string;
    paidAt?: string;
}

export default function AgentCommissionsPage() {
    const [commissions, setCommissions] = useState<Commission[]>([]);
    const [payouts, setPayouts] = useState<Payout[]>([]);
    const [totals, setTotals] = useState({ total: 0, pending: 0, approved: 0, paid: 0 });
    const [selectedCommissions, setSelectedCommissions] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [commissionsRes, payoutsRes] = await Promise.all([
                fetch('/api/commissions'),
                fetch('/api/payouts'),
            ]);

            if (commissionsRes.ok) {
                const data = await commissionsRes.json();
                setCommissions(data.commissions);
                setTotals(data.totals);
            }

            if (payoutsRes.ok) {
                const data = await payoutsRes.json();
                setPayouts(data.payouts);
            }
        } catch (err) {
            console.error('Failed to fetch data:', err);
        } finally {
            setLoading(false);
        }
    };

    const toggleCommission = (id: string) => {
        setSelectedCommissions(prev =>
            prev.includes(id)
                ? prev.filter(c => c !== id)
                : [...prev, id]
        );
    };

    const selectAllPending = () => {
        const pendingIds = commissions
            .filter(c => c.status === 'PENDING')
            .map(c => c.id);
        setSelectedCommissions(pendingIds);
    };

    const requestPayout = async () => {
        if (selectedCommissions.length === 0) return;

        setSubmitting(true);
        try {
            const res = await fetch('/api/payouts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ commissionIds: selectedCommissions }),
            });

            if (res.ok) {
                setSelectedCommissions([]);
                fetchData();
                alert('Payout request submitted successfully!');
            } else {
                const data = await res.json();
                alert(data.error || 'Failed to submit payout request');
            }
        } catch (err) {
            alert('Failed to submit payout request');
        } finally {
            setSubmitting(false);
        }
    };

    const selectedTotal = commissions
        .filter(c => selectedCommissions.includes(c.id))
        .reduce((sum, c) => sum + c.amount, 0);

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
                <h1 className="page-title">Commissions</h1>
                <p className="page-subtitle">Track your earnings and request payouts</p>
            </div>

            {/* Earnings Summary */}
            <div className="grid grid-4" style={{ marginBottom: 'var(--spacing-xl)' }}>
                <div className="stat-card">
                    <div className="stat-value">₹{totals.total.toLocaleString()}</div>
                    <div className="stat-label">Total Earned</div>
                </div>
                <div className="stat-card">
                    <div className="stat-value" style={{ color: 'var(--accent)' }}>
                        ₹{totals.pending.toLocaleString()}
                    </div>
                    <div className="stat-label">Available for Payout</div>
                </div>
                <div className="stat-card">
                    <div className="stat-value" style={{ color: 'var(--primary-light)' }}>
                        ₹{totals.approved.toLocaleString()}
                    </div>
                    <div className="stat-label">Processing</div>
                </div>
                <div className="stat-card">
                    <div className="stat-value" style={{ color: 'var(--secondary)' }}>
                        ₹{totals.paid.toLocaleString()}
                    </div>
                    <div className="stat-label">Paid Out</div>
                </div>
            </div>

            <div className="grid" style={{ gridTemplateColumns: '2fr 1fr', gap: 'var(--spacing-xl)' }}>
                {/* Commission List */}
                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">Commission History</h3>
                        {commissions.some(c => c.status === 'PENDING') && (
                            <button onClick={selectAllPending} className="btn btn-secondary btn-sm">
                                Select All Pending
                            </button>
                        )}
                    </div>

                    {commissions.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-state-icon">💰</div>
                            <p>No commissions yet. Earn by closing leads!</p>
                        </div>
                    ) : (
                        <div className="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th style={{ width: '40px' }}></th>
                                        <th>Student</th>
                                        <th>Course</th>
                                        <th>Amount</th>
                                        <th>Status</th>
                                        <th>Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {commissions.map(commission => (
                                        <tr key={commission.id}>
                                            <td>
                                                {commission.status === 'PENDING' && (
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedCommissions.includes(commission.id)}
                                                        onChange={() => toggleCommission(commission.id)}
                                                        style={{ cursor: 'pointer' }}
                                                    />
                                                )}
                                            </td>
                                            <td style={{ fontWeight: 500 }}>
                                                {commission.lead?.studentName || 'N/A'}
                                            </td>
                                            <td>{commission.course?.name || 'N/A'}</td>
                                            <td style={{ fontWeight: 600, color: 'var(--secondary)' }}>
                                                ₹{commission.amount.toLocaleString()}
                                            </td>
                                            <td>
                                                <span className={`badge badge-${commission.status.toLowerCase()}`}>
                                                    {commission.status}
                                                </span>
                                            </td>
                                            <td style={{ color: 'var(--text-muted)' }}>
                                                {new Date(commission.createdAt).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Payout Request Panel */}
                <div>
                    <div className="card" style={{ marginBottom: 'var(--spacing-lg)' }}>
                        <h3 style={{ marginBottom: 'var(--spacing-lg)' }}>Request Payout</h3>

                        <div style={{
                            padding: 'var(--spacing-lg)',
                            background: 'var(--bg-tertiary)',
                            borderRadius: 'var(--radius-md)',
                            marginBottom: 'var(--spacing-lg)'
                        }}>
                            <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                                Selected Amount
                            </div>
                            <div className="commission-amount">
                                ₹{selectedTotal.toLocaleString()}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 'var(--spacing-sm)' }}>
                                {selectedCommissions.length} commission(s) selected
                            </div>
                        </div>

                        <button
                            onClick={requestPayout}
                            className="btn btn-success"
                            style={{ width: '100%' }}
                            disabled={selectedCommissions.length === 0 || submitting}
                        >
                            {submitting ? 'Submitting...' : 'Request Payout'}
                        </button>
                    </div>

                    {/* Payout History */}
                    <div className="card">
                        <h3 style={{ marginBottom: 'var(--spacing-lg)' }}>Payout History</h3>

                        {payouts.length === 0 ? (
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                                No payout requests yet
                            </p>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                                {payouts.slice(0, 5).map(payout => (
                                    <div
                                        key={payout.id}
                                        style={{
                                            padding: 'var(--spacing-md)',
                                            background: 'var(--bg-tertiary)',
                                            borderRadius: 'var(--radius-md)'
                                        }}
                                    >
                                        <div className="flex-between">
                                            <span style={{ fontWeight: 600 }}>
                                                ₹{payout.totalAmount.toLocaleString()}
                                            </span>
                                            <span className={`badge badge-${payout.status.toLowerCase()}`}>
                                                {payout.status}
                                            </span>
                                        </div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 'var(--spacing-xs)' }}>
                                            Requested: {new Date(payout.requestedAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
