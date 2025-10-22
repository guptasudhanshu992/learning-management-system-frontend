# Cloudflare Pages Deployment Configuration

## Build Settings for Cloudflare Pages Dashboard:

**Framework preset:** Create React App
**Build command:** `npm run build`
**Build output directory:** `dist`
**Root directory:** (Leave empty - use the repository root)

## Environment Variables:

### Production Environment:
```
VITE_API_BASE_URL=https://api.priceactionrepository.com
VITE_NODE_ENV=production
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_ERROR_REPORTING=true
```

### Preview Environment:
```
VITE_API_BASE_URL=https://api.priceactionrepository.com
VITE_NODE_ENV=development
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_ERROR_REPORTING=false
```

## Notes:
- The `_redirects` file handles SPA routing
- The `_routes.json` file configures Cloudflare Pages routing
- No `wrangler.toml` file is needed for Cloudflare Pages
- All static assets will be served from the `dist` directory