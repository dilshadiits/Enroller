import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { ensureInitialized } from '@/lib/db';
import connectDB from '@/lib/mongodb';
import { Course, Center } from '@/lib/models';

export async function GET() {
    try {
        await ensureInitialized();
        await connectDB();

        const session = await getCurrentUser();

        let query: any = {};

        if (session?.role === 'ADMIN') {
            // Admin sees all courses including inactive
        } else if (session?.role === 'CENTER') {
            const center = await Center.findOne({ userId: session.id });
            if (center) {
                query.centerId = center._id.toString();
            } else {
                return NextResponse.json({ courses: [] });
            }
        } else {
            // Agents and public see only active courses
            query.isActive = true;
        }

        const courses = await Course.find(query).sort({ createdAt: -1 });

        // Include center info with each course
        // Fetch unique center IDs
        const centerIds = [...new Set(courses.map(c => c.centerId))];
        const centers = await Center.find({ _id: { $in: centerIds } });

        const coursesWithCenter = courses.map(course => {
            const courseObj = course.toObject();
            courseObj.id = courseObj._id.toString();
            delete courseObj._id;
            delete courseObj.__v;

            const center = centers.find(c => c._id.toString() === course.centerId);
            return {
                ...courseObj,
                center: center ? {
                    id: center._id.toString(),
                    name: center.name,
                } : null,
            };
        });

        return NextResponse.json({ courses: coursesWithCenter });
    } catch (error) {
        console.error('Fetch courses error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch courses' },
            { status: 500 }
        );
    }
}

// POST - Create new course (Admin only)
export async function POST(request: NextRequest) {
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
                { error: 'Only admins can create courses' },
                { status: 403 }
            );
        }

        const { name, description, courseType, fee, commissionPercent, centerId, isActive } = await request.json();

        // Validation
        if (!name || !fee || !commissionPercent || !centerId) {
            return NextResponse.json(
                { error: 'Name, fee, commission percent, and center are required' },
                { status: 400 }
            );
        }

        // Verify center exists
        const center = await Center.findById(centerId);
        if (!center) {
            return NextResponse.json(
                { error: 'Invalid center' },
                { status: 400 }
            );
        }

        const newCourse = await Course.create({
            name,
            description: description || '',
            courseType: courseType || 'skill_course',
            fee: Number(fee),
            commissionPercent: Number(commissionPercent),
            centerId,
            isActive: isActive !== false,
        });

        const courseObj = newCourse.toObject();
        courseObj.id = courseObj._id.toString();
        delete courseObj._id;

        return NextResponse.json({
            success: true,
            course: {
                ...courseObj,
                center: {
                    id: center._id.toString(),
                    name: center.name,
                },
            },
        });
    } catch (error) {
        console.error('Create course error:', error);
        return NextResponse.json(
            { error: 'Failed to create course' },
            { status: 500 }
        );
    }
}

