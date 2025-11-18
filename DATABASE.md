# Survey Data Management

This document explains how the survey application stores and exports data.

## Database Setup

The application uses **Prisma ORM** with **SQLite** for local data persistence.

### Database Location
- **File**: `prisma/dev.db`
- **Type**: SQLite database
- **Schema**: Defined in `prisma/schema.prisma`

### Initial Setup (Already Done)
```bash
# Install dependencies
npm install

# Run database migration
npx prisma migrate dev --name init

# Generate Prisma Client
npx prisma generate
```

## How Data is Saved

When a participant completes the survey:

1. They fill out all forms (consent → demographics → pre-task → tasks → post-study)
2. Data is stored in React Context throughout the session
3. On the final "Submit & Finish" button, the app:
   - Calls `markStudyEnded()` to record timestamps
   - Sends a POST request to `/api/survey`
   - Saves the complete survey response to SQLite
   - Redirects to the thank-you page

### API Endpoint
- **Route**: `app/api/survey/route.ts`
- **Method**: POST
- **Body**: Complete `SurveyResponse` object
- **Returns**: `{ success: true, responseId, id }`

## Data Export

### Export to CSV

To export all survey responses as a CSV file:

```bash
npm run export-csv
```

This will:
- Query all responses from the database
- Flatten nested JSON objects into columns
- Create a timestamped CSV file: `survey-export-YYYY-MM-DDTHH-MM-SS.csv`
- Save it in the project root directory

### CSV Column Structure

The exported CSV contains all survey data with the following columns:

**Metadata:**
- `id` - Database record ID
- `responseId` - Unique survey response UUID
- `createdAt` - Database creation timestamp

**Demographics:**
- `age`, `gender`, `education`, `major`, `aiUseFrequency`

**Timestamps:**
- `startTimestamp`, `endTimestamp`, `durationSeconds`

**DIA Pre-Task Scale (5 items):**
- `diaPre_unprotected`, `diaPre_leftBehind`, `diaPre_stayUpdated`, `diaPre_relyValidation`, `diaPre_fearReplacement`

**General Self-Efficacy (3 items):**
- `gse_solveProblems`, `gse_achieveGoals`, `gse_handleDifficulties`

**Mood Pre-Task (4 items):**
- `moodPre_confident`, `moodPre_stressed`, `moodPre_motivated`, `moodPre_creative`

**Task A (No-AI):**
- `taskNoAI_responseText` - Participant's creative writing
- NASA-TLX: `taskNoAI_tlx_mentalDemand`, `taskNoAI_tlx_physicalDemand`, `taskNoAI_tlx_temporalDemand`, `taskNoAI_tlx_performance`, `taskNoAI_tlx_effort`, `taskNoAI_tlx_frustration`
- Experience: `taskNoAI_exp_challenging`, `taskNoAI_exp_confident`, `taskNoAI_exp_satisfied`, `taskNoAI_exp_creative`

**Task B (AI):**
- `taskAI_responseText` - Participant's creative writing
- NASA-TLX: `taskAI_tlx_mentalDemand`, `taskAI_tlx_physicalDemand`, `taskAI_tlx_temporalDemand`, `taskAI_tlx_performance`, `taskAI_tlx_effort`, `taskAI_tlx_frustration`
- Experience: `taskAI_exp_challenging`, `taskAI_exp_confident`, `taskAI_exp_satisfied`, `taskAI_exp_creative`
- AI Usage: `taskAI_aiUsed`, `taskAI_aiHelpful`, `taskAI_aiFrequency`

**DIA Post-Task Scale (5 items):**
- `diaPost_unprotected`, `diaPost_leftBehind`, `diaPost_stayUpdated`, `diaPost_relyValidation`, `diaPost_fearReplacement`

**Mood Post-Task (4 items):**
- `moodPost_confident`, `moodPost_stressed`, `moodPost_satisfied`, `moodPost_creative`

**Reflections:**
- `reflections_easierTask`, `reflections_aiThoughtProcess`, `reflections_finalComments`

### CSV Formatting
- Text fields containing commas, quotes, or newlines are properly escaped
- Empty/null values appear as blank cells
- Timestamps are in ISO 8601 format (e.g., `2024-11-18T10:30:45.000Z`)

## Viewing the Database

### Using Prisma Studio (GUI)
```bash
npx prisma studio
```
This opens a web interface at `http://localhost:5555` where you can:
- View all survey responses
- Filter and search data
- Edit records manually (if needed for testing)

### Using SQLite CLI
```bash
sqlite3 prisma/dev.db

# Inside SQLite prompt:
.tables                    # List all tables
.schema SurveyResponse     # View table structure
SELECT * FROM SurveyResponse;   # Query all responses
.quit                      # Exit
```

## Development Workflow

### Reset Database (Clear All Data)
```bash
# Delete the database file
rm prisma/dev.db

# Re-run migrations
npx prisma migrate dev
```

### Regenerate Prisma Client (After Schema Changes)
```bash
npx prisma generate
```

### Create New Migration (After Editing schema.prisma)
```bash
npx prisma migrate dev --name descriptive_migration_name
```

## Security & Privacy

- **Local Only**: Database file (`dev.db`) is stored locally and NOT committed to git
- **No Cloud Sync**: Data stays on your machine unless you manually deploy
- **Excluded from Git**: `.gitignore` excludes:
  - `prisma/dev.db`
  - `prisma/dev.db-journal`
  - `survey-export-*.csv`

## Troubleshooting

### "Cannot find module '@prisma/client'"
```bash
npx prisma generate
```

### "Database file not found"
```bash
npx prisma migrate dev
```

### "Environment variable not found: DATABASE_URL"
- Check that `.env` file exists
- Verify it contains: `DATABASE_URL="file:./dev.db"`
- Ensure `prisma.config.ts` imports `dotenv/config`

### Export script fails
```bash
# Make sure ts-node is installed
npm install -D ts-node @types/node

# Try running directly
npx ts-node scripts/export-csv.ts
```

## Production Deployment

For production deployment, you may want to:

1. **Use PostgreSQL** instead of SQLite (better for concurrent writes)
2. **Add authentication** to protect the `/api/survey` endpoint
3. **Rate limiting** to prevent spam submissions
4. **Data validation** on the server side
5. **Encrypted storage** for sensitive responses
6. **Backup strategy** for the database

To switch to PostgreSQL:
1. Update `prisma/schema.prisma` datasource to `postgresql`
2. Change `DATABASE_URL` in `.env` to PostgreSQL connection string
3. Run `npx prisma migrate dev` to create tables
4. Deploy database to a service like Vercel Postgres, Supabase, or Railway

---

**Need Help?** Check the Prisma documentation at https://www.prisma.io/docs
