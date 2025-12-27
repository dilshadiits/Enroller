import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.warn('⚠️  MONGODB_URI is not defined in environment variables. Using fallback/hardcoded connection string if available, or failing.');
    // Fallback logic could go here if you really want to keep it, but it's safer to rely on Env Vars.
    // modifying the logic to STRICTLY require env var for better debugging
    // But to respect the existing code's fallback (which I saw in the file view), I will re-implement the fallback logic but with a log.
}

const uri = MONGODB_URI || 'mongodb+srv://dilshadbvoc_db_user:enroller123@enroller.edixhqh.mongodb.net/?appName=Enroller';

if (uri === 'mongodb+srv://dilshadbvoc_db_user:enroller123@enroller.edixhqh.mongodb.net/?appName=Enroller') {
    console.warn('⚠️  Using HARDCODED connection string. This is not recommended for production.');
} else {
    console.log('Using configured MONGODB_URI from environment.');
}

if (!uri) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

interface MongooseCache {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
}

// Global interface generic extension for TypeScript
declare global {
    var mongoose: MongooseCache;
}

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
            serverSelectionTimeoutMS: 5000, // Fail after 5 seconds if cannot connect
            socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
        };

        cached.promise = mongoose.connect(uri, opts).then((mongoose) => {
            console.log('✅ MongoDB Connected Successfully');
            return mongoose;
        }).catch((error) => {
            console.error('❌ MongoDB Connection Error:', error);
            throw error;
        });
    }

    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        throw e;
    }

    return cached.conn;
}

export default connectDB;
