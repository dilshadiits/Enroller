import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { ensureInitialized } from '@/lib/db';
import connectDB from '@/lib/mongodb';
import { Commission, Lead, Course } from '@/lib/models';

// GET - Get commissions for current agent
export async function GET(request: NextRequest) {
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

        let query: any = {};

        if (session.role === 'ADMIN') {
            // Admin sees all
        } else if (session.role === 'AGENT') {
            query.agentId = session.id;
        } else {
            return NextResponse.json(
                { error: 'Only agents and admins can view commissions' },
                { status: 403 }
            );
        }

        const commissions = await Commission.find(query).sort({ createdAt: -1 });

        // Populate with lead and course info
        const leadIds = [...new Set(commissions.map(c => c.leadId))];
        const leads = await Lead.find({ _id: { $in: leadIds } });

        const courseIds = [...new Set(leads.map(l => l.courseId))];
        const courses = await Course.find({ _id: { $in: courseIds } });

        const populatedCommissions = commissions.map(commission => {
            const commObj = commission.toObject();
            commObj.id = commObj._id.toString();
            delete commObj._id;
            delete commObj.__v;

            const lead = leads.find(l => l._id.toString() === commission.leadId);
            const course = lead ? courses.find(c => c._id.toString() === lead.courseId) : null;

            return {
                ...commObj,
                lead: lead ? {
                    id: lead._id.toString(),
                    studentName: lead.studentName,
                    status: lead.status,
                } : null,
                course: course ? {
                    id: course._id.toString(),
                    name: course.name,
                    fee: course.fee,
                } : null,
            };
        });

        // Calculate totals
        const totals = {
            total: commissions.reduce((sum, c) => sum + c.amount, 0),
            pending: commissions.filter(c => c.status === 'PENDING').reduce((sum, c) => sum + c.amount, 0),
            approved: commissions.filter(c => c.status === 'APPROVED').reduce((sum, c) => sum + c.amount, 0),
            paid: commissions.filter(c => c.status === 'PAID').reduce((sum, c) => sum + c.amount, 0),
        };

        return NextResponse.json({
            commissions: populatedCommissions,
            totals,
        });
    } catch (error) {
        console.error('Fetch commissions error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch commissions' },
            { status: 500 }
        );
    }
}

