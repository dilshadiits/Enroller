// MongoDB adapter and helper functions
import connectDB from './mongodb';
import { User, Center, Course, Lead, Commission, Payout } from './models';
import bcrypt from 'bcryptjs';

// Cache flag to prevent repeated initialization
let isInitialized = false;

// Function to ensure database is initialized with seed data
export async function ensureInitialized() {
    // Skip if already initialized in this server instance
    if (isInitialized) {
        await connectDB(); // Still ensure connection
        return;
    }

    await connectDB();

    // Check if admin exists
    const adminCount = await User.countDocuments({ role: 'ADMIN' });

    if (adminCount === 0) {
        console.log('Seeding database...');
        const hashedPassword = await bcrypt.hash('admin123', 10);

        // Create admin user
        await User.create({
            email: 'admin@edman.com',
            password: hashedPassword,
            name: 'System Admin',
            role: 'ADMIN',
        });

        // Create sample center user
        const centerUser = await User.create({
            email: 'center@edman.com',
            password: hashedPassword,
            name: 'Demo Center',
            role: 'CENTER',
            phone: '+91 9876543210',
        });

        // Create sample agent user
        await User.create({
            email: 'agent@edman.com',
            password: hashedPassword,
            name: 'Demo Agent',
            role: 'AGENT',
            phone: '+91 9876543211',
        });

        // Create center
        const center = await Center.create({
            name: 'Main Training Center',
            address: '123 Education Street, Learning City',
            contactPerson: 'John Manager',
            phone: '+91 9876543210',
            email: 'center@edman.com',
            userId: centerUser._id.toString(), // Store as string
        });

        // Create sample courses
        await Course.create([
            {
                name: 'Web Development Bootcamp',
                description: 'Complete web development course covering HTML, CSS, JavaScript, React, and Node.js',
                courseType: 'skill_course',
                fee: 25000,
                commissionPercent: 10,
                centerId: center._id.toString(),
                isActive: true,
            },
            {
                name: 'Data Science Fundamentals',
                description: 'Learn Python, Machine Learning, and Data Analysis',
                courseType: 'online_degree',
                fee: 35000,
                commissionPercent: 10,
                centerId: center._id.toString(),
                isActive: true,
            },
            {
                name: 'Digital Marketing Mastery',
                description: 'SEO, Social Media Marketing, Google Ads, and Content Strategy',
                courseType: 'vocational',
                fee: 15000,
                commissionPercent: 15,
                centerId: center._id.toString(),
                isActive: true,
            }
        ]);

        console.log('Database seeded successfully');
    }

    // Mark as initialized to skip checks on subsequent requests
    isInitialized = true;
}

// Helpers - these are now Async wrappers or direct exports of models if needed
// But preserving the function signatures as async helps migration

export async function findUserByEmail(email: string) {
    await connectDB();
    const user = await User.findOne({ email });
    return user ? mapDoc(user) : null;
}

export async function findUserById(id: string) {
    await connectDB();
    const user = await User.findById(id);
    return user ? mapDoc(user) : null;
}

// Helper to convert Mongoose document to plain object and map _id to id
function mapDoc(doc: any) {
    if (!doc) return null;
    const obj = doc.toObject ? doc.toObject() : doc;
    obj.id = obj._id.toString();
    delete obj._id;
    delete obj.__v;
    return obj;
}

