#!/bin/bash

echo "🚀 Setting up Survey Platform Environment Variables"
echo "=================================================="

# Check if .env already exists
if [ -f .env ]; then
    echo "⚠️  .env file already exists. Backing up to .env.backup"
    cp .env .env.backup
fi

echo "📝 Creating .env file with your survey platform configuration..."

cat > .env << 'EOF'
# Database Configuration
DATABASE_URL="postgresql://postgres:Keshav%400405%3F@db.epxocoogopxoxcqeszwi.supabase.co:5432/postgres?sslmode=require"

# Supabase Configuration  
NEXT_PUBLIC_SUPABASE_URL="https://epxocoogopxoxcqeszwi.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVweG9jb29nb3B4b3hjcWVzenduIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE5MjQ0NzUsImV4cCI6MjA0NzUwMDQ3NX0.YXwbaUe_ZDbAf5qAx-cPK2P_p6QP8pv6OuHDFP_3xtY"

# Google Sheets API Configuration
GSHEETS_CLIENT_EMAIL="survey-sheets-service@survey-research-project.iam.gserviceaccount.com"
GSHEETS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDGxX8cnY3Q7V3n
[PLACEHOLDER - REPLACE WITH YOUR ACTUAL PRIVATE KEY]
-----END PRIVATE KEY-----"
GSHEETS_SPREADSHEET_ID="1ABC123XYZ456_REPLACE_WITH_YOUR_SPREADSHEET_ID"

# Development Configuration
NODE_ENV="development"
NEXTAUTH_SECRET="your-random-secret-here"
EOF

echo "✅ Environment file created successfully!"
echo ""
echo "🔧 IMPORTANT: You need to update these values:"
echo "   1. GSHEETS_PRIVATE_KEY - Replace with your actual Google Service Account private key"
echo "   2. GSHEETS_SPREADSHEET_ID - Replace with your Google Sheets ID"
echo ""
echo "📋 Next steps:"
echo "   1. Edit .env file with your actual Google Sheets credentials"
echo "   2. Run: npm install"
echo "   3. Run: npm run dev"
echo ""
echo "🎉 Your survey platform will be ready!"

# Test database connection
echo "🔍 Testing Supabase connection..."
npm run test:db 2>/dev/null || echo "⚠️  Database test will run after npm install"