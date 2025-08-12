# Deployment Instructions for Hostinger VPS

## Prerequisites
- Node.js 18+ installed on your Hostinger VPS
- Access to your VPS via SSH or file manager
- Neon PostgreSQL database connection string

## Step-by-Step Deployment

### 1. Upload Files to VPS
Upload all project files to your VPS directory (e.g., `/var/www/getabonus/`)

### 2. Environment Configuration
1. Rename `.env.hostinger` to `.env` in the root directory
2. Verify the `.env` file contains:
```
DATABASE_URL=postgresql://neondb_owner:npg_T12RZtydDJSp@ep-blue-bird-a2qvkujo-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
NODE_ENV=production
PORT=3000
SESSION_SECRET=getabonus_crypto_casino_secret_2025_alkox
```

### 3. Install Dependencies
```bash
cd /var/www/getabonus
npm install
```

### 4. Database Setup
```bash
npm run db:push
```

### 5. Build the Application
```bash
npm run build
```

### 6. Start the Application

**Option 1: Using our startup script (Recommended)**
```bash
node start-production.js
```

**Option 2: Using PM2 (for production servers)**
```bash
npm install -g pm2
pm2 start start-production.js --name "getabonus"
pm2 startup
pm2 save
```

**Option 3: Manual with environment variables**
```bash
export DATABASE_URL="postgresql://neondb_owner:npg_T12RZtydDJSp@ep-blue-bird-a2qvkujo-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
export NODE_ENV="production"
export PORT="3000"
export SESSION_SECRET="getabonus_crypto_casino_secret_2025_alkox"
node dist/index.js
```

## Environment Variables
The application requires these environment variables:
- `DATABASE_URL`: Your Neon PostgreSQL connection string
- `NODE_ENV`: Set to "production" for deployment
- `PORT`: Port number (default 3000)
- `SESSION_SECRET`: Secret for session security

## Troubleshooting
- If you get "DATABASE_URL must be set" error, make sure the `.env` file is in the root directory
- For permission issues, ensure proper file permissions: `chmod -R 755 /var/www/getabonus`
- Check logs with: `pm2 logs getabonus` (if using PM2)

## Admin Access
- Admin panel: `https://yourdomain.com/admin`
- Login credentials: alkox / Katapult00..alkox