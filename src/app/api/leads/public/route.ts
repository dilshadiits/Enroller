import { NextRequest, NextResponse } from 'next/server';
import { ensureInitialized } from '@/lib/db';
import connectDB from '@/lib/mongodb';
import { Lead, User, Course } from '@/lib/models';

// POST - Public lead submission via agent link
export async function POST(request: NextRequest) {
    try {
        await ensureInitialized();
        await connectDB();

        const { studentName, phone, email, courseId, agentId, notes } = await request.json();

        if (!studentName || !phone || !courseId || !agentId) {
            return NextResponse.json(
                { error: 'Student name, phone, course, and agent are required' },
                { status: 400 }
            );
        }

        // Verify agent exists
        const agent = await User.findById(agentId);
        if (!agent || agent.role !== 'AGENT') {
            return NextResponse.json(
                { error: 'Invalid agent' },
                { status: 400 }
            );
        }

        // Verify course exists
        const course = await Course.findById(courseId);
        if (!course || !course.isActive) {
            return NextResponse.json(
                { error: 'Invalid or inactive course' },
                { status: 400 }
            );
        }

        const newLead = await Lead.create({
            studentName,
            phone,
            email: email || undefined,
            courseId,
            agentId,
            centerId: course.centerId,
            status: 'NEW',
            notes: notes || undefined,
        });

        return NextResponse.json({
            success: true,
            message: 'Thank you! Your enquiry has been submitted successfully.',
            lead: {
                id: newLead._id.toString(),
                studentName: newLead.studentName,
                course: course.name,
            },
        });
    } catch (error) {
        console.error('Public lead submission error:', error);
        return NextResponse.json(
            { error: 'Failed to submit enquiry' },
            { status: 500 }
        );
    }
}

