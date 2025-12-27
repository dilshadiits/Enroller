import mongoose, { Schema, Document, Model } from 'mongoose';
import { UserRole, LeadStatus, CourseType, CommissionStatus, PayoutStatus } from '@/types';

// Interfaces for Mongoose Documents (extending generated types)
// We use the existing interfaces from @/types but omit 'id' as Mongoose uses '_id'
// We'll handle the conversion in the response helpers or usage.

// --- User Model ---
const UserSchema = new Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    role: {
        type: String,
        enum: ['ADMIN', 'AGENT', 'CENTER'],
        default: 'AGENT'
    },
    phone: { type: String },
}, { timestamps: true });

// --- Center Model ---
const CenterSchema = new Schema({
    name: { type: String, required: true },
    address: { type: String },
    contactPerson: { type: String },
    phone: { type: String },
    email: { type: String },
    userId: { type: String, ref: 'User', required: true }, // Linking to User by string ID or ObjectId if we chose
}, { timestamps: true });

// --- Course Model ---
const CourseSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String },
    courseType: {
        type: String,
        enum: ['online_degree', 'credit_transfer', 'skill_course', 'vocational'],
        required: true
    },
    fee: { type: Number, required: true },
    commissionPercent: { type: Number, required: true },
    centerId: { type: String, required: true }, // Using string IDs for simplicity with existing frontend, or could be ObjectId
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

// --- Lead Model ---
const LeadSchema = new Schema({
    studentName: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String },
    courseId: { type: String, required: true }, // Can be ObjectId ref if we migrate fully
    agentId: { type: String, required: true },
    centerId: { type: String, required: true },
    status: {
        type: String,
        enum: ['NEW', 'CONTACTED', 'INTERESTED', 'ENROLLED', 'CLOSED', 'LOST'],
        default: 'NEW'
    },
    notes: { type: String },
    followUpDate: { type: Date },
    closedAt: { type: Date },
}, { timestamps: true });

// --- Commission Model ---
const CommissionSchema = new Schema({
    leadId: { type: String, required: true },
    agentId: { type: String, required: true },
    amount: { type: Number, required: true },
    status: {
        type: String,
        enum: ['PENDING', 'APPROVED', 'PAID'],
        default: 'PENDING'
    },
    paidAt: { type: Date },
}, { timestamps: true });

// --- Payout Model ---
const PayoutSchema = new Schema({
    agentId: { type: String, required: true },
    totalAmount: { type: Number, required: true },
    commissionIds: [{ type: String }],
    status: {
        type: String,
        enum: ['REQUESTED', 'APPROVED', 'PAID', 'REJECTED'],
        default: 'REQUESTED'
    },
    approvedAt: { type: Date },
    paidAt: { type: Date },
    notes: { type: String },
}, { timestamps: true });

// Helper to prevent overwriting models during hot reloads
const getModel = <T extends Document>(name: string, schema: Schema<T>): Model<T> => {
    return mongoose.models[name] || mongoose.model<T>(name, schema);
};

export const User = getModel('User', UserSchema);
export const Center = getModel('Center', CenterSchema);
export const Course = getModel('Course', CourseSchema);
export const Lead = getModel('Lead', LeadSchema);
export const Commission = getModel('Commission', CommissionSchema);
export const Payout = getModel('Payout', PayoutSchema);
