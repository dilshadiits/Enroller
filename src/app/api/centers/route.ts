import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { ensureInitialized } from '@/lib/db';
import connectDB from '@/lib/mongodb';
import { Center } from '@/lib/models';

// GET - List all centers (Admin only)
export async function GET() {
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

        if (session.role !== 'ADMIN') {
            return NextResponse.json(
                { error: 'Only admins can view centers' },
                { status: 403 }
            );
        }

        const centers = await Center.find({}).sort({ createdAt: -1 });

        const centerList = centers.map(center => ({
            id: center._id.toString(),
            name: center.name,
            contactPerson: center.contactPerson,
            phone: center.phone,
            email: center.email,
        }));

        return NextResponse.json({ centers: centerList });
    } catch (error) {
        console.error('Fetch centers error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch centers' },
            { status: 500 }
        );
    }
}

