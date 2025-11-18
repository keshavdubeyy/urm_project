import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testConnection() {
  try {
    console.log('🔌 Testing database connection...');
    
    // Test basic connection
    await prisma.$connect();
    console.log('✅ Database connection successful!');
    
    // Test table access
    const count = await prisma.surveyResponse.count();
    console.log(`📊 Current survey responses in database: ${count}`);
    
    // Test a simple query
    const recent = await prisma.surveyResponse.findFirst({
      orderBy: { createdAt: 'desc' },
      select: { id: true, responseId: true, createdAt: true }
    });
    
    if (recent) {
      console.log(`🕒 Most recent response: ${recent.responseId} (${recent.createdAt})`);
    } else {
      console.log('📝 No survey responses found yet');
    }
    
    console.log('🎉 Database test completed successfully!');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    console.log('\n💡 Troubleshooting tips:');
    console.log('1. Check your DATABASE_URL in .env file');
    console.log('2. Make sure your database is running and accessible');
    console.log('3. Verify your connection string format');
    console.log('4. For PostgreSQL, ensure sslmode=require is added');
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();