'use client';

import { useState, useEffect } from 'react';

interface Payout {
    id: string;
    totalAmount: number;
    status: string;
    requestedAt: string;
    approvedAt?: string;
    paidAt?: string;
    notes?: string;
    agent?: { id: string; name: string; email: string };
}

export default function AdminPayoutsPage() {
    const [payouts, setPayouts] = useState<Payout[]>([]);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState<string | null>(null);
    const [filter, setFilter] = useState('ALL');

    useEffect(() => {
        fetchPayouts();
    }, []);

    const fetchPayouts = async () => {
        try {
            console.log('Fetching payouts...');
            const res = await fetch('/api/payouts');
            console.log('Fetch payouts response status:', res.status);

            if (res.ok) {
                const data = await res.json();
                console.log('Fetch payouts data:', data);
                setPayouts(data.payouts);
            } else {
                const errData = await res.json().catch(() => ({}));
                console.error('Fetch payouts failed:', errData);
                // Optional: alert('Failed to fetch payouts');
            }
        } catch (err) {
            console.error('Failed to fetch payouts:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (payoutId: string, action: 'APPROVE' | 'REJECT' | 'MARK_PAID') => {
        setProcessing(payoutId);
        try {
            const res = await fetch(`/api/payouts/${payoutId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action }),
            });

            if (res.ok) {
                fetchPayouts();
            } else {
                const data = await res.json();
                alert(data.error || 'Failed to process payout');
            }
        } catch (err) {
            alert('Failed to process payout');
        } finally {
            setProcessing(null);
        }
    };

    const filteredPayouts = filter === 'ALL'
        ? payouts
        : payouts.filter(p => p.status === filter);

    const totals = {
        requested: payouts.filter(p => p.status === 'REQUESTED').reduce((sum, p) => sum + p.totalAmount, 0),
        approved: payouts.filter(p => p.status === 'APPROVED').reduce((sum, p) => sum + p.totalAmount, 0),
        paid: payouts.filter(p => p.status === 'PAID').reduce((sum, p) => sum + p.totalAmount, 0),
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
                <h1 className="page-title">Payout Management</h1>
                <p className="page-subtitle">Review and process agent payout requests</p>
            </div>

            {/* Stats */}
            <div className="grid grid-4" style={{ marginBottom: 'var(--spacing-xl)' }}>
                <div className="stat-card">
                    <div className="stat-value">{payouts.length}</div>
                    <div className="stat-label">Total Requests</div>
                </div>
                <div className="stat-card">
                    <div className="stat-value" style={{ color: 'var(--accent)' }}>
                        ₹{totals.requested.toLocaleString()}
                    </div>
                    <div className="stat-label">Pending Review</div>
                </div>
                <div className="stat-card">
                    <div className="stat-value" style={{ color: 'var(--primary-light)' }}>
                        ₹{totals.approved.toLocaleString()}
                    </div>
                    <div className="stat-label">Approved (Unpaid)</div>
                </div>
                <div className="stat-card">
                    <div className="stat-value" style={{ color: 'var(--secondary)' }}>
                        ₹{totals.paid.toLocaleString()}
                    </div>
                    <div className="stat-label">Total Paid</div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex gap-sm" style={{ marginBottom: 'var(--spacing-xl)' }}>
                {['ALL', 'REQUESTED', 'APPROVED', 'PAID', 'REJECTED'].map(status => (
                    <button
                        key={status}
                        className={`btn btn-sm ${filter === status ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => setFilter(status)}
                    >
                        {status} ({payouts.filter(p => status === 'ALL' || p.status === status).length})
                    </button>
                ))}
            </div>

            {/* Payouts Table */}
            <div className="card">
                {filteredPayouts.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-state-icon">💳</div>
                        <p>No payout requests {filter !== 'ALL' ? `with status "${filter}"` : ''}</p>
                    </div>
                ) : (
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Agent</th>
                                    <th>Amount</th>
                                    <th>Status</th>
                                    <th>Requested</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredPayouts.map(payout => (
                                    <tr key={payout.id}>
                                        <td>
                                            <div style={{ fontWeight: 500 }}>{payout.agent?.name || 'Unknown'}</div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                                {payout.agent?.email}
                                            </div>
                                        </td>
                                        <td style={{ fontWeight: 600, color: 'var(--secondary)', fontSize: '1.125rem' }}>
                                            ₹{payout.totalAmount.toLocaleString()}
                                        </td>
                                        <td>
                                            <span className={`badge badge-${payout.status.toLowerCase()}`}>
                                                {payout.status}
                                            </span>
                                        </td>
                                        <td style={{ color: 'var(--text-muted)' }}>
                                            {payout.requestedAt && !isNaN(new Date(payout.requestedAt).getTime())
                                                ? new Date(payout.requestedAt).toLocaleDateString()
                                                : 'N/A'}
                                        </td>
                                        <td>
                                            <div className="flex gap-sm">
                                                {payout.status === 'REQUESTED' && (
                                                    <>
                                                        <button
                                                            onClick={() => handleAction(payout.id, 'APPROVE')}
                                                            className="btn btn-success btn-sm"
                                                            disabled={processing === payout.id}
                                                        >
                                                            Approve
                                                        </button>
                                                        <button
                                                            onClick={() => handleAction(payout.id, 'REJECT')}
                                                            className="btn btn-danger btn-sm"
                                                            disabled={processing === payout.id}
                                                        >
                                                            Reject
                                                        </button>
                                                    </>
                                                )}
                                                {payout.status === 'APPROVED' && (
                                                    <button
                                                        onClick={() => handleAction(payout.id, 'MARK_PAID')}
                                                        className="btn btn-primary btn-sm"
                                                        disabled={processing === payout.id}
                                                    >
                                                        Mark as Paid
                                                    </button>
                                                )}
                                                {payout.status === 'PAID' && (
                                                    <span style={{ color: 'var(--secondary)', fontSize: '0.875rem' }}>
                                                        ✓ Completed
                                                    </span>
                                                )}
                                                {payout.status === 'REJECTED' && (
                                                    <span style={{ color: 'var(--danger)', fontSize: '0.875rem' }}>
                                                        ✗ Rejected
                                                    </span>
                                                )}
                                            </div>
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
