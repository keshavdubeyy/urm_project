# 🚀 Deploy Survey Platform on GitHub Codespaces

## Quick Start (Cloud Deployment)

### 1. Launch Codespace
1. Go to your GitHub repository: `https://github.com/keshavdubeyy/urm_project`
2. Click the green **"Code"** button
3. Select **"Codespaces"** tab
4. Click **"Create codespace on main"**

### 2. Set Environment Variables (IMPORTANT!)
Once your Codespace opens, set up these environment secrets:

```bash
# In the Codespace terminal, create .env file:
cat > .env << 'EOF'
# Database
DATABASE_URL="postgresql://postgres:Keshav%400405%3F@db.epxocoogopxoxcqeszwi.supabase.co:5432/postgres?sslmode=require"

# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://epxocoogopxoxcqeszwi.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVweG9jb29nb3B4b3hjcWVzenduIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE5MjQ0NzUsImV4cCI6MjA0NzUwMDQ3NX0.YXwbaUe_ZDbAf5qAx-cPK2P_p6QP8pv6OuHDFP_3xtY"

# Google Sheets API
GSHEETS_CLIENT_EMAIL="survey-sheets-service@survey-research-project.iam.gserviceaccount.com"
GSHEETS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n[YOUR_PRIVATE_KEY_HERE]\n-----END PRIVATE KEY-----"
GSHEETS_SPREADSHEET_ID="[YOUR_SPREADSHEET_ID]"
EOF
```

### 3. Start the Survey App
```bash
# Install dependencies (if not auto-installed)
npm install

# Start the development server
npm run dev
```

### 4. Access Your Survey
- Codespace will automatically forward port 3000
- Click the popup notification to open the survey
- Or use the "Ports" tab in VS Code and click the globe icon next to port 3000

## 🌟 Benefits of Codespaces

✅ **Always Online**: Runs 24/7 in the cloud, works even when your laptop is off  
✅ **No Setup**: Pre-configured environment with all dependencies  
✅ **Shareable**: Generate public URLs for participants  
✅ **Reliable**: Microsoft's infrastructure, no local environment issues  
✅ **Auto-save**: All changes automatically saved to GitHub  

## 📊 Survey Flow

1. **Demographics** → Collect participant info
2. **Pre-task** → Instructions and consent  
3. **Task (No AI)** → 1.5-minute coding task without AI assistance
4. **Task (AI)** → 1.5-minute coding task with AI assistance  
5. **Post-study** → Final questionnaire and feedback
6. **Thank You** → Completion confirmation

## 🔧 Technical Stack

- **Frontend**: Next.js 14 with Tailwind CSS (Apple Design System)
- **Database**: Supabase PostgreSQL (cloud-hosted)
- **Data Export**: Google Sheets API (real-time sync)
- **Hosting**: GitHub Codespaces (cloud development environment)

## 📈 Data Collection

- All responses saved to **Supabase database**
- Real-time export to **Google Sheets** 
- TLX workload assessment with slider interface
- Likert scale questionnaires with enhanced UI

## 🛠 Development Commands

```bash
# Start development server
npm run dev

# Build for production  
npm run build

# Test database connection
npm run test:db

# Export data to CSV
npm run export:csv
```

## 🔒 Security Notes

- Environment variables are securely stored in Codespace secrets
- Database uses SSL connections
- Google Sheets API uses service account authentication
- No sensitive data in source code

---

**Need help?** The Codespace includes all necessary extensions and will guide you through the setup process!