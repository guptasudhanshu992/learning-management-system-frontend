// _worker.js - Main entry point for Cloudflare Pages Functions
// This file handles the integration between Pages and Functions

export default {
  async fetch(request, env, ctx) {
    // This is the main handler for all HTTP requests
    const url = new URL(request.url);
    
    // Get the path pathname without the leading slash
    const pathname = url.pathname;
    
    // If this is an API request, handle it specially
    if (pathname.startsWith('/api/')) {
      try {
        // Dynamic import of API handler
        const apiHandler = await import('./api/[[path]].js');
        if (apiHandler.onRequest) {
          return apiHandler.onRequest({ request, env, ctx });
        }
      } catch (e) {
        return new Response(`API Error: ${e.message}`, { status: 500 });
      }
    }
    
    // For all other requests, serve static assets
    return env.ASSETS.fetch(request);
  }
};