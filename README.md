# AI Research Survey - Project Documentation

## Overview

This is a Next.js 14 App Router application for conducting a psychology-style research survey about AI and problem-solving. The survey guides participants through a structured series of steps, collecting data about their experiences, attitudes, and performance on problem-solving tasks with and without AI assistance.

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **React Context API** for global state management
- **Prisma ORM** with **SQLite** for data persistence

## Project Structure

```
Project_Survey/
├── app/
│   ├── api/
│   │   └── survey/
│   │       └── route.ts    # POST endpoint to save survey responses
│   ├── layout.tsx          # Root layout with header and SurveyProvider
│   ├── page.tsx            # Welcome/landing page
│   ├── globals.css         # Global styles with Tailwind directives
│   ├── demographics/       # Step 1: Demographics & Consent
│   ├── pre-task/           # Step 2: Pre-task scales (DIA, GSE, Mood)
│   ├── task-no-ai/         # Step 3: Problem-solving task (No AI)
│   ├── task-ai/            # Step 4: Problem-solving task (With AI)
│   ├── post-study/         # Step 5: Post-task scales & reflections
│   └── thank-you/          # Step 6: Completion page
├── components/
│   ├── StepLayout.tsx      # Reusable layout with progress indicator
│   ├── LikertItem.tsx      # 7-point Likert scale component
│   ├── RadioGroup.tsx      # Radio button group component
│   ├── TextInput.tsx       # Text input component
│   ├── TextArea.tsx        # Textarea component
│   ├── TlxItem.tsx         # NASA-TLX 21-point scale component
│   └── Timer.tsx           # 3-minute countdown timer
├── context/
│   └── SurveyContext.tsx   # Global state management for survey data
├── lib/
│   └── prisma.ts           # Prisma Client singleton
├── prisma/
│   ├── schema.prisma       # Database schema definition
│   ├── dev.db              # SQLite database (gitignored)
│   └── migrations/         # Database migration history
├── scripts/
│   └── export-csv.ts       # CSV export utility
├── types/
│   └── survey.ts           # TypeScript interfaces for SurveyResponse
├── DATABASE.md             # Database documentation and usage guide
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── next.config.mjs
```

## Survey Flow

1. **Welcome/Consent** (`/`) - Landing page with study overview
2. **Demographics** (`/demographics`) - Participant information and consent
3. **Pre-Task** (`/pre-task`) - Baseline questionnaires (DIA, GSE, Mood)
4. **Task No AI** (`/task-no-ai`) - Problem-solving without AI assistance
5. **Task AI** (`/task-ai`) - Problem-solving with AI assistance
6. **Post-Study** (`/post-study`) - Post-task questionnaires and reflections
7. **Thank You** (`/thank-you`) - Study completion and summary

## Data Structure

The survey collects data in a structured `SurveyResponse` object that includes:

- **Metadata**: Response ID, timestamps, duration
- **Demographics**: Age, gender, education, AI usage
- **Pre-task scales**: DIA (Digital Intelligence Anxiety), GSE (General Self-Efficacy), Mood
- **Task data**: Responses, timestamps, NASA-TLX workload ratings, creativity metrics
- **Post-task scales**: DIA post, Mood post
- **Reflections**: Open-ended responses about the experience

## Current Status (Milestone 4 - Complete!)

✅ **Completed:**
- Project structure and routing
- TypeScript interfaces for all survey data
- Global state management with React Context
- All form components (consent, demographics, scales, tasks, reflections)
- Likert scales, radio groups, text inputs, textareas
- 3-minute countdown timers for timed tasks
- NASA-TLX workload assessment (21-point scales)
- Task experience ratings
- Two-column layout for AI-assisted task
- Prisma ORM + SQLite database integration
- POST API endpoint (`/api/survey`) to save responses
- Frontend submission integration
- CSV export utility (`npm run export-csv`)
- Complete documentation

🎉 **Fully Functional:**
- Participants can complete the entire survey flow
- Data is automatically saved to SQLite database
- Researchers can export all responses as CSV
- All forms properly validated and connected

## 🚀 Quick Start with GitHub Codespaces (Recommended)

