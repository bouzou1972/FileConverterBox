# Deployment Guide for File Converter Box

## Cloudflare Pages Deployment

### Prerequisites
1. GitHub repository with your project code
2. Cloudflare account

### Deployment Steps

#### 1. Build Configuration
The project includes a production-specific Vite config (`vite.config.production.ts`) optimized for Cloudflare Pages with:
- `base: './'` for correct asset path resolution
- Simplified plugin configuration
- Production build optimizations

#### 2. Build Commands
For Cloudflare Pages, use:
- **Build command**: `npm run build:cloudflare`
- **Build output directory**: `dist/public`

#### 3. Alternative Build
If you need to use the standard build command:
- **Build command**: `npm run build`
- **Build output directory**: `dist/public`

### Manual Build and Upload
If you prefer manual deployment:

```bash
# Build for production
npm run build:cloudflare

# The built files will be in dist/public/
# Upload the contents of dist/public/ to your hosting provider
```

### Environment Variables
This is a 100% client-side application, so no server environment variables are needed.

### Troubleshooting
- **Asset loading issues**: Ensure `base: './'` is set in vite config
- **Path resolution errors**: Check that the build output directory is `dist/public`
- **Missing files**: Verify all source files are committed to your repository

### Performance Notes
- The application is fully client-side with no backend dependencies
- All file processing happens in the browser for maximum privacy
- Built bundle size is optimized for fast loading