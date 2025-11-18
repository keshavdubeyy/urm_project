const { execSync } = require('child_process');

console.log('🔧 Running postinstall script...');

// Skip Prisma generation in CI/Netlify/Vercel environments
if (process.env.NETLIFY || process.env.CI || process.env.VERCEL) {
  console.log('⏭️  Skipping prisma generate in CI/deployment environment');
  console.log('   Environment detected:', {
    NETLIFY: !!process.env.NETLIFY,
    CI: !!process.env.CI,
    VERCEL: !!process.env.VERCEL
  });
  process.exit(0);
}

// Run Prisma generation for local development
try {
  console.log('🔨 Running prisma generate for local development...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log('✅ Prisma client generated successfully');
} catch (error) {
  console.error('❌ Failed to generate Prisma client:', error.message);
  console.log('💡 This is normal if DATABASE_URL is not configured yet');
  // Don't fail the install process - let developers continue
  process.exit(0);
}