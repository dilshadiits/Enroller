const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://dilshadbvoc_db_user:enroller123@enroller.edixhqh.mongodb.net/?appName=Enroller';

console.log('🔄 Attempting to connect to MongoDB Atlas...');
console.log(`📡 URI: ${MONGODB_URI}`);

async function testConnection() {
    try {
        await mongoose.connect(MONGODB_URI, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });
        console.log('✅ SUCCEEDED: Connected to MongoDB successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ FAILED: Could not connect to MongoDB.');
        console.error('⚠️ Error Name:', error.name);
        console.error('⚠️ Error Message:', error.message);
        if (error.reason) console.error('⚠️ Reason:', error.reason);
        process.exit(1);
    }
}

testConnection();
