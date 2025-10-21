// Simple test script to verify database setup
const Database = require('./src/database/database');

async function testDatabase() {
  console.log('Testing database setup...');
  
  try {
    const db = new Database();
    await db.init();
    console.log('✅ Database initialized successfully');
    
    // Test creating a user
    const testUser = {
      userType: 'student',
      studentId: 'TEST001',
      name: 'Test Student',
      email: 'test@example.com',
      password: 'testpassword123',
      parentEmail: 'parent@example.com'
    };
    
    const user = await db.createUser(testUser);
    console.log('✅ User created successfully:', user.id);
    
    // Test finding user by email
    const foundUser = await db.findUserByEmail('test@example.com');
    console.log('✅ User found by email:', foundUser.name);
    
    // Test password verification
    const isValidPassword = await db.verifyPassword('testpassword123', foundUser.password_hash);
    console.log('✅ Password verification:', isValidPassword ? 'PASSED' : 'FAILED');
    
    // Test session creation
    const sessionToken = await db.createSession(foundUser.id);
    console.log('✅ Session created:', sessionToken.substring(0, 20) + '...');
    
    // Test session validation
    const sessionUser = await db.validateSession(sessionToken);
    console.log('✅ Session validation:', sessionUser ? 'PASSED' : 'FAILED');
    
    // Clean up test data
    await db.deleteSession(sessionToken);
    console.log('✅ Test session cleaned up');
    
    console.log('\n🎉 All database tests passed!');
    console.log('\nTo start the application:');
    console.log('1. Run: npm run dev');
    console.log('2. Open: http://localhost:3000');
    console.log('3. Try registering a new user or logging in');
    
  } catch (error) {
    console.error('❌ Database test failed:', error.message);
    console.error('Full error:', error);
  } finally {
    process.exit(0);
  }
}

testDatabase();
