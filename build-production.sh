#!/bin/bash
echo "🏗️  Building GetABonus.net for production..."

# Build frontend
echo "📦 Building frontend..."
npm run build

# Build production server
echo "🚀 Building production server..."
npx esbuild server/production.ts --platform=node --packages=external --bundle --format=esm --outfile=dist/production.js

echo "✅ Production build complete!"
echo ""
echo "📋 Files to copy to your server:"
echo "   - dist/ (entire folder)"
echo "   - production-server.js"
echo "   - .env" 
echo "   - package.json"
echo ""
echo "🚀 On your server run: node production-server.js"