# Cloudflare Pages Setup Instructions

## ✅ What's Already Done
I've prepared your File Converter Box for Cloudflare Pages deployment:

- ✅ **vite.config.production.ts** - Production config with `base: './'`
- ✅ **DEPLOYMENT.md** - Complete deployment guide  
- ✅ **build-cloudflare.sh** - Build script for Cloudflare Pages
- ✅ **Tested build process** - Confirmed it builds successfully

## 🛠️ What You Need to Do

### 1. Add Build Script to package.json
Since I can't edit package.json (it's protected), you need to add this script manually:

Open `package.json` and add this line to the "scripts" section:
```json
"build:cloudflare": "vite build --config vite.config.production.ts"
```

Your scripts section should look like:
```json
"scripts": {
  "dev": "NODE_ENV=development tsx server/index.ts",
  "build": "vite build && esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist",
  "build:cloudflare": "vite build --config vite.config.production.ts",
  "start": "NODE_ENV=production node dist/index.js",
  "check": "tsc",
  "db:push": "drizzle-kit push"
}
```

### 2. Cloudflare Pages Configuration
When setting up Cloudflare Pages:

- **Build command**: `npm run build:cloudflare`
- **Build output directory**: `dist/public`
- **Node.js version**: 18 or 20

### 3. Alternative: Use Build Script
You can also run the provided build script:
```bash
./build-cloudflare.sh
```

### 4. GitHub Integration
1. Push all files to your GitHub repository
2. Connect Cloudflare Pages to your GitHub repo
3. Use the build settings above
4. Cloudflare will auto-deploy on every push

## 🔧 Key Configuration Changes

The production config (`vite.config.production.ts`) includes:
- `base: './'` for proper asset paths
- Removed development-only plugins
- Optimized for static hosting
- Same path aliases as development

## 🚀 Ready to Deploy!
Your File Converter Box is now fully configured for Cloudflare Pages deployment with proper asset path resolution and optimized build settings.