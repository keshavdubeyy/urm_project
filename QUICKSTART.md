# Quick Start Guide

## First Time Setup

```bash
# 1. Install dependencies
npm install

# 2. Initialize database
npx prisma migrate dev --name init

# 3. Start development server
npm run dev
```

Visit http://localhost:3000 to view the application.

## Daily Usage

### Run the Survey Application
```bash
npm run dev
```

### View Collected Data
```bash
# Option 1: GUI (Prisma Studio)
npx prisma studio

# Option 2: Export to CSV
npm run export-csv
```

### Reset Database (Clear All Data)
```bash
rm prisma/dev.db
npx prisma migrate dev
```

## Troubleshooting

### "Cannot find module '@prisma/client'"
```bash
npx prisma generate
```

### "Module not found: Can't resolve 'dotenv'"
```bash
npm install dotenv
```

### "Database file not found"
```bash
npx prisma migrate dev
```

### Port 3000 already in use
```bash
# Option 1: Kill the process using port 3000
lsof -ti:3000 | xargs kill

# Option 2: Use a different port
PORT=3001 npm run dev
```

## Common Tasks

### View Database Schema
```bash
npx prisma studio
```

### Add Test Data Manually
1. Run `npx prisma studio`
2. Navigate to SurveyResponse table
3. Click "Add record"
4. Fill in fields (or paste JSON)

### Check Database Size
```bash
ls -lh prisma/dev.db
```

### Backup Database
```bash
cp prisma/dev.db prisma/dev.db.backup
```

### Restore Database Backup
```bash
cp prisma/dev.db.backup prisma/dev.db
```

## File Locations

- **Database**: `prisma/dev.db`
- **Schema**: `prisma/schema.prisma`
- **Exports**: `survey-export-*.csv` (project root)
- **Env Config**: `.env`

## Support

For detailed documentation:
- Database: See [DATABASE.md](./DATABASE.md)
- Full Guide: See [README.md](./README.md)
- Milestone Notes: See [MILESTONE-4-COMPLETE.md](./MILESTONE-4-COMPLETE.md)
