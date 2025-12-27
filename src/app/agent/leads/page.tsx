'use client';

import { useState, useEffect } from 'react';

interface Lead {
    id: string;
    studentName: string;
    phone: string;
    email?: string;
    status: string;
    notes?: string;
    createdAt: string;
    course?: { name: string; fee: number };
    center?: { name: string };
}

export default function AgentLeadsPage() {
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

    const filteredLeads = filter === 'ALL'
        ? leads
        : leads.filter(l => l.status === filter);

    const statusFilters = ['ALL', 'NEW', 'CONTACTED', 'INTERESTED', 'ENROLLED', 'CLOSED', 'LOST'];

    if (loading) {
        return (
            <div className="flex-center" style={{ padding: '4rem' }}>
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className="fade-in">
            <div className="page-header flex-between">
                <div>
                    <h1 className="page-title">My Leads</h1>
                    <p className="page-subtitle">All leads you have collected</p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex gap-sm" style={{ marginBottom: 'var(--spacing-xl)', flexWrap: 'wrap' }}>
                {statusFilters.map(status => (
                    <button
                        key={status}
                        className={`btn btn-sm ${filter === status ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => setFilter(status)}
                    >
                        {status}
                    </button>
                ))}
            </div>

            {/* Leads Table */}
            <div className="card">
                {filteredLeads.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-state-icon">📋</div>
                        <p>No leads found {filter !== 'ALL' ? `with status "${filter}"` : ''}</p>
                    </div>
                ) : (
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Student Name</th>
                                    <th>Phone</th>
                                    <th>Course</th>
                                    <th>Center</th>
                                    <th>Fee</th>
                                    <th>Status</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredLeads.map(lead => (
                                    <tr key={lead.id}>
                                        <td>
                                            <div style={{ fontWeight: 500 }}>{lead.studentName}</div>
                                            {lead.email && (
                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                                    {lead.email}
                                                </div>
                                            )}
                                        </td>
                                        <td>{lead.phone}</td>
                                        <td>{lead.course?.name || 'N/A'}</td>
                                        <td style={{ color: 'var(--primary-light)' }}>
                                            {lead.center?.name || 'N/A'}
                                        </td>
                                        <td>₹{lead.course?.fee?.toLocaleString() || 'N/A'}</td>
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

            {/* Summary */}
            <div className="grid grid-4" style={{ marginTop: 'var(--spacing-xl)' }}>
                <div className="stat-card">
                    <div className="stat-value">{leads.filter(l => l.status === 'NEW').length}</div>
                    <div className="stat-label">New</div>
                </div>
                <div className="stat-card">
                    <div className="stat-value">{leads.filter(l => l.status === 'INTERESTED').length}</div>
                    <div className="stat-label">Interested</div>
                </div>
                <div className="stat-card">
                    <div className="stat-value">{leads.filter(l => ['ENROLLED', 'CLOSED'].includes(l.status)).length}</div>
                    <div className="stat-label">Converted</div>
                </div>
                <div className="stat-card">
                    <div className="stat-value">{leads.filter(l => l.status === 'LOST').length}</div>
                    <div className="stat-label">Lost</div>
                </div>
            </div>
        </div>
    );
}
