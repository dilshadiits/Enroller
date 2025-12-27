import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { findUserById, ensureInitialized } from '@/lib/db';

export async function GET() {
    try {
        // Ensure database is initialized
        await ensureInitialized();

        const session = await getCurrentUser();

        if (!session) {
            return NextResponse.json(
                { error: 'Not authenticated' },
                { status: 401 }
            );
        }

        const user = await findUserById(session.id);

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                phone: user.phone,
            },
        });
    } catch (error) {
        console.error('Auth check error:', error);
        return NextResponse.json(
            { error: 'Authentication failed' },
            { status: 500 }
        );
    }
}
