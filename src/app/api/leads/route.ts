import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { ensureInitialized } from '@/lib/db'; // Keep this for now to ensure seed
import connectDB from '@/lib/mongodb';
import { Lead, Course, Center, User } from '@/lib/models'; // Import generic models

// Helper to map Mongoose doc (handling populated fields)
const mapLead = (lead: any) => {
    const obj = lead.toObject ? lead.toObject() : lead;
    obj.id = obj._id.toString();
    delete obj._id;
    delete obj.__v;

    if (obj.course && obj.course._id) {
        obj.course.id = obj.course._id.toString();
        delete obj.course._id;
        delete obj.course.__v;
    }
    if (obj.agent && obj.agent._id) {
        obj.agent.id = obj.agent._id.toString();
        delete obj.agent._id;
        delete obj.agent.__v;
    }
    if (obj.center && obj.center._id) {
        obj.center.id = obj.center._id.toString();
        delete obj.center._id;
        delete obj.center.__v;
    }
    return obj;
};

// GET - List leads based on user role
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
            // No filter
        } else if (session.role === 'AGENT') {
            query.agentId = session.id;
        } else if (session.role === 'CENTER') {
            const center = await Center.findOne({ userId: session.id });
            if (center) {
                query.centerId = center._id.toString(); // assuming string IDs in DB for refs or ObjectId matching
            } else {
                return NextResponse.json({ leads: [] });
            }
        }

        // Fetch leads with population
        // Note: For 'course', 'agent', 'center' fields in Lead schema are strings (refs usually work best with ObjectId).
        // Since I defined them as String in models.ts but generic refs often imply ObjectId.
        // If the seed data used string IDs (from generateId), population might fail if Mongoose expects ObjectId.
        // However, I changed seed data to use `_id.toString()`.
        // Mongoose `ref` usually requires ObjectId. If I stored strings, I might need "virtual populate" or manual lookup.
        // BUT, for now, let's assume I need to manually fetch or fix the schema to use ObjectId if I want real population.
        // The schema in `models.ts` defined these as String.
        // `centerId: { type: String, required: true }`.
        // So `.populate()` WON'T work out of the box unless I use virtuals with localField/foreignField.

        // Let's use manual population loop as it's safer given the mixed ID types risk, 
        // OR define virtuals. Manual loop is explicit and easy to debug.

        const leads = await Lead.find(query).sort({ createdAt: -1 });

        // Collect IDs to fetch in batch
        const courseIds = [...new Set(leads.map(l => l.courseId))];
        const agentIds = [...new Set(leads.map(l => l.agentId))];
        const centerIds = [...new Set(leads.map(l => l.centerId))];

        const courses = await Course.find({ _id: { $in: courseIds } });
        const agents = await User.find({ _id: { $in: agentIds } });
        const centers = await Center.find({ _id: { $in: centerIds } });

        const populatedLeads = leads.map(leadObj => {
            const lead = leadObj.toObject();
            lead.id = lead._id.toString();
            delete lead._id;
            delete lead.__v;

            const course = courses.find(c => c._id.toString() === lead.courseId);
            const agent = agents.find(u => u._id.toString() === lead.agentId);
            const center = centers.find(c => c._id.toString() === lead.centerId);

            return {
                ...lead,
                course: course ? { ...course.toObject(), id: course._id.toString() } : null,
                agent: agent ? { ...agent.toObject(), id: agent._id.toString() } : null,
                center: center ? { ...center.toObject(), id: center._id.toString() } : null,
            };
        });

        return NextResponse.json({ leads: populatedLeads });
    } catch (error) {
        console.error('Fetch leads error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch leads' },
            { status: 500 }
        );
    }
}

// POST - Create new lead
export async function POST(request: NextRequest) {
    try {
        await ensureInitialized();
        await connectDB();

        const session = await getCurrentUser();

        if (!session || session.role !== 'AGENT') {
            return NextResponse.json(
                { error: 'Only agents can create leads' },
                { status: 403 }
            );
        }

        const { studentName, phone, email, courseId, notes } = await request.json();

        if (!studentName || !phone || !courseId) {
            return NextResponse.json(
                { error: 'Student name, phone, and course are required' },
                { status: 400 }
            );
        }

        const course = await Course.findById(courseId);
        if (!course) {
            return NextResponse.json(
                { error: 'Invalid course' },
                { status: 400 }
            );
        }

        const newLead = await Lead.create({
            studentName,
            phone,
            email: email || undefined,
            courseId,
            agentId: session.id,
            centerId: course.centerId,
            status: 'NEW',
            notes: notes || undefined,
        });

        const leadObj = newLead.toObject();
        leadObj.id = leadObj._id.toString();
        delete leadObj._id;

        return NextResponse.json({
            success: true,
            lead: {
                ...leadObj,
                course: { ...course.toObject(), id: course._id.toString() },
            },
        });
    } catch (error) {
        console.error('Create lead error:', error);
        return NextResponse.json(
            { error: 'Failed to create lead' },
            { status: 500 }
        );
    }
}

