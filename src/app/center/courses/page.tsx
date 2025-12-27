'use client';

import { useState, useEffect } from 'react';

interface Lead {
    id: string;
    studentName: string;
    status: string;
    createdAt: string;
}

interface Course {
    id: string;
    name: string;
    description?: string;
    fee: number;
    commissionPercent: number;
    isActive: boolean;
    createdAt: string;
    leads?: Lead[];
    leadCount?: number;
}

export default function CenterCoursesPage() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [coursesRes, leadsRes] = await Promise.all([
                fetch('/api/courses'),
                fetch('/api/leads')
            ]);

            if (coursesRes.ok) {
                const coursesData = await coursesRes.json();
                setCourses(coursesData.courses);
            }

            if (leadsRes.ok) {
                const leadsData = await leadsRes.json();
                setLeads(leadsData.leads);
            }
        } catch (err) {
            console.error('Failed to fetch data:', err);
        } finally {
            setLoading(false);
        }
    };

    // Calculate leads per course
    const getLeadsForCourse = (courseId: string) => {
        return leads.filter(lead => (lead as any).courseId === courseId);
    };

    const getStatusCount = (courseLeads: Lead[], status: string) => {
        return courseLeads.filter(l => l.status === status).length;
    };

    const totalLeads = leads.length;
    const activeCoursesCount = courses.filter(c => c.isActive).length;

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
                <h1 className="page-title">Your Courses</h1>
                <p className="page-subtitle">View courses assigned to your center and their lead statistics</p>
            </div>

            {/* Stats */}
            <div className="grid grid-3" style={{ marginBottom: 'var(--spacing-xl)' }}>
                <div className="stat-card">
                    <div className="stat-value">{courses.length}</div>
                    <div className="stat-label">Total Courses</div>
                </div>
                <div className="stat-card">
                    <div className="stat-value" style={{ color: 'var(--secondary)' }}>
                        {activeCoursesCount}
                    </div>
                    <div className="stat-label">Active Courses</div>
                </div>
                <div className="stat-card">
                    <div className="stat-value" style={{ color: 'var(--primary-light)' }}>
                        {totalLeads}
                    </div>
                    <div className="stat-label">Total Leads</div>
                </div>
            </div>

            {/* Courses with Lead Stats */}
            <div className="grid grid-2">
                {courses.map(course => {
                    const courseLeads = getLeadsForCourse(course.id);
                    const newCount = getStatusCount(courseLeads, 'NEW');
                    const enrolledCount = getStatusCount(courseLeads, 'ENROLLED') + getStatusCount(courseLeads, 'CLOSED');
                    const conversionRate = courseLeads.length > 0
                        ? ((enrolledCount / courseLeads.length) * 100).toFixed(1)
                        : 0;

                    return (
                        <div
                            key={course.id}
                            className="card"
                            style={{
                                borderTop: `3px solid ${course.isActive ? 'var(--secondary)' : 'var(--text-muted)'}`,
                            }}
                        >
                            <div className="flex-between" style={{ marginBottom: 'var(--spacing-md)' }}>
                                <h3 style={{ fontSize: '1.25rem' }}>{course.name}</h3>
                                <span className={`badge ${course.isActive ? 'badge-enrolled' : 'badge-lost'}`}>
                                    {course.isActive ? 'Active' : 'Inactive'}
                                </span>
                            </div>

                            <p style={{ fontSize: '0.875rem', marginBottom: 'var(--spacing-lg)', color: 'var(--text-secondary)' }}>
                                {course.description || 'No description available'}
                            </p>

                            {/* Course Info */}
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
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Course Fee</div>
                                    <div style={{ fontWeight: 600, color: 'var(--secondary)' }}>
                                        ₹{course.fee.toLocaleString()}
                                    </div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Agent Commission</div>
                                    <div style={{ fontWeight: 600 }}>{course.commissionPercent}%</div>
                                </div>
                            </div>

                            {/* Lead Stats */}
                            <div style={{
                                padding: 'var(--spacing-md)',
                                background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.1), rgba(6, 182, 212, 0.1))',
                                borderRadius: 'var(--radius-md)',
                                border: '1px solid var(--border-color)'
                            }}>
                                <div style={{
                                    fontSize: '0.75rem',
                                    color: 'var(--text-muted)',
                                    marginBottom: 'var(--spacing-sm)',
                                    fontWeight: 500
                                }}>
                                    Lead Statistics
                                </div>
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(4, 1fr)',
                                    gap: 'var(--spacing-sm)',
                                    textAlign: 'center'
                                }}>
                                    <div>
                                        <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary-light)' }}>
                                            {courseLeads.length}
                                        </div>
                                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Total</div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--accent)' }}>
                                            {newCount}
                                        </div>
                                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>New</div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--success)' }}>
                                            {enrolledCount}
                                        </div>
                                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Enrolled</div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--secondary)' }}>
                                            {conversionRate}%
                                        </div>
                                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Conv.</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {courses.length === 0 && (
                <div className="card">
                    <div className="empty-state">
                        <div className="empty-state-icon">📚</div>
                        <p>No courses assigned to your center yet.</p>
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                            Contact an admin to add courses to your center.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
