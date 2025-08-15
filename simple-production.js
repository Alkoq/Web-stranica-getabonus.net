#!/usr/bin/env node

// Simple production server without vite dependencies
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { readFileSync } from 'fs';

// Manual .env loading
try {
  const envFile = readFileSync('.env', 'utf8');
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
  console.log('Environment variables loaded from .env');
} catch (error) {
  console.log('No .env file found, using system environment variables');
}

process.env.NODE_ENV = 'production';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Import routes dynamically
const { registerRoutes } = await import('./server/routes.js');
const server = await registerRoutes(app);

// Serve static files from client/dist
const distPath = path.join(__dirname, 'client/dist');
app.use(express.static(distPath));

// SPA fallback - serve index.html for all non-API routes
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(distPath, 'index.html'));
  }
});

const port = process.env.PORT || 3000;
server.listen(port, '0.0.0.0', () => {
  console.log(`🚀 GetABonus.net production server running on port ${port}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV}`);
  console.log(`🗄️  Database: Connected`);
  console.log(`🤖 AI Chatbot: ${process.env.OPENAI_API_KEY ? 'Enabled' : 'Disabled'}`);
});