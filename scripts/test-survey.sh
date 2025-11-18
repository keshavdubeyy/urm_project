#!/bin/bash

echo "🧪 Testing Survey Platform - Experimental Design Verification"
echo "==========================================================="

# Test 1: Verify experimental condition generation
echo "📊 Test 1: Experimental Condition Generation"
node -e "
const { generateExperimentalCondition, logExperimentalCondition } = require('./lib/experimentalDesign.js');

console.log('Generating 5 random conditions to verify distribution:');
for (let i = 1; i <= 5; i++) {
  console.log(\`\nCondition \${i}:\`);
  const condition = generateExperimentalCondition();
  logExperimentalCondition(condition);
}
"

# Test 2: Verify database connection
echo ""
echo "🗄️  Test 2: Database Connection"
npm run test:db 2>/dev/null || node -e "
const { createClient } = require('@supabase/supabase-js');
require('dotenv/config');

console.log('Testing Supabase connection...');
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

supabase.from('survey_responses').select('count').limit(1).then(({ data, error }) => {
  if (error && error.code === 'PGRST116') {
    console.log('✅ Supabase connected! Ready for data collection.');
  } else if (error) {
    console.log('❌ Supabase Error:', error.message);
  } else {
    console.log('✅ Supabase connected and table ready!');
  }
}).catch(err => console.log('❌ Connection failed:', err.message));
"

# Test 3: Verify Google Sheets integration
echo ""
echo "📋 Test 3: Google Sheets Integration"
node -e "
const fs = require('fs');
const path = require('path');
require('dotenv/config');

console.log('Checking Google Sheets API configuration...');

const requiredEnvVars = [
  'GSHEETS_CLIENT_EMAIL',
  'GSHEETS_PRIVATE_KEY', 
  'GSHEETS_SPREADSHEET_ID'
];

let allConfigured = true;
requiredEnvVars.forEach(varName => {
  if (!process.env[varName]) {
    console.log(\`❌ Missing: \${varName}\`);
    allConfigured = false;
  } else {
    console.log(\`✅ Configured: \${varName}\`);
  }
});

if (allConfigured) {
  console.log('✅ Google Sheets API fully configured!');
} else {
  console.log('⚠️  Some Google Sheets credentials missing - update .env file');
}
"

# Test 4: Check build status
echo ""
echo "🔨 Test 4: Build Verification"
echo "Testing production build..."
npm run build > /dev/null 2>&1
if [ $? -eq 0 ]; then
  echo "✅ Production build successful"
else
  echo "❌ Build failed - checking for errors..."
  npm run build 2>&1 | tail -10
fi

# Test 5: Check survey pages accessibility
echo ""
echo "🌐 Test 5: Page Accessibility"
pages=("/" "/demographics" "/pre-task" "/task-no-ai" "/task-ai" "/post-study" "/thank-you")

for page in "${pages[@]}"; do
  status=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:3000$page")
  if [ "$status" = "200" ]; then
    echo "✅ Page accessible: $page"
  else
    echo "❌ Page error ($status): $page"
  fi
done

echo ""
echo "🎯 Test Summary Complete!"
echo "Ready for Codespaces deployment and full survey testing."