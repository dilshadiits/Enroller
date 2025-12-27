import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { ensureInitialized } from '@/lib/db';
import connectDB from '@/lib/mongodb';
import { Lead, Course, Center, Commission } from '@/lib/models';
import { LeadStatus } from '@/types';

// GET - Get single lead
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await ensureInitialized();
        await connectDB();
        const session = await getCurrentUser();

        if (!session) {
            return NextResponse.json(
                { error: 'Not authenticated' },
                { status: 401 }
            );
        }

        const { id } = await params;
        const lead = await Lead.findById(id);

        if (!lead) {
            return NextResponse.json(
                { error: 'Lead not found' },
                { status: 404 }
            );
        }

        // Check authorization
        if (session.role === 'AGENT' && lead.agentId !== session.id) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 403 }
            );
        }

        if (session.role === 'CENTER') {
            const center = await Center.findOne({ userId: session.id });
            if (!center || lead.centerId !== center._id.toString()) {
                return NextResponse.json(
                    { error: 'Unauthorized' },
                    { status: 403 }
                );
            }
        }

        const course = await Course.findById(lead.courseId);

        const leadObj = lead.toObject();
        leadObj.id = leadObj._id.toString();
        delete leadObj._id;
        delete leadObj.__v;

        return NextResponse.json({
            lead: {
                ...leadObj,
                course: course ? { ...course.toObject(), id: course._id.toString() } : null,
            },
        });
    } catch (error) {
        console.error('Get lead error:', error);
        return NextResponse.json(
            { error: 'Failed to get lead' },
            { status: 500 }
        );
    }
}

// PUT - Update lead status
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await ensureInitialized();
        await connectDB();
        const session = await getCurrentUser();

        if (!session) {
            return NextResponse.json(
                { error: 'Not authenticated' },
                { status: 401 }
            );
        }

        const { id } = await params;
        const lead = await Lead.findById(id);

        if (!lead) {
            return NextResponse.json(
                { error: 'Lead not found' },
                { status: 404 }
            );
        }

        // Only centers and admins can update lead status
        if (session.role === 'CENTER') {
            const center = await Center.findOne({ userId: session.id });
            if (!center || lead.centerId !== center._id.toString()) {
                return NextResponse.json(
                    { error: 'Unauthorized' },
                    { status: 403 }
                );
            }
        } else if (session.role !== 'ADMIN') {
            return NextResponse.json(
                { error: 'Only centers and admins can update leads' },
                { status: 403 }
            );
        }

        const { status, notes, followUpDate } = await request.json();

        const validStatuses: LeadStatus[] = ['NEW', 'CONTACTED', 'INTERESTED', 'ENROLLED', 'CLOSED', 'LOST'];
        if (status && !validStatuses.includes(status)) {
            return NextResponse.json(
                { error: 'Invalid status' },
                { status: 400 }
            );
        }

        const previousStatus = lead.status;

        // Update lead
        if (status) lead.status = status;
        if (notes !== undefined) lead.notes = notes;
        if (followUpDate) lead.followUpDate = new Date(followUpDate);

        // If status changed to CLOSED, create commission
        if (status === 'CLOSED' && previousStatus !== 'CLOSED') {
            lead.closedAt = new Date();

            const course = await Course.findById(lead.courseId);
            if (course) {
                const commissionAmount = (course.fee * course.commissionPercent) / 100;

                await Commission.create({
                    leadId: lead._id.toString(),
                    agentId: lead.agentId,
                    amount: commissionAmount,
                    status: 'PENDING',
                });
            }
        }

        const updatedLead = await lead.save();

        const leadObj = updatedLead.toObject();
        leadObj.id = leadObj._id.toString();
        delete leadObj._id;
        delete leadObj.__v;

        return NextResponse.json({
            success: true,
            lead: leadObj,
        });
    } catch (error) {
        console.error('Update lead error:', error);
        return NextResponse.json(
            { error: 'Failed to update lead' },
            { status: 500 }
        );
    }
}

