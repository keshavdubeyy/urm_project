# Survey App Deployment Guide

## 📊 Complete Deployment & Integration Setup

### 🚀 **Step 1: Database Setup (Choose One)**

#### Option A: Supabase (Recommended)
1. Go to [supabase.com](https://supabase.com) and create account
2. Create new project
3. Go to Settings > Database
4. Copy connection string (looks like: `postgresql://postgres:[password]@[host]:5432/postgres`)

#### Option B: Neon
1. Go to [neon.tech](https://neon.tech) and sign up
2. Create database
3. Copy connection string

#### Option C: Railway
1. Go to [railway.app](https://railway.app)
2. Create PostgreSQL database
3. Get connection string

### 🔧 **Step 2: Environment Variables**

Create these environment variables in your deployment platform:

```env
# Database (replace with your actual connection string)
DATABASE_URL="postgresql://user:password@host:5432/dbname?sslmode=require"

# Google Sheets API (get from Google Cloud Console)
GSHEETS_CLIENT_EMAIL="your-service-account@project.iam.gserviceaccount.com"
GSHEETS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY\n-----END PRIVATE KEY-----\n"
GSHEETS_SPREADSHEET_ID="1ABC123-your-spreadsheet-id"

# Next.js
NEXTAUTH_SECRET="random-secret-string-generate-one"
NEXTAUTH_URL="https://your-deployed-domain.vercel.app"
```

### 📋 **Step 3: Google Sheets Setup**

1. **Create Google Cloud Project:**
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create new project
   - Enable Google Sheets API

2. **Create Service Account:**
   - Go to IAM & Admin > Service Accounts
   - Create service account
   - Generate JSON key file
   - Extract `client_email` and `private_key` for environment variables

3. **Create Google Sheet:**
   - Create new Google Sheet
   - Share with service account email (Editor access)
   - Copy spreadsheet ID from URL
   - The spreadsheet ID is the long string between `/d/` and `/edit` in the URL

4. **Set Up Headers (Optional):**
   - Run this API endpoint once: `GET /api/setup-sheets` (we'll create this)

### 🚢 **Step 4: Deploy to Vercel**

1. **Connect Repository:**
   ```bash
   # Install Vercel CLI (optional)
   npm i -g vercel
   
   # Deploy from GitHub (recommended)
   # Push your code to GitHub, then connect on Vercel dashboard
   ```

2. **Environment Variables in Vercel:**
   - Go to Vercel dashboard > Project > Settings > Environment Variables
   - Add all the variables from Step 2

3. **Database Migration:**
   - After deployment, run database setup:
   ```bash
   # This runs automatically on deployment, but you can manually trigger:
   npx prisma db push
   ```

### 🧪 **Step 5: Testing**

1. **Test Database Connection:**
   - Visit your deployed URL
   - Complete a survey
   - Check your database (use database provider's dashboard)

2. **Test Google Sheets:**
   - Complete another survey
   - Check your Google Sheet for new row

3. **Debug Issues:**
   - Check Vercel function logs
   - Verify environment variables
   - Test Google Sheets API access

### 📊 **Step 6: Create Setup API (Optional)**

We've created a setup endpoint to initialize your Google Sheet with proper headers.

### 🔍 **Troubleshooting**

**Database Issues:**
- Check connection string format
- Ensure database allows connections
- Verify SSL requirements

**Google Sheets Issues:**
- Verify service account has access to sheet
- Check private key format (keep `\n` characters)
- Ensure Sheets API is enabled

**Deployment Issues:**
- Check build logs in Vercel
- Verify all environment variables are set
- Ensure Prisma generates client properly

### ✅ **Verification Checklist**

- [ ] Database connected and migrations applied
- [ ] Environment variables configured
- [ ] Google Cloud project and service account created
- [ ] Google Sheet created and shared with service account
- [ ] App deployed successfully
- [ ] Survey submissions save to database
- [ ] Survey submissions appear in Google Sheets
- [ ] CSV export still works

### 🎯 **Next Steps**

After deployment:
1. Share the deployed URL for survey collection
2. Monitor responses in Google Sheets (real-time updates!)
3. Use existing CSV export for detailed analysis
4. Scale database if needed based on response volume

The app will now automatically sync every survey response to both your database and Google Sheets in real-time! 🎉