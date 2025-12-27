import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { ensureInitialized } from '@/lib/db';
import connectDB from '@/lib/mongodb';
import { Payout, Commission } from '@/lib/models';

// PUT - Approve or reject payout (admin only)
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await ensureInitialized();
        await connectDB();
        const session = await getCurrentUser();

        if (!session || session.role !== 'ADMIN') {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 403 }
            );
        }

        const { id } = await params;
        const payout = await Payout.findById(id);

        if (!payout) {
            return NextResponse.json(
                { error: 'Payout not found' },
                { status: 404 }
            );
        }

        const { action, notes } = await request.json();

        if (!['APPROVE', 'REJECT', 'MARK_PAID'].includes(action)) {
            return NextResponse.json(
                { error: 'Invalid action' },
                { status: 400 }
            );
        }

        if (action === 'APPROVE') {
            payout.status = 'APPROVED';
            payout.approvedAt = new Date();
        } else if (action === 'REJECT') {
            payout.status = 'REJECTED';
            // Revert commission statuses back to PENDING
            await Commission.updateMany(
                { _id: { $in: payout.commissionIds } },
                {
                    status: 'PENDING',
                    updatedAt: new Date()
                }
            );
        } else if (action === 'MARK_PAID') {
            payout.status = 'PAID';
            payout.paidAt = new Date();
            // Mark all commissions as PAID
            await Commission.updateMany(
                { _id: { $in: payout.commissionIds } },
                {
                    status: 'PAID',
                    paidAt: new Date(),
                    updatedAt: new Date()
                }
            );
        }

        if (notes) {
            payout.notes = notes;
        }

        await payout.save();

        const payoutObj = payout.toObject();
        payoutObj.id = payoutObj._id.toString();
        delete payoutObj._id;
        delete payoutObj.__v;

        return NextResponse.json({
            success: true,
            payout: payoutObj,
        });
    } catch (error) {
        console.error('Update payout error:', error);
        return NextResponse.json(
            { error: 'Failed to update payout' },
            { status: 500 }
        );
    }
}

