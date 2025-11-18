# Migration from SQLite to PostgreSQL

## Before Migrating

1. **Export your current data:**
   ```bash
   npm run export-csv
   ```

2. **Backup your SQLite database:**
   ```bash
   cp prisma/dev.db prisma/dev.db.backup
   ```

## Migration Steps

1. **Set up PostgreSQL database** (follow DEPLOYMENT_GUIDE.md)

2. **Update your .env with PostgreSQL URL:**
   ```env
   DATABASE_URL="postgresql://user:password@host:5432/dbname"
   ```

3. **Push schema to new database:**
   ```bash
   npx prisma db push
   ```

4. **If you have existing data to migrate:**
   - Use the CSV export to manually import important data
   - Or write a migration script to transfer from SQLite to PostgreSQL

## Rollback Plan

If something goes wrong:

1. **Restore SQLite:**
   ```bash
   cp prisma/dev.db.backup prisma/dev.db
   ```

2. **Update schema back to SQLite:**
   ```prisma
   datasource db {
     provider = "sqlite"
     url      = env("DATABASE_URL")
   }
   ```

3. **Update .env:**
   ```env
   DATABASE_URL="file:./dev.db"
   ```

4. **Regenerate client:**
   ```bash
   npx prisma generate
   ```