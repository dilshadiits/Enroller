module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/node:buffer [external] (node:buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:buffer", () => require("node:buffer"));

module.exports = mod;
}),
"[externals]/node:crypto [external] (node:crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:crypto", () => require("node:crypto"));

module.exports = mod;
}),
"[externals]/node:util [external] (node:util, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:util", () => require("node:util"));

module.exports = mod;
}),
"[project]/src/lib/auth.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createToken",
    ()=>createToken,
    "getAuthCookie",
    ()=>getAuthCookie,
    "getCurrentUser",
    ()=>getCurrentUser,
    "removeAuthCookie",
    ()=>removeAuthCookie,
    "setAuthCookie",
    ()=>setAuthCookie,
    "verifyToken",
    ()=>verifyToken
]);
// Authentication utilities using Jose for JWT
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$jwt$2f$sign$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jose/dist/node/esm/jwt/sign.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$jwt$2f$verify$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/jose/dist/node/esm/jwt/verify.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/headers.js [app-route] (ecmascript)");
;
;
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'your-super-secret-key-change-in-production');
const COOKIE_NAME = 'auth-token';
async function createToken(user) {
    return await new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$jwt$2f$sign$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SignJWT"]({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
    }).setProtectedHeader({
        alg: 'HS256'
    }).setIssuedAt().setExpirationTime('7d').sign(JWT_SECRET);
}
async function verifyToken(token) {
    try {
        const { payload } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$jose$2f$dist$2f$node$2f$esm$2f$jwt$2f$verify$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jwtVerify"])(token, JWT_SECRET);
        return payload;
    } catch  {
        return null;
    }
}
async function setAuthCookie(token) {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cookies"])();
    cookieStore.set(COOKIE_NAME, token, {
        httpOnly: true,
        secure: ("TURBOPACK compile-time value", "development") === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7,
        path: '/'
    });
}
async function getAuthCookie() {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cookies"])();
    return cookieStore.get(COOKIE_NAME)?.value;
}
async function removeAuthCookie() {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cookies"])();
    cookieStore.delete(COOKIE_NAME);
}
async function getCurrentUser() {
    const token = await getAuthCookie();
    if (!token) return null;
    return await verifyToken(token);
}
}),
"[project]/src/lib/mongodb.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs, [project]/node_modules/mongoose)");
;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://dilshadbvoc_db_user:enroller123@enroller.edixhqh.mongodb.net/?appName=Enroller';
if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
let cached = global.mongoose;
if (!cached) {
    cached = global.mongoose = {
        conn: null,
        promise: null
    };
}
async function connectDB() {
    if (cached.conn) {
        return cached.conn;
    }
    if (!cached.promise) {
        const opts = {
            bufferCommands: false
        };
        cached.promise = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].connect(MONGODB_URI, opts).then((mongoose)=>{
            return mongoose;
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
const __TURBOPACK__default__export__ = connectDB;
}),
"[project]/src/lib/models.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Center",
    ()=>Center,
    "Commission",
    ()=>Commission,
    "Course",
    ()=>Course,
    "Lead",
    ()=>Lead,
    "Payout",
    ()=>Payout,
    "User",
    ()=>User
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs, [project]/node_modules/mongoose)");
;
// Interfaces for Mongoose Documents (extending generated types)
// We use the existing interfaces from @/types but omit 'id' as Mongoose uses '_id'
// We'll handle the conversion in the response helpers or usage.
// --- User Model ---
const UserSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["Schema"]({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: [
            'ADMIN',
            'AGENT',
            'CENTER'
        ],
        default: 'AGENT'
    },
    phone: {
        type: String
    }
}, {
    timestamps: true
});
// --- Center Model ---
const CenterSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["Schema"]({
    name: {
        type: String,
        required: true
    },
    address: {
        type: String
    },
    contactPerson: {
        type: String
    },
    phone: {
        type: String
    },
    email: {
        type: String
    },
    userId: {
        type: String,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});
// --- Course Model ---
const CourseSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["Schema"]({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    courseType: {
        type: String,
        enum: [
            'online_degree',
            'credit_transfer',
            'skill_course',
            'vocational'
        ],
        required: true
    },
    fee: {
        type: Number,
        required: true
    },
    commissionPercent: {
        type: Number,
        required: true
    },
    centerId: {
        type: String,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});
// --- Lead Model ---
const LeadSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["Schema"]({
    studentName: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    email: {
        type: String
    },
    courseId: {
        type: String,
        required: true
    },
    agentId: {
        type: String,
        required: true
    },
    centerId: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: [
            'NEW',
            'CONTACTED',
            'INTERESTED',
            'ENROLLED',
            'CLOSED',
            'LOST'
        ],
        default: 'NEW'
    },
    notes: {
        type: String
    },
    followUpDate: {
        type: Date
    },
    closedAt: {
        type: Date
    }
}, {
    timestamps: true
});
// --- Commission Model ---
const CommissionSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["Schema"]({
    leadId: {
        type: String,
        required: true
    },
    agentId: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: [
            'PENDING',
            'APPROVED',
            'PAID'
        ],
        default: 'PENDING'
    },
    paidAt: {
        type: Date
    }
}, {
    timestamps: true
});
// --- Payout Model ---
const PayoutSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["Schema"]({
    agentId: {
        type: String,
        required: true
    },
    totalAmount: {
        type: Number,
        required: true
    },
    commissionIds: [
        {
            type: String
        }
    ],
    status: {
        type: String,
        enum: [
            'REQUESTED',
            'APPROVED',
            'PAID',
            'REJECTED'
        ],
        default: 'REQUESTED'
    },
    approvedAt: {
        type: Date
    },
    paidAt: {
        type: Date
    },
    notes: {
        type: String
    }
}, {
    timestamps: true
});
// Helper to prevent overwriting models during hot reloads
const getModel = (name, schema)=>{
    return __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].models[name] || __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$mongoose$29$__["default"].model(name, schema);
};
const User = getModel('User', UserSchema);
const Center = getModel('Center', CenterSchema);
const Course = getModel('Course', CourseSchema);
const Lead = getModel('Lead', LeadSchema);
const Commission = getModel('Commission', CommissionSchema);
const Payout = getModel('Payout', PayoutSchema);
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[project]/src/lib/db.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ensureInitialized",
    ()=>ensureInitialized,
    "findUserByEmail",
    ()=>findUserByEmail,
    "findUserById",
    ()=>findUserById
]);
// MongoDB adapter and helper functions
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/mongodb.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$models$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/models.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/bcryptjs/index.js [app-route] (ecmascript)");
;
;
;
async function ensureInitialized() {
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])();
    // Check if admin exists
    const adminCount = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$models$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["User"].countDocuments({
        role: 'ADMIN'
    });
    if (adminCount === 0) {
        console.log('Seeding database...');
        const hashedPassword = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].hash('admin123', 10);
        // Create admin user
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$models$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["User"].create({
            email: 'admin@edman.com',
            password: hashedPassword,
            name: 'System Admin',
            role: 'ADMIN'
        });
        // Create sample center user
        const centerUser = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$models$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["User"].create({
            email: 'center@edman.com',
            password: hashedPassword,
            name: 'Demo Center',
            role: 'CENTER',
            phone: '+91 9876543210'
        });
        // Create sample agent user
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$models$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["User"].create({
            email: 'agent@edman.com',
            password: hashedPassword,
            name: 'Demo Agent',
            role: 'AGENT',
            phone: '+91 9876543211'
        });
        // Create center
        const center = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$models$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Center"].create({
            name: 'Main Training Center',
            address: '123 Education Street, Learning City',
            contactPerson: 'John Manager',
            phone: '+91 9876543210',
            email: 'center@edman.com',
            userId: centerUser._id.toString()
        });
        // Create sample courses
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$models$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Course"].create([
            {
                name: 'Web Development Bootcamp',
                description: 'Complete web development course covering HTML, CSS, JavaScript, React, and Node.js',
                courseType: 'skill_course',
                fee: 25000,
                commissionPercent: 10,
                centerId: center._id.toString(),
                isActive: true
            },
            {
                name: 'Data Science Fundamentals',
                description: 'Learn Python, Machine Learning, and Data Analysis',
                courseType: 'online_degree',
                fee: 35000,
                commissionPercent: 10,
                centerId: center._id.toString(),
                isActive: true
            },
            {
                name: 'Digital Marketing Mastery',
                description: 'SEO, Social Media Marketing, Google Ads, and Content Strategy',
                courseType: 'vocational',
                fee: 15000,
                commissionPercent: 15,
                centerId: center._id.toString(),
                isActive: true
            }
        ]);
        console.log('Database seeded successfully');
    }
}
async function findUserByEmail(email) {
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])();
    const user = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$models$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["User"].findOne({
        email
    });
    return user ? mapDoc(user) : null;
}
async function findUserById(id) {
    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])();
    const user = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$models$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["User"].findById(id);
    return user ? mapDoc(user) : null;
}
// Helper to convert Mongoose document to plain object and map _id to id
function mapDoc(doc) {
    if (!doc) return null;
    const obj = doc.toObject ? doc.toObject() : doc;
    obj.id = obj._id.toString();
    delete obj._id;
    delete obj.__v;
    return obj;
}
}),
"[project]/src/app/api/leads/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/auth.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/db.ts [app-route] (ecmascript)"); // Keep this for now to ensure seed
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/mongodb.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$models$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/models.ts [app-route] (ecmascript)"); // Import generic models
;
;
;
;
;
// Helper to map Mongoose doc (handling populated fields)
const mapLead = (lead)=>{
    const obj = lead.toObject ? lead.toObject() : lead;
    obj.id = obj._id.toString();
    delete obj._id;
    delete obj.__v;
    if (obj.course && obj.course._id) {
        obj.course.id = obj.course._id.toString();
        delete obj.course._id;
        delete obj.course.__v;
    }
    if (obj.agent && obj.agent._id) {
        obj.agent.id = obj.agent._id.toString();
        delete obj.agent._id;
        delete obj.agent.__v;
    }
    if (obj.center && obj.center._id) {
        obj.center.id = obj.center._id.toString();
        delete obj.center._id;
        delete obj.center.__v;
    }
    return obj;
};
async function GET(request) {
    try {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ensureInitialized"])();
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])();
        const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getCurrentUser"])();
        if (!session) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Not authenticated'
            }, {
                status: 401
            });
        }
        let query = {};
        if (session.role === 'ADMIN') {
        // No filter
        } else if (session.role === 'AGENT') {
            query.agentId = session.id;
        } else if (session.role === 'CENTER') {
            const center = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$models$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Center"].findOne({
                userId: session.id
            });
            if (center) {
                query.centerId = center._id.toString(); // assuming string IDs in DB for refs or ObjectId matching
            } else {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    leads: []
                });
            }
        }
        // Fetch leads with population
        // Note: For 'course', 'agent', 'center' fields in Lead schema are strings (refs usually work best with ObjectId).
        // Since I defined them as String in models.ts but generic refs often imply ObjectId.
        // If the seed data used string IDs (from generateId), population might fail if Mongoose expects ObjectId.
        // However, I changed seed data to use `_id.toString()`.
        // Mongoose `ref` usually requires ObjectId. If I stored strings, I might need "virtual populate" or manual lookup.
        // BUT, for now, let's assume I need to manually fetch or fix the schema to use ObjectId if I want real population.
        // The schema in `models.ts` defined these as String.
        // `centerId: { type: String, required: true }`.
        // So `.populate()` WON'T work out of the box unless I use virtuals with localField/foreignField.
        // Let's use manual population loop as it's safer given the mixed ID types risk, 
        // OR define virtuals. Manual loop is explicit and easy to debug.
        const leads = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$models$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Lead"].find(query).sort({
            createdAt: -1
        });
        // Collect IDs to fetch in batch
        const courseIds = [
            ...new Set(leads.map((l)=>l.courseId))
        ];
        const agentIds = [
            ...new Set(leads.map((l)=>l.agentId))
        ];
        const centerIds = [
            ...new Set(leads.map((l)=>l.centerId))
        ];
        const courses = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$models$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Course"].find({
            _id: {
                $in: courseIds
            }
        });
        const agents = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$models$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["User"].find({
            _id: {
                $in: agentIds
            }
        });
        const centers = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$models$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Center"].find({
            _id: {
                $in: centerIds
            }
        });
        const populatedLeads = leads.map((leadObj)=>{
            const lead = leadObj.toObject();
            lead.id = lead._id.toString();
            delete lead._id;
            delete lead.__v;
            const course = courses.find((c)=>c._id.toString() === lead.courseId);
            const agent = agents.find((u)=>u._id.toString() === lead.agentId);
            const center = centers.find((c)=>c._id.toString() === lead.centerId);
            return {
                ...lead,
                course: course ? {
                    ...course.toObject(),
                    id: course._id.toString()
                } : null,
                agent: agent ? {
                    ...agent.toObject(),
                    id: agent._id.toString()
                } : null,
                center: center ? {
                    ...center.toObject(),
                    id: center._id.toString()
                } : null
            };
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            leads: populatedLeads
        });
    } catch (error) {
        console.error('Fetch leads error:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Failed to fetch leads'
        }, {
            status: 500
        });
    }
}
async function POST(request) {
    try {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ensureInitialized"])();
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])();
        const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getCurrentUser"])();
        if (!session || session.role !== 'AGENT') {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Only agents can create leads'
            }, {
                status: 403
            });
        }
        const { studentName, phone, email, courseId, notes } = await request.json();
        if (!studentName || !phone || !courseId) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Student name, phone, and course are required'
            }, {
                status: 400
            });
        }
        const course = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$models$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Course"].findById(courseId);
        if (!course) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Invalid course'
            }, {
                status: 400
            });
        }
        const newLead = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$models$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Lead"].create({
            studentName,
            phone,
            email: email || undefined,
            courseId,
            agentId: session.id,
            centerId: course.centerId,
            status: 'NEW',
            notes: notes || undefined
        });
        const leadObj = newLead.toObject();
        leadObj.id = leadObj._id.toString();
        delete leadObj._id;
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            lead: {
                ...leadObj,
                course: {
                    ...course.toObject(),
                    id: course._id.toString()
                }
            }
        });
    } catch (error) {
        console.error('Create lead error:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Failed to create lead'
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__002acf61._.js.map