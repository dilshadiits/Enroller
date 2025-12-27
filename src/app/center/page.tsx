'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Lead {
    id: string;
    studentName: string;
    status: string;
    createdAt: string;
    course?: { name: string };
    agent?: { name: string };
}

export default function CenterDashboard() {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);

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

    const getStatusCount = (status: string) =>
        leads.filter(l => l.status === status).length;

    const conversionRate = leads.length > 0
        ? (((getStatusCount('ENROLLED') + getStatusCount('CLOSED')) / leads.length) * 100).toFixed(1)
        : 0;

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
                <h1 className="page-title">Center Dashboard</h1>
                <p className="page-subtitle">Manage incoming leads and track conversions</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-4" style={{ marginBottom: 'var(--spacing-xl)' }}>
                <div className="stat-card">
                    <div className="stat-value">{leads.length}</div>
                    <div className="stat-label">Total Leads</div>
                </div>
                <div className="stat-card">
                    <div className="stat-value pulse" style={{ color: 'var(--primary-light)' }}>
                        {getStatusCount('NEW')}
                    </div>
                    <div className="stat-label">New (Pending)</div>
                </div>
                <div className="stat-card">
                    <div className="stat-value" style={{ color: 'var(--secondary)' }}>
                        {getStatusCount('ENROLLED') + getStatusCount('CLOSED')}
                    </div>
                    <div className="stat-label">Enrolled</div>
                </div>
                <div className="stat-card">
                    <div className="stat-value">{conversionRate}%</div>
                    <div className="stat-label">Conversion Rate</div>
                </div>
            </div>

            {/* Pipeline Overview */}
            <div className="grid grid-3" style={{ marginBottom: 'var(--spacing-xl)' }}>
                <div className="card" style={{ borderTop: '3px solid var(--primary)' }}>
                    <div className="flex-between" style={{ marginBottom: 'var(--spacing-md)' }}>
                        <h4>New Leads</h4>
                        <span className="badge badge-new">{getStatusCount('NEW')}</span>
                    </div>
                    <div className="progress-bar">
                        <div
                            className="progress-fill"
                            style={{ width: leads.length > 0 ? `${(getStatusCount('NEW') / leads.length) * 100}%` : '0%' }}
                        />
                    </div>
                </div>

                <div className="card" style={{ borderTop: '3px solid var(--accent)' }}>
                    <div className="flex-between" style={{ marginBottom: 'var(--spacing-md)' }}>
                        <h4>In Progress</h4>
                        <span className="badge badge-contacted">
                            {getStatusCount('CONTACTED') + getStatusCount('INTERESTED')}
                        </span>
                    </div>
                    <div className="progress-bar">
                        <div
                            className="progress-fill"
                            style={{
                                width: leads.length > 0
                                    ? `${((getStatusCount('CONTACTED') + getStatusCount('INTERESTED')) / leads.length) * 100}%`
                                    : '0%',
                                background: 'linear-gradient(90deg, var(--accent) 0%, var(--secondary) 100%)'
                            }}
                        />
                    </div>
                </div>

                <div className="card" style={{ borderTop: '3px solid var(--secondary)' }}>
                    <div className="flex-between" style={{ marginBottom: 'var(--spacing-md)' }}>
                        <h4>Converted</h4>
                        <span className="badge badge-enrolled">
                            {getStatusCount('ENROLLED') + getStatusCount('CLOSED')}
                        </span>
                    </div>
                    <div className="progress-bar">
                        <div
                            className="progress-fill"
                            style={{
                                width: leads.length > 0
                                    ? `${((getStatusCount('ENROLLED') + getStatusCount('CLOSED')) / leads.length) * 100}%`
                                    : '0%',
                                background: 'var(--secondary)'
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* New Leads Alert */}
            {getStatusCount('NEW') > 0 && (
                <div className="alert alert-warning" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span>
                        ⚠️ You have <strong>{getStatusCount('NEW')} new leads</strong> waiting to be processed!
                    </span>
                    <Link href="/center/leads" className="btn btn-primary btn-sm">
                        Process Now
                    </Link>
                </div>
            )}

            {/* Recent Leads */}
            <div className="card">
                <div className="card-header">
                    <h3 className="card-title">Recent Leads</h3>
                    <Link href="/center/leads" className="btn btn-secondary btn-sm">View All</Link>
                </div>

                {leads.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-state-icon">📥</div>
                        <p>No leads yet. Leads will appear here when agents submit them.</p>
                    </div>
                ) : (
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Student Name</th>
                                    <th>Course</th>
                                    <th>Agent</th>
                                    <th>Status</th>
                                    <th>Date</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {leads.slice(0, 5).map(lead => (
                                    <tr key={lead.id}>
                                        <td style={{ fontWeight: 500 }}>{lead.studentName}</td>
                                        <td>{lead.course?.name || 'N/A'}</td>
                                        <td>{lead.agent?.name || 'N/A'}</td>
                                        <td>
                                            <span className={`badge badge-${lead.status.toLowerCase()}`}>
                                                {lead.status}
                                            </span>
                                        </td>
                                        <td style={{ color: 'var(--text-muted)' }}>
                                            {new Date(lead.createdAt).toLocaleDateString()}
                                        </td>
                                        <td>
                                            <Link href={`/center/leads?id=${lead.id}`} className="btn btn-secondary btn-sm">
                                                Manage
                                            </Link>
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
