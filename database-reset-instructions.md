# Database Setup Instructions for Hostinger Server

## Problem
Your PostgreSQL database on the server is missing required columns (like `content_media` in the `blog_posts` table), causing errors in the application.

## Solution
Run the complete database setup script to create all required tables with proper structure.

## Steps to Fix Your Database

### Option 1: Complete Reset (Recommended)

1. **Connect to your PostgreSQL database on the server:**
   ```bash
   psql -h 148.230.71.61 -U alkox -d getabonus
   ```

2. **Drop all existing tables (this will delete all data):**
   ```sql
   DROP SCHEMA public CASCADE;
   CREATE SCHEMA public;
   GRANT ALL ON SCHEMA public TO alkox;
   GRANT ALL ON SCHEMA public TO public;
   ```

3. **Run the complete setup script:**
   ```bash
   psql -h 148.230.71.61 -U alkox -d getabonus -f database-setup.sql
   ```

### Option 2: Add Missing Columns Only

If you want to keep existing data, run these commands to add missing columns:

```sql
-- Connect to database first
psql -h 148.230.71.61 -U alkox -d getabonus

-- Add missing content_media column to blog_posts
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS content_media JSONB DEFAULT '[]'::jsonb;

-- Add any other missing columns that might cause errors
ALTER TABLE casinos ADD COLUMN IF NOT EXISTS payment_methods JSONB DEFAULT '[]'::jsonb;
ALTER TABLE casinos ADD COLUMN IF NOT EXISTS supported_currencies JSONB DEFAULT '[]'::jsonb;
ALTER TABLE casinos ADD COLUMN IF NOT EXISTS game_providers JSONB DEFAULT '[]'::jsonb;
ALTER TABLE casinos ADD COLUMN IF NOT EXISTS features JSONB DEFAULT '[]'::jsonb;

-- Update sequences and constraints
SELECT setval(pg_get_serial_sequence('casinos', 'id'), COALESCE(MAX(id::integer), 0) + 1, false) FROM casinos;
```

### Option 3: Using the Database Setup Script

1. **Copy the `database-setup.sql` file to your server:**
   ```bash
   scp database-setup.sql root@148.230.71.61:/var/www/getabonus/
   ```

2. **Run the script on your server:**
   ```bash
   ssh root@148.230.71.61
   cd /var/www/getabonus
   psql -h 148.230.71.61 -U alkox -d getabonus -f database-setup.sql
   ```

## After Database Setup

1. **Restart your application:**
   ```bash
   pm2 restart getabonus-app
   ```

2. **Check the logs:**
   ```bash
   pm2 logs getabonus-app --lines 20
   ```

3. **Test the admin panel:**
   - Go to: `http://yourdomain.com/admin`
   - Login with: `alkox` / `Katapult00..alkox`

## What the Setup Script Creates

- ✅ **All required tables** with proper column types
- ✅ **Foreign key relationships** between tables
- ✅ **Indexes** for better performance
- ✅ **Default admin user** (alkox) with proper password hash
- ✅ **Triggers** for automatic timestamp updates
- ✅ **JSONB columns** for flexible data storage

## Database Schema Overview

```
users               → User accounts and admins
casinos             → Casino information and ratings
bonuses             → Casino bonuses and promotions
games               → Game catalog with RTP and providers
casino_games        → Junction table linking casinos to games
reviews             → User reviews for casinos/bonuses/games
expert_reviews      → Professional reviews with detailed ratings
blog_posts          → Blog content with SEO fields
user_interactions   → User click tracking
newsletter_subscribers → Email subscriptions
admins              → Administrator accounts
casino_ratings      → Detailed rating breakdowns
comparisons         → Casino comparison data
helpful_votes       → Review voting system
```

## Environment Variables

Make sure your `.env` file on the server has:

```
DATABASE_URL="postgresql://alkox:Katapult00..alkox@148.230.71.61:5432/getabonus"
PORT=3000
SESSION_SECRET=getabonus_crypto_casino_secret_2025_alkox
CLIENT_BUILD_PATH=/var/www/getabonus/dist/public
```

## Troubleshooting

1. **If you get connection errors:**
   - Check if PostgreSQL is running: `systemctl status postgresql`
   - Verify database exists: `psql -h 148.230.71.61 -U alkox -l`

2. **If you get permission errors:**
   - Grant permissions: `GRANT ALL PRIVILEGES ON DATABASE getabonus TO alkox;`

3. **If application still shows errors:**
   - Clear browser cache
   - Check PM2 logs: `pm2 logs getabonus-app`
   - Restart application: `pm2 restart getabonus-app`

After running this setup, your application should work correctly with all required database columns and tables.