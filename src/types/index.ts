// Type definitions for Lead Management System

export type UserRole = 'ADMIN' | 'AGENT' | 'CENTER';

export type LeadStatus = 'NEW' | 'CONTACTED' | 'INTERESTED' | 'ENROLLED' | 'CLOSED' | 'LOST';

export type CommissionStatus = 'PENDING' | 'APPROVED' | 'PAID';

export type PayoutStatus = 'REQUESTED' | 'APPROVED' | 'PAID' | 'REJECTED';

export type CourseType = 'online_degree' | 'credit_transfer' | 'skill_course' | 'vocational';

export interface User {
    id: string;
    email: string;
    password?: string;
    name: string;
    role: UserRole;
    phone?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Center {
    id: string;
    name: string;
    address?: string;
    contactPerson?: string;
    phone?: string;
    email?: string;
    userId: string; // Link to center user account
    createdAt: Date;
    updatedAt: Date;
}

export interface Course {
    id: string;
    name: string;
    description?: string;
    courseType: CourseType;
    fee: number;
    commissionPercent: number; // Agent commission percentage
    centerId: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface Lead {
    id: string;
    studentName: string;
    phone: string;
    email?: string;
    courseId: string;
    agentId: string;
    centerId: string;
    status: LeadStatus;
    notes?: string;
    followUpDate?: Date;
    createdAt: Date;
    updatedAt: Date;
    closedAt?: Date;
    // Relations (populated)
    course?: Course;
    agent?: User;
    center?: Center;
}

export interface Commission {
    id: string;
    leadId: string;
    agentId: string;
    amount: number;
    status: CommissionStatus;
    createdAt: Date;
    updatedAt: Date;
    paidAt?: Date;
    // Relations
    lead?: Lead;
    agent?: User;
}

export interface Payout {
    id: string;
    agentId: string;
    totalAmount: number;
    commissionIds: string[];
    status: PayoutStatus;
    requestedAt: Date;
    approvedAt?: Date;
    paidAt?: Date;
    notes?: string;
    // Relations
    agent?: User;
    commissions?: Commission[];
}

// API Request/Response types
export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    email: string;
    password: string;
    name: string;
    role: UserRole;
    phone?: string;
}

export interface CreateLeadRequest {
    studentName: string;
    phone: string;
    email?: string;
    courseId: string;
    notes?: string;
}

export interface UpdateLeadRequest {
    status?: LeadStatus;
    notes?: string;
    followUpDate?: Date;
}

export interface CreatePayoutRequest {
    commissionIds: string[];
}

// Dashboard stats
export interface AgentDashboardStats {
    totalLeads: number;
    newLeads: number;
    interestedLeads: number;
    enrolledLeads: number;
    closedLeads: number;
    lostLeads: number;
    totalEarnings: number;
    pendingEarnings: number;
    paidEarnings: number;
}

export interface CenterDashboardStats {
    totalLeads: number;
    newLeads: number;
    interestedLeads: number;
    enrolledLeads: number;
    closedLeads: number;
    lostLeads: number;
    conversionRate: number;
    todayFollowUps: number;
}

export interface AdminDashboardStats {
    totalLeads: number;
    totalAgents: number;
    totalCenters: number;
    totalCourses: number;
    totalRevenue: number;
    totalCommissions: number;
    pendingPayouts: number;
    conversionRate: number;
}