[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://github.com/keshavdubeyy/urm_project/codespaces)

**GitHub Codespaces provides a complete development environment in the cloud:**

1. **Click the badge above** or go to your repository
2. **Click "Code" → "Codespaces" → "Create codespace"**
3. **Wait for the environment to set up** (2-3 minutes)
4. **Add environment variables** in the terminal:
   ```bash
   # Copy from .env.example and fill in your values
   cp .env.example .env
   nano .env  # Edit with your actual credentials
   ```
5. **Start the application:**
   ```bash
   npm run dev
   ```
6. **Access your app** at the forwarded port (Codespaces will notify you)

**Your survey platform will be running and accessible to participants via the public Codespaces URL!**

## 🛠️ Local Development

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your actual values

# Initialize database
npx prisma db push
```

### Development

```bash
# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Export Survey Data

```bash
# Export all survey responses to CSV
npm run export-csv
```

This creates a timestamped CSV file (e.g., `survey-export-2024-11-18T10-30-45.csv`) with all survey data.

### View Database

```bash
# Open Prisma Studio (GUI for viewing data)
npx prisma studio
```

For more details on data management, see [DATABASE.md](./DATABASE.md).

### Build for Production

```bash
# Create production build
npm run build

# Start production server
npm start
```

## Key Features

### Complete Survey Implementation

- **7 Survey Steps**: From consent to completion
- **Multiple Scale Types**: Likert scales (1-7), NASA-TLX (1-21), experience ratings
- **Timed Tasks**: 3-minute countdown timers for creative tasks
- **Real-time State**: All responses stored in React Context
- **Database Persistence**: Automatic save to SQLite on submission
- **Data Export**: CSV export with all survey fields flattened

### Global State Management

The `SurveyContext` provides:
- `survey`: Current survey response data
- `setSurvey`: Update survey data
- `markStudyStarted()`: Records study start timestamp
- `markStudyEnded()`: Records end timestamp and calculates duration

### Progress Tracking

Each page displays:
- Current step number
- Progress bar
- Navigation buttons (Back/Next)

### Data Collection

**Demographics:**
- Age, gender, education level, major (optional)
- AI usage frequency

**Pre-Task Scales:**
- Digital Intelligence Anxiety (DIA) - 5 items
- General Self-Efficacy (GSE) - 3 items
- Mood assessment - 4 items (confident, stressed, motivated, creative)

**Task A (No-AI):**
- Instructions page
- 3-minute timed creative writing activity
- NASA-TLX workload assessment (6 dimensions)
- Task experience ratings (4 items)

**Task B (AI):**
- Instructions page
- 3-minute timed creative writing with AI placeholder
- NASA-TLX workload assessment
- Task experience ratings
- AI usage questions

**Post-Study:**
- DIA scale (post-task) - 5 items
- Mood assessment (post-task) - 4 items
- Open-ended reflections (3 questions)

### Responsive Design

- Centered container with max-width of 800px
- Clean, minimal design with ample whitespace
- Mobile-friendly layout
- Professional color scheme (amber for Task A, green for Task B)

## Database & Export

### Prisma + SQLite

- **Database**: SQLite file at `prisma/dev.db`
- **ORM**: Prisma for type-safe queries
- **API**: `/api/survey` POST endpoint
- **Schema**: Flattened demographics + JSON strings for nested data

### CSV Export Utility

Run `npm run export-csv` to generate a CSV file with:
- 70+ columns with all survey data
- Flattened structure for easy analysis
- Proper escaping for text fields
- Timestamped filename

See [DATABASE.md](./DATABASE.md) for complete documentation.

## Next Steps (Optional Enhancements)

Potential future improvements:
1. **Production Database**: Switch from SQLite to PostgreSQL for better scalability
2. **Authentication**: Add admin login to protect data export
3. **Data Visualization**: Build dashboard to visualize response statistics
4. **Email Notifications**: Send confirmation emails to participants
5. **Multi-language Support**: Add internationalization
6. **A/B Testing**: Randomize task order (AI first vs. No-AI first)
7. **Real AI Integration**: Replace placeholder with actual AI assistant (e.g., OpenAI API)
8. **Advanced Analytics**: Statistical analysis of DIA changes, workload comparisons
9. **PDF Export**: Generate participant summary reports

## Contributing

This is a research project. If you need to make changes, ensure:
- TypeScript types are properly defined
- All changes maintain the survey flow logic
- UI remains clean and accessible
- Data collection remains comprehensive
- Database migrations are created for schema changes (`npx prisma migrate dev`)

## License

This project is for research purposes.
