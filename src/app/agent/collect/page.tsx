'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Course {
    id: string;
    name: string;
    fee: number;
    commissionPercent: number;
    center?: { name: string };
}

export default function AgentCollectPage() {
    const router = useRouter();
    const [courses, setCourses] = useState<Course[]>([]);
    const [formData, setFormData] = useState({
        studentName: '',
        phone: '',
        email: '',
        courseId: '',
        notes: '',
    });
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        fetchCourses();
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSubmitting(true);

        try {
            const res = await fetch('/api/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to add lead');
            }

            setSuccess(true);
            setFormData({
                studentName: '',
                phone: '',
                email: '',
                courseId: '',
                notes: '',
            });

            setTimeout(() => {
                setSuccess(false);
            }, 3000);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to add lead');
        } finally {
            setSubmitting(false);
        }
    };

    const selectedCourse = courses.find(c => c.id === formData.courseId);
    const estimatedCommission = selectedCourse
        ? (selectedCourse.fee * selectedCourse.commissionPercent) / 100
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
                <h1 className="page-title">Add New Lead</h1>
                <p className="page-subtitle">Manually add a lead to your collection</p>
            </div>

            <div className="grid" style={{ gridTemplateColumns: '2fr 1fr', gap: 'var(--spacing-xl)' }}>
                {/* Lead Form */}
                <div className="card">
                    {success && (
                        <div className="alert alert-success">
                            ✅ Lead added successfully!
                        </div>
                    )}

                    {error && (
                        <div className="alert alert-error">{error}</div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="studentName">Student Name *</label>
                                <input
                                    id="studentName"
                                    type="text"
                                    placeholder="Enter student's full name"
                                    value={formData.studentName}
                                    onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="phone">Phone Number *</label>
                                <input
                                    id="phone"
                                    type="tel"
                                    placeholder="+91 9876543210"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="email">Email Address</label>
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="student@example.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="courseId">Select Course *</label>
                                <select
                                    id="courseId"
                                    value={formData.courseId}
                                    onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
                                    required
                                >
                                    <option value="">Choose a course</option>
                                    {courses.map(course => (
                                        <option key={course.id} value={course.id}>
                                            {course.name} ({course.center?.name}) - ₹{course.fee.toLocaleString()}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="notes">Notes (Optional)</label>
                            <textarea
                                id="notes"
                                placeholder="Any additional notes about this lead..."
                                value={formData.notes}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                rows={3}
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary"
                            style={{ marginTop: 'var(--spacing-md)' }}
                            disabled={submitting}
                        >
                            {submitting ? 'Adding Lead...' : '➕ Add Lead'}
                        </button>
                    </form>
                </div>

                {/* Commission Preview */}
                <div>
                    <div className="card" style={{ position: 'sticky', top: '100px' }}>
                        <h3 style={{ marginBottom: 'var(--spacing-lg)' }}>Commission Preview</h3>

                        {selectedCourse ? (
                            <div>
                                <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                                    <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                                        Selected Course
                                    </div>
                                    <div style={{ fontWeight: 600 }}>{selectedCourse.name}</div>
                                </div>

                                <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                                    <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                                        Lead Goes To Center
                                    </div>
                                    <div style={{
                                        fontWeight: 600,
                                        color: 'var(--primary-light)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem'
                                    }}>
                                        🏢 {selectedCourse.center?.name || 'N/A'}
                                    </div>
                                </div>

                                <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                                    <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                                        Course Fee
                                    </div>
                                    <div style={{ fontWeight: 600 }}>₹{selectedCourse.fee.toLocaleString()}</div>
                                </div>

                                <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                                    <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                                        Commission Rate
                                    </div>
                                    <div style={{ fontWeight: 600 }}>{selectedCourse.commissionPercent}%</div>
                                </div>

                                <div style={{
                                    padding: 'var(--spacing-lg)',
                                    background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(16, 185, 129, 0.1) 100%)',
                                    borderRadius: 'var(--radius-md)',
                                    textAlign: 'center'
                                }}>
                                    <div style={{ fontSize: '0.875rem', color: 'var(--secondary)' }}>
                                        You&apos;ll Earn
                                    </div>
                                    <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--secondary)' }}>
                                        ₹{estimatedCommission.toLocaleString()}
                                    </div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                        on successful enrollment
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                                <p>Select a course to see your commission</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
