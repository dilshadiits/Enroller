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
    updatedAt: string;
    course?: { name: string; fee: number };
    agent?: { name: string; email: string };
}

const STATUSES = ['NEW', 'CONTACTED', 'INTERESTED', 'ENROLLED', 'CLOSED', 'LOST'];

export default function CenterLeadsPage() {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [filter, setFilter] = useState('ALL');
    const [updateForm, setUpdateForm] = useState({ status: '', notes: '' });

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

    const openLeadModal = (lead: Lead) => {
        setSelectedLead(lead);
        setUpdateForm({ status: lead.status, notes: lead.notes || '' });
    };

    const updateLead = async () => {
        if (!selectedLead) return;

        setUpdating(true);
        try {
            const res = await fetch(`/api/leads/${selectedLead.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updateForm),
            });

            if (res.ok) {
                const data = await res.json();
                setLeads(leads.map(l => l.id === selectedLead.id ? { ...l, ...data.lead } : l));
                setSelectedLead(null);
                alert('Lead updated successfully!');
            } else {
                const data = await res.json();
                alert(data.error || 'Failed to update lead');
            }
        } catch (err) {
            alert('Failed to update lead');
        } finally {
            setUpdating(false);
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
                <h1 className="page-title">Incoming Leads</h1>
                <p className="page-subtitle">Process and update lead statuses</p>
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
                        <p>No leads found {filter !== 'ALL' ? `with status "${filter}"` : ''}</p>
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
                                    <th>Status</th>
                                    <th>Date</th>
                                    <th>Action</th>
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
                                        <td>
                                            <span className={`badge badge-${lead.status.toLowerCase()}`}>
                                                {lead.status}
                                            </span>
                                        </td>
                                        <td style={{ color: 'var(--text-muted)' }}>
                                            {new Date(lead.createdAt).toLocaleDateString()}
                                        </td>
                                        <td>
                                            <button
                                                onClick={() => openLeadModal(lead)}
                                                className="btn btn-primary btn-sm"
                                            >
                                                Update
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Update Lead Modal */}
            {selectedLead && (
                <div className="modal-overlay" onClick={() => setSelectedLead(null)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Update Lead</h2>
                            <button className="modal-close" onClick={() => setSelectedLead(null)}>×</button>
                        </div>

                        <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                            <div style={{
                                padding: 'var(--spacing-md)',
                                background: 'var(--bg-tertiary)',
                                borderRadius: 'var(--radius-md)',
                                marginBottom: 'var(--spacing-md)'
                            }}>
                                <div style={{ fontWeight: 600 }}>{selectedLead.studentName}</div>
                                <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                                    {selectedLead.phone} • {selectedLead.course?.name}
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="status">Status</label>
                                <select
                                    id="status"
                                    value={updateForm.status}
                                    onChange={(e) => setUpdateForm({ ...updateForm, status: e.target.value })}
                                >
                                    {STATUSES.map(status => (
                                        <option key={status} value={status}>{status}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="notes">Notes</label>
                                <textarea
                                    id="notes"
                                    placeholder="Add follow-up notes..."
                                    value={updateForm.notes}
                                    onChange={(e) => setUpdateForm({ ...updateForm, notes: e.target.value })}
                                    rows={3}
                                />
                            </div>

                            {updateForm.status === 'CLOSED' && (
                                <div className="alert alert-success">
                                    ✨ Closing this lead will generate a commission for the agent!
                                </div>
                            )}
                        </div>

                        <div className="flex gap-md">
                            <button
                                onClick={() => setSelectedLead(null)}
                                className="btn btn-secondary"
                                style={{ flex: 1 }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={updateLead}
                                className="btn btn-primary"
                                style={{ flex: 1 }}
                                disabled={updating}
                            >
                                {updating ? 'Updating...' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
