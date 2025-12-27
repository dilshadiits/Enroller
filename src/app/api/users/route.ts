import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getCurrentUser } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import { User, Center } from '@/lib/models';
import { UserRole } from '@/types';

// GET - List all users (admin only)
export async function GET(request: NextRequest) {
    try {
        const session = await getCurrentUser();

        if (!session || session.role !== 'ADMIN') {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 403 }
            );
        }

        await connectDB();
        const users = await User.find({}).sort({ createdAt: -1 });

        // Return users without passwords
        const safeUsers = users.map(user => ({
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
            phone: user.phone,
            createdAt: user.createdAt,
        }));

        return NextResponse.json({ users: safeUsers });
    } catch (error) {
        console.error('Fetch users error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch users' },
            { status: 500 }
        );
    }
}

// POST - Create new user (admin only)
export async function POST(request: NextRequest) {
    try {
        const session = await getCurrentUser();

        if (!session || session.role !== 'ADMIN') {
            return NextResponse.json(
                { error: 'Unauthorized - Admin access required' },
                { status: 403 }
            );
        }

        const { email, password, name, role, phone } = await request.json();

        // Validation
        if (!email || !password || !name || !role) {
            return NextResponse.json(
                { error: 'Email, password, name, and role are required' },
                { status: 400 }
            );
        }

        if (password.length < 6) {
            return NextResponse.json(
                { error: 'Password must be at least 6 characters' },
                { status: 400 }
            );
        }

        const validRoles: UserRole[] = ['AGENT', 'CENTER', 'ADMIN'];
        if (!validRoles.includes(role)) {
            return NextResponse.json(
                { error: 'Invalid role' },
                { status: 400 }
            );
        }

        await connectDB();

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json(
                { error: 'Email already registered' },
                { status: 400 }
            );
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const newUser = await User.create({
            email: email.toLowerCase(),
            password: hashedPassword,
            name,
            role,
            phone,
        });

        // If creating a center, also create a center record
        if (role === 'CENTER') {
            await Center.create({
                name: name,
                address: '',
                contactPerson: name,
                phone: phone,
                email: email.toLowerCase(),
                userId: newUser._id.toString(),
            });
        }

        return NextResponse.json({
            success: true,
            message: 'User created successfully',
            user: {
                id: newUser._id.toString(),
                email: newUser.email,
                name: newUser.name,
                role: newUser.role,
            },
        });
    } catch (error) {
        console.error('Create user error:', error);
        return NextResponse.json(
            { error: 'Failed to create user' },
            { status: 500 }
        );
    }
}

