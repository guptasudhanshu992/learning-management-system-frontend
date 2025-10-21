// functions/[[path]].js - A Cloudflare Worker for your LMS Frontend

export async function onRequest(context) {
  // Get the current request from the context
  const { request } = context;
  
  // URL object for examining the request
  const url = new URL(request.url);
  
  // You can add custom handling based on URL patterns
  if (url.pathname.startsWith('/api/')) {
    // If this is an API request, you could proxy it to your backend
    // This is useful for avoiding CORS issues
    const backendUrl = new URL(url.pathname.replace('/api/', '/'), 
      process.env.BACKEND_API_URL || 'http://localhost:8001');
    
    // Forward the request to your backend
    return fetch(backendUrl.toString(), {
      method: request.method,
      headers: request.headers,
      body: request.body,
      cf: {
        // Optimize caching behavior
        cacheTtl: 0, // Don't cache API responses by default
        cacheEverything: false,
      }
    });
  }
  
  // Handle normal page requests and assets
  // This can be a simple pass-through for your static assets
  return context.next();
}