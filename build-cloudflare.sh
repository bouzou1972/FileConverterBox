#!/bin/bash

echo "🚀 Building File Converter Box for Cloudflare Pages..."

# Clean previous build
rm -rf dist/public

# Build using production config optimized for Cloudflare Pages
npx vite build --config vite.config.production.ts

echo "✅ Build complete! Files are in dist/public/"
echo "📁 Upload the contents of dist/public/ to Cloudflare Pages"
echo "🌐 Or push to GitHub and Cloudflare will auto-deploy"