'use client';

import { useState, useEffect } from 'react';

interface Lead {
    id: string;
    studentName: string;
    phone: string;
    email?: string;
    status: string;
    createdAt: string;
    course?: { name: string; fee: number };
    agent?: { name: string };
    center?: { name: string };
}

const STATUSES = ['NEW', 'CONTACTED', 'INTERESTED', 'ENROLLED', 'CLOSED', 'LOST'];

export default function AdminLeadsPage() {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('ALL');

    useEffect(() => {
        fetchLeads();
    }, []);

    const fetchLeads = async () => {
        try {
            const res = await fetch('/api/leads');
            if (res.ok) {
                const data = await res.json();
                setLeads(data.leads);
            }
        } catch (err) {
            console.error('Failed to fetch leads:', err);
        } finally {
            setLoading(false);
        }
    };

    const filteredLeads = filter === 'ALL' ? leads : leads.filter(l => l.status === filter);

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
                <h1 className="page-title">All Leads</h1>
                <p className="page-subtitle">Complete overview of all leads in the system</p>
            </div>

            {/* Stats */}
            <div className="grid grid-4" style={{ marginBottom: 'var(--spacing-xl)' }}>
                <div className="stat-card">
                    <div className="stat-value">{leads.length}</div>
                    <div className="stat-label">Total Leads</div>
                </div>
                <div className="stat-card">
                    <div className="stat-value" style={{ color: 'var(--primary-light)' }}>
                        {leads.filter(l => l.status === 'NEW').length}
                    </div>
                    <div className="stat-label">New</div>
                </div>
                <div className="stat-card">
                    <div className="stat-value" style={{ color: 'var(--secondary)' }}>
                        {leads.filter(l => ['ENROLLED', 'CLOSED'].includes(l.status)).length}
                    </div>
                    <div className="stat-label">Converted</div>
                </div>
                <div className="stat-card">
                    <div className="stat-value">
                        {leads.length > 0
                            ? ((leads.filter(l => ['ENROLLED', 'CLOSED'].includes(l.status)).length / leads.length) * 100).toFixed(1)
                            : 0}%
                    </div>
                    <div className="stat-label">Conversion Rate</div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex gap-sm" style={{ marginBottom: 'var(--spacing-xl)', flexWrap: 'wrap' }}>
                <button
                    className={`btn btn-sm ${filter === 'ALL' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setFilter('ALL')}
                >
                    All ({leads.length})
                </button>
                {STATUSES.map(status => (
                    <button
                        key={status}
                        className={`btn btn-sm ${filter === status ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => setFilter(status)}
                    >
                        {status} ({leads.filter(l => l.status === status).length})
                    </button>
                ))}
            </div>

            {/* Leads Table */}
            <div className="card">
                {filteredLeads.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-state-icon">📋</div>
                        <p>No leads found</p>
                    </div>
                ) : (
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Student</th>
                                    <th>Contact</th>
                                    <th>Course</th>
                                    <th>Agent</th>
                                    <th>Center</th>
                                    <th>Status</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredLeads.map(lead => (
                                    <tr key={lead.id}>
                                        <td style={{ fontWeight: 500 }}>{lead.studentName}</td>
                                        <td>
                                            <div>{lead.phone}</div>
                                            {lead.email && (
                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                                    {lead.email}
                                                </div>
                                            )}
                                        </td>
                                        <td>
                                            <div>{lead.course?.name || 'N/A'}</div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--secondary)' }}>
                                                ₹{lead.course?.fee?.toLocaleString() || 'N/A'}
                                            </div>
                                        </td>
                                        <td>{lead.agent?.name || 'N/A'}</td>
                                        <td>{lead.center?.name || 'N/A'}</td>
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
