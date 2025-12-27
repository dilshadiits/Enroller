import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { ensureInitialized } from '@/lib/db';
import connectDB from '@/lib/mongodb';
import { Course, Center } from '@/lib/models';

// GET - Get single course
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await ensureInitialized();
        await connectDB();
        const { id } = await params;

        const course = await Course.findById(id);
        if (!course) {
            return NextResponse.json(
                { error: 'Course not found' },
                { status: 404 }
            );
        }

        const center = await Center.findById(course.centerId);

        const courseObj = course.toObject();
        courseObj.id = courseObj._id.toString();
        delete courseObj._id;
        delete courseObj.__v;

        return NextResponse.json({
            course: {
                ...courseObj,
                center: center ? { id: center._id.toString(), name: center.name } : null,
            },
        });
    } catch (error) {
        console.error('Fetch course error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch course' },
            { status: 500 }
        );
    }
}

// PUT - Update course (Admin only)
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

        const updates = await request.json();

        // Remove undefined fields
        Object.keys(updates).forEach(key => updates[key] === undefined && delete updates[key]);

        // Validate center if changed
        if (updates.centerId) {
            const center = await Center.findById(updates.centerId);
            if (!center) {
                return NextResponse.json(
                    { error: 'Invalid center' },
                    { status: 400 }
                );
            }
        }

        const updatedCourse = await Course.findByIdAndUpdate(
            id,
            { ...updates, updatedAt: new Date() },
            { new: true }
        );

        if (!updatedCourse) {
            return NextResponse.json(
                { error: 'Course not found' },
                { status: 404 }
            );
        }

        const center = await Center.findById(updatedCourse.centerId);

        const courseObj = updatedCourse.toObject();
        courseObj.id = courseObj._id.toString();
        delete courseObj._id;
        delete courseObj.__v;

        return NextResponse.json({
            success: true,
            message: 'Course updated successfully',
            course: {
                ...courseObj,
                center: center ? { id: center._id.toString(), name: center.name } : null,
            },
        });
    } catch (error) {
        console.error('Update course error:', error);
        return NextResponse.json(
            { error: 'Failed to update course' },
            { status: 500 }
        );
    }
}

// DELETE - Delete course (Admin only)
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

        const deletedCourse = await Course.findByIdAndDelete(id);

        if (!deletedCourse) {
            return NextResponse.json(
                { error: 'Course not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Course deleted successfully',
        });
    } catch (error) {
        console.error('Delete course error:', error);
        return NextResponse.json(
            { error: 'Failed to delete course' },
            { status: 500 }
        );
    }
}

