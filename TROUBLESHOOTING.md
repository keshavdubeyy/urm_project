# Troubleshooting Guide

## Dashboard 500 Error

If you're seeing a 500 error when accessing `/api/dashboard`, follow these steps:

### 1. Check Supabase Connection

Run this test script to verify your Supabase setup:

```bash
npm run test:supabase
```

Or manually check with:

```bash
node scripts/test-supabase-client.ts
```

### 2. Verify Environment Variables

Make sure your `.env` file has these variables set:

```env
NEXT_PUBLIC_SUPABASE_URL="https://YOUR_PROJECT_REF.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key-here"
```

Check if they're loaded:

```bash
grep "NEXT_PUBLIC_SUPABASE" .env
```

### 3. Verify Supabase Table Exists

The most common issue is that the `SurveyResponse` table doesn't exist in Supabase.

**Option A: Create table using Prisma migration**

```bash
npx prisma migrate dev --name init
```

**Option B: Create table directly in Supabase**

Go to your Supabase dashboard → SQL Editor → New Query, and run:

```sql
-- Copy the contents from sql/create_table.sql
```

Or use the provided SQL file:

```bash
cat sql/create_table.sql
```

### 4. Check Browser Console

1. Open your browser's Developer Tools (F12)
2. Go to the Console tab
3. Look for detailed error messages
4. Check the Network tab for the `/api/dashboard` request

### 5. Check Server Logs

In your terminal where `npm run dev` is running, you should now see detailed logs:

- "Dashboard API: Checking Supabase credentials..."
- "Dashboard API: Fetching from SurveyResponse table..."
- Any error details including error codes and hints

### Common Error Messages

**"relation "SurveyResponse" does not exist"**
- The table hasn't been created in Supabase
- Solution: Run the migration or create the table manually

**"Database configuration missing"**
- Environment variables are not set
- Solution: Check your `.env` file

**"Invalid API key"**
- The Supabase key is incorrect
- Solution: Get the correct key from Supabase dashboard → Settings → API

### 6. Test the API Directly

Once the server is running, test the API:

```bash
curl http://localhost:3000/api/dashboard
```

This should return either:
- Success: `{"responses":[],"count":0}`
- Error: Detailed error message with hints

### 7. Favicon 404 Error

The favicon error is harmless and just means Next.js can't find a favicon file. To fix:

1. Add a `favicon.ico` file to the `app` directory, or
2. Add this to `app/layout.tsx`:

```tsx
export const metadata = {
  icons: {
    icon: '/icon.png', // if you have an icon.png
  },
}
```

### Need More Help?

1. Check the server logs for specific error messages
2. Verify your Supabase project is active
3. Check Supabase dashboard → Database → Tables to see if `SurveyResponse` exists
4. Review the Supabase logs in the dashboard
