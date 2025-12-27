// Authentication utilities using Jose for JWT

import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { User } from '@/types';

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || 'your-super-secret-key-change-in-production'
);

const COOKIE_NAME = 'auth-token';

export async function createToken(user: User): Promise<string> {
    return await new SignJWT({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
    })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('7d')
        .sign(JWT_SECRET);
}

export async function verifyToken(token: string): Promise<{
    id: string;
    email: string;
    name: string;
    role: string;
} | null> {
    try {
        const { payload } = await jwtVerify(token, JWT_SECRET);
        return payload as {
            id: string;
            email: string;
            name: string;
            role: string;
        };
    } catch {
        return null;
    }
}

export async function setAuthCookie(token: string): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
    });
}

export async function getAuthCookie(): Promise<string | undefined> {
    const cookieStore = await cookies();
    return cookieStore.get(COOKIE_NAME)?.value;
}

export async function removeAuthCookie(): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.delete(COOKIE_NAME);
}

export async function getCurrentUser(): Promise<{
    id: string;
    email: string;
    name: string;
    role: string;
} | null> {
    const token = await getAuthCookie();
    if (!token) return null;
    return await verifyToken(token);
}
