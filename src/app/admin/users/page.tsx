'use client';

import { useState, useEffect } from 'react';

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    phone?: string;
    createdAt: string;
}

export default function AdminUsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('ALL');
    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [creating, setCreating] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'AGENT',
        phone: '',
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await fetch('/api/users');
            if (res.ok) {
                const data = await res.json();
                setUsers(data.users);
            }
        } catch (err) {
            console.error('Failed to fetch users:', err);
        } finally {
            setLoading(false);
        }
    };

    const openCreateModal = () => {
        setEditingUser(null);
        setFormData({ name: '', email: '', password: '', role: 'AGENT', phone: '' });
        setError('');
        setShowModal(true);
    };

    const openEditModal = (user: User) => {
        setEditingUser(user);
        setFormData({
            name: user.name,
            email: user.email,
            password: '',
            role: user.role,
            phone: user.phone || '',
        });
        setError('');
        setShowModal(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setCreating(true);

        try {
            const url = editingUser ? `/api/users/${editingUser.id}` : '/api/users';
            const method = editingUser ? 'PUT' : 'POST';

            // Don't send empty password on edit
            const payload = { ...formData };
            if (editingUser && !payload.password) {
                delete (payload as any).password;
            }

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Operation failed');
            }

            setSuccess(editingUser
                ? `User ${formData.name} updated successfully!`
                : `User ${formData.name} created successfully!`
            );
            setFormData({ name: '', email: '', password: '', role: 'AGENT', phone: '' });
            setShowModal(false);
            setEditingUser(null);
            fetchUsers();

            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Operation failed');
        } finally {
            setCreating(false);
        }
    };

    const handleDelete = async (user: User) => {
        if (!confirm(`Are you sure you want to delete ${user.name}? This action cannot be undone.`)) {
            return;
        }

        try {
            const res = await fetch(`/api/users/${user.id}`, {
                method: 'DELETE',
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to delete user');
            }

            setSuccess(`User ${user.name} deleted successfully!`);
            fetchUsers();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete user');
            setTimeout(() => setError(''), 3000);
        }
    };

    const filteredUsers = filter === 'ALL'
        ? users
        : users.filter(u => u.role === filter);

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
                    <h1 className="page-title">User Management</h1>
                    <p className="page-subtitle">Manage agents, centers, and admins</p>
                </div>
                <button
                    onClick={openCreateModal}
                    className="btn btn-primary ripple"
                >
                    ➕ Create User
                </button>
            </div>

            {success && (
                <div className="alert alert-success">{success}</div>
            )}
            {error && !showModal && (
                <div className="alert alert-error">{error}</div>
            )}

            {/* Stats */}
            <div className="grid grid-4" style={{ marginBottom: 'var(--spacing-xl)' }}>
                <div className="stat-card hover-pop">
                    <div className="stat-value">{users.length}</div>
                    <div className="stat-label">Total Users</div>
                </div>
                <div className="stat-card hover-pop">
                    <div className="stat-value" style={{ color: 'var(--primary-light)' }}>
                        {users.filter(u => u.role === 'AGENT').length}
                    </div>
                    <div className="stat-label">Agents</div>
                </div>
                <div className="stat-card hover-pop">
                    <div className="stat-value" style={{ color: 'var(--secondary)' }}>
                        {users.filter(u => u.role === 'CENTER').length}
                    </div>
                    <div className="stat-label">Centers</div>
                </div>
                <div className="stat-card hover-pop">
                    <div className="stat-value" style={{ color: 'var(--accent)' }}>
                        {users.filter(u => u.role === 'ADMIN').length}
                    </div>
                    <div className="stat-label">Admins</div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex gap-sm" style={{ marginBottom: 'var(--spacing-xl)' }}>
                {['ALL', 'AGENT', 'CENTER', 'ADMIN'].map(role => (
                    <button
                        key={role}
                        className={`btn btn-sm ${filter === role ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => setFilter(role)}
                    >
                        {role}
                    </button>
                ))}
            </div>

            {/* Users Table */}
            <div className="card">
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Role</th>
                                <th>Joined</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map(user => (
                                <tr key={user.id}>
                                    <td style={{ fontWeight: 500 }}>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>{user.phone || '-'}</td>
                                    <td>
                                        <span className={`badge badge-${user.role === 'ADMIN' ? 'contacted' : user.role === 'CENTER' ? 'interested' : 'new'}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td style={{ color: 'var(--text-muted)' }}>
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </td>
                                    <td>
                                        <div className="flex gap-sm">
                                            <button
                                                onClick={() => openEditModal(user)}
                                                className="btn btn-sm btn-secondary"
                                                title="Edit User"
                                            >
                                                ✏️
                                            </button>
                                            <button
                                                onClick={() => handleDelete(user)}
                                                className="btn btn-sm btn-danger"
                                                title="Delete User"
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create/Edit User Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{editingUser ? 'Edit User' : 'Create New User'}</h2>
                            <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
                        </div>

                        {error && (
                            <div className="alert alert-error">{error}</div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="name">Full Name</label>
                                <input
                                    id="name"
                                    type="text"
                                    placeholder="John Doe"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="email">Email Address</label>
                                    <input
                                        id="email"
                                        type="email"
                                        placeholder="user@example.com"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="phone">Phone Number</label>
                                    <input
                                        id="phone"
                                        type="tel"
                                        placeholder="+91 9876543210"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="password">
                                        {editingUser ? 'New Password (leave blank to keep)' : 'Password'}
                                    </label>
                                    <input
                                        id="password"
                                        type="password"
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        required={!editingUser}
                                        minLength={6}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="role">Role</label>
                                    <select
                                        id="role"
                                        value={formData.role}
                                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                        required
                                    >
                                        <option value="AGENT">Admission Agent</option>
                                        <option value="CENTER">Training Center</option>
                                        <option value="ADMIN">Admin</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex gap-md" style={{ marginTop: 'var(--spacing-lg)' }}>
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="btn btn-secondary"
                                    style={{ flex: 1 }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary ripple"
                                    style={{ flex: 1 }}
                                    disabled={creating}
                                >
                                    {creating
                                        ? (editingUser ? 'Updating...' : 'Creating...')
                                        : (editingUser ? '✓ Update User' : '✓ Create User')
                                    }
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
