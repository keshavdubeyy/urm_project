# 🚀 Complete Codespaces Deployment Guide

## Step 1: Launch GitHub Codespace

1. **Go to your repository**: https://github.com/keshavdubeyy/urm_project
2. **Click the green "Code" button**
3. **Select "Codespaces" tab**
4. **Click "Create codespace on main"**

⏱️ **Wait 2-3 minutes** for the Codespace to initialize with all dependencies.

## Step 2: Set Up Environment Variables

Once your Codespace opens, you have two options:

### Option A: Use the Setup Script (Recommended)
```bash
# Run the automated setup script
./scripts/setup-env.sh

# Then edit the .env file to add your actual Google Sheets credentials
code .env
```

### Option B: Manual Setup
Create a `.env` file with your configuration:

```bash
cat > .env << 'EOF'
# Database Configuration
DATABASE_URL="postgresql://postgres:Keshav%400405%3F@db.epxocoogopxoxcqeszwi.supabase.co:5432/postgres?sslmode=require"

# Supabase Configuration  
NEXT_PUBLIC_SUPABASE_URL="https://epxocoogopxoxcqeszwi.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVweG9jb29nb3B4b3hjcWVzenduIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE5MjQ0NzUsImV4cCI6MjA0NzUwMDQ3NX0.YXwbaUe_ZDbAf5qAx-cPK2P_p6QP8pv6OuHDFP_3xtY"

# Google Sheets API Configuration
GSHEETS_CLIENT_EMAIL="survey-sheets-service@survey-research-project.iam.gserviceaccount.com"
GSHEETS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----
[YOUR_ACTUAL_PRIVATE_KEY_HERE]
-----END PRIVATE KEY-----"
GSHEETS_SPREADSHEET_ID="[YOUR_SPREADSHEET_ID]"

# Development Configuration
NODE_ENV="development"
EOF
```

## Step 3: Install Dependencies & Start Survey

```bash
# Install all dependencies (if not already done)
npm install

# Start the survey application
npm run dev
```

## Step 4: Access Your Survey

1. **VS Code will show a notification**: "Your application running on port 3000 is available"
2. **Click "Open in Browser"** or use the "Ports" tab
3. **Your survey will open** at a URL like: `https://username-reponame-randomid.github.dev`

## Step 5: Make Survey Public (For Participants)

1. **Go to the "Ports" tab** in VS Code
2. **Right-click on port 3000**
3. **Select "Port Visibility" → "Public"**
4. **Copy the public URL** - this is what you share with participants

## 🧪 Experimental Design Verification

Your survey now includes **counterbalanced experimental design**:

### **Four Conditions (Automatically Assigned):**
- **Order A + Paperclip=ObjectA**: No-AI Paperclip → AI Brick
- **Order A + Brick=ObjectA**: No-AI Brick → AI Paperclip  
- **Order B + Paperclip=ObjectA**: AI Paperclip → No-AI Brick
- **Order B + Brick=ObjectA**: AI Brick → No-AI Paperclip

### **Verification Steps:**
1. Open browser developer console (F12)
2. Go through consent → demographics → pre-task
3. Watch for experimental condition log in console
4. Verify task order and objects match assigned condition

## 📊 Data Collection

### **Real-time Monitoring:**
- **Database**: All responses saved to Supabase PostgreSQL
- **Google Sheets**: Real-time export for easy analysis
- **Console logs**: Track experimental assignments (development mode)

### **Data Export:**
```bash
# Export data to CSV file
npm run export:csv
```

## 🔧 Troubleshooting

### If the app doesn't start:
```bash
# Check for errors
npm run build

# Restart development server
npm run dev
```

### If database connection fails:
```bash
# Test Supabase connection
node -e "
const { createClient } = require('@supabase/supabase-js');
require('dotenv/config');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
supabase.from('survey_responses').select('count').limit(1).then(console.log);
"
```

### If Google Sheets integration fails:
1. Verify your `GSHEETS_PRIVATE_KEY` has proper line breaks (`\n`)
2. Check that your Google Sheet is shared with the service account email
3. Confirm `GSHEETS_SPREADSHEET_ID` matches your sheet's ID

## 🌟 Production Features

✅ **Always Online**: Runs 24/7 in Microsoft's cloud infrastructure  
✅ **Automatic Scaling**: Handles multiple participants simultaneously  
✅ **Real-time Data**: Immediate backup to both database and spreadsheet  
✅ **Counterbalanced Design**: Scientifically rigorous experimental conditions  
✅ **Mobile Responsive**: Works on all devices and screen sizes  
✅ **Professional UI**: Apple design system for consistent experience  

## 📋 Survey Flow Summary

1. **Consent & Demographics** → Collect participant information
2. **Pre-task Scales** → DIA, GSE, Mood baselines  
3. **Task Assignment** → Random experimental condition
4. **Task 1** → Object A with assigned AI condition (1.5 min)
5. **Task 1 Evaluation** → Workload assessment & experience ratings
6. **Task 2** → Object B with alternate AI condition (1.5 min)  
7. **Task 2 Evaluation** → Workload assessment & experience ratings
8. **Post-study** → Final scales and reflections
9. **Thank You** → Completion confirmation

## 🎯 Ready for Research!

Your survey platform is now **production-ready** with:
- Robust experimental design
- Professional data collection
- Cloud-based reliability  
- Easy participant access

**Public URL Format**: `https://[username]-urm-project-[id].github.dev`

Share this URL with your research participants! 🚀