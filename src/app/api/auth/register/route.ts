import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { ensureInitialized } from '@/lib/db';
import connectDB from '@/lib/mongodb';
import { User, Center } from '@/lib/models';
import { UserRole } from '@/types';

export async function POST(request: NextRequest) {
    try {
        await ensureInitialized();
        await connectDB();

        const { email, password, name, role, phone } = await request.json();

        // Validation
        if (!email || !password || !name || !role) {
            return NextResponse.json(
                { error: 'All fields are required' },
                { status: 400 }
            );
        }

        if (password.length < 6) {
            return NextResponse.json(
                { error: 'Password must be at least 6 characters' },
                { status: 400 }
            );
        }

        const validRoles: UserRole[] = ['AGENT', 'CENTER'];
        if (!validRoles.includes(role)) {
            return NextResponse.json(
                { error: 'Invalid role' },
                { status: 400 }
            );
        }

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

        // If registering as a center, create a center record
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
            message: 'Registration successful',
            user: {
                id: newUser._id.toString(),
                email: newUser.email,
                name: newUser.name,
                role: newUser.role,
            },
        });
    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json(
            { error: 'Registration failed' },
            { status: 500 }
        );
    }
}

