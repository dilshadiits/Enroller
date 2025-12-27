'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';

interface Course {
    id: string;
    name: string;
    description?: string;
    fee: number;
    center?: { name: string };
}

const COURSE_TYPES = [
    { value: 'online_degree', label: 'Online Degree', icon: '🎓' },
    { value: 'credit_transfer', label: 'Credit Transfer', icon: '🔄' },
    { value: 'skill_course', label: 'Skill Course', icon: '💡' },
    { value: 'vocational', label: 'Vocational', icon: '🛠️' },
];

export default function PublicCollectPage({ params }: { params: Promise<{ agentId: string }> }) {
    const { agentId } = use(params);
    const [courses, setCourses] = useState<Course[]>([]);
    const [formData, setFormData] = useState({
        studentName: '',
        phone: '',
        email: '',
        courseType: '',
        courseId: '',
    });
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchData();
    }, [agentId]);

    const fetchData = async () => {
        try {
            const coursesRes = await fetch('/api/courses');
            if (coursesRes.ok) {
                const data = await coursesRes.json();
                setCourses(data.courses);
            }
        } catch (err) {
            console.error('Failed to fetch data:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSubmitting(true);

        try {
            const res = await fetch('/api/leads/public', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    agentId,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to submit');
            }

            setSuccess(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to submit');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex-center" style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #fef9c3 0%, #fde047 100%)' }}>
                <div className="spinner"></div>
            </div>
        );
    }

    if (success) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'linear-gradient(135deg, #fef9c3 0%, #fde047 100%)' }}>
                <nav className="navbar" style={{ background: 'rgba(254, 249, 195, 0.95)', borderBottom: '1px solid rgba(234, 179, 8, 0.3)' }}>
                    <span className="nav-brand" style={{ color: '#ca8a04' }}>Enroller</span>
                </nav>

                <main className="container flex-center" style={{ flex: 1 }}>
                    <div className="card fade-in" style={{
                        maxWidth: '500px',
                        textAlign: 'center',
                        background: 'rgba(255, 255, 255, 0.95)',
                        color: '#1c1917'
                    }}>
                        <div style={{ fontSize: '4rem', marginBottom: 'var(--spacing-lg)' }}>🎉</div>
                        <h1 style={{ marginBottom: 'var(--spacing-md)', color: '#1c1917' }}>Thank You!</h1>
                        <p style={{ marginBottom: 'var(--spacing-xl)', color: '#57534e' }}>
                            Your enquiry has been submitted successfully. Our team will contact you shortly.
                        </p>
                        <Link href="/" className="btn btn-primary">
                            Back to Home
                        </Link>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'linear-gradient(135deg, #fef9c3 0%, #fde047 100%)' }}>
            <nav className="navbar" style={{ background: 'rgba(254, 249, 195, 0.95)', borderBottom: '1px solid rgba(234, 179, 8, 0.3)' }}>
                <span className="nav-brand" style={{ color: '#ca8a04' }}>Enroller</span>
            </nav>

            <main className="container" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--spacing-xl)' }}>
                <div className="card fade-in" style={{
                    maxWidth: '600px',
                    width: '100%',
                    background: 'rgba(255, 255, 255, 0.95)',
                    color: '#1c1917'
                }}>
                    <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-xl)' }}>
                        <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-md)' }}>🎓</div>
                        <h1 style={{ marginBottom: 'var(--spacing-sm)', color: '#1c1917' }}>Student Enrollment Form</h1>
                        <p style={{ color: '#78716c' }}>Fill out this form to enquire about our courses</p>
                    </div>

                    {error && (
                        <div className="alert alert-error">{error}</div>
                    )}

                    <form onSubmit={handleSubmit}>
                        {/* Name */}
                        <div className="form-group">
                            <label htmlFor="studentName" style={{ color: '#44403c' }}>Full Name *</label>
                            <input
                                id="studentName"
                                type="text"
                                placeholder="Enter your full name"
                                value={formData.studentName}
                                onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                                required
                                style={{ background: 'white', border: '1px solid #d6d3d1', color: '#1c1917' }}
                            />
                        </div>

                        {/* Phone & Email */}
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="phone" style={{ color: '#44403c' }}>Phone Number *</label>
                                <input
                                    id="phone"
                                    type="tel"
                                    placeholder="+91 9876543210"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    required
                                    style={{ background: 'white', border: '1px solid #d6d3d1', color: '#1c1917' }}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="email" style={{ color: '#44403c' }}>Email Address</label>
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    style={{ background: 'white', border: '1px solid #d6d3d1', color: '#1c1917' }}
                                />
                            </div>
                        </div>

                        {/* Course Type */}
                        <div className="form-group">
                            <label style={{ color: '#44403c' }}>Course Type *</label>
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(2, 1fr)',
                                gap: 'var(--spacing-md)',
                                marginTop: 'var(--spacing-sm)'
                            }}>
                                {COURSE_TYPES.map(type => (
                                    <div
                                        key={type.value}
                                        onClick={() => setFormData({ ...formData, courseType: type.value, courseId: '' })}
                                        style={{
                                            padding: 'var(--spacing-md)',
                                            border: formData.courseType === type.value
                                                ? '2px solid #eab308'
                                                : '1px solid #d6d3d1',
                                            borderRadius: 'var(--radius-md)',
                                            cursor: 'pointer',
                                            textAlign: 'center',
                                            background: formData.courseType === type.value
                                                ? 'rgba(234, 179, 8, 0.1)'
                                                : 'white',
                                            transition: 'all 0.2s ease'
                                        }}
                                    >
                                        <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{type.icon}</div>
                                        <div style={{
                                            fontWeight: 500,
                                            fontSize: '0.875rem',
                                            color: formData.courseType === type.value ? '#ca8a04' : '#44403c'
                                        }}>
                                            {type.label}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Course Selection */}
                        <div className="form-group">
                            <label htmlFor="courseId" style={{ color: '#44403c' }}>Select Course *</label>
                            <select
                                id="courseId"
                                value={formData.courseId}
                                onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
                                required
                                style={{ background: 'white', border: '1px solid #d6d3d1', color: '#1c1917' }}
                            >
                                <option value="">Choose a course</option>
                                {courses.map(course => (
                                    <option key={course.id} value={course.id}>
                                        {course.name} - ₹{course.fee.toLocaleString()}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Selected Course Details */}
                        {formData.courseId && (
                            <div style={{
                                padding: 'var(--spacing-md)',
                                background: 'rgba(234, 179, 8, 0.1)',
                                borderRadius: 'var(--radius-md)',
                                marginBottom: 'var(--spacing-lg)',
                                border: '1px solid rgba(234, 179, 8, 0.3)'
                            }}>
                                {(() => {
                                    const course = courses.find(c => c.id === formData.courseId);
                                    return course ? (
                                        <>
                                            <div style={{ fontWeight: 600, marginBottom: 'var(--spacing-sm)', color: '#1c1917' }}>
                                                {course.name}
                                            </div>
                                            <div style={{ fontSize: '0.875rem', color: '#78716c' }}>
                                                {course.description}
                                            </div>
                                            <div style={{ marginTop: 'var(--spacing-sm)', color: '#ca8a04', fontWeight: 600 }}>
                                                Fee: ₹{course.fee.toLocaleString()}
                                            </div>
                                        </>
                                    ) : null;
                                })()}
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="btn btn-primary btn-lg ripple"
                            style={{ width: '100%' }}
                            disabled={submitting || !formData.courseType}
                        >
                            {submitting ? 'Submitting...' : '📝 Submit Enrollment'}
                        </button>
                    </form>

                    <p style={{ textAlign: 'center', marginTop: 'var(--spacing-xl)', fontSize: '0.875rem', color: '#a8a29e' }}>
                        By submitting this form, you agree to be contacted regarding our courses.
                    </p>
                </div>
            </main>

            <footer style={{
                textAlign: 'center',
                padding: 'var(--spacing-lg)',
                borderTop: '1px solid rgba(234, 179, 8, 0.3)',
                background: 'rgba(254, 240, 138, 0.8)'
            }}>
                <p style={{ color: '#78716c' }}>© 2024 Enroller. All rights reserved.</p>
            </footer>
        </div>
    );
}
