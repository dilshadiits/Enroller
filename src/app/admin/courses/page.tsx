'use client';

import { useState, useEffect } from 'react';

interface Course {
    id: string;
    name: string;
    description?: string;
    courseType: string;
    fee: number;
    commissionPercent: number;
    isActive: boolean;
    createdAt: string;
    center?: { id: string; name: string };
}

interface Center {
    id: string;
    name: string;
}

const COURSE_TYPES = [
    { value: 'online_degree', label: 'Online Degree', icon: '🎓' },
    { value: 'credit_transfer', label: 'Credit Transfer', icon: '🔄' },
    { value: 'skill_course', label: 'Skill Course', icon: '💡' },
    { value: 'vocational', label: 'Vocational', icon: '🛠️' },
];

export default function AdminCoursesPage() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [centers, setCenters] = useState<Center[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingCourse, setEditingCourse] = useState<Course | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        courseType: '',
        fee: '',
        commissionPercent: '',
        centerId: '',
        isActive: true,
    });

    useEffect(() => {
        fetchCourses();
        fetchCenters();
    }, []);

    const fetchCourses = async () => {
        try {
            const res = await fetch('/api/courses');
            if (res.ok) {
                const data = await res.json();
                setCourses(data.courses);
            }
        } catch (err) {
            console.error('Failed to fetch courses:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchCenters = async () => {
        try {
            const res = await fetch('/api/centers');
            if (res.ok) {
                const data = await res.json();
                setCenters(data.centers);
            }
        } catch (err) {
            console.error('Failed to fetch centers:', err);
        }
    };

    const openCreateModal = () => {
        setEditingCourse(null);
        setFormData({
            name: '',
            description: '',
            courseType: '',
            fee: '',
            commissionPercent: '',
            centerId: '',
            isActive: true,
        });
        setError('');
        setShowModal(true);
    };

    const openEditModal = (course: Course) => {
        setEditingCourse(course);
        setFormData({
            name: course.name,
            description: course.description || '',
            courseType: course.courseType || '',
            fee: String(course.fee),
            commissionPercent: String(course.commissionPercent),
            centerId: course.center?.id || '',
            isActive: course.isActive,
        });
        setError('');
        setShowModal(true);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setSubmitting(true);

        try {
            const url = editingCourse ? `/api/courses/${editingCourse.id}` : '/api/courses';
            const method = editingCourse ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    fee: Number(formData.fee),
                    commissionPercent: Number(formData.commissionPercent),
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Operation failed');
            }

            setSuccess(editingCourse
                ? `Course "${formData.name}" updated successfully!`
                : `Course "${formData.name}" created successfully!`
            );
            setShowModal(false);
            setEditingCourse(null);
            fetchCourses();

            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Operation failed');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (course: Course) => {
        if (!confirm(`Are you sure you want to delete "${course.name}"? This action cannot be undone.`)) {
            return;
        }

        try {
            const res = await fetch(`/api/courses/${course.id}`, {
                method: 'DELETE',
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to delete course');
            }

            setSuccess(`Course "${course.name}" deleted successfully!`);
            fetchCourses();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete course');
            setTimeout(() => setError(''), 3000);
        }
    };

    const toggleCourseStatus = async (course: Course) => {
        try {
            const res = await fetch(`/api/courses/${course.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isActive: !course.isActive }),
            });

            if (!res.ok) {
                throw new Error('Failed to update course');
            }

            fetchCourses();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update course');
            setTimeout(() => setError(''), 3000);
        }
    };

    const getCourseTypeInfo = (type: string) => {
        return COURSE_TYPES.find(t => t.value === type) || { value: type, label: type, icon: '📚' };
    };

    const totalRevenue = courses.reduce((sum, c) => sum + c.fee, 0);

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
                <div className="flex-between" style={{ alignItems: 'flex-start' }}>
                    <div>
                        <h1 className="page-title">Course Management</h1>
                        <p className="page-subtitle">View and manage available courses</p>
                    </div>
                    <button
                        className="btn btn-primary ripple"
                        onClick={openCreateModal}
                    >
                        + Add Course
                    </button>
                </div>
            </div>

            {/* Success/Error Messages */}
            {success && (
                <div className="alert alert-success" style={{ marginBottom: 'var(--spacing-lg)' }}>
                    ✓ {success}
                </div>
            )}

            {error && !showModal && (
                <div className="alert alert-error" style={{ marginBottom: 'var(--spacing-lg)' }}>
                    ✕ {error}
                </div>
            )}

            {/* Stats */}
            <div className="grid grid-4" style={{ marginBottom: 'var(--spacing-xl)' }}>
                <div className="stat-card hover-pop">
                    <div className="stat-value">{courses.length}</div>
                    <div className="stat-label">Total Courses</div>
                </div>
                <div className="stat-card hover-pop">
                    <div className="stat-value" style={{ color: 'var(--secondary)' }}>
                        {courses.filter(c => c.isActive).length}
                    </div>
                    <div className="stat-label">Active Courses</div>
                </div>
                <div className="stat-card hover-pop">
                    <div className="stat-value">
                        ₹{(totalRevenue / courses.length || 0).toLocaleString()}
                    </div>
                    <div className="stat-label">Avg. Course Fee</div>
                </div>
                <div className="stat-card hover-pop">
                    <div className="stat-value" style={{ color: 'var(--accent)' }}>
                        {new Set(courses.map(c => c.courseType)).size}
                    </div>
                    <div className="stat-label">Course Types</div>
                </div>
            </div>

            {/* Courses Grid */}
            <div className="grid grid-3">
                {courses.map(course => {
                    const typeInfo = getCourseTypeInfo(course.courseType);
                    return (
                        <div
                            key={course.id}
                            className="card hover-lift"
                            style={{ borderTop: `3px solid ${course.isActive ? 'var(--secondary)' : 'var(--text-muted)'}` }}
                        >
                            <div className="flex-between" style={{ marginBottom: 'var(--spacing-md)' }}>
                                <h3 style={{ fontSize: '1.125rem' }}>{course.name}</h3>
                                <span className={`badge ${course.isActive ? 'badge-enrolled' : 'badge-lost'}`}>
                                    {course.isActive ? 'Active' : 'Inactive'}
                                </span>
                            </div>

                            {/* Course Type Badge */}
                            <div style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.25rem',
                                padding: '0.25rem 0.75rem',
                                background: 'var(--bg-tertiary)',
                                borderRadius: 'var(--radius-full)',
                                fontSize: '0.75rem',
                                marginBottom: 'var(--spacing-md)'
                            }}>
                                <span>{typeInfo.icon}</span>
                                <span>{typeInfo.label}</span>
                            </div>

                            <p style={{ fontSize: '0.875rem', marginBottom: 'var(--spacing-lg)', color: 'var(--text-secondary)' }}>
                                {course.description || 'No description available'}
                            </p>

                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(2, 1fr)',
                                gap: 'var(--spacing-md)',
                                padding: 'var(--spacing-md)',
                                background: 'var(--bg-tertiary)',
                                borderRadius: 'var(--radius-md)',
                                marginBottom: 'var(--spacing-lg)'
                            }}>
                                <div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Fee</div>
                                    <div style={{ fontWeight: 600, color: 'var(--secondary)' }}>
                                        ₹{course.fee.toLocaleString()}
                                    </div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Commission</div>
                                    <div style={{ fontWeight: 600 }}>{course.commissionPercent}%</div>
                                </div>
                                <div style={{ gridColumn: 'span 2' }}>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Center</div>
                                    <div style={{ fontWeight: 500, color: 'var(--primary-light)' }}>
                                        🏢 {course.center?.name || 'N/A'}
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-sm">
                                <button
                                    onClick={() => openEditModal(course)}
                                    className="btn btn-sm btn-secondary"
                                    style={{ flex: 1 }}
                                >
                                    ✏️ Edit
                                </button>
                                <button
                                    onClick={() => toggleCourseStatus(course)}
                                    className={`btn btn-sm ${course.isActive ? 'btn-secondary' : 'btn-success'}`}
                                    title={course.isActive ? 'Deactivate' : 'Activate'}
                                >
                                    {course.isActive ? '⏸️' : '▶️'}
                                </button>
                                <button
                                    onClick={() => handleDelete(course)}
                                    className="btn btn-sm btn-danger"
                                    title="Delete Course"
                                >
                                    🗑️
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {courses.length === 0 && (
                <div className="card">
                    <div className="empty-state">
                        <div className="empty-state-icon">📚</div>
                        <p>No courses available</p>
                        <button
                            className="btn btn-primary"
                            style={{ marginTop: 'var(--spacing-md)' }}
                            onClick={openCreateModal}
                        >
                            + Add Your First Course
                        </button>
                    </div>
                </div>
            )}

            {/* Create/Edit Course Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '650px' }}>
                        <div className="modal-header">
                            <h2>{editingCourse ? 'Edit Course' : 'Add New Course'}</h2>
                            <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
                        </div>

                        {error && (
                            <div className="alert alert-error">{error}</div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="name">Course Name *</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        placeholder="Enter course name"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="centerId">Center *</label>
                                    <select
                                        id="centerId"
                                        name="centerId"
                                        value={formData.centerId}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <option value="">Select a center</option>
                                        {centers.map(center => (
                                            <option key={center.id} value={center.id}>
                                                {center.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Course Type Selection */}
                            <div className="form-group">
                                <label>Course Type *</label>
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(4, 1fr)',
                                    gap: 'var(--spacing-sm)',
                                    marginTop: 'var(--spacing-sm)'
                                }}>
                                    {COURSE_TYPES.map(type => (
                                        <div
                                            key={type.value}
                                            onClick={() => setFormData({ ...formData, courseType: type.value })}
                                            style={{
                                                padding: 'var(--spacing-md)',
                                                border: formData.courseType === type.value
                                                    ? '2px solid var(--primary)'
                                                    : '1px solid var(--border-color)',
                                                borderRadius: 'var(--radius-md)',
                                                cursor: 'pointer',
                                                textAlign: 'center',
                                                background: formData.courseType === type.value
                                                    ? 'rgba(234, 179, 8, 0.15)'
                                                    : 'var(--bg-tertiary)',
                                                transition: 'all 0.2s ease'
                                            }}
                                        >
                                            <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{type.icon}</div>
                                            <div style={{
                                                fontWeight: 500,
                                                fontSize: '0.75rem',
                                                color: formData.courseType === type.value ? 'var(--primary-light)' : 'var(--text-secondary)'
                                            }}>
                                                {type.label}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="fee">Course Fee (₹) *</label>
                                    <input
                                        type="number"
                                        id="fee"
                                        name="fee"
                                        value={formData.fee}
                                        onChange={handleInputChange}
                                        placeholder="25000"
                                        min="0"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="commissionPercent">Commission (%) *</label>
                                    <input
                                        type="number"
                                        id="commissionPercent"
                                        name="commissionPercent"
                                        value={formData.commissionPercent}
                                        onChange={handleInputChange}
                                        placeholder="10"
                                        min="0"
                                        max="100"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="description">Description</label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    placeholder="Enter course description"
                                    rows={3}
                                />
                            </div>

                            <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                                <input
                                    type="checkbox"
                                    name="isActive"
                                    id="isActive"
                                    checked={formData.isActive}
                                    onChange={handleInputChange}
                                    style={{ width: 'auto' }}
                                />
                                <label htmlFor="isActive" style={{ margin: 0, cursor: 'pointer' }}>
                                    Course is Active
                                </label>
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
                                    disabled={submitting || !formData.courseType}
                                >
                                    {submitting
                                        ? (editingCourse ? 'Updating...' : 'Creating...')
                                        : (editingCourse ? '✓ Update Course' : '✓ Create Course')
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
