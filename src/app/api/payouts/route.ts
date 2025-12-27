import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { ensureInitialized } from '@/lib/db';
import connectDB from '@/lib/mongodb';
import { Payout, Commission, User } from '@/lib/models';

// GET - Get payouts
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
                { error: 'Only agents and admins can view payouts' },
                { status: 403 }
            );
        }

        const payouts = await Payout.find(query).sort({ requestedAt: -1 });

        // Populate agent info
        const agentIds = [...new Set(payouts.map(p => p.agentId))];
        const agents = await User.find({ _id: { $in: agentIds } });

        const populatedPayouts = payouts.map(payout => {
            const payoutObj = payout.toObject();
            payoutObj.id = payoutObj._id.toString();
            delete payoutObj._id;
            delete payoutObj.__v;

            const agent = agents.find(u => u._id.toString() === payout.agentId);
            return {
                ...payoutObj,
                agent: agent ? {
                    id: agent._id.toString(),
                    name: agent.name,
                    email: agent.email,
                } : null,
            };
        });

        return NextResponse.json({ payouts: populatedPayouts });
    } catch (error) {
        console.error('Fetch payouts error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch payouts' },
            { status: 500 }
        );
    }
}

// POST - Request new payout
export async function POST(request: NextRequest) {
    try {
        await ensureInitialized();
        await connectDB();

        const session = await getCurrentUser();

        if (!session || session.role !== 'AGENT') {
            return NextResponse.json(
                { error: 'Only agents can request payouts' },
                { status: 403 }
            );
        }

        const { commissionIds } = await request.json();

        if (!commissionIds || !Array.isArray(commissionIds) || commissionIds.length === 0) {
            return NextResponse.json(
                { error: 'Please select commissions for payout' },
                { status: 400 }
            );
        }

        // Verify all commissions belong to the agent and are PENDING
        // Mongoose query to find matching documents
        const agentCommissions = await Commission.find({
            _id: { $in: commissionIds },
            agentId: session.id,
            status: 'PENDING'
        });

        if (agentCommissions.length !== commissionIds.length) {
            return NextResponse.json(
                { error: 'Some commissions are invalid or already processed' },
                { status: 400 }
            );
        }

        // Calculate total
        const totalAmount = agentCommissions.reduce((sum, c) => sum + c.amount, 0);

        // Create payout
        const newPayout = await Payout.create({
            agentId: session.id,
            totalAmount,
            commissionIds,
            status: 'REQUESTED',
            requestedAt: new Date(),
        });

        // Update commission statuses to APPROVED (pending payout)
        await Commission.updateMany(
            { _id: { $in: commissionIds } },
            {
                status: 'APPROVED',
                updatedAt: new Date()
            }
        );

        const payoutObj = newPayout.toObject();
        payoutObj.id = payoutObj._id.toString();
        delete payoutObj._id;

        return NextResponse.json({
            success: true,
            payout: payoutObj,
        });
    } catch (error) {
        console.error('Create payout error:', error);
        return NextResponse.json(
            { error: 'Failed to create payout request' },
            { status: 500 }
        );
    }
}

