#!/usr/bin/env node

// Production startup script that loads environment variables
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Get the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Manually load environment variables from .env file
try {
  const envPath = join(__dirname, '.env');
  const envFile = readFileSync(envPath, 'utf8');
  
  // Parse .env file
  const envLines = envFile.split('\n');
  for (const line of envLines) {
    const trimmedLine = line.trim();
    if (trimmedLine && !trimmedLine.startsWith('#')) {
      const [key, ...valueParts] = trimmedLine.split('=');
      if (key && valueParts.length > 0) {
        const value = valueParts.join('=').replace(/^["']|["']$/g, '');
        process.env[key.trim()] = value.trim();
      }
    }
  }
  console.log('Environment variables loaded from .env file');
} catch (error) {
  console.log('No .env file found, using system environment variables');
}

// Set NODE_ENV to production if not set
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'production';
}

// Verify required environment variables
if (!process.env.DATABASE_URL) {
  console.error('ERROR: DATABASE_URL environment variable is required');
  console.error('Make sure you have a .env file with DATABASE_URL set');
  process.exit(1);
}

console.log('Starting GetABonus.net application...');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('PORT:', process.env.PORT || 3000);

// Now import and start the application
import('./dist/index.js').catch(error => {
  console.error('Failed to start application:', error);
  process.exit(1);
});