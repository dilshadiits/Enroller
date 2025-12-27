import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getCurrentUser } from '@/lib/auth';
import { ensureInitialized } from '@/lib/db';
import connectDB from '@/lib/mongodb';
import { User, Center } from '@/lib/models';
import { UserRole } from '@/types';

// GET - Get single user
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await ensureInitialized();
        await connectDB();
        const session = await getCurrentUser();
        const { id } = await params;

        if (!session || session.role !== 'ADMIN') {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 403 }
            );
        }

        const user = await User.findById(id);
        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            user: {
                id: user._id.toString(),
                email: user.email,
                name: user.name,
                role: user.role,
                phone: user.phone,
                createdAt: user.createdAt,
            },
        });
    } catch (error) {
        console.error('Fetch user error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch user' },
            { status: 500 }
        );
    }
}

// PUT - Update user
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await ensureInitialized();
        await connectDB();
        const session = await getCurrentUser();
        const { id } = await params;

        if (!session || session.role !== 'ADMIN') {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 403 }
            );
        }

        const user = await User.findById(id);

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        const { name, email, phone, role, password } = await request.json();

        // Validate role if provided
        if (role) {
            const validRoles: UserRole[] = ['AGENT', 'CENTER', 'ADMIN'];
            if (!validRoles.includes(role)) {
                return NextResponse.json(
                    { error: 'Invalid role' },
                    { status: 400 }
                );
            }
        }

        // Check email uniqueness if changed
        if (email && email.toLowerCase() !== user.email.toLowerCase()) {
            const existingUser = await User.findOne({ email: email.toLowerCase() });
            if (existingUser) {
                return NextResponse.json(
                    { error: 'Email already in use' },
                    { status: 400 }
                );
            }
        }

        // Update user fields
        if (name) user.name = name;
        if (email) user.email = email.toLowerCase();
        if (phone !== undefined) user.phone = phone;
        if (role) user.role = role;
        if (password && password.length >= 6) {
            user.password = await bcrypt.hash(password, 10);
        }
        user.updatedAt = new Date(); // Mongoose timestamps handles this usually, but strict typing might need it if used

        await user.save();

        // Update associated center if it's a center user
        if (user.role === 'CENTER') {
            const center = await Center.findOne({ userId: id });
            if (center) {
                if (name) center.name = name;
                if (email) center.email = email.toLowerCase();
                if (phone) center.phone = phone;
                // center.updatedAt auto processed
                await center.save();
            }
        }

        return NextResponse.json({
            success: true,
            message: 'User updated successfully',
            user: {
                id: user._id.toString(),
                email: user.email,
                name: user.name,
                role: user.role,
                phone: user.phone,
            },
        });
    } catch (error) {
        console.error('Update user error:', error);
        return NextResponse.json(
            { error: 'Failed to update user' },
            { status: 500 }
        );
    }
}

// DELETE - Delete user
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await ensureInitialized();
        await connectDB();
        const session = await getCurrentUser();
        const { id } = await params;

        if (!session || session.role !== 'ADMIN') {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 403 }
            );
        }

        // Prevent self-deletion
        if (session.id === id) {
            return NextResponse.json(
                { error: 'Cannot delete your own account' },
                { status: 400 }
            );
        }

        const user = await User.findById(id);

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        // Delete associated center if it's a center user
        if (user.role === 'CENTER') {
            await Center.findOneAndDelete({ userId: id });
        }

        // Remove user
        await User.findByIdAndDelete(id);

        return NextResponse.json({
            success: true,
            message: 'User deleted successfully',
        });
    } catch (error) {
        console.error('Delete user error:', error);
        return NextResponse.json(
            { error: 'Failed to delete user' },
            { status: 500 }
        );
    }
}

