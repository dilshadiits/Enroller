import { NextRequest, NextResponse } from 'next/server';
import { ensureInitialized } from '@/lib/db';
import connectDB from '@/lib/mongodb';
import { Payout, Commission, User } from '@/lib/models';

export async function GET(request: NextRequest) {
    try {
        await ensureInitialized();
        await connectDB();

        const payoutCount = await Payout.countDocuments();
        const commissionCount = await Commission.countDocuments();
        const userCount = await User.countDocuments();

        const latestPayouts = await Payout.find().sort({ createdAt: -1 }).limit(5);

        return NextResponse.json({
            counts: {
                payouts: payoutCount,
                commissions: commissionCount,
                users: userCount
            },
            latestPayouts
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
